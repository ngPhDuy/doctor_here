import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  data: {
    id: number;
    thu: string;
    gio_bat_dau: string;
    gio_ket_thuc: string;
    lam_viec_onl: boolean;
    hieu_luc: boolean;
    ma_bac_si?: string; // Có thể thêm trường bác sĩ nếu cần
  };
};

const UpdateWorkSchedule: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  // Kiểm tra xem dữ liệu có đầy đủ không
  if (!data) return <p>Không có dữ liệu lịch làm việc để cập nhật.</p>;
  if (!data.id || !data.thu || !data.gio_bat_dau || !data.gio_ket_thuc) {
    return <p>Thiếu thông tin cần thiết để cập nhật lịch làm việc.</p>;
  }

  console.log("UpdateWorkSchedule data:", data);

  return (
    <div className="w-full relative space-y-2">
      {/* ✅ Nút điều hướng dời ra ngoài khung trắng */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/doctorSchedule")}
          className="text-sm text-blue-600 hover:underline"
        >
          📋 Xem danh sách lịch làm việc
        </button>
      </div>

      {/* ✅ Thẻ thông báo chính */}
      <div className="bg-white border border-yellow-200 rounded-xl shadow-md p-4 space-y-3">
        <p className="text-yellow-600 font-semibold flex items-center gap-2 text-lg">
          🔄 Đã cập nhật lịch làm việc
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <p><span className="font-medium">Mã lịch làm việc:</span> #{data.id}</p>
          <p><span className="font-medium">Thứ:</span> {data.thu}</p>
          <p><span className="font-medium">Giờ bắt đầu:</span> {data.gio_bat_dau.slice(0, 5)}</p>
          <p><span className="font-medium">Giờ kết thúc:</span> {data.gio_ket_thuc.slice(0, 5)}</p>
          <p><span className="font-medium">Hình thức:</span> {data.lam_viec_onl ? "Khám online" : "Khám trực tiếp"}</p>
          <p><span className="font-medium">Hiệu lực:</span> {data.hieu_luc ? "Đang áp dụng" : "Hết hạn"}</p>
          {/* Nếu có trường bác sĩ, có thể hiển thị */}
          {data.ma_bac_si && <p><span className="font-medium">Mã bác sĩ:</span> {data.ma_bac_si}</p>}
        </div>
      </div>
    </div>
  );
};

export default UpdateWorkSchedule;
