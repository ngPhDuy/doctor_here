import React from "react";
import { useNavigate } from "react-router-dom";

type Appointment = {
  id: number;
  Gio_hen: {
    thoi_diem_bat_dau: string;
    thoi_diem_ket_thuc: string;
    ngay_lam_viec: string;
    Ca_lam_viec_trong_tuan: {
      lam_viec_onl: boolean;
    };
  };
  Benh_nhan: {
    ma_benh_nhan: string;
    Nguoi_dung: {
      ho_va_ten: string;
      avt_url: string;
    };
  };
};

type Props = {
  data: Appointment[];
};

const ListDiagnosisDone: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0)
    return <p>Không có cuộc hẹn nào đã được chẩn đoán.</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-md italic flex items-center gap-1">
        ✅ <span>Danh sách các cuộc hẹn đã được xử lý mà tôi tìm được:</span>
      </p>

      {data.map((item) => {
        const bn = item.Benh_nhan.Nguoi_dung;
        const ma_benh_nhan = item.Benh_nhan.ma_benh_nhan;
        const gioHen = item.Gio_hen;

        return (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 space-y-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={bn.avt_url}
                alt={bn.ho_va_ten}
                className="w-14 h-14 object-cover rounded-full border"
              />
              <div>
                <p className="font-semibold text-blue-700">
                  {bn.ho_va_ten} <span className="text-gray-500 text-sm">({ma_benh_nhan})</span>
                </p>
                <p className="text-sm text-gray-500">Mã cuộc hẹn: #{item.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">Ngày hẹn:</span>{" "}
                {new Date(gioHen.ngay_lam_viec).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <span className="font-medium">Giờ khám:</span>{" "}
                {new Date(gioHen.thoi_diem_bat_dau).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(gioHen.thoi_diem_ket_thuc).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Hình thức:</span>{" "}
                {gioHen.Ca_lam_viec_trong_tuan.lam_viec_onl ? "Khám online" : "Khám trực tiếp"}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/resultDetail/${item.id}`)}
                className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded shadow"
              >
                🧾 Xem chi tiết
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListDiagnosisDone;
