import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket, {
  registerUser,
  sendMessage,
  onMessageReceived,
} from "../../socket";
import Swal from "sweetalert2";

//Dữ liệu mẫu: bệnh nhân đang chọn bao gồm tên, ảnh đại diện
// const patientsEx = [
//   {
//     ma_benh_nhan: "BN0000006",
//     ho_va_ten: "Nguyễn Văn A",
//     avt_url: "./images/avt.png",
//   },
//   {
//     ma_benh_nhan: "BN0000007",
//     ho_va_ten: "Nguyễn Văn B",
//     avt_url: "./images/avt.png",
//   },
//   {
//     ma_benh_nhan: "BN0000008",
//     ho_va_ten: "Nguyễn Văn C",
//     avt_url: "./images/avt.png",
//   },
// ];

interface Patient {
  ma_benh_nhan: string;
  ho_va_ten: string;
  avt_url: string;
}

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

interface UpFileResponse {
  url: string;
  type: string;
}

const Conversations: React.FC = () => {
  let drID = localStorage.getItem("drID") || "BS0000001";
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [tabConversation, setTabConversation] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  let previousDate: string | null = null;

  // Hàm tự động cuộn xuống khi có tin nhắn mới
  const useChatScroll = <T,>(dep: T): React.RefObject<HTMLDivElement> => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      console.log("Effect cuộn xuống");
      if (ref.current) {
        console.log("Cuộn xuống");
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [dep]);

    return ref;
  };

  const reff = useChatScroll(messages);

  useEffect(() => {
    // Lắng nghe tin nhắn mới từ server
    onMessageReceived((message: string) => {
      // Kiểm tra xem tin nhắn mới có phải của cuộc trò chuyện đang được chọn không
      const parsedMessage: Message = JSON.parse(message);
      console.log(selectedConversation?.cuoc_hoi_thoai);
      console.log(parsedMessage.cuoc_hoi_thoai);
      if (
        // Nếu có thì cập nhật lại messages
        parsedMessage.cuoc_hoi_thoai === selectedConversation?.cuoc_hoi_thoai
      ) {
        console.log("tin nhắn mới", parsedMessage);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      } else {
        // Nếu không thì cập nhật lại số tin nhắn chưa đọc
        console.log("tin nhắn mới ở hội thoại k mở", parsedMessage);
        const updatedConversations = conversations.map((conversation) => {
          if (conversation.cuoc_hoi_thoai === parsedMessage.cuoc_hoi_thoai) {
            return {
              ...conversation,
              so_tin_moi: conversation.so_tin_moi + 1,
            };
          }
          return conversation;
        });

        setConversations(updatedConversations);
        setFilteredConversations(updatedConversations);
      }
    });

    return () => {
      // Hủy lắng nghe tin nhắn khi component bị hủy
      socket.off("chat_message");
    };
  }, [selectedConversation, conversations, drID]);

  //Lấy danh sách trò chuyện từ server qua API ${import.meta.env.VITE_API_BASE_URL}/api/conversation/user/:userID
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation/user/${drID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Lấy danh sách trò chuyện", data);
        setConversations(data);
        setFilteredConversations(data);

        if (!selectedConversation) {
          setSelectedConversation(data[0]);
        }
      });

    return () => {};
  }, [drID]);

  // useEffect(() => {
  //   setPatients(patientsEx);
  //   setFilteredPatients(patientsEx);
  // }, [drID]);

  //Lấy tin nhắn từ server qua API ${import.meta.env.VITE_API_BASE_URL}/api/message/conversation/:conversationID
  useEffect(() => {
    if (selectedConversation) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/conversation/${
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
    if (tabConversation) {
      setFilteredConversations(
        conversations.filter((conversation) =>
          conversation.nguoi_dung.ho_va_ten
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredPatients(
        patients.filter((patient) =>
          patient.ho_va_ten.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  // Gọi api cập nhật đã xem các tin nhắn trong cuộc trò chuyện
  useEffect(() => {
    if (!selectedConversation) return;

    // không cần đợi kết quả trả về
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/message/seen/conversation/${
        selectedConversation.cuoc_hoi_thoai
      }/user/${drID}`,
      {
        method: "PATCH",
      }
    );

    // cập nhật lại số tin nhắn chưa đọc
    const updatedConversations = conversations.map((conversation) => {
      if (conversation.cuoc_hoi_thoai === selectedConversation.cuoc_hoi_thoai) {
        return {
          ...conversation,
          so_tin_moi: 0,
        };
      }
      return conversation;
    });
    setConversations(updatedConversations);
    setFilteredConversations(updatedConversations);
  }, [selectedConversation]);

  // Lấy danh sách các bệnh nhân
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/patient/getAllByDoctorID?doctorID=${localStorage.getItem("id")}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách bệnh nhân.");
        }
        const data: Patient[] = await response.json();

        let patients = data.map((patient) => {
          return {
            ma_benh_nhan: patient.ma_benh_nhan,
            ho_va_ten: patient.ho_va_ten,
            avt_url: patient.avt_url || "./images/avt.png",
          };
        });

        setPatients(patients);
        setFilteredPatients(patients);
      } catch (err) {
        console.error("Lỗi khi tải danh sách bệnh nhân.", err);
      }
    };
    fetchPatients();
  }, []);

  const handleSendMessage = (content: string) => {
    // Gửi tin nhắn đến server
    let time = new Date().toISOString();

    // Kiểm tra xem tin nhắn có phải là file không
    if (files.length > 0) {
      let tempID = Date.now();

      let message = {
        id: tempID, // Sử dụng timestamp để làm ID cho tin nhắn tạm thời
        kieu_noi_dung: "text",
        noi_dung_van_ban: "",
        media_url: null, // Không có media url ngay lập tức
        thoi_diem_gui: time,
        thoi_diem_da_xem: null,
        cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
        ben_gui_di: "bs",
      };

      setMessages((prevMessages) => [...prevMessages, message]);

      let formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folderName", "message_media");
      setFiles([]);

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          data.forEach((file: UpFileResponse) => {
            console.log("Gửi file thành công", file);
            sendMessage(
              drID,
              selectedConversation?.nguoi_dung?.ma || "",
              content,
              time,
              file.type,
              file.url
            );

            // Cập nhật lại tin nhắn tạm thời thành tin nhắn thực
            setMessages((prevMessages) =>
              prevMessages.map((msg) => {
                if (msg.id === tempID) {
                  return {
                    ...msg,
                    kieu_noi_dung: file.type,
                    media_url: file.url,
                  };
                }
                return msg;
              })
            );
          });
        });
    } else {
      sendMessage(
        drID,
        selectedConversation?.nguoi_dung?.ma || "",
        content,
        time,
        "text",
        ""
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          kieu_noi_dung: "text",
          noi_dung_van_ban: content,
          media_url: null,
          thoi_diem_gui: time,
          thoi_diem_da_xem: null,
          cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
          ben_gui_di: "bs",
        },
      ]);
    }
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

  const handleSelectPatient = (patient: Patient) => {
    // Kiểm tra các cuộc trò chuyện đã có với bệnh nhân này (trong biến conversations)
    const existingConversation = conversations.find(
      (conversation) => conversation.nguoi_dung.ma === patient.ma_benh_nhan
    );
    // Nếu có, chọn cuộc trò chuyện đó và hiển thị tin nhắn
    if (existingConversation) {
      console.log("Chọn cuộc trò chuyện đã có", existingConversation);
      setSelectedConversation(existingConversation);
    } else {
      // Nếu không, tạo cuộc trò chuyện mới với bệnh nhân này bằng api createConversation và call api getConversations để lấy lại danh sách cuộc trò chuyện
      console.log("Tạo cuộc trò chuyện mới");
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ptID: patient.ma_benh_nhan,
          drID: drID,
        }),
      }).then(() => {
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/conversation/user/${drID}`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("Lấy danh sách trò chuyện", data);
            setConversations(data);
            setFilteredConversations(data);

            // Chọn cuộc trò chuyện vừa tạo - đầu tiên trong danh sách
            setSelectedConversation(data[0]);
          });
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Hàm để mở modal khi nhấn vào hình ảnh
  const handleImageClick = (url: string) => {
    setSelectedImage(url); // Lưu url của ảnh vào state
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Danh sách trò chuyện bên trái và nội dung trò chuyện bên phải, tương tự như Facebook Messenger */}
      <div className="flex flex-1 gap-1">
        <div className="w-1/3 bg-gray-200 p-4 flex flex-col">
          {/*Hiện tab trò chuyện và tab bệnh nhân*/}
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col w-full">
              <button
                className={`${tabConversation ? "text-blueTitle" : ""}`}
                onClick={() => setTabConversation(true)}
              >
                Trò chuyện
              </button>
              {tabConversation && (
                <hr className="border-t-2 border-blueTitle ml-1 mt-1" />
              )}
            </div>
            <div className="flex flex-col w-full">
              <button
                className={`${!tabConversation ? "text-blueTitle" : ""}`}
                onClick={() => setTabConversation(false)}
              >
                Bệnh nhân
              </button>
              {!tabConversation && (
                <hr className="border-t-2 border-blueTitle ml-1 mt-1" />
              )}
            </div>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full p-2 rounded-lg border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-2 overflow-y-auto flex-grow h-96">
            {/* Khi tab trò chuyện được chọn, hiển thị danh sách trò chuyện */}
            {tabConversation &&
              filteredConversations.map((conversation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-300 cursor-pointer w-full"
                  onClick={() => {
                    console.log("Click vào cuộc trò chuyện", conversation);
                    setSelectedConversation(conversation);
                  }}
                >
                  <div className="flex justify-evenly items-center gap-2">
                    <img
                      src={
                        conversation.nguoi_dung.avt_url || "./images/avt.png"
                      }
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

            {/* Khi tab bệnh nhân được chọn, hiển thị danh sách bệnh nhân */}
            {!tabConversation &&
              filteredPatients.map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-300 cursor-pointer w-full"
                  onClick={() => handleSelectPatient(patient)}
                >
                  <div className="flex justify-evenly items-center gap-2">
                    <img
                      src={patient.avt_url || "./images/avt.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />

                    <span>{patient.ho_va_ten}</span>
                  </div>
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
          <div
            className="flex flex-col overflow-y-auto flex-grow h-96 my-2"
            ref={reff}
          >
            {messages.map((message, index) => {
              // Lấy ngày từ thời gian gửi tin nhắn
              const messageDate = new Date(message.thoi_diem_gui);
              const messageDateString = messageDate.toLocaleDateString("vi-VN");

              // Kiểm tra nếu ngày thay đổi so với tin nhắn trước đó
              const renderDate = messageDateString !== previousDate;

              // Cập nhật lại previousDate cho lần lặp sau
              previousDate = messageDateString;

              return (
                <div key={index}>
                  {/* Nếu ngày thay đổi, render thẻ ngày */}
                  {renderDate && (
                    <div className="text-center text-gray-500 text-xs">
                      <span>{messageDate.toLocaleDateString("vi-VN")}</span>
                    </div>
                  )}

                  {/* Render tin nhắn kiểu text*/}
                  {message.kieu_noi_dung === "text" && (
                    <div
                      className={`${
                        message.ben_gui_di === "bn"
                          ? "mr-auto bg-white"
                          : "ml-auto bg-blue-500 text-white"
                      } p-2 shadow-md rounded-lg my-2 max-w-xs w-fit`}
                    >
                      <p className="w-fit">{message.noi_dung_van_ban}</p>
                      <span
                        className={`text-xs ${
                          message.ben_gui_di === "bn"
                            ? "text-gray-500"
                            : "text-gray-200"
                        }`}
                      >
                        {
                          //giờ Việt Nam, định dạng 24h hh:mm
                          new Date(message.thoi_diem_gui).toLocaleString(
                            "vi-VN",
                            {
                              hour: "numeric",
                              minute: "numeric",
                            }
                          )
                        }
                      </span>
                    </div>
                  )}

                  {/* Render tin nhắn kiểu image */}
                  {message.kieu_noi_dung === "image" && (
                    <div
                      className={`${
                        message.ben_gui_di === "bn" ? "mr-auto" : "ml-auto"
                      } p-2 shadow-md rounded-lg my-2 max-w-xs w-fit cursor-pointer`}
                      onClick={() => handleImageClick(message.media_url || "")}
                    >
                      <img
                        src={message.media_url || ""}
                        alt=""
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Hiển thị các tệp đã chọn */}
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-4">
              {files.map((file, index) => (
                // Hiển thị ảnh hoặc tên file
                <div key={index} className="relative w-20 h-20">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Selected"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">{file.name}</span>
                  )}
                  {/* Nút xóa file */}
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="absolute top-0 right-0 text-white bg-red-500 hover:bg-red-700 rounded-full p-1 w-6 h-6 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <span className="text-sm font-semibold">×</span>
                  </button>
                </div>
              ))}
            </div>
          )}
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
                handleFileChange(e);
              }}
              multiple
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
      {/* Modal hiển thị hình ảnh lớn */}
      {selectedImage && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()} // Ngừng propagation để tránh đóng modal khi click vào ảnh
          >
            <img
              src={selectedImage}
              alt="large image"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
