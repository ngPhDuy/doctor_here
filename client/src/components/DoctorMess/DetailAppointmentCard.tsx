import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  data: any;
};

const DetailAppointmentCard: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  if (!data) return <p>Không có dữ liệu chi tiết.</p>;

  const bn = data?.Benh_nhan?.Nguoi_dung || {};
  const bs = data?.Bac_si?.Nguoi_dung || {};
  const gioHen = data?.Gio_hen || {};
  const maBenhNhan = data?.ma_benh_nhan_dat_hen;
  const maAppointment = data?.id;
  const handleViewProfile = () => {
    if (maAppointment) {
      navigate(`/historyDetail/${maAppointment}`);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* ✅ Dòng AI bên ngoài khung */}
      <p className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md italic flex items-center gap-1">
        🤖 <span>Dưới đây là thông tin chi tiết của cuộc hẹn:</span>
      </p>

      {/* ✅ Khung thông tin chi tiết */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800 space-y-6 border border-gray-200">
        {/* ✅ Tiêu đề + nút */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            🗓️ Thông tin chi tiết
          </h2>
          <button
            onClick={handleViewProfile}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Xem hồ sơ
          </button>
        </div>

        {/* Bệnh nhân */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><span className="font-medium">Họ tên:</span> {bn.ho_va_ten}</p>
          <p><span className="font-medium">Mã bệnh nhân:</span> {maBenhNhan}</p>
          <p><span className="font-medium">Giới tính:</span> {bn.gioi_tinh}</p>
          <p><span className="font-medium">Ngày sinh:</span> {new Date(bn.ngay_sinh).toLocaleDateString("vi-VN")}</p>
          <p><span className="font-medium">CCCD:</span> {data?.Benh_nhan?.cccd}</p>
          <p><span className="font-medium">Số điện thoại:</span> {bn.sdt}</p>
          <p><span className="font-medium">Tiền sử bệnh lý:</span> {data?.Benh_nhan?.tien_su_benh}</p>
          <p className="sm:col-span-2"><span className="font-medium">Địa chỉ:</span> {data?.Benh_nhan?.dia_chi}</p>
        </div>

        {/* Bác sĩ */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-red-600 mb-2">👨‍⚕️ Bác sĩ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><span className="font-medium">Họ tên:</span> {bs.ho_va_ten}</p>
            <p><span className="font-medium">Chuyên khoa:</span> {data.Bac_si?.chuyen_khoa}</p>
            <p><span className="font-medium">Trình độ:</span> {data.Bac_si?.trinh_do_hoc_van}</p>
            <p><span className="font-medium">Phòng khám:</span> {data.Bac_si?.dia_chi_pk}</p>
            <p className="sm:col-span-2"><span className="font-medium">Mô tả:</span> {data.Bac_si?.mo_ta}</p>
          </div>
        </div>

        {/* Cuộc hẹn */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">📌 Cuộc hẹn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><span className="font-medium">Trạng thái:</span> {data.trang_thai}</p>
            <p><span className="font-medium">Thời điểm tạo:</span> {new Date(data.thoi_diem_tao).toLocaleString("vi-VN")}</p>
            <p><span className="font-medium">Giờ hẹn:</span> {new Date(gioHen.thoi_diem_bat_dau).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - {new Date(gioHen.thoi_diem_ket_thuc).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</p>
            <p><span className="font-medium">Ngày làm việc:</span> {gioHen.ngay_lam_viec}</p>
            <p className="sm:col-span-2"><span className="font-medium">Làm việc online:</span> {gioHen.Ca_lam_viec_trong_tuan?.lam_viec_onl ? "Có" : "Không"}</p>
            <p className="sm:col-span-2"><span className="font-medium">Văn bản bổ sung:</span> {data.van_ban_bo_sung}</p>
          </div>
        </div>

        {/* Hình ảnh bổ sung (nếu bật lại) */}
        {/* {data.Hinh_anh_bo_sung_cuoc_hen?.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📷 Hình ảnh bổ sung</h3>
            <div className="flex flex-wrap gap-3">
              {data.Hinh_anh_bo_sung_cuoc_hen.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`img-${idx}`}
                  className="w-28 h-28 object-cover rounded-lg border hover:scale-105 transition-transform duration-200"
                />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default DetailAppointmentCard;
