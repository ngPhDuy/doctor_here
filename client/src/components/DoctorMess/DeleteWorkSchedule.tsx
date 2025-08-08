import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  data: {
    thu: string;
    gio_bat_dau: string;
    gio_ket_thuc: string;
    ma_bac_si: string;
  };
};

const DeleteWorkSchedule: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  if (!data) return <p>Không có dữ liệu lịch làm việc đã xoá.</p>;

  return (
    <div className="w-full">
      <div className="bg-white border border-green-200 rounded-xl shadow-md p-4 space-y-3">
        {/* ✅ Nút điều hướng */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/doctorSchedule")}
            className="text-sm text-blue-600 hover:underline"
          >
            📋 Xem danh sách lịch làm việc
          </button>
        </div>

        <p className="text-green-600 font-semibold flex items-center gap-2 text-lg">
          ✅ Lịch làm việc đã được xoá
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <p>
            <span className="font-medium">Bác sĩ:</span> {localStorage.getItem("fullName")}
          </p>
          <p>
            <span className="font-medium">Thứ:</span> {data.thu}
          </p>
          <p>
            <span className="font-medium">Giờ bắt đầu:</span> {data.gio_bat_dau}
          </p>
          <p>
            <span className="font-medium">Giờ kết thúc:</span> {data.gio_ket_thuc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteWorkSchedule;
