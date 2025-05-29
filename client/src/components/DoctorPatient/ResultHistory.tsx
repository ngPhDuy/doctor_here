import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiFilter, FiSearch } from "react-icons/fi";
import { FaLock, FaLockOpen } from "react-icons/fa6";
import { BsCheckCircle, BsLock, BsUnlock } from "react-icons/bs";
import defaultAvatar from "../../assets/images/avt.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// Result
//   {
//     "ho_va_ten_bac_si": "Nguyễn Trung Hiếu",
//     "avt_url_bac_si": "https://res.cloudinary.com/dpquv4bcu/image/upload/v1744614905/avatar/e9juhyvm3o5t44cuk9v6.jpg",
//     "ma_bac_si": "BS0000001",
//     "ma_benh_nhan": "BN0000006",
//     "duoc_chia_se": false,
//     "lam_viec_onl": false,
//     "thoi_diem_bat_dau": "2025-05-07T01:30:00.000Z"
//   }
interface Result {
  ho_va_ten_bac_si: string;
  avt_url_bac_si: string;
  ma_bac_si: string;
  ma_benh_nhan: string;
  duoc_chia_se: boolean;
  lam_viec_onl: boolean;
  thoi_diem_bat_dau: string;
  id_cuoc_hen: string;
}

const ResultHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDate, setFilteredDate] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOnlineFilter, setIsOnlineFilter] = useState<boolean | null>(null);
  const { ptID } = useParams<string>();

  // State cho sắp xếp
  const [sortField, setSortField] = useState("thoi_diem_bat_dau"); // "id" or "thoi_diem_bat_dau"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/diagnosis/from_other/patient/${ptID}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();

      console.log(data);

      setResults(data);
    };

    fetchResults();
  }, []);

  console.log("Results:", results);
  const filteredResults = results.filter((item) => {
    const isOnlineMatch =
      isOnlineFilter === null || item.lam_viec_onl === isOnlineFilter;
    const dateMatch =
      filteredDate === "" ||
      new Date(item.thoi_diem_bat_dau).toLocaleDateString() ===
        new Date(filteredDate).toLocaleDateString();
    const searchMatch =
      searchTerm === "" ||
      item.ma_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma_bac_si.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id_cuoc_hen
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return isOnlineMatch && dateMatch && searchMatch;
  });

  console.log("Filtered results:", filteredResults);

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc"
        ? +a.id_cuoc_hen - +b.id_cuoc_hen
        : +b.id_cuoc_hen - +a.id_cuoc_hen;
    }
    if (sortField === "thoi_diem_bat_dau") {
      const dateA = new Date(a.thoi_diem_bat_dau).getTime();
      const dateB = new Date(b.thoi_diem_bat_dau).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  console.log("Sorted results:", sortedResults);

  // Hàm xử lý khi nhấn vào một dòng trong danh sách
  const handleRowClick = (appointmentId: string) => {
    navigate(`/patientResult/${appointmentId}`);
  };

  // Xử lý phân trang
  const resultsPerPage = 10; // Số lượng kết quả trên mỗi trang
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const indexOfLastAppointment = currentPage * resultsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - resultsPerPage;
  const currentAppointments = sortedResults.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  console.log("Current appointments:", currentAppointments);

  // Xử lý filter modal
  const handleFilterModalToggle = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setFilteredDate("");
    setIsOnlineFilter(null);
    setIsFilterModalOpen(false);
    setCurrentPage(1); // Reset to the first page after clearing filters
  };

  const handleModalClose = (e: React.MouseEvent) => {
    // Close the modal if clicked outside the modal content
    if (e.target === e.currentTarget) {
      setIsFilterModalOpen(false);
    }
  };

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="flex items-center p-2 mb-2 bg-white rounded-lg shadow-md mr-auto">
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
          className="mr-4 cursor-pointer"
          onClick={() => navigate(`/patientInfoDoctor/${ptID}`)}
        >
          <p className="font-semibold mb-1 ml-1">Thông tin bệnh nhân</p>
        </div>
        <div
          className="mr-4 cursor-pointer text-blueTitle "
          onClick={() => navigate(`/resultHistory/${ptID}`)}
        >
          <p className="font-semibold mb-1">Kết quả khám bệnh</p>
          <hr className="border-t-2 border-blueTitle ml-1" />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/patientDetailHistory/${ptID}`)}
        >
          <p className="font-semibold mb-1">Lịch sử khám bệnh</p>
        </div>
      </div>

      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold text">
          <p>Tổng kết quả ({sortedResults.length})</p>
        </div>
        <div className="flex items-center gap-2 text-sm ml-auto">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
            <select
              className="outline-none"
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
              value={sortField}
            >
              <option value="id">SX: Mã đơn hẹn</option>
              <option value="thoi_diem_bat_dau">SX: Thời điểm hẹn</option>
            </select>
            <select
              className="outline-none ml-2"
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              value={sortOrder}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Tên hoặc mã bệnh nhân"
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
            <th className="px-4 py-2">Mã đơn hẹn</th>
            <th className="px-4 py-2">Bác sĩ</th>
            <th className="px-4 py-2">Tên bác sĩ</th>
            <th className="px-4 py-2">Mã bác sĩ</th>
            <th className="px-4 py-2">Hẹn lúc</th>
            <th className="px-4 py-2">Hình thức</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.map((result, index) => (
            <tr
              key={result.id_cuoc_hen}
              onClick={() => handleRowClick(result.id_cuoc_hen)}
              className="bg-white hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-4 py-3">{`#${result.id_cuoc_hen}`}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center items-center">
                  <img
                    src={result.avt_url_bac_si ?? defaultAvatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full m-auto"
                  />
                </div>
              </td>
              <td className="px-4 py-3 truncate max-w-xs">
                {localStorage.getItem("id") === result.ma_bac_si ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="">Chính tôi</span>
                    <span title="Bạn là người khám">
                      <BsCheckCircle className="text-green-500" size={12} />
                    </span>
                  </div>
                ) : (
                  <span>{result.ho_va_ten_bac_si}</span>
                )}
              </td>

              <td className="px-4 py-3">{result.ma_bac_si}</td>
              <td className="px-4 py-3">
                {new Date(result.thoi_diem_bat_dau).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium block w-10/12 mx-auto ${
                    result.lam_viec_onl
                      ? "bg-rose-200 text-rose-600"
                      : "bg-blue-200 text-blue-700"
                  }`}
                >
                  {result.lam_viec_onl ? "Trực tuyến" : "Trực tiếp"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center">
                  {result.duoc_chia_se ||
                  localStorage.getItem("id") === result.ma_bac_si ? (
                    <BsUnlock size={20} color="green" />
                  ) : (
                    <BsLock size={20} color="red" />
                  )}
                </div>
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

            <div className="flex flex-row items-center mb-4">
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
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </label>
            </div>

            <div className="flex flex-row mb-4 w-full">
              <span className="mr-2 w-3/12 font-semibold">Hẹn ngày:</span>

              <input
                type="date"
                value={filteredDate}
                onChange={(e) => {
                  setFilteredDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-2 py-2 rounded-lg w-7/12"
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

      {totalPages > 1 && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ResultHistory;
