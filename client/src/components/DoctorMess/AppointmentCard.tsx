import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  data: any;
};

const AppointmentCard: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  if (!data) return <p>Không có dữ liệu cuộc hẹn.</p>;

  const bn = data?.Nguoi_dung || {};
  const bs = data?.Bac_si?.Nguoi_dung || {};
  const gioHen = data?.Gio_hen || {};
  const maBenhNhan = data?.ma_benh_nhan;

  const handleViewProfile = () => {
    if (maBenhNhan) {
      navigate(`/patientInfoDoctor/${maBenhNhan}`);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* ✅ Dòng AI bên ngoài khung */}
      <p className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md italic flex items-center gap-1">
        🤖 <span>Dưới đây là thông tin chi tiết của bệnh nhân mà tôi tìm được:</span>
      </p>

      {/* ✅ Khung thông tin chi tiết */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800 space-y-6 border border-gray-200">
        {/* ✅ Tiêu đề và nút nằm cùng dòng */}
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
          <p><span className="font-medium">CCCD:</span> {data?.cccd}</p>
          <p><span className="font-medium">Số BHYT:</span> {data?.Bao_hiem_y_te?.ma_bhyt}</p>
          <p><span className="font-medium">Tiền sử bệnh lý:</span> {data?.tien_su_benh}</p>
          <p className="sm:col-span-2"><span className="font-medium">Địa chỉ:</span> {data?.dia_chi}</p>
        </div>

        {/* Bác sĩ (commented) */}
        {/* <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-red-600 mb-2">👨‍⚕️ Bác sĩ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><span className="font-medium">Họ tên:</span> {bs.ho_va_ten}</p>
            <p><span className="font-medium">Chuyên khoa:</span> {data.Bac_si?.chuyen_khoa}</p>
            <p className="sm:col-span-2"><span className="font-medium">Mô tả:</span> {data.Bac_si?.mo_ta}</p>
          </div>
        </div> */}

        {/* Hình ảnh bổ sung */}
        {data.Hinh_anh_bo_sung_cuoc_hen?.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
