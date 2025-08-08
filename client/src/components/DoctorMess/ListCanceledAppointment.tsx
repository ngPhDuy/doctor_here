import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  data: any[]; // mảng cuộc hẹn đã huỷ
};

const ListCanceledAppointment: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) return <p>Không có cuộc hẹn nào đã bị huỷ.</p>;

  return (
    <div className="w-full space-y-4">
      <p className="text-sm bg-red-100 text-red-800 px-4 py-2 rounded-md italic flex items-center gap-1">
        ❌ <span>Dưới đây là danh sách các cuộc hẹn đã bị huỷ:</span>
      </p>

      {data.map((item, idx) => {
        const bn = item?.Benh_nhan?.Nguoi_dung || {};
        const gioHen = item?.Gio_hen || {};

        return (
          <div
            key={item.id || idx}
            className="bg-white rounded-xl shadow-md p-4 text-gray-800 border border-gray-200 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                ❗ Cuộc hẹn #{item.id}
              </h3>
              <span className="text-sm font-medium px-2 py-1 rounded bg-red-100 text-red-700">
                {item.trang_thai}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <p>
                <span className="font-medium">Bệnh nhân:</span> {bn.ho_va_ten}
              </p>
              <p>
                <span className="font-medium">Giới tính:</span> {bn.gioi_tinh}
              </p>
              <p>
                <span className="font-medium">Mã bệnh nhân:</span>{" "}
                {item?.Benh_nhan?.ma_benh_nhan}
              </p>
              <p>
                <span className="font-medium">Ngày khám:</span>{" "}
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
              <p>
                <span className="font-medium">Khám online:</span>{" "}
                {gioHen.Ca_lam_viec_trong_tuan?.lam_viec_onl ? "Có" : "Không"}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Địa chỉ PK:</span>{" "}
                {item.dia_chi_phong_kham}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Ghi chú:</span> {item.van_ban_bo_sung}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/historyDetail/${item.id}`)}
                className="mt-2 text-sm px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Xem chi tiết
              </button>
            </div>

            <p className="text-xs text-gray-500 italic">
              Đặt lúc:{" "}
              {new Date(item.thoi_diem_tao).toLocaleString("vi-VN", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ListCanceledAppointment;
