import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiFilter, FiSearch } from "react-icons/fi";

// dữ liệu mẫu: mã đơn hẹn, tên bệnh nhân, mã bệnh nhân, thời điểm đặt hẹn, hình thức gồm 15 mẫu
interface Result {
  id: string;
  ten_benh_nhan: string;
  ma_benh_nhan: string;
  thoi_diem_bat_dau: string;
  lam_viec_onl: boolean;
}

const ResultList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDate, setFilteredDate] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOnlineFilter, setIsOnlineFilter] = useState<boolean | null>(null);
  const { status } = useParams<string>();
  console.log(status);

  useEffect(() => {
    const fetchResults = async () => {
      if (status !== "pending" && status !== "success") {
        console.error("Invalid status parameter:", status);
        return;
      }
      console.log(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/appointment/doctor/${localStorage.getItem("id")}/status/${
          status === "pending" ? "1" : "2"
        }`
      );
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/appointment/doctor/${localStorage.getItem("id")}/status/${
          status === "pending" ? "1" : "2"
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();

      //format lại dữ liệu để phù hợp với kiểu Result
      const results = data.map((item: any) => ({
        id: item.id,
        ten_benh_nhan: item.Benh_nhan.Nguoi_dung.ho_va_ten,
        ma_benh_nhan: item.Benh_nhan.ma_benh_nhan,
        thoi_diem_bat_dau: item.Gio_hen.thoi_diem_bat_dau,
        lam_viec_onl: item.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl,
      }));

      setResults(results);
    };

    fetchResults();
  }, [status]);

  const filteredResults = results.filter((item) => {
    const isOnlineMatch =
      isOnlineFilter === null || item.lam_viec_onl === isOnlineFilter;
    const dateMatch =
      filteredDate === "" ||
      new Date(item.thoi_diem_bat_dau).toLocaleDateString() ===
        new Date(filteredDate).toLocaleDateString();
    const searchMatch =
      searchTerm === "" ||
      item.ten_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return isOnlineMatch && dateMatch && searchMatch;
  });

  // Hàm xử lý khi nhấn vào một dòng trong danh sách
  const handleRowClick = (appointmentId: string) => {
    navigate(`/resultDetail/${appointmentId}`);
  };

  // Xử lý phân trang
  const resultsPerPage = 10; // Số lượng kết quả trên mỗi trang
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const indexOfLastAppointment = currentPage * resultsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - resultsPerPage;
  const currentAppointments = filteredResults.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

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
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold flex items-center text-lg">
          <div
            className={`mr-5 cursor-pointer ${
              status === "pending" ? "text-blueTitle" : ""
            }`}
            onClick={() => navigate("/resultList/pending")}
          >
            <p
              className={`font-semibold mb-1 ml-1 ${
                status === "pending" ? "text-blueTitle" : ""
              }`}
            >
              Chờ xử lý
            </p>

            {status === "pending" && (
              <hr className="border-t-2 border-blueTitle ml-1" />
            )}
          </div>
          <div
            className={`mr-5 cursor-pointer`}
            onClick={() => navigate("/resultList/success")}
          >
            <p
              className={`font-semibold mb-1 ${
                status === "success" ? "text-blueTitle" : ""
              }`}
            >
              Đã xử lý
            </p>
            {status === "success" && (
              <hr className="border-t-2 border-blueTitle ml-1" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
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
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã đơn hẹn</th>
            <th className="px-4 py-2">Tên bệnh nhân</th>
            <th className="px-4 py-2">Mã bệnh nhân</th>
            <th className="px-4 py-2">Hẹn lúc</th>
            <th className="px-4 py-2">Hình thức</th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.map((result, index) => (
            <tr
              key={result.id}
              onClick={() => handleRowClick(result.id)}
              className="bg-white hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{`#${result.id}`}</td>
              <td className="px-4 py-3 truncate max-w-xs">
                {result.ten_benh_nhan}
              </td>
              <td className="px-4 py-3">{result.ma_benh_nhan}</td>
              <td className="px-4 py-3">
                {new Date(result.thoi_diem_bat_dau).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 flex justify-center items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium block w-10/12 ${
                    result.lam_viec_onl
                      ? "bg-rose-200 text-rose-600"
                      : "bg-blue-200 text-blue-700"
                  }`}
                >
                  {result.lam_viec_onl ? "Trực tuyến" : "Trực tiếp"}
                </span>
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

export default ResultList;
