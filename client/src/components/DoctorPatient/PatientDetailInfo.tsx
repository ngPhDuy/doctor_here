import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultAvatar from "../../assets/images/avt.png";

interface PatientInfo {
  id: number;
  cccd: string;
  dan_toc: string;
  nhom_mau: string;
  tien_su_benh: string;
  quoc_tich: string;
  dia_chi: string;
  ma_benh_nhan: string;
  chieu_cao: number;
  can_nang: number;
  Nguoi_dung: {
    ten_dang_nhap: string;
    email: string;
    sdt: string;
    ngay_sinh: string;
    gioi_tinh: string;
    phan_loai: string;
    ho_va_ten: string;
    avt_url: string;
    Tai_khoan: {
      ten_dang_nhap: string;
      active: boolean;
      thoi_diem_mo_tk: string;
    };
  };
  Bao_hiem_y_te: {
    ma_bhyt: string;
    bv_dang_ky: string;
    ngay_cap: string;
    ngay_het_han: string;
  };
}
const PatientDetailInfo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Gọi API để lấy thông tin bệnh nhân
  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/patient/detail/${id}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải thông tin bệnh nhân.");
        }
        const data = await response.json();
        console.log("data", data);
        setPatient(data);
      } catch (err) {
        setError("Lỗi khi tải thông tin bệnh nhân.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientDetail();
    }
  }, [id]);

  // if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="h-full bg-gray-100 p-2">
      {/* Header */}
      <div className="flex items-center p-2 mb-2 bg-white rounded-lg shadow-md">
        <div
          className="p-3 cursor-pointer"
          //onclick go back to previous page
          onClick={() => navigate(-1)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.57 5.92969L3.5 11.9997L9.57 18.0697"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5 12H3.67001"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className="mr-4 text-blueTitle cursor-pointer"
          onClick={() => navigate(`/patientInfoDoctor/${id}`)}
        >
          <p className="font-semibold mb-1 ml-1">Thông tin bệnh nhân</p>
          <hr className="border-t-2 border-blueTitle ml-1" />
        </div>
        <div
          className="mr-4 cursor-pointer"
          onClick={() => navigate(`/resultHistory/${id}`)}
        >
          <p className="font-semibold mb-1">Kết quả khám bệnh</p>
        </div>
        <div
          className=" cursor-pointer"
          onClick={() => navigate(`/patientDetailHistory/${id}`)}
        >
          <p className="font-semibold mb-1">Lịch sử khám bệnh</p>
        </div>
      </div>

      {/* Thông tin cá nhân & y tế */}
      <div className="grid grid-cols-2 gap-4">
        {/* Thông tin cá nhân */}
        <div className="bg-white px-6 py-4 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
          <div className="flex items-center mb-4">
            {/* Avatar */}
            <img
              src={patient?.Nguoi_dung.avt_url || defaultAvatar} // Sử dụng ảnh mặc định nếu không có avt_url
              alt="Avatar"
              className="w-16 h-16 rounded-full mr-4"
            />
            {/* Thông tin bệnh nhân */}
            <div>
              <h4 className="text-xl font-semibold">
                {patient?.Nguoi_dung.ho_va_ten ?? "Chưa có"}
              </h4>
              <button
                onClick={() => navigate(`/conversations/${id}`)}
                className="mt-2 text-blue-500 hover:underline"
              >
                Nhắn tin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              {
                label: "Tên",
                value: patient?.Nguoi_dung.ho_va_ten ?? "Chưa có",
              },
              {
                label: "Ngày sinh",
                value: patient?.Nguoi_dung.ngay_sinh ?? "Chưa có",
              },
              { label: "SĐT", value: patient?.Nguoi_dung.sdt ?? "Chưa có" },
              {
                label: "Mã bệnh nhân",
                value: patient?.ma_benh_nhan ?? "Chưa có",
              },
              {
                label: "Địa chỉ",
                value: patient?.dia_chi ?? "Chưa có",
                isFullWidth: true,
              },
              { label: "Email", value: patient?.Nguoi_dung.email ?? "Chưa có" },
              {
                label: "Giới tính",
                value: patient?.Nguoi_dung.gioi_tinh ?? "Chưa có",
              },
              { label: "Dân tộc", value: patient?.dan_toc ?? "Chưa có" },
              { label: "Quốc tịch", value: patient?.quoc_tich ?? "Chưa có" },
            ].map((info, index) => (
              <div key={index} className={info.isFullWidth ? "col-span-2" : ""}>
                <label className="text-sm font-medium block mb-2">
                  {info.label}
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                  value={info.value}
                  disabled
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin y tế */}
        <div className="bg-white px-6 py-4 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Thông tin y tế</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              {
                label: "Số thẻ BHYT",
                value: patient?.Bao_hiem_y_te.ma_bhyt ?? "Chưa có",
              },
              {
                label: "Cơ sở khám BHYT",
                value: patient?.Bao_hiem_y_te.bv_dang_ky ?? "Chưa có",
              },
              {
                label: "Ngày cấp",
                value: patient?.Bao_hiem_y_te.ngay_cap ?? "Chưa có",
              },
              {
                label: "Ngày hết hạn",
                value: patient?.Bao_hiem_y_te.ngay_het_han ?? "Chưa có",
              },
              {
                label: "Tiền sử bệnh lý",
                value: patient?.tien_su_benh ?? "Chưa có",
                isFullWidth: true,
              },
              { label: "Chiều cao", value: patient?.chieu_cao ?? "Chưa có" },
              { label: "Cân nặng", value: patient?.can_nang ?? "Chưa có" },
              { label: "Nhóm máu", value: patient?.nhom_mau ?? "Chưa có" },
            ].map((info, index) => (
              <div key={index} className={info.isFullWidth ? "col-span-2" : ""}>
                <label className="text-sm font-medium">{info.label}</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                  value={info.value}
                  disabled
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailInfo;
