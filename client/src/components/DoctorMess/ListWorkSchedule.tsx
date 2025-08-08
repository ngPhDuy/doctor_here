import React from "react";
import { useNavigate } from "react-router-dom";

type ScheduleItem = {
  id: number;
  thu: string;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  lam_viec_onl: boolean;
  hieu_luc: boolean;
};

type Props = {
  data: ScheduleItem[];
};

const ListWorkSchedule: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return <p>Không có lịch làm việc nào để hiển thị.</p>;
  }

  return (
    <div className="w-full space-y-4">
      {/* ✅ Câu mở đầu + nút quay về (ngang hàng) */}
      <div className="flex justify-between items-center">
        <p className="text-gray-800 font-medium text-base">
          📌 Dưới đây là danh sách lịch làm việc của bạn:
        </p>
        <button
          onClick={() => navigate("/doctorSchedule")}
          className="text-sm text-blue-600 hover:underline"
        >
          🔙 Quay lại trang quản lý lịch làm việc
        </button>
      </div>

      {/* ✅ Danh sách lịch làm việc */}
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-2"
        >
          <p className="text-gray-800 font-semibold text-base">
            📅 Lịch làm việc #{item.id}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <p>
              <span className="font-medium">Thứ:</span> {item.thu}
            </p>
            <p>
              <span className="font-medium">Giờ bắt đầu:</span>{" "}
              {item.gio_bat_dau.slice(0, 5)}
            </p>
            <p>
              <span className="font-medium">Giờ kết thúc:</span>{" "}
              {item.gio_ket_thuc.slice(0, 5)}
            </p>
            <p>
              <span className="font-medium">Hình thức:</span>{" "}
              {item.lam_viec_onl ? "Khám online" : "Khám trực tiếp"}
            </p>
            <p>
              <span className="font-medium">Hiệu lực:</span>{" "}
              {item.hieu_luc ? "Đang áp dụng" : "Hết hạn"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListWorkSchedule;
