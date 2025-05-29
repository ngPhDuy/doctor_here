import { StringeeClient, StringeeCall2 } from "stringee";

let stringeeClient: StringeeClient | null = null;

// Hàm khởi tạo StringeeClient và kết nối với Stringee Server
export const initStringee = () => {
  // Tạo một instance của StringeeClient
  stringeeClient = new StringeeClient();

  // Lắng nghe sự kiện "connect" khi kết nối thành công
  stringeeClient.on("connect", () => {
    // connected to StringeeServer
    console.log("Kết nối thành công với Stringee");
  });

  // Lắng nghe sự kiện "authen" khi xác thực người dùng
  stringeeClient.on("authen", (response: any) => {
    // on authen user, response object
    // {
    //     r               : 0
    //     requestId       : 1
    //     clients         : [{…}]
    //     connectionId    : 123456789
    //     ping_after_ms   : 45000
    //     projectId       : 1234
    //     userId          : "abc"
    //     ice_servers     : [{…}, {…}, {…}, {…}]
    //     message         : "SUCCESS"
    // }
    // response success: r = 0
    // response error: r != 0 and message : "Error message"
    if (response.r === 0) {
      console.log("Xác thực thành công:", response);
    } else {
      console.error("Lỗi xác thực:", response.message);
    }
  });

  // Lắng nghe sự kiện "disconnect" khi bị ngắt kết nối
  stringeeClient.on("disconnect", () => {
    console.log("Đã ngắt kết nối với Stringee");
  });

  // // Lắng nghe cuộc gọi đến
  // stringeeClient.on("incomingcall2", (call2: StringeeCall2) => {
  //   console.log("Có cuộc gọi đến: ", call2);
  //   // Cấu hình các sự kiện cuộc gọi
  //   setupCallEvents(call2);
  // });

  // // Lắng nghe sự kiện "requestnewtoken" khi cần token mới
  // stringeeClient.on("requestnewtoken", () => {
  //   // request new token;
  //   // please get new access_token from YourServer
  //   // and call client.connect(new_access_token)
  //   console.log("Cần token mới, yêu cầu từ server");
  //   // Yêu cầu token mới từ server và gọi lại client.connect(new_access_token)
  // });

  // // Kết nối với Stringee server
  // console.log("Kết nối với Stringee server với access token:", accessToken);
  // stringeeClient.connect(accessToken);
  return stringeeClient;
};

// Hàm cấu hình các sự kiện cuộc gọi
const setupCallEvents = (
  call: StringeeCall2,
  onAddRemoteTrack: (track: any) => void,
  onAddLocalTrack: (track: any) => void,
  onSignalingState: (state: any) => void,
  onMediaState: (state: any) => void,
  onInfo: (info: any) => void
) => {
  // Lắng nghe khi có stream video mới từ đối phương (remote stream)
  call.on("addremotetrack", onAddRemoteTrack);
  call.on("addlocaltrack", onAddLocalTrack);
  call.on("signalingstate", onSignalingState);
  call.on("mediastate", onMediaState);
  call.on("info", onInfo);
};

// Hàm thực hiện cuộc gọi
export const makeVideoCall = (
  fromNumber: string,
  toNumber: string,
  onAddRemoteTrack: (track: any) => void,
  onAddLocalTrack: (track: any) => void,
  onSignalingState: (state: any) => void,
  onMediaState: (state: any) => void,
  onInfo: (info: any) => void
) => {
  // response object
  // {
  //     r         : 0
  //     requestId : 2
  //     callId    : "call-vn-1-D2BIJCH2U9-1686467455592"
  //     message   : "SUCCESS"
  // }
  if (!stringeeClient) {
    console.error("Client chưa được kết nối");
    return;
  }

  const call = new StringeeCall2(stringeeClient, fromNumber, toNumber, true); // true cho phép video call

  setupCallEvents(
    call,
    onAddRemoteTrack,
    onAddLocalTrack,
    onSignalingState,
    onMediaState,
    onInfo
  );

  // Thực hiện cuộc gọi
  call.makeCall((response: any) => {
    if (response.r === 0) {
      console.log("Cuộc gọi thành công, callId:", response.callId);
    } else {
      console.error("Lỗi khi gọi:", response.message);
    }
  });
};
