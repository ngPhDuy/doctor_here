import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket, {
  registerUser,
  sendMessage,
  onMessageReceived,
} from "../../socket";

//Dữ liệu mẫu: bệnh nhân đang chọn bao gồm tên, ảnh đại diện
const patient = {
  name: "Bệnh nhân 1",
  avatar: "./images/avt.png",
};

interface Message {
  id: number;
  kieu_noi_dung: string;
  noi_dung_van_ban: string;
  media_url: string | null;
  thoi_diem_gui: string;
  thoi_diem_da_xem: string | null;
  cuoc_hoi_thoai: number;
  ben_gui_di: string;
}

interface Conversation {
  cuoc_hoi_thoai: number;
  nguoi_dung: {
    ma: string;
    avt_url: string | null;
    ho_va_ten: string;
  };
  so_tin_moi: number;
}

const Conversations: React.FC = () => {
  let drID = localStorage.getItem("drID") || "BS0000001";
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  // const { conversationID } = useParams();
  // const navigate = useNavigate();

  useEffect(() => {
    // Đăng ký người dùng
    registerUser(drID);

    // Lắng nghe tin nhắn mới từ server
    // onMessageReceived((message: string) => {
    //   const parsedMessage: Message = JSON.parse(message);
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     {
    //       content: parsedMessage.content,
    //       sender: "patient",
    //       time: new Date().toLocaleTimeString(),
    //     },
    //   ]);
    // });

    return () => {
      // Hủy lắng nghe tin nhắn khi component bị hủy
      socket.off("chat_message");
    };
  }, [drID]);

  //Lấy danh sách trò chuyện từ server qua API ${import.meta.env.VITE_API_BASE_URL}/api/conversation/user/:userID
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation/user/${drID}`)
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
        setFilteredConversations(data);

        if (!selectedConversation) {
          setSelectedConversation(data[0]);
        }
      });

    return () => {};
  }, [drID]);

  //Lấy tin nhắn từ server qua API ${import.meta.env.VITE_API_BASE_URL}/api/messages/conversation/:conversationID
  useEffect(() => {
    if (selectedConversation) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages/conversation/${
          selectedConversation.cuoc_hoi_thoai
        }`
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
        });
    }
  }, [selectedConversation]);

  //Lọc danh sách trò chuyện theo tên bác sĩ
  useEffect(() => {
    setFilteredConversations(
      conversations.filter((conversation) =>
        conversation.nguoi_dung.ho_va_ten
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search]);

  const handleSendMessage = (content: string) => {
    // Gửi tin nhắn đến server
    sendMessage(drID, "BN0000006", content);
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     {
    //       content,
    //       sender: "doctor",
    //       time: new Date().toLocaleTimeString(),
    //     },
    //   ]);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Ngừng hành động mặc định của Enter (ví dụ, ngừng submit form)
      e.preventDefault();

      if (content.trim()) {
        // Gửi tin nhắn ở đây
        handleSendMessage(content);

        // Sau khi gửi tin nhắn, bạn có thể làm gì đó như xóa nội dung
        setContent("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Danh sách trò chuyện bên trái và nội dung trò chuyện bên phải, tương tự như Facebook Messenger */}
      <div className="flex flex-1 gap-1">
        <div className="w-1/3 bg-gray-200 p-4 flex flex-col">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full p-2 rounded-lg border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-4 overflow-y-auto flex-grow h-96">
            {filteredConversations.map((conversation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-300 cursor-pointer w-full"
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex justify-evenly items-center gap-2">
                  <img
                    src={conversation.nguoi_dung.avt_url || "./images/avt.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />

                  <span>{conversation.nguoi_dung.ho_va_ten}</span>
                </div>
                {conversation.so_tin_moi > 0 && (
                  <span className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                    {conversation.so_tin_moi}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 p-2 bg-gray-100 flex flex-col">
          {/* Header chứa ảnh và tên ở bên trái, nút gọi video ở bên phải */}
          <div className="flex items-center justify-between p-2 bg-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <img
                src={
                  selectedConversation?.nguoi_dung.avt_url || "./images/avt.png"
                }
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">
                {selectedConversation?.nguoi_dung.ho_va_ten}
              </span>
            </div>
            <button className="p-2 rounded-full">
              <img
                src="./images/mess/phone-call.png"
                alt=""
                className="h-5 w-5"
              />
            </button>
          </div>
          <div className="flex flex-col overflow-y-auto flex-grow h-96 my-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.ben_gui_di === "bn"
                    ? "mr-auto bg-white"
                    : "ml-auto bg-blue-500 text-white"
                } p-2 shadow-md rounded-lg my-2 max-w-xs`}
              >
                <p>{message.noi_dung_van_ban}</p>
                <span
                  className={`text-xs ${
                    message.ben_gui_di === "bn"
                      ? "text-gray-500"
                      : "text-gray-200"
                  }`}
                >
                  {
                    //giờ Việt Nam, định dạng 24h hh:mm
                    new Date(message.thoi_diem_gui).toLocaleString("vi-VN", {
                      hour: "numeric",
                      minute: "numeric",
                    })
                  }
                </span>
              </div>
            ))}
          </div>
          {/* Nút đính kèm file ở bên trái và thanh nhập tin và nút gửi ở bên phải */}
          <div className="flex items-center gap-2">
            <label htmlFor="fileInput" className="cursor-pointer">
              <img
                src="images/mess/attach-file.png"
                alt="Attach file"
                className="inline-block w-6 h-6"
              />
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden" // ẩn input
              onChange={(e) => {
                // Xử lý file
                console.log(e);
              }}
            />
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="p-2 border border-gray-300 rounded-lg flex-grow"
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="p-2 bg-blue-500 text-white rounded-lg"
              onClick={() => {
                handleSendMessage(content);
                setContent("");
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
