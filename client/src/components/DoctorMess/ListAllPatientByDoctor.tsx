import React from "react";
import { useNavigate } from "react-router-dom";

type Patient = {
  ho_va_ten: string;
  ma_benh_nhan: string;
  gioi_tinh: string;
  ngay_sinh: string;
  cccd: string;
  sdt: string;
  email: string;
  nhom_mau: string;
  dan_toc: string;
  tien_su_benh: string;
  dia_chi: string;
  ma_bhyt: string;
  bv_dang_ky: string;
  ngay_cap: string;
  ngay_het_han: string;
  avt_url: string;
  quoc_tich: string;
};

type Props = {
  data: Patient[];
};

const ListAllPatientByDoctor: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0)
    return <p>Không có bệnh nhân nào được liên kết với bác sĩ này.</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md italic flex items-center gap-1">
        👩‍⚕️ <span>Dưới đây là danh sách bệnh nhân của bác sĩ mà tôi tìm được:</span>
      </p>

      {data.map((bn, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow-md p-4 border border-gray-200 space-y-3 relative"
        >
          {/* Nút xem chi tiết */}
          <button
            onClick={() => navigate(`/patientInfoDoctor/${bn.ma_benh_nhan}`)}
            className="absolute top-4 right-4 text-sm text-blue-600 hover:underline"
          >
            Xem chi tiết
          </button>

          <div className="flex items-center gap-4">
            <img
              src={bn.avt_url}
              alt={bn.ho_va_ten}
              className="w-16 h-16 object-cover rounded-full border"
            />
            <div>
              <p className="text-lg font-semibold text-blue-600">
                {bn.ho_va_ten}{" "}
                <span className="text-gray-500 text-sm">({bn.ma_benh_nhan})</span>
              </p>
              <p className="text-sm text-gray-600">
                {bn.email} • {bn.sdt}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <p><span className="font-medium">Giới tính:</span> {bn.gioi_tinh}</p>
            <p><span className="font-medium">Ngày sinh:</span> {new Date(bn.ngay_sinh).toLocaleDateString("vi-VN")}</p>
            <p><span className="font-medium">CCCD:</span> {bn.cccd}</p>
            <p><span className="font-medium">Dân tộc:</span> {bn.dan_toc}</p>
            <p><span className="font-medium">Nhóm máu:</span> {bn.nhom_mau}</p>
            <p><span className="font-medium">Quốc tịch:</span> {bn.quoc_tich}</p>
            <p className="sm:col-span-2"><span className="font-medium">Tiền sử bệnh:</span> {bn.tien_su_benh}</p>
            <p className="sm:col-span-2"><span className="font-medium">Địa chỉ:</span> {bn.dia_chi}</p>
          </div>

          <div className="border-t pt-2 mt-2 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <p><span className="font-medium">Mã BHYT:</span> {bn.ma_bhyt}</p>
            <p><span className="font-medium">BV đăng ký:</span> {bn.bv_dang_ky}</p>
            <p><span className="font-medium">Ngày cấp:</span> {bn.ngay_cap}</p>
            <p><span className="font-medium">Ngày hết hạn:</span> {bn.ngay_het_han}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListAllPatientByDoctor;
