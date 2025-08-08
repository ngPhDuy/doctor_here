import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket, {
  sendMessage,
  onMessageReceived,
  recallMessage,
  onRecallMessage,
} from "../../../socket";
import Swal from "sweetalert2";
import { FaPhone } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import DynamicAIReply from "./DynamicAIReply";
import { getAIPreviewText } from "./DynamicAIReply";

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
  ben_gui_di: "bs" | "bn" | "ai" | string;
}

interface Conversation {
  cuoc_hoi_thoai: number;
  nguoi_dung: {
    ma: string;
    avt_url: string | null;
    ho_va_ten: string;
  };
  is_ai_agent?: boolean;
  so_tin_moi: number;
  thoi_diem_tin_nhan_cuoi: string;
  tin_nhan: {
    noi_dung_van_ban: string;
    media_url: string | null;
  };
}

interface UpFileResponse {
  url: string;
  type: string;
}

const Conversations: React.FC = () => {
  
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  let drID = localStorage.getItem("id") || "";
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(
    useParams<{ ptID: string }>().ptID ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [isAIChat, setIsAIChat] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [tabConversation, setTabConversation] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newConversation, setNewConversation] = useState<Conversation | null>(
    null
  );
  let previousDate: string | null = null;
  const navigate = useNavigate();

  console.log("Selected patient ID:", selectedPatient);
  console.log("Filtered conversations:", filteredConversations);

  // Hàm tự động cuộn xuống khi có tin nhắn mới
  // const useChatScroll = <T,>(dep: T): React.RefObject<HTMLDivElement> => {
  //   const ref = React.useRef<HTMLDivElement>(null);

  //   React.useEffect(() => {
  //     console.log("Effect cuộn xuống");
  //     if (ref.current) {
  //       console.log("Cuộn xuống");
  //       ref.current.scrollTop = ref.current.scrollHeight;
  //     }
  //   }, [dep]);

  //   return ref;
  // };
  const useChatScroll = <T,>(
    dep: T,
    autoScrollRef: React.MutableRefObject<boolean>
  ): React.RefObject<HTMLDivElement> => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;

      const el = ref.current;

      // Nếu người dùng đã cuộn gần cuối -> auto scroll
      if (autoScrollRef.current) {
        el.scrollTop = el.scrollHeight;
      } else {
        // Nếu không auto scroll, thì khôi phục vị trí tương đối
        const prevScrollHeight = el.scrollHeight;
        queueMicrotask(() => {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = el.scrollTop + (newScrollHeight - prevScrollHeight);
        });
      }
    }, [dep]);

    return ref;
  };

  // const reff = useChatScroll(messages);
  const autoScrollRef = useRef(true);
  const reff = useChatScroll(messages, autoScrollRef);

  useEffect(() => {
    //Nếu là cuộc hội thoại giả
    if (!selectedConversation || selectedConversation.cuoc_hoi_thoai < 0) {
      return;
    }

    // Lắng nghe tin nhắn mới từ server
    onMessageReceived((message: string) => {
      // Kiểm tra xem tin nhắn mới có phải của cuộc trò chuyện đang được chọn không
      const parsedMessage: Message = JSON.parse(message);
      console.log("Tin nhắn mới từ socket", parsedMessage);
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
              thoi_diem_tin_nhan_cuoi: parsedMessage.thoi_diem_gui,
              tin_nhan: {
                noi_dung_van_ban: parsedMessage.noi_dung_van_ban,
                media_url: parsedMessage.media_url,
              },
            };
          }
          return conversation;
        });

        //Sắp xếp theo thời điểm tin nhắn cuối giảm dần
        let sortedConversations = updatedConversations.sort(
          (a, b) =>
            new Date(b.thoi_diem_tin_nhan_cuoi).getTime() -
            new Date(a.thoi_diem_tin_nhan_cuoi).getTime()
        );
        setConversations(sortedConversations);
        setFilteredConversations(sortedConversations);
      }
    });

    onRecallMessage((body: string) => {
      const parsedBody = JSON.parse(body);

      if (parsedBody.cuoc_hoi_thoai === selectedConversation?.cuoc_hoi_thoai) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (
              msg.thoi_diem_gui === parsedBody.thoi_diem_gui &&
              msg.ben_gui_di === "bn" &&
              msg.kieu_noi_dung === parsedBody.kieu_noi_dung
            ) {
              return {
                ...msg,
                kieu_noi_dung: "recall", // Cập nhật kiểu nội dung thành 'recall'
                noi_dung_van_ban: "",
                media_url: null,
              };
            }
            return msg;
          })
        );
      }
    });

    return () => {
      // Hủy lắng nghe tin nhắn khi component bị hủy
      socket.off("chat_message");
      socket.off("recall_message");
    };
  }, [selectedConversation, conversations, drID]);

  //Lấy danh sách trò chuyện từ server qua API ${import.meta.env.VITE_API_BASE_URL}/api/conversation/user/:userID
useEffect(() => {
  const fetchConversations = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/conversation/user/${drID}`
      );
      const data: Conversation[] = await res.json();

      // Kiểm tra có cuộc trò chuyện AI thật chưa
      const hasRealAIConversation = data.some(
        (conversation) => conversation.is_ai_agent && conversation.cuoc_hoi_thoai !== -999
      );

      let updatedData: Conversation[] = [];

      if (!hasRealAIConversation) {
        // Tạo AI Agent giả nếu chưa từng chat
        const aiAgentConversation: Conversation = {
          cuoc_hoi_thoai: -999,
          nguoi_dung: {
            ma: "ai_agent",
            avt_url: "./images/ai-avatar.png",
            ho_va_ten: "AI Agent",
          },
          so_tin_moi: 0,
          thoi_diem_tin_nhan_cuoi: new Date().toISOString(),
          tin_nhan: {
            noi_dung_van_ban: "Chào bạn, tôi là AI. Tôi giúp gì được cho bạn?",
            media_url: null,
          },
        };

        // Thêm giả + các cuộc trò chuyện khác (loại bỏ AI thật nếu có)
        updatedData = [aiAgentConversation, ...data.filter((c) => !c.is_ai_agent)];
      } else {
        updatedData = data;
      }

      setConversations(updatedData);
      setFilteredConversations(updatedData);

      // Nếu đang xem AI Agent
      if (selectedPatient === "ai_agent") {
        const realAI = updatedData.find(
          (c) => c.is_ai_agent && c.cuoc_hoi_thoai !== -999
        );

        if (realAI) {
          setSelectedConversation(realAI);
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/message/conversation/${realAI.cuoc_hoi_thoai}`
          );
          const messages = await res.json();
          setMessages(messages);
        } else {
          const fakeMsg: Message = {
            id: -1,
            cuoc_hoi_thoai: -999,
            kieu_noi_dung: "text",
            noi_dung_van_ban: "Chào bạn, tôi là AI. Tôi giúp gì được cho bạn?",
            media_url: null,
            thoi_diem_gui: new Date().toISOString(),
            thoi_diem_da_xem: null,
            ben_gui_di: "ai",
          };
          const fakeConv = updatedData.find((c) => c.cuoc_hoi_thoai === -999);
          if (fakeConv) {
            setSelectedConversation(fakeConv);
            setMessages([fakeMsg]);
          }
        }

        return;
      }

      // Nếu là bệnh nhân
      if (selectedPatient) {
        const existingConversation = updatedData.find(
          (c) => c.nguoi_dung.ma === selectedPatient
        );

        if (existingConversation) {
          setSelectedConversation(existingConversation);
        } else {
          setMessages([]);

          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/patient/detail/${selectedPatient}`
          );
          const data = await res.json();

          const newConver: Conversation = {
            cuoc_hoi_thoai: -1,
            nguoi_dung: {
              ma: selectedPatient,
              avt_url: data.Nguoi_dung.avt_url || null,
              ho_va_ten: data.Nguoi_dung.ho_va_ten,
            },
            so_tin_moi: 0,
            thoi_diem_tin_nhan_cuoi: "",
            tin_nhan: {
              noi_dung_van_ban: "",
              media_url: null,
            },
          };

          setNewConversation(newConver);
          setSelectedConversation(newConver);
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách trò chuyện:", err);
    }
  };

  fetchConversations();
}, [drID, selectedPatient]);

  // Tự động chọn cuộc trò chuyện đầu tiên nếu chưa có cuộc trò chuyện nào được chọn
  useEffect(() => {
    if (!selectedConversation && filteredConversations.length > 0) {
      const first = filteredConversations[0];

      if (first.nguoi_dung.ma === "ai_agent") {
        setSelectedPatient("ai_agent");
        setSelectedConversation(first);
        setMessages([
          {
            id: -1,
            cuoc_hoi_thoai: -999,
            kieu_noi_dung: "text",
            noi_dung_van_ban: "Chào bạn, tôi là AI. Tôi giúp gì được cho bạn?",
            media_url: null,
            thoi_diem_gui: new Date().toISOString(),
            thoi_diem_da_xem: null,
            ben_gui_di: "ai",
          },
        ]);
      } else {
        setSelectedPatient(first.nguoi_dung.ma);
        setSelectedConversation(first);
      }
    }
  }, [filteredConversations, selectedConversation]);
  //Lấy tin nhắn từ server qua API ${import.meta.env.VITE_API_BASE_URL}/api/message/conversation/:conversationID
  useEffect(() => {
    if (selectedConversation && selectedConversation.cuoc_hoi_thoai > 0) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/conversation/${
          selectedConversation.cuoc_hoi_thoai
        }`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
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
    if (!selectedConversation || selectedConversation.cuoc_hoi_thoai < 0)
      return;

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

  // const handleSendMessage = async (content: string) => {
  //   // Nếu chưa có cuộc trò chuyện nào được chọn thì phải đợi tạo
  //   if (!selectedConversation) {
  //     return;
  //   }
  //   if (selectedConversation?.cuoc_hoi_thoai < 0) {
  //     await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ptID: selectedPatient,
  //         drID: drID,
  //       }),
  //     })
  //       .then((res) => {
  //         if (res.ok) {
  //           return res.json();
  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Lỗi",
  //             text: "Có lỗi xảy ra, vui lòng thử lại.",
  //           });
  //         }
  //       })
  //       .then((data) => {
  //         console.log("Tạo cuộc trò chuyện mới", data);
  //         if (newConversation?.nguoi_dung) {
  //           setSelectedConversation({
  //             cuoc_hoi_thoai: data.cuoc_hoi_thoai,
  //             nguoi_dung: newConversation.nguoi_dung,
  //             so_tin_moi: newConversation.so_tin_moi || 0,
  //             thoi_diem_tin_nhan_cuoi: new Date().toISOString(),
  //             tin_nhan: {
  //               noi_dung_van_ban: "",
  //               media_url: null,
  //             },
  //           });
  //           setNewConversation(null);
  //           setConversations((prevConversations) => [
  //             {
  //               cuoc_hoi_thoai: data.cuoc_hoi_thoai,
  //               nguoi_dung: newConversation.nguoi_dung,
  //               so_tin_moi: newConversation.so_tin_moi || 0,
  //               thoi_diem_tin_nhan_cuoi: new Date().toISOString(),
  //               tin_nhan: {
  //                 noi_dung_van_ban: "",
  //                 media_url: null,
  //               },
  //             },
  //             ...prevConversations,
  //           ]);

  //           setFilteredConversations((prevConversations) => [
  //             {
  //               cuoc_hoi_thoai: data.cuoc_hoi_thoai,
  //               nguoi_dung: newConversation.nguoi_dung,
  //               so_tin_moi: newConversation.so_tin_moi || 0,
  //               thoi_diem_tin_nhan_cuoi: new Date().toISOString(),
  //               tin_nhan: {
  //                 noi_dung_van_ban: "",
  //                 media_url: null,
  //               },
  //             },
  //             ...prevConversations,
  //           ]);
  //         }
  //       });
  //   }

  //   console.log(
  //     "Tin nhắn từ ",
  //     drID,
  //     " đến ",
  //     selectedConversation?.nguoi_dung?.ma
  //   );
  //   // Gửi tin nhắn đến server
  //   let time = new Date().toISOString();
  //   console.log(time);

  //   // Cập nhật lại thời điểm tin nhắn cuối cùng trong cuộc trò chuyện
  //   const updatedConversations = conversations.map((conversation) => {
  //     if (conversation.cuoc_hoi_thoai === selectedConversation.cuoc_hoi_thoai) {
  //       console.log("Cập nhật time", time, "cuộc hội thoại", conversation);
  //       return {
  //         ...conversation,
  //         thoi_diem_tin_nhan_cuoi: time,
  //         tin_nhan: {
  //           noi_dung_van_ban: content,
  //           media_url: files.length > 0 ? "Đã gửi tệp" : "",
  //         },
  //       };
  //     }
  //     return conversation;
  //   });
  //   // Sắp xếp lại các cuộc trò chuyện theo thời điểm tin nhắn cuối cùng
  //   let sortedConversations = updatedConversations.sort(
  //     (a, b) =>
  //       new Date(b.thoi_diem_tin_nhan_cuoi).getTime() -
  //       new Date(a.thoi_diem_tin_nhan_cuoi).getTime()
  //   );
  //   console.log(sortedConversations);
  //   setConversations(sortedConversations);
  //   setFilteredConversations(sortedConversations);

  //   // Kiểm tra xem tin nhắn có phải là file không
  //   if (files.length > 0) {
  //     let tempID = Date.now();

  //     let message = {
  //       id: tempID, // Sử dụng timestamp để làm ID cho tin nhắn tạm thời
  //       kieu_noi_dung: "text",
  //       noi_dung_van_ban: "",
  //       media_url: null, // Không có media url ngay lập tức
  //       thoi_diem_gui: time,
  //       thoi_diem_da_xem: null,
  //       cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
  //       ben_gui_di: "bs",
  //     };

  //     setMessages((prevMessages) => [...prevMessages, message]);

  //     let formData = new FormData();
  //     files.forEach((file) => {
  //       formData.append("files", file);
  //     });
  //     formData.append("folderName", "message_media");
  //     setFiles([]);

  //     fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`, {
  //       method: "POST",
  //       body: formData,
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         data.forEach((file: UpFileResponse) => {
  //           console.log("Gửi file thành công", file);
  //           sendMessage(
  //             drID,
  //             selectedConversation?.nguoi_dung?.ma || "",
  //             content,
  //             time,
  //             file.type,
  //             file.url
  //           );

  //           // Cập nhật lại tin nhắn tạm thời thành tin nhắn thực
  //           setMessages((prevMessages) =>
  //             prevMessages.map((msg) => {
  //               if (msg.id === tempID) {
  //                 return {
  //                   ...msg,
  //                   kieu_noi_dung: file.type,
  //                   media_url: file.url,
  //                 };
  //               }
  //               return msg;
  //             })
  //           );
  //         });
  //       });
  //   } else {
  //     sendMessage(
  //       drID,
  //       selectedConversation?.nguoi_dung?.ma || "",
  //       content,
  //       time,
  //       "text",
  //       ""
  //     );
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         id: prevMessages.length + 1,
  //         kieu_noi_dung: "text",
  //         noi_dung_van_ban: content,
  //         media_url: null,
  //         thoi_diem_gui: time,
  //         thoi_diem_da_xem: null,
  //         cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
  //         ben_gui_di: "bs",
  //       },
  //     ]);
  //   }
  // };

  // const handleSendMessage = async (content: string) => {
  // if (!selectedConversation) return;
  // const time = new Date().toISOString();

  // // === Trường hợp là cuộc hội thoại với AI Agent (cuoc_hoi_thoai = -999) ===
  // if (selectedConversation.cuoc_hoi_thoai === -999) {
  //   const tempUserMsg: Message = {
  //     id: Date.now(),
  //     kieu_noi_dung: "text",
  //     noi_dung_van_ban: content,
  //     media_url: null,
  //     thoi_diem_gui: time,
  //     thoi_diem_da_xem: null,
  //     cuoc_hoi_thoai: -999,
  //     ben_gui_di: "bs",
  //   };
  //   setMessages((prev) => [...prev, tempUserMsg]);

  //   try {
  //     // 1. Tạo hoặc lấy cuộc hội thoại AI thật
  //     let realConversationId: number;
  //     const existingAIConversation = conversations.find(
  //       (c) => c.is_ai_agent && c.cuoc_hoi_thoai !== -999
  //     );

  //     if (existingAIConversation) {
  //       realConversationId = existingAIConversation.cuoc_hoi_thoai;
  //     } else {
  //       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation/ai`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ drID }),
  //       });
  //       const newConv = await res.json();
  //       realConversationId = newConv.id;
          
  //       // ✅ Cập nhật danh sách hội thoại để không bị lỗi lần gửi sau
  //       const updatedAIConv: Conversation = {
  //         cuoc_hoi_thoai: newConv.cuoc_hoi_thoai,
  //         is_ai_agent: true,
  //         nguoi_dung: {
  //           ma: "ai_agent",
  //           ho_va_ten: "AI Agent",
  //           avt_url: "./images/ai-avatar.png",
  //         },
  //         so_tin_moi: 0,
  //         thoi_diem_tin_nhan_cuoi: time,
  //         tin_nhan: { noi_dung_van_ban: content, media_url: null },
  //       };
  //       setConversations((prev) => {
  //         const filtered = prev.filter((c) => c.cuoc_hoi_thoai !== -999);
  //         return [updatedAIConv, ...filtered];
  //       });

  //       setFilteredConversations((prev) => {
  //         const filtered = prev.filter((c) => c.cuoc_hoi_thoai !== -999);
  //         return [updatedAIConv, ...filtered];
  //       });
  //       setSelectedConversation(updatedAIConv);
  //     }

  //     // 2. Lưu tin nhắn bác sĩ vào DB
  //     await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/text/ai`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         cuoc_hoi_thoai: realConversationId,
  //         ben_gui_di: "bs",
  //         kieu_noi_dung: "text",
  //         noi_dung_van_ban: content,
  //         media_url: "",
  //         thoi_diem_gui: time,
  //       }),
  //     });

  //     // 3. Gọi AI Agent
  //     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ message: content, drID, conversationID: realConversationId }),
  //     });

  //     if (!response.ok) throw new Error("API lỗi!");
  //     const data = await response.json();
  //     const aiReplyTime = new Date().toISOString();

  //     // 4. Lưu phản hồi AI vào DB
  //     await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/text/ai`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         cuoc_hoi_thoai: realConversationId,
  //         ben_gui_di: "ai",
  //         kieu_noi_dung: "text",
  //         noi_dung_van_ban: data.reply,
  //         media_url: "",
  //         thoi_diem_gui: aiReplyTime,
  //       }),
  //     });

  //     // 5. Hiển thị tin nhắn AI trên giao diện
  //     const aiReply: Message = {
  //       id: Date.now() + 1,
  //       kieu_noi_dung: "text",
  //       noi_dung_van_ban: data.reply,
  //       media_url: null,
  //       thoi_diem_gui: aiReplyTime,
  //       thoi_diem_da_xem: null,
  //       cuoc_hoi_thoai: realConversationId,
  //       ben_gui_di: "ai",
  //     };
  //     setMessages((prev) => [...prev, aiReply]);
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   return;
  // }

  // // === Trường hợp gửi tin nhắn với bệnh nhân ===
  // if (selectedConversation.cuoc_hoi_thoai < 0) {
  //   await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ ptID: selectedPatient, drID }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (newConversation?.nguoi_dung) {
  //         const newConv = {
  //           cuoc_hoi_thoai: data.cuoc_hoi_thoai,
  //           nguoi_dung: newConversation.nguoi_dung,
  //           so_tin_moi: 0,
  //           thoi_diem_tin_nhan_cuoi: time,
  //           tin_nhan: { noi_dung_van_ban: "", media_url: null },
  //         };
  //         setSelectedConversation(newConv);
  //         setNewConversation(null);
  //         setConversations((prev) => [newConv, ...prev]);
  //         setFilteredConversations((prev) => [newConv, ...prev]);
  //       }
  //     });
  // }

  // // === Cập nhật giao diện danh sách hội thoại ===
  // const updatedConversations = conversations.map((conversation) => {
  //   if (conversation.cuoc_hoi_thoai === selectedConversation.cuoc_hoi_thoai) {
  //     return {
  //       ...conversation,
  //       thoi_diem_tin_nhan_cuoi: time,
  //       tin_nhan: {
  //         noi_dung_van_ban: content,
  //         media_url: files.length > 0 ? "Đã gửi tệp" : "",
  //       },
  //     };
  //   }
  //   return conversation;
  // });

  // const sortedConversations = updatedConversations.sort(
  //   (a, b) =>
  //     new Date(b.thoi_diem_tin_nhan_cuoi).getTime() -
  //     new Date(a.thoi_diem_tin_nhan_cuoi).getTime()
  // );

  // setConversations(sortedConversations);
  // setFilteredConversations(sortedConversations);

  // // === Gửi file nếu có ===
  // if (files.length > 0) {
  //   const tempID = Date.now();
  //   const message = {
  //     id: tempID,
  //     kieu_noi_dung: "text",
  //     noi_dung_van_ban: "",
  //     media_url: null,
  //     thoi_diem_gui: time,
  //     thoi_diem_da_xem: null,
  //     cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
  //     ben_gui_di: "bs",
  //   };

  //   setMessages((prevMessages) => [...prevMessages, message]);

  //   const formData = new FormData();
  //   files.forEach((file) => formData.append("files", file));
  //   formData.append("folderName", "message_media");
  //   setFiles([]);

  //   fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`, {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       data.forEach((file: UpFileResponse) => {
  //         sendMessage(
  //           drID,
  //           selectedConversation?.nguoi_dung?.ma || "",
  //           content,
  //           time,
  //           file.type,
  //           file.url
  //         );

  //         setMessages((prevMessages) =>
  //           prevMessages.map((msg) =>
  //             msg.id === tempID
  //               ? { ...msg, kieu_noi_dung: file.type, media_url: file.url }
  //               : msg
  //           )
  //         );
  //       });
  //     });
  // } else {
  //   sendMessage(
  //     drID,
  //     selectedConversation?.nguoi_dung?.ma || "",
  //     content,
  //     time,
  //     "text",
  //     ""
  //   );
  //   setMessages((prevMessages) => [
  //     ...prevMessages,
  //     {
  //       id: prevMessages.length + 1,
  //       kieu_noi_dung: "text",
  //       noi_dung_van_ban: content,
  //       media_url: null,
  //       thoi_diem_gui: time,
  //       thoi_diem_da_xem: null,
  //       cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
  //       ben_gui_di: "bs",
  //     },
  //   ]);
  // }
  // };

  // const handleSendMessage = async (content: string) => {
  // if (!selectedConversation) return;
  // const time = new Date().toISOString();

  // // === Trường hợp là cuộc hội thoại với AI Agent ===
  // if (selectedConversation.nguoi_dung.ma === "ai_agent") {
  //   const tempUserMsg: Message = {
  //     id: Date.now(),
  //     kieu_noi_dung: "text",
  //     noi_dung_van_ban: content,
  //     media_url: null,
  //     thoi_diem_gui: time,
  //     thoi_diem_da_xem: null,
  //     cuoc_hoi_thoai: selectedConversation.cuoc_hoi_thoai,
  //     ben_gui_di: "bs",
  //   };
  //   setMessages((prev) => [...prev, tempUserMsg]);

  //   try {
  //     // 1. Tạo hoặc lấy conversation thật
  //     let realConversationId: number;
  //     const existingAIConversation = conversations.find(
  //       (c) => c.is_ai_agent && c.cuoc_hoi_thoai !== -999
  //     );

  //     if (existingAIConversation) {
  //       realConversationId = existingAIConversation.cuoc_hoi_thoai;
  //     } else {
  //       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation/ai`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ drID }),
  //       });
  //       const newConv = await res.json();
  //       realConversationId = newConv.id;
  //       console.log(realConversationId," realConversationId");
  //       const newAIConv: Conversation = {
  //         cuoc_hoi_thoai: realConversationId,
  //         is_ai_agent: true,
  //         nguoi_dung: {
  //           ma: "ai_agent",
  //           ho_va_ten: "AI Agent",
  //           avt_url: "./images/ai-avatar.png",
  //         },
  //         so_tin_moi: 0,
  //         thoi_diem_tin_nhan_cuoi: time,
  //         tin_nhan: { noi_dung_van_ban: content, media_url: null },
  //       };

  //       setConversations((prev) => {
  //         const filtered = prev.filter((c) => c.cuoc_hoi_thoai !== -999);
  //         return [newAIConv, ...filtered];
  //       });
  //       setFilteredConversations((prev) => {
  //         const filtered = prev.filter((c) => c.cuoc_hoi_thoai !== -999);
  //         return [newAIConv, ...filtered];
  //       });
  //       setSelectedConversation(newAIConv);
  //     }

  //     // 2. Lưu tin nhắn bác sĩ vào DB
  //     await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/text/ai`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         cuoc_hoi_thoai: realConversationId,
  //         ben_gui_di: "bs",
  //         kieu_noi_dung: "text",
  //         noi_dung_van_ban: content,
  //         media_url: "",
  //         thoi_diem_gui: time,
  //       }),
  //     });

  //     // 3. Gọi AI Agent
  //     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         message: content,
  //         drID,
  //         conversationID: realConversationId,
  //       }),
  //     });

  //     if (!res.ok) throw new Error("API lỗi!");
  //     const data = await res.json();
  //     const aiReplyTime = new Date().toISOString();

  //     // 4. Lưu phản hồi AI vào DB
  //     await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/text/ai`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         cuoc_hoi_thoai: realConversationId,
  //         ben_gui_di: "ai",
  //         kieu_noi_dung: "text",
  //         noi_dung_van_ban: data.reply,
  //         media_url: "",
  //         thoi_diem_gui: aiReplyTime,
  //       }),
  //     });

  //     // 5. Hiển thị phản hồi AI
  //     const aiReply: Message = {
  //       id: Date.now() + 1,
  //       kieu_noi_dung: "text",
  //       noi_dung_van_ban: data.reply,
  //       media_url: null,
  //       thoi_diem_gui: aiReplyTime,
  //       thoi_diem_da_xem: null,
  //       cuoc_hoi_thoai: realConversationId,
  //       ben_gui_di: "ai",
  //     };
  //     setMessages((prev) => [...prev, aiReply]);
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   return;
  // }

  // // === Trường hợp gửi với bệnh nhân ===
  // if (selectedConversation.cuoc_hoi_thoai < 0) {
  //   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ ptID: selectedPatient, drID }),
  //   });
  //   const data = await res.json();
  //   if (newConversation?.nguoi_dung) {
  //     const newConv = {
  //       cuoc_hoi_thoai: data.cuoc_hoi_thoai,
  //       nguoi_dung: newConversation.nguoi_dung,
  //       so_tin_moi: 0,
  //       thoi_diem_tin_nhan_cuoi: time,
  //       tin_nhan: { noi_dung_van_ban: "", media_url: null },
  //     };
  //     setSelectedConversation(newConv);
  //     setNewConversation(null);
  //     setConversations((prev) => [newConv, ...prev]);
  //     setFilteredConversations((prev) => [newConv, ...prev]);
  //   }
  // }

  // // === Cập nhật UI danh sách hội thoại ===
  // const updatedConversations = conversations.map((conversation) => {
  //   if (conversation.cuoc_hoi_thoai === selectedConversation.cuoc_hoi_thoai) {
  //     return {
  //       ...conversation,
  //       thoi_diem_tin_nhan_cuoi: time,
  //       tin_nhan: {
  //         noi_dung_van_ban: content,
  //         media_url: files.length > 0 ? "Đã gửi tệp" : "",
  //       },
  //     };
  //   }
  //   return conversation;
  // });

  // const sortedConversations = updatedConversations.sort(
  //   (a, b) =>
  //     new Date(b.thoi_diem_tin_nhan_cuoi).getTime() -
  //     new Date(a.thoi_diem_tin_nhan_cuoi).getTime()
  // );
  // setConversations(sortedConversations);
  // setFilteredConversations(sortedConversations);

  // // === Gửi file hoặc text qua WebSocket ===
  // if (files.length > 0) {
  //   const tempID = Date.now();
  //   const message = {
  //     id: tempID,
  //     kieu_noi_dung: "text",
  //     noi_dung_van_ban: "",
  //     media_url: null,
  //     thoi_diem_gui: time,
  //     thoi_diem_da_xem: null,
  //     cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
  //     ben_gui_di: "bs",
  //   };
  //   setMessages((prev) => [...prev, message]);

  //   const formData = new FormData();
  //   files.forEach((file) => formData.append("files", file));
  //   formData.append("folderName", "message_media");
  //   setFiles([]);

  //   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`, {
  //     method: "POST",
  //     body: formData,
  //   });
  //   const fileData = await res.json();

  //   fileData.forEach((file: UpFileResponse) => {
  //     sendMessage(
  //       drID,
  //       selectedConversation?.nguoi_dung?.ma || "",
  //       content,
  //       time,
  //       file.type,
  //       file.url
  //     );
  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg.id === tempID
  //           ? { ...msg, kieu_noi_dung: file.type, media_url: file.url }
  //           : msg
  //       )
  //     );
  //   });
  // } else {
  //   sendMessage(
  //     drID,
  //     selectedConversation?.nguoi_dung?.ma || "",
  //     content,
  //     time,
  //     "text",
  //     ""
  //   );
  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       id: Date.now(),
  //       kieu_noi_dung: "text",
  //       noi_dung_van_ban: content,
  //       media_url: null,
  //       thoi_diem_gui: time,
  //       thoi_diem_da_xem: null,
  //       cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
  //       ben_gui_di: "bs",
  //     },
  //   ]);
  // }
  // };
  const handleSendMessage = async (content: string) => {
  if (!selectedConversation) return;
  const time = new Date().toISOString();

  // === Trường hợp là cuộc hội thoại với AI Agent ===
  if (selectedConversation.nguoi_dung.ma === "ai_agent") {
    try {
      // 1. Tạo hoặc lấy conversation thật
      let realConversationId: number;
      let selectedConv: Conversation;

      const existingAIConversation = conversations.find(
        (c) => c.is_ai_agent && c.cuoc_hoi_thoai !== -999
      );

      if (existingAIConversation) {
        realConversationId = existingAIConversation.cuoc_hoi_thoai;
        selectedConv = existingAIConversation;
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ drID }),
        });
        const newConv = await res.json();
        realConversationId = newConv.id;

        // ✅ Lưu tin nhắn chào hỏi vào DB
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/text/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cuoc_hoi_thoai: realConversationId,
            ben_gui_di: "ai",
            kieu_noi_dung: "text",
            noi_dung_van_ban: "Chào bạn, tôi là AI. Tôi giúp gì được cho bạn?",
            media_url: "",
            thoi_diem_gui: time,
          }),
        });

        selectedConv = {
          cuoc_hoi_thoai: realConversationId,
          is_ai_agent: true,
          nguoi_dung: {
            ma: "ai_agent",
            ho_va_ten: "AI Agent",
            avt_url: "./images/ai-avatar.png",
          },
          so_tin_moi: 0,
          thoi_diem_tin_nhan_cuoi: time,
          tin_nhan: { noi_dung_van_ban: content, media_url: null },
        };

        setConversations((prev) => {
          const filtered = prev.filter((c) => c.cuoc_hoi_thoai !== -999);
          return [selectedConv, ...filtered];
        });
        setFilteredConversations((prev) => {
          const filtered = prev.filter((c) => c.cuoc_hoi_thoai !== -999);
          return [selectedConv, ...filtered];
        });
        setSelectedConversation(selectedConv);
      }

      // 2. Lưu và hiển thị tin nhắn bác sĩ
      const tempUserMsg: Message = {
        id: Date.now(),
        kieu_noi_dung: "text",
        noi_dung_van_ban: content,
        media_url: null,
        thoi_diem_gui: time,
        thoi_diem_da_xem: null,
        cuoc_hoi_thoai: realConversationId,
        ben_gui_di: "bs",
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/text/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuoc_hoi_thoai: realConversationId,
          ben_gui_di: "bs",
          kieu_noi_dung: "text",
          noi_dung_van_ban: content,
          media_url: "",
          thoi_diem_gui: time,
        }),
      });

      // 3. Gọi AI Agent
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          role: localStorage.getItem("role"),
          ma_user: localStorage.getItem("id"),
        }),
      });

      if (!res.ok) throw new Error("API lỗi!");
      const data = await res.json();
      const aiReplyTime = new Date().toISOString();

      if (typeof data.reply !== 'string') {
        // Nếu `reply` không phải là string, chuyển nó thành chuỗi
        data.reply = JSON.stringify(data.reply);
      }

      // 4. Lưu phản hồi AI
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message/text/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuoc_hoi_thoai: realConversationId,
          ben_gui_di: "ai",
          kieu_noi_dung: "text",
          noi_dung_van_ban: data.reply,
          media_url: "",
          thoi_diem_gui: aiReplyTime,
        }),
      });

      // 5. Hiển thị phản hồi AI trên UI
      const aiReply: Message = {
        id: Date.now() + 1,
        kieu_noi_dung: "text",
        noi_dung_van_ban: data.reply,
        media_url: null,
        thoi_diem_gui: aiReplyTime,
        thoi_diem_da_xem: null,
        cuoc_hoi_thoai: realConversationId,
        ben_gui_di: "ai",
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
    }

    return;
  }

  // === Trường hợp gửi với bệnh nhân ===
  if (selectedConversation.cuoc_hoi_thoai < 0) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ptID: selectedPatient, drID }),
    });
    const data = await res.json();
    if (newConversation?.nguoi_dung) {
      const newConv = {
        cuoc_hoi_thoai: data.cuoc_hoi_thoai,
        nguoi_dung: newConversation.nguoi_dung,
        so_tin_moi: 0,
        thoi_diem_tin_nhan_cuoi: time,
        tin_nhan: { noi_dung_van_ban: "", media_url: null },
      };
      setSelectedConversation(newConv);
      setNewConversation(null);
      setConversations((prev) => [newConv, ...prev]);
      setFilteredConversations((prev) => [newConv, ...prev]);
    }
  }

  // === Cập nhật UI danh sách hội thoại ===
  const updatedConversations = conversations.map((conversation) => {
    if (conversation.cuoc_hoi_thoai === selectedConversation.cuoc_hoi_thoai) {
      return {
        ...conversation,
        thoi_diem_tin_nhan_cuoi: time,
        tin_nhan: {
          noi_dung_van_ban: content,
          media_url: files.length > 0 ? "Đã gửi tệp" : "",
        },
      };
    }
    return conversation;
  });

  const sortedConversations = updatedConversations.sort(
    (a, b) =>
      new Date(b.thoi_diem_tin_nhan_cuoi).getTime() -
      new Date(a.thoi_diem_tin_nhan_cuoi).getTime()
  );
  setConversations(sortedConversations);
  setFilteredConversations(sortedConversations);

  // === Gửi file hoặc text qua WebSocket ===
  if (files.length > 0) {
    const tempID = Date.now();
    const message = {
      id: tempID,
      kieu_noi_dung: "text",
      noi_dung_van_ban: "",
      media_url: null,
      thoi_diem_gui: time,
      thoi_diem_da_xem: null,
      cuoc_hoi_thoai: selectedConversation?.cuoc_hoi_thoai || 0,
      ben_gui_di: "bs",
    };
    setMessages((prev) => [...prev, message]);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("folderName", "message_media");
    setFiles([]);

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`, {
      method: "POST",
      body: formData,
    });
    const fileData = await res.json();

    fileData.forEach((file: UpFileResponse) => {
      sendMessage(
        drID,
        selectedConversation?.nguoi_dung?.ma || "",
        content,
        time,
        file.type,
        file.url
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempID
            ? { ...msg, kieu_noi_dung: file.type, media_url: file.url }
            : msg
        )
      );
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
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
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
    if (e.nativeEvent.isComposing) return; // fix lỗi với IME như tiếng Việt
    if (e.key === "Enter") {
      e.preventDefault();
      if (content.trim()) {
        const msg = content;
        setContent(""); // reset trước
        handleSendMessage(msg); // gọi hàm sau khi đã clear
      }
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

  const handleRecallMessage = (
    content: string,
    time: string,
    type: string,
    url: string
  ) => {
    if (!selectedConversation) {
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (
          msg.thoi_diem_gui === time &&
          msg.ben_gui_di === "bs" &&
          msg.kieu_noi_dung === type
        ) {
          return {
            ...msg,
            kieu_noi_dung: "recall", // Cập nhật kiểu nội dung thành 'recall'
            noi_dung_van_ban: "",
            media_url: null,
          };
        }
        return msg;
      })
    );

    recallMessage(
      drID,
      selectedConversation?.nguoi_dung?.ma || "",
      content,
      time,
      type,
      url
    );
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
          <div className="mt-2 overflow-y-auto flex-grow h-96">
            {filteredConversations.map((conversation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-300 cursor-pointer w-full"
                onClick={async () => {
                  if (conversation.nguoi_dung.ma === "ai_agent") {
                    // setSelectedPatient("ai_agent");
                    // setSelectedConversation(conversation);
                    // setMessages([
                    //   {
                    //     id: -1,
                    //     cuoc_hoi_thoai: -999,
                    //     kieu_noi_dung: "text",
                    //     noi_dung_van_ban: "Chào bạn, tôi là AI. Tôi giúp gì được cho bạn?",
                    //     media_url: null,
                    //     thoi_diem_gui: new Date().toISOString(),
                    //     thoi_diem_da_xem: null,
                    //     ben_gui_di: "ai",
                    //   },
                    // ]);
                    setSelectedPatient("ai_agent");

                    const realAIConversation = conversations.find(
                      (c) => c.is_ai_agent && c.cuoc_hoi_thoai !== -999
                    );

                    if (realAIConversation) {
                      setSelectedConversation(realAIConversation);

                      const res = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/api/message/conversation/${realAIConversation.cuoc_hoi_thoai}`
                      );
                      const data = await res.json();
                      setMessages(data);
                    } else {
                      const fakeMessage: Message = {
                        id: -1,
                        cuoc_hoi_thoai: -999,
                        kieu_noi_dung: "text",
                        noi_dung_van_ban: "Chào bạn, tôi là AI. Tôi giúp gì được cho bạn?",
                        media_url: null,
                        thoi_diem_gui: new Date().toISOString(),
                        thoi_diem_da_xem: null,
                        ben_gui_di: "ai",
                      };

                      setSelectedConversation(conversation);
                      setMessages([fakeMessage]);
                    }
                  } else {
                    setSelectedPatient(conversation.nguoi_dung.ma);
                    setSelectedConversation(conversation);
                  }
                }}
              >
                <div className="flex justify-evenly items-center gap-2">
                  {/* <img
                    src={conversation.nguoi_dung.avt_url || "./images/avt.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  /> */}
                  {conversation.nguoi_dung.ma === "ai_agent" ? (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl text-gray-600">
                      <BsRobot />
                    </div>
                  ) : (
                    <img
                      src={conversation.nguoi_dung.avt_url || "./images/avt.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <span>{conversation.nguoi_dung.ho_va_ten}</span>
                    <p className="text-sm text-gray-500">
                      {conversation.tin_nhan.media_url &&
                      conversation.tin_nhan.media_url !== ""
                        ? "Tệp đính kèm"
                        : getAIPreviewText(conversation.tin_nhan.noi_dung_van_ban)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end mt-auto">
                  {conversation.so_tin_moi > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {conversation.so_tin_moi}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(
                      conversation.thoi_diem_tin_nhan_cuoi
                    ).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 p-2 bg-gray-100 flex flex-col">
          {/* Header chứa ảnh và tên ở bên trái, nút gọi video ở bên phải */}
          <div className="flex items-center justify-between p-2 bg-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              {/* <img
                src={
                  selectedConversation?.nguoi_dung.avt_url || "./images/avt.png"
                }
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">
                {selectedConversation?.nguoi_dung.ho_va_ten}
              </span> */}
              {selectedConversation?.nguoi_dung.ma === "ai_agent" ? (
                <div
                  title="AI Agent"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-[22px]"
                >
                  <BsRobot />
                </div>
              ) : (
                <img
                  src={
                    selectedConversation?.nguoi_dung.avt_url || "./images/avt.png"
                  }
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              )}
              <span className="font-semibold">
                {selectedConversation?.nguoi_dung.ho_va_ten}
              </span>
            </div>
          </div>
          <div
            className="flex flex-col overflow-y-auto flex-grow h-96 my-2"
            ref={reff}
            onScroll={(e) => {
              const target = e.currentTarget;
              // Nếu người dùng đang ở gần cuối
              autoScrollRef.current =
                target.scrollHeight - target.scrollTop - target.clientHeight <
                100;
            }}
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
                  {/* {message.kieu_noi_dung === "text" && (
                  <div
                    className={`${
                      ["bn", "ai"].includes(message.ben_gui_di)
                        ? "mr-auto bg-white min-h-[40px] max-h-[200px] overflow-auto"
                        : "ml-auto bg-blue-500 text-white min-h-[40px] max-h-[200px] overflow-auto"
                    } p-2 shadow-md rounded-lg my-2 max-w-xs w-fit relative group`}
                  >
                      {message.ben_gui_di === "bs" && (
                        <button
                          onClick={() =>
                            handleRecallMessage(
                              message.noi_dung_van_ban,
                              message.thoi_diem_gui,
                              message.kieu_noi_dung,
                              message.media_url || ""
                            )
                          }
                          className="absolute top-0 right-0 text-white hidden group-hover:block text-sm bg-gray-600 px-1 rounded hover:bg-red-500"
                          title="Thu hồi tin nhắn"
                        >
                          ⟳
                        </button>
                      )}
                      <p className="w-fit">{message.noi_dung_van_ban}</p>
                      <span
                        className={`text-xs ${
                          ["bn", "ai"].includes(message.ben_gui_di)
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
                  )} */}
                  {message.kieu_noi_dung === "text" && (
                    <>
                      {message.ben_gui_di === "ai" ? (
                        <div className="mr-auto bg-white min-h-[60px] max-h-[500px] overflow-auto p-3 shadow-md rounded-lg my-2 max-w-2xl w-full relative group">
                          {(() => {
                            try {
                              const parsed = JSON.parse(message.noi_dung_van_ban);
                              if (typeof parsed === "object" && parsed.message) {
                                return <DynamicAIReply reply={parsed} />;
                              }
                              return <p className="w-fit">{message.noi_dung_van_ban}</p>;
                            } catch {
                              return <p className="w-fit">{message.noi_dung_van_ban}</p>;
                            }
                          })()}

                          <span className="text-xs text-gray-500 block mt-1">
                            {new Date(message.thoi_diem_gui).toLocaleString("vi-VN", {
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </span>
                        </div>
                      ) : (
                        // Các tin nhắn từ bn hoặc bs
                        <div
                          className={`${
                            message.ben_gui_di === "bn"
                              ? "mr-auto bg-white"
                              : "ml-auto bg-blue-500 text-white"
                          } min-h-[40px] max-h-[300px] overflow-auto p-2 shadow-md rounded-lg my-2 max-w-md w-fit relative group`}
                        >
                          {/* Chỉ bác sĩ mới có quyền recall */}
                          {message.ben_gui_di === "bs" && (
                            <button
                              onClick={() =>
                                handleRecallMessage(
                                  message.noi_dung_van_ban,
                                  message.thoi_diem_gui,
                                  message.kieu_noi_dung,
                                  message.media_url || ""
                                )
                              }
                              className="absolute top-0 right-0 text-white hidden group-hover:block text-sm bg-gray-600 px-1 rounded hover:bg-red-500"
                              title="Thu hồi tin nhắn"
                            >
                              ⟳
                            </button>
                          )}

                          <p className="w-fit">{message.noi_dung_van_ban}</p>
                          <span
                            className={`text-xs ${
                              message.ben_gui_di === "bn" ? "text-gray-500" : "text-gray-200"
                            } block mt-1`}
                          >
                            {new Date(message.thoi_diem_gui).toLocaleString("vi-VN", {
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                 {/* Render tin nhắn kiểu image */}
                  {message.kieu_noi_dung === "image" && (
                    <div
                      className={`${
                        message.ben_gui_di === "bn" ? "mr-auto" : "ml-auto"
                      } p-2 py-0  my-2 max-w-xs w-fit cursor-pointer relative group`}
                      onClick={() => handleImageClick(message.media_url || "")}
                    >
                      {message.ben_gui_di === "bs" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecallMessage(
                              message.noi_dung_van_ban,
                              message.thoi_diem_gui,
                              message.kieu_noi_dung,
                              message.media_url || ""
                            );
                          }}
                          className="absolute top-0 right-0 text-white hidden group-hover:block text-sm bg-gray-600 px-1 rounded hover:bg-red-500"
                          title="Thu hồi tin nhắn"
                        >
                          ⟳
                        </button>
                      )}
                      <img
                        src={message.media_url || ""}
                        alt=""
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <span
                        className={`text-xs text-gray-500 block w-full
                          ${
                            message.ben_gui_di === "bn"
                              ? "text-left"
                              : "text-right"
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

                  {/* Render tin nhắn đã thu hồi */}
                  {message.kieu_noi_dung === "recall" && (
                    <div
                      className={`${
                        message.ben_gui_di === "bn" ? "mr-auto" : "ml-auto"
                      } p-2 shadow-md rounded-lg my-2 max-w-xs w-fit bg-white`}
                    >
                      <span className="text-xs text-gray-500 italic font-medium">
                        Tin nhắn đã thu hồi
                      </span>
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
              <MdAttachFile className=" text-blue-500 hover:text-blue-700 text-2xl transition-all duration-300 transform hover:scale-110" />
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
              type="button"
              className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
              onClick={() => {
                if (content.trim()) {
                  handleSendMessage(content);
                  setContent("");
                }
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

      {/* Hiển thị iframe khi người dùng nhấn nút */}
      {isVideoCallOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 h-full">
            {/* Nút đóng ở góc trái */}
            <button
              onClick={() => setIsVideoCallOpen(false)} // Đóng iframe
              className="absolute top-5 right-10 text-white text-2xl"
            >
              &times; {/* Dấu X */}
            </button>

            {/* Iframe chiếm toàn bộ không gian của div chứa */}
            <iframe
              src={`/video_call/${selectedConversation?.nguoi_dung.ma}`}
              frameBorder="0"
              title="Video Call"
              className="w-full h-full rounded-lg"
              allow="camera; microphone; fullscreen; display-capture"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
