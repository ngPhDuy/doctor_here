import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Dữ liệu mẫu: Danh sách các trò chuyện bao gồm tên bác sĩ và số tin nhắn chưa đọc
const conversations = [
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 1",
    unreadCount: 3,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 2",
    unreadCount: 1,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 3",
    unreadCount: 0,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 1",
    unreadCount: 3,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 2",
    unreadCount: 1,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 3",
    unreadCount: 0,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 1",
    unreadCount: 3,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 2",
    unreadCount: 1,
  },
  {
    avatar: "./images/avt.png",
    doctorName: "Bệnh nhân 3",
    unreadCount: 0,
  },
];
//Dữ liệu mẫu: bệnh nhân đang chọn bao gồm tên, ảnh đại diện
const patient = {
  name: "Bệnh nhân 1",
  avatar: "./images/avt.png",
};
//Dữ liệu mẫu: Danh sách các tin nhắn của 1 trò chuyện đang mở bao gồm nội dung, người gửi và thời gian gửi
const messages = [
  {
    content: "Chào bác sĩ",
    sender: "patient",
    time: "10:00",
  },
  {
    content: "Chào bạn",
    sender: "doctor",
    time: "10:01",
  },
  {
    content: "Bạn cần hỗ trợ gì không?",
    sender: "doctor",
    time: "10:02",
  },
  {
    content: "Chào bác sĩ",
    sender: "patient",
    time: "10:00",
  },
  {
    content: "Chào bạn",
    sender: "doctor",
    time: "10:01",
  },
  {
    content: "Bạn cần hỗ trợ gì không?",
    sender: "doctor",
    time: "10:02",
  },
];

const Conversations: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);

  //Lọc danh sách trò chuyện theo tên bác sĩ
  useEffect(() => {
    setFilteredConversations(
      conversations.filter((conversation) =>
        conversation.doctorName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

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
              >
                <div className="flex justify-evenly items-center gap-2">
                  <img
                    src={conversation.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />

                  <span>{conversation.doctorName}</span>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                    {conversation.unreadCount}
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
                src={patient.avatar}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{patient.name}</span>
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
                  message.sender === "patient"
                    ? "mr-auto bg-white"
                    : "ml-auto bg-blue-500 text-white"
                } p-2 shadow-md rounded-lg my-2 max-w-xs`}
              >
                <p>{message.content}</p>
                <span
                  className={`text-xs ${
                    message.sender === "patient"
                      ? "text-gray-500"
                      : "text-gray-200"
                  }`}
                >
                  {message.time}
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
            />
            <button className="p-2 bg-blue-500 text-white rounded-lg">
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
