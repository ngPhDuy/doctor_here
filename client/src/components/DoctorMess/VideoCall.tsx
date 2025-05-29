import React, { useEffect, useRef, useState } from "react";
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamVideoParticipant,
  useCallStateHooks,
  SpeakerLayout,
  CallControls,
  ParticipantView,
  StreamTheme,
  User,
  useStreamVideoClient,
  CancelCallButton,
  Restricted,
  SpeakingWhileMutedNotification,
  OwnCapability,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
} from "@stream-io/video-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import defaultAvatar from "../../assets/images/avt.png";
import {
  FaMicrophone,
  FaMicrophoneAltSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { ImPhoneHangUp } from "react-icons/im";
import type { CallControlsProps } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const VideoCall: React.FC = () => {
  const { ptID } = useParams<{ ptID: string }>();
  const { callId } = useParams<{ callId: string }>();
  const navigate = useNavigate();
  const [calleeName, setCalleeName] = useState("Người gọi");
  const [calleeAvatar, setCalleeAvatar] = useState(defaultAvatar);
  const client = useStreamVideoClient();
  const [call, setCall] = useState<any>(null);

  // const clientRef = useRef<StringeeClient | null>(null);

  // Lấy dữ liệu bệnh nhân
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/patient/detail/${ptID}`
    ).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log("Patient data:", data);
          setCalleeName(data.Nguoi_dung.ho_va_ten || "Người gọi");
          setCalleeAvatar(data.Nguoi_dung.avt_url || null);
        });
      } else {
        console.error("Failed to fetch patient data");
      }
    });
  }, [ptID]);

  useEffect(() => {
    const setupCall = async () => {
      if (!client || !ptID || !callId) return;

      const callInstance = client.call("default", callId);

      await callInstance.join({ create: true });

      setCall(callInstance);
    };

    setupCall();

    return () => {
      call?.leave();
    };
  }, [client]);

  //Custom button
  const CustomToggleAudioPublishingButton = () => {
    const { useMicrophoneState } = useCallStateHooks();
    const { microphone, isMute } = useMicrophoneState();
    return (
      <button onClick={() => microphone.toggle()}>
        {isMute ? (
          <FaMicrophoneAltSlash className="text-gray-500" size={24} />
        ) : (
          <FaMicrophone className="text-gray-500" size={24} />
        )}
      </button>
    );
  };

  const CustomToggleVideoPublishingButton = () => {
    const { useCameraState } = useCallStateHooks();
    const { camera, isMute } = useCameraState();
    return (
      <button onClick={() => camera.toggle()}>
        {isMute ? (
          <FaVideoSlash className="text-gray-500" size={24} />
        ) : (
          <FaVideo className="text-gray-500" size={24} />
        )}
      </button>
    );
  };

  const CustomCallControls = ({ onLeave }: CallControlsProps) => (
    <div className=" bg-gray-800 rounded-lg p-4 flex justify-between items-center w-full gap-4">
      <Restricted requiredGrants={[OwnCapability.SEND_AUDIO]}>
        <SpeakingWhileMutedNotification>
          <ToggleAudioPublishingButton />
        </SpeakingWhileMutedNotification>
      </Restricted>
      <Restricted requiredGrants={[OwnCapability.SEND_VIDEO]}>
        <ToggleVideoPublishingButton />
      </Restricted>
      <Restricted requiredGrants={[OwnCapability.SCREENSHARE]}>
        <ScreenShareButton />
      </Restricted>
      <Restricted
        requiredGrants={[
          OwnCapability.START_RECORD_CALL,
          OwnCapability.STOP_RECORD_CALL,
        ]}
      ></Restricted>
      <div className="str-video__composite-button__button-group flex justify-center items-center p-2 aspect-square">
        <button
          onClick={onLeave}
          className="str-video__composite-button__button"
        >
          <ImPhoneHangUp className="text-red-500" size={18} />
        </button>
      </div>
    </div>
  );

  //Custom UI
  const MyUILayout = ({
    calleeName,
    calleeAvatar,
  }: {
    calleeName: string;
    calleeAvatar: string;
  }) => {
    const { useCallCallingState, useLocalParticipant, useRemoteParticipants } =
      useCallStateHooks();

    const callingState = useCallCallingState();
    const localParticipant = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
    const remoteParticipant = remoteParticipants.find(
      (p) => !p.isLocalParticipant
    );

    console.log(localParticipant);
    console.log(remoteParticipants);

    if (callingState !== CallingState.JOINED) {
      return (
        <>
          <div className="flex flex-col items-center justify-center w-full h-full rounded-lg absolute top-0 left-0 right-0">
            <img
              src={calleeAvatar}
              alt="Avatar"
              className={`w-36 h-36 rounded-full border-4 border-gray-400 mb-4 animate-bounce animate-infinite animate-ease-linear`}
            />
            <h2 className="text-xl font-semibold ml-4 text-black">
              {calleeName}
            </h2>
          </div>
        </>
      );
    }

    // return (
    //   <StreamTheme>
    //     <SpeakerLayout participantsBarPosition="bottom" />
    //     <CustomCallControls
    //       onLeave={async () => {
    //         await call.leave();
    //         navigate(-1);
    //       }}
    //     />
    //   </StreamTheme>
    // );
    return (
      <StreamTheme>
        <div className="relative w-full h-screen">
          {/* Remote full screen */}
          {remoteParticipant && (
            <ParticipantView
              participant={remoteParticipant}
              className="w-full h-full object-cover"
            />
          )}

          {!remoteParticipant && (
            <>
              <div className="flex flex-col items-center justify-center w-full h-full rounded-lg absolute top-0 left-0 right-0">
                <img
                  src={calleeAvatar}
                  alt="Avatar"
                  className={`w-36 h-36 rounded-full border-4 border-gray-400 mb-4 animate-bounce animate-infinite animate-ease-linear`}
                />
                <h2 className="text-xl font-semibold ml-4 text-black">
                  {calleeName}
                </h2>
              </div>
            </>
          )}

          {/* Local small window at bottom left */}
          {localParticipant && (
            <div className="absolute top-4 left-4 w-40 h-40 rounded-lg overflow-hidden shadow-lg border border-gray-500">
              <ParticipantView
                participant={localParticipant}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Call controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <CustomCallControls
              onLeave={async () => {
                await call?.leave();
                navigate(-1);
              }}
            />
          </div>
        </div>
      </StreamTheme>
    );
  };

  return call ? (
    <StreamCall call={call}>
      <MyUILayout calleeName={calleeName} calleeAvatar={calleeAvatar} />
    </StreamCall>
  ) : (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full rounded-lg absolute top-0 left-0 right-0">
        <img
          src={calleeAvatar}
          alt="Avatar"
          className={`w-36 h-36 rounded-full border-4 border-gray-400 mb-4 animate-bounce animate-infinite animate-ease-linear`}
        />
        <h2 className="text-xl font-semibold ml-4 text-black">{calleeName}</h2>
      </div>
    </>
  );
};

export default VideoCall;
