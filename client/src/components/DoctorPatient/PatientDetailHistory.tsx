import React, { useState, useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";

interface PatientHistory {
    id: number;
    van_ban_bo_sung: string;
    dia_chi_phong_kham: string;
    trang_thai: string;
    thoi_diem_tao: string;
    ma_bac_si: string;
    ma_benh_nhan_dat_hen: string;
    Gio_hen: {
      thoi_diem_bat_dau: string;
      thoi_diem_ket_thuc: string;
      ngay_lam_viec: string;
      available: boolean;
      id_ca_lam_viec: number;
      Ca_lam_viec_trong_tuan: {
        lam_viec_onl: boolean;
      };
    };
    Benh_nhan: {
      ma_benh_nhan: string;
      Nguoi_dung: {
        ho_va_ten: string;
        gioi_tinh: string;
      };
    };
  }

const PatientDetailHistory: React.FC = () => {
  const navigate = useNavigate();
  const [historyPatients, setHistoryPatients] = useState<PatientHistory []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { patientId } = useParams<{ patientId: string }>();
  const doctorId = "BS0000001";
  
  const formatDateTime = (isoString: string): string => {
    if (!isoString) return "";
  
    const date = new Date(isoString);
  
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
  
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerpage = 7;

  const indexOfLastHistory = currentPage * requestsPerpage;
  const indexOfFirstHistory = indexOfLastHistory - requestsPerpage;
  const currentHistoryPatient = historyPatients.slice(
    indexOfFirstHistory,
    indexOfLastHistory
  );

  // Chuyển trang
  const totalPages = Math.ceil(historyPatients.length / requestsPerpage);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const fetchPatientHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/getAllByPatientAndDoctor?patientID=${patientId}&doctorID=${doctorId}`
      );
  
      if (!response.ok) {
        throw new Error("Không thể tải lịch sử khám bệnh.");
      }
  
      const data: PatientHistory[] = await response.json();
      setHistoryPatients(data);
    } catch (err) {
      setError("Lỗi khi tải lịch sử khám bệnh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientHistory();
  }, []);

  if (loading) return <p>Đang tải danh sách yêu cầu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5 h-full bg-gray-50">
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
          className="mr-5 cursor-pointer"
          onClick={() => navigate(`/patientInfoDoctor/${patientId}`)}
        >
          <p className="font-semibold text-lg mb-1 ml-1">Thông tin bệnh nhân</p>
        </div>
        <div
          className="ml-5 cursor-pointer text-blueTitle "
          onClick={() => navigate(`/patientDetailHistory/${patientId}`)}
        >
          <p className="font-semibold text-lg mb-1">Lịch sử khám bệnh</p>
          <hr className="border-t-2 border-blueTitle ml-1" />
        </div>
      </div>
      <div className="flex items-center w-full pb-4 p-3 mb-4  justify-between bg-white">
        <div className="font-semibold text-lg mr-50">
          <p>Tổng số lần khám ({historyPatients.length})</p>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src="/images/AdminList/search.png"
            alt="Search"
            className="w2r-h2r cursor-pointer hover:bg-gray-200"
          />
          <img
            src="/images/AdminList/filter.png"
            alt="Filter"
            className="w2r-h2r cursor-pointer hover:bg-gray-200"
          />
        </div>
      </div>
      <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
        <thead className="text-gray-600 text-base bg-gray-100">
          <tr>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã đơn hẹn</th>
            <th className="px-4 py-2">Thời điểm đặt lịch</th>
            <th className="px-4 py-2">Địa điểm</th>
            <th className="px-4 py-2">Hình thức</th>
            <th className="px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {currentHistoryPatient.map((historyPatient, index) => (
            <tr
              key={historyPatient.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-2 py-3">{index + 1}</td>
              <td className="px-2 py-3">{historyPatient.ma_benh_nhan_dat_hen}</td>
              <td className="px-2 py-3">{formatDateTime(historyPatient.thoi_diem_tao)}</td>
              <td className="px-2 py-3">
                {historyPatient.dia_chi_phong_kham}
              </td>
              <td
                className={`px-2 py-3 font-semibold ${
                    historyPatient.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl
                    ? "text-blue-500" 
                    : "text-red-500"
                }`}
              >
                  {historyPatient.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl ? "Online" : "Offline"}
              </td>
              <td className="px-4 py-3">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${
                        historyPatient.trang_thai === "Hoàn thành"
                        ? "bg-green-200 text-green-700"
                        : historyPatient.trang_thai === "Đang chờ"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-red-200 text-red-700"
                    }
                `}
              >
                    {historyPatient.trang_thai}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex justify-end mt-5 space-x-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blueButton hover:bg-blueButtonHover text-white"
          }`}
        >
          Trước
        </button>
        <span className="px-4 py-2 border rounded-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blueButton hover:bg-blueButtonHover text-white"
          }`}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default PatientDetailHistory;
