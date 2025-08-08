import React from "react";
import AppointmentCard from "./AppointmentCard";
import DetailAppointmentCard from "./DetailAppointmentCard";
import ListAppointmentCard from "./ListAppointmentCard";
import ListReviewsDoctor from "./ListReviewsDoctor";
import ListAllPatientByDoctor from "./ListAllPatientByDoctor";
import ListDiagnosisUndone from "./ListDiagnosisUndone";
import ListDiagnosisDone from "./ListDiagnosisDone";
import DeleteWorkSchedule from "./DeleteWorkSchedule";
import AddWorkSchedule from "./AddWorkSchedule";
import UpdateWorkSchedule from "./UpdateWorkSchedule";
import ListWorkSchedule from "./ListWorkSchedule";
import ListUpcomingAppointment from "./ListUpcomingAppointment";
import ListCanceledAppointment from "./ListCanceledAppointment";
import ListDoneAppointment from "./ListDoneAppointment";
import ListUndoneAppointment from "./ListUndoneAppointment";
// ... thêm các component khác

type Props = {
  reply: any;
};

export const getAIPreviewText = (reply: any, maxLength: number = 35): string => {
  try {
    if (typeof reply === "string") {
      reply = JSON.parse(reply);
    }

    if (reply?.message) {
      let text = "";

      switch (reply.message) {
        case "get_patient_info_by_doctor":
            text = "🤖 Dưới đây là thông tin chi tiết của bệnh nhân mà tôi tìm được:";
            break;
        case "get_detail_appointment":
            text = "🤖 Dưới đây là thông tin chi tiết của cuộc hẹn:";
            break;
        case "get_appointment":
            text = "🗂️ Dưới đây là danh sách các cuộc hẹn gần đây:";
            break;
        case "get_all_reviews":
            text = "🤖 Dưới đây là thông tin các đánh giá bệnh nhân mà tôi tìm được:";
            break;
        case "get_all_patient_by_doctor":
            text = "👩‍⚕️ Dứoi đây là danh sách bệnh nhân của bác sĩ mà tôi tim được:";
            break;
        case "get_diagnosis_undone":
            text = "🩺 Danh sách các cuộc hẹn chưa được xử lý mà tôi tìm được:";
            break;
        case "get_diagnosis_done":
            text = "🩺 Danh sách các cuộc hẹn đã được xử lý mà tôi tìm được:";
            break;
        case "delete_work_schedule":
            text = "✅ Lịch làm việc đã được xoá";
            break;
        case "add_work_schedule":
            text = "✅ Đã thêm lịch làm việc mới";
            break;
        case "update_work_schedule":
            text = "✅ Đã cập nhật lịch làm việc";
            break;
        case "get_work_schedule":
            text = "📌 Dưới đây là danh sách lịch làm việc của bạn:";
            break;
        case "get_upcoming_appointment":
            text = "⏳ Dưới đây là danh sách các cuộc hẹn sắp tới:";
            break;
        case "get_appointment_canceled":
            text = "❌  Dưới đây là danh sách các cuộc hẹn đã bị huỷ:";
            break;
        case "get_appointment_done":
            text = "✅ Dưới đây là danh sách các cuộc hẹn đã hoàn thành:";
            break;
        case "get_appointment_undone":
            text = "⏳ Dưới đây là danh sách các cuộc hẹn đang chờ xử lý:";
            break;
        
        default:
          text = "🤖 Trả lời từ AI";
      }

      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }
  } catch {
    // Nếu không phải JSON, fallback dùng string thường
    if (typeof reply === "string") {
      return reply.length > maxLength ? reply.slice(0, maxLength) + "..." : reply;
    }
  }

  return "🤖 Nội dung từ AI";
};

const DynamicAIReply: React.FC<Props> = ({ reply }) => {
  switch (reply.message) {
    case "get_patient_info_by_doctor":
      return <AppointmentCard data={reply.noi_dung_van_ban} />;

    case "get_detail_appointment":
      return <DetailAppointmentCard data={reply.noi_dung_van_ban} />;

    case "get_appointment":
      return <ListAppointmentCard data={reply.noi_dung_van_ban} />;

    case "get_all_reviews":
      return <ListReviewsDoctor data={reply} />;

    case "get_all_patient_by_doctor":
      return <ListAllPatientByDoctor data={reply.patients} />;

    case "get_diagnosis_undone":
        return <ListDiagnosisUndone data={reply.appointments} />;

    case "get_diagnosis_done":
        return <ListDiagnosisDone data={reply.appointments} />;
    
    case "delete_work_schedule":
        return <DeleteWorkSchedule data={reply.deletedSchedule} />;
    
    case "add_work_schedule":
        return <AddWorkSchedule data={reply.newSchedule} />;

    case "update_work_schedule":
        return <UpdateWorkSchedule data={reply.updateSchedule} />;
    
    case "get_work_schedule":
        return <ListWorkSchedule data={reply.data} />;

    case "get_upcoming_appointment":
        return <ListUpcomingAppointment data={reply.appointments} />;

    case "get_appointment_canceled":
        return <ListCanceledAppointment data={reply.data} />;

    case "get_appointment_done":
        return <ListDoneAppointment data={reply.data} />;

    case "get_appointment_undone":
        return <ListUndoneAppointment data={reply.data} />;
    

    default:
      return (
        <pre className="text-sm bg-gray-100 p-2 rounded">
          {typeof reply === "string"
            ? reply
            : JSON.stringify(reply, null, 2)}
        </pre>
      );
  }
};

export default DynamicAIReply;