import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  FaRegCalendar,
  FaRegCalendarCheck,
  FaCalendarXmark,
} from "react-icons/fa6";

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
  const [historyPatients, setHistoryPatients] = useState<PatientHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { patientId } = useParams<{ patientId: string }>();
  const doctorId = "BS0000001";
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // State cho bộ lọc ngày
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");

  // State cho hình thức online/offline
  const [isOnlineFilter, setIsOnlineFilter] = useState<boolean | null>(null);

  // State cho trạng thái
  const [status, setStatus] = useState("");

  const filteredHistories = historyPatients.filter((item) => {
    const startTimestamp = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : -Infinity;
    const endTimestamp = endDate
      ? new Date(endDate).setHours(23, 59, 59, 999)
      : Infinity;

    const createdTimestamp = new Date(item.thoi_diem_tao).setHours(0, 0, 0, 0);

    const isOnlineMatch =
      isOnlineFilter === null ||
      item.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl === isOnlineFilter;

    const searchMatch =
      searchTerm === "" ||
      item.dia_chi_phong_kham
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm);

    const statusMatch = status === "" || item.trang_thai === status;
    return (
      isOnlineMatch &&
      createdTimestamp >= startTimestamp &&
      createdTimestamp <= endTimestamp &&
      searchMatch &&
      statusMatch
    );
  });

  // Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleFilterModalToggle = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setIsOnlineFilter(null);
    setStatus("");
    setIsFilterModalOpen(false);
    setCurrentPage(1); // Reset to the first page after clearing filters
  };

  const handleModalClose = (e: React.MouseEvent) => {
    // Close the modal if clicked outside the modal content
    if (e.target === e.currentTarget) {
      setIsFilterModalOpen(false);
    }
  };

  // Xử lý phân trang
  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentHistories = filteredHistories.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const fetchPatientHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/appointment/getAllByPatientAndDoctor?patientID=${patientId}&doctorID=${localStorage.getItem(
          "id"
        )}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải lịch sử khám bệnh.");
      }

      const data: PatientHistory[] = await response.json();
      console.log(data);
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

  // if (loading) return <p>Đang tải danh sách yêu cầu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="flex items-center p-2 mb-2 bg-white rounded-lg shadow-md">
        <div className="p-3 cursor-pointer" onClick={() => navigate(-1)}>
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
          <p className="font-semibold mb-1 ml-1">Thông tin bệnh nhân</p>
        </div>
        <div
          className="ml-5 cursor-pointer text-blueTitle "
          onClick={() => navigate(`/patientDetailHistory/${patientId}`)}
        >
          <p className="font-semibold mb-1">Lịch sử khám bệnh</p>
          <hr className="border-t-2 border-blueTitle ml-1" />
        </div>
      </div>
      <div className="flex items-center w-full p-3 mb-3 justify-between bg-white shadow-md">
        <div className="font-semibold text">
          <p>Tổng số lần khám ({historyPatients.length})</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Mã ĐH hoặc địa chỉ PK..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 outline-none px-2"
            />
            <FiSearch size={18} />
          </div>

          <button
            onClick={handleFilterModalToggle}
            className="p-2 flex items-center border rounded-lg bg-white shadow-sm"
          >
            <FiFilter size={18} />
          </button>
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
          {currentHistories.map((historyPatient, index) => (
            <tr
              key={historyPatient.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/historyDetail/${historyPatient.id}`)}
            >
              <td className="px-2 py-3">
                {index + 1 + indexOfFirstAppointment}
              </td>
              <td className="px-2 py-3">{`#${historyPatient.id}`}</td>
              <td className="px-2 py-3">
                {new Date(historyPatient.thoi_diem_tao).toLocaleString(
                  "vi-VN",
                  {
                    timeZone: "Asia/Ho_Chi_Minh",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </td>
              <td className="px-2 py-3">{historyPatient.dia_chi_phong_kham}</td>
              <td className="px-4 py-3 flex justify-center items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium w-9/12 ${
                    historyPatient.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl
                      ? "bg-rose-200 text-rose-600"
                      : "bg-blue-200 text-blue-700"
                  }`}
                >
                  {historyPatient.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl
                    ? "Trực tuyến"
                    : "Trực tiếp"}
                </span>
              </td>
              <td className="px-4 py-3">
                {historyPatient.trang_thai === "Hoàn thành" ? (
                  <FaRegCalendarCheck className="text-green-500 m-auto" />
                ) : historyPatient.trang_thai === "Đang chờ" ? (
                  <FaRegCalendar className="text-yellow-500 m-auto" />
                ) : (
                  <FaCalendarXmark className="text-red-500 m-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
          onClick={handleModalClose} // Close modal when clicked outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold mb-4 text-center">
              Lọc lịch hẹn
            </h2>

            <div className="flex flex-row items-center mb-4 gap-3">
              <label className="flex items-center w-full">
                <span className="mr-2 w-3/12 font-semibold">Hình thức:</span>
                <select
                  onChange={(e) => {
                    setIsOnlineFilter(
                      e.target.value === "online"
                        ? true
                        : e.target.value === "offline"
                        ? false
                        : null
                    );

                    setCurrentPage(1); // Reset to the first page after filtering
                  }}
                  value={
                    isOnlineFilter === null
                      ? "all"
                      : isOnlineFilter
                      ? "online"
                      : "offline"
                  }
                  className="px-4 py-2 border rounded-lg w-7/12"
                >
                  <option value="all">Tất cả</option>
                  <option value="online">Trực tuyến</option>
                  <option value="offline">Trực tiếp</option>
                </select>
              </label>
            </div>

            <div className="flex flex-row items-center mb-4 gap-3">
              <label className="flex items-center w-full">
                <span className="mr-2 w-3/12 font-semibold">Trạng thái:</span>
                <select
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setCurrentPage(1); // Reset to the first page after filtering
                  }}
                  className="px-4 py-2 border rounded-lg w-7/12"
                  value={status}
                >
                  <option value="">Tất cả</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đang chờ">Đang chờ</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </label>
            </div>

            <div className="flex flex-row items-center justify-center mb-4 gap-2 w-full">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1); // Reset to the first page after filtering
                }}
                className="border px-2 py-2 rounded-lg w-5/12"
              />

              <span>-</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1); // Reset to the first page after filtering
                }}
                className="border px-2 py-2 rounded-lg w-5/12"
              />
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={handleClearFilter}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-end mt-5 space-x-4 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Trước
        </button>
        <span className="px-4 py-2 border rounded-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default PatientDetailHistory;
