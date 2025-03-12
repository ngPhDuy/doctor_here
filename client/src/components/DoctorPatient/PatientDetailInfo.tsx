import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface PatientInfo {
    id: number;
    cccd: string;
    dan_toc: string;
    nhom_mau: string;
    tien_su_benh: string;
    quoc_tich: string;
    dia_chi: string;
    ma_benh_nhan: string;
    Nguoi_dung: {
      ten_dang_nhap: string;
      email: string;
      sdt: string;
      ngay_sinh: string;
      gioi_tinh: string;
      phan_loai: string;
      ho_va_ten: string;
      Tai_khoan: {
        ten_dang_nhap: string;
        active: boolean;
        thoi_diem_mo_tk: string;
      };
    };
    Bao_hiem_y_te:{
        ma_bhyt: string;
        bv_dang_ky: string;
        ngay_cap: string;
        ngay_het_han: string;
    }
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
    
      if (loading) return <p>Đang tải dữ liệu...</p>;
      if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="h-full bg-gray-100 p-3">
      {/* Header */}
      <div className="flex items-center p-2 mb-4 bg-white rounded-lg shadow-md">
        <div className="p-3 cursor-pointer" onClick={() => navigate("/patientListDoctor")}>
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
          className="mr-5 text-blueTitle cursor-pointer"
          onClick={() => navigate(`/patientInfoDoctor/${id}`)}
        >
          <p className="font-semibold text-lg mb-1 ml-1">Thông tin bệnh nhân</p>
          <hr className="border-t-2 border-blueTitle ml-1" />
        </div>
        <div
          className="ml-5 cursor-pointer"
          onClick={() => navigate(`/patientDetailHistory/${id}`)}
        >
          <p className="font-semibold text-lg mb-1">Lịch sử khám bệnh</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">                
        <div className="flex items-center mb-6">
          {/* Icon */}
          <svg
            width="35"
            height="35"
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.5" width="44" height="44" rx="7.5" fill="#3995C5" />
            <rect x="0.5" y="0.5" width="44" height="44" rx="7.5" stroke="white" />
            <path
              d="M22.5 17.7188V23.625"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32.7148 18.6525V26.3475C32.7148 27.6075 32.0398 28.7775 30.9485 29.4188L24.266 33.2775C23.1748 33.9075 21.8248 33.9075 20.7223 33.2775L14.0398 29.4188C12.9485 28.7888 12.2735 27.6187 12.2735 26.3475V18.6525C12.2735 17.3925 12.9485 16.2225 14.0398 15.5812L20.7223 11.7225C21.8135 11.0925 23.1635 11.0925 24.266 11.7225L30.9485 15.5812C32.0398 16.2225 32.7148 17.3813 32.7148 18.6525Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.5 27.2246V27.3371"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-lg font-semibold ml-4">Thông tin chi tiết</h2>
        </div>

        {/* Thông tin cá nhân & y tế */}
        <div className="grid grid-cols-2 gap-6">
          {/* Thông tin cá nhân */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Tên", value: patient?.Nguoi_dung.ho_va_ten },
                { label: "Ngày sinh", value: patient?.Nguoi_dung.ngay_sinh },
                { label: "SĐT", value: patient?.Nguoi_dung.sdt},
                { label: "Mã bệnh nhân", value: patient?.Nguoi_dung.sdt },
                { label: "Địa chỉ", value: patient?.dia_chi , isFullWidth: true,},
                { label: "Email", value: patient?.Nguoi_dung.email},
                { label: "Giới tính", value: patient?.Nguoi_dung.gioi_tinh },
                { label: "Dân tộc", value: patient?.dan_toc},
                { label: "Quốc tịch", value: patient?.quoc_tich },
              ].map((info, index) => (
                <div key={index} className={info.isFullWidth ? "col-span-2" : ""}>
                  <label className="text-sm font-medium">{info.label}</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    value={info.value}
                    disabled
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin y tế */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Thông tin y tế</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Số thẻ BHYT", value: patient?.Bao_hiem_y_te.ma_bhyt },
                { label: "Cơ sở khám BHYT", value: patient?.Bao_hiem_y_te.bv_dang_ky },
                { label: "Ngày cấp", value: patient?.Bao_hiem_y_te.ngay_cap },
                { label: "Ngày hết hạn", value: patient?.Bao_hiem_y_te.ngay_het_han },
                {
                  label: "Tiền sử bệnh lý",
                  value: patient?.tien_su_benh,
                  isFullWidth: true,
                },
                { label: "Chiều cao", value: "175 cm" },
                { label: "Cân nặng", value: "66kg" },
                { label: "Nhóm máu", value: patient?.nhom_mau },
              ].map((info, index) => (
                <div key={index} className={info.isFullWidth ? "col-span-2" : ""}>
                  <label className="text-sm font-medium">{info.label}</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    value={info.value}
                    disabled
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailInfo;
