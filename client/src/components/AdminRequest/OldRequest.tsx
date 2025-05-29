import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

interface UpdateRequest {
  ma_yeu_cau: string;
  ma_bac_si: string;
  ho_va_ten: string;
  thoi_diem_yeu_cau: string;
  trang_thai: string;
}

const OldRequestComponent: React.FC = () => {
  const navigate = useNavigate();
  const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>([]);

  const [filteredRequests, setFilteredRequests] = useState<UpdateRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState("");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerpage = 10;

  const indexOfLastRequest = currentPage * requestsPerpage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerpage;
  const currentRequest = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  // State cho bộ lọc ngày
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  // Chuyển trang
  const totalPages = Math.ceil(filteredRequests.length / requestsPerpage);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const fetchUpdateRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/updateRequest/oldRequest`
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách yêu cầu mới.");
      }

      const data: UpdateRequest[] = await response.json();
      setUpdateRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      setError("Lỗi khi tải danh sách yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdateRequests();
  }, []);

  useEffect(() => {
    const filtered = updateRequests.filter((request) => {
      const isMatchingSearchTerm =
        request.ho_va_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.ma_yeu_cau.toLowerCase().includes(searchTerm) ||
        request.ma_bac_si.toLowerCase().includes(searchTerm);

      const requestDate = new Date(request.thoi_diem_yeu_cau).setHours(
        0,
        0,
        0,
        0
      );
      const startTimestamp = startDate
        ? new Date(startDate).setHours(0, 0, 0, 0)
        : -Infinity;
      const endTimestamp = endDate
        ? new Date(endDate).setHours(23, 59, 59, 999)
        : Infinity;

      const isMatchingDateRange =
        requestDate >= startTimestamp && requestDate <= endTimestamp;

      const isMatchingStatus = status === "" || request.trang_thai === status;

      return isMatchingSearchTerm && isMatchingDateRange && isMatchingStatus;
    });

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset current page when filter changes
  }, [searchTerm, startDate, endDate, updateRequests, status]);

  if (loading) return <p>Đang tải danh sách yêu cầu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold flex items-center text-lg">
          <div
            className="mr-5  cursor-pointer"
            onClick={() => navigate(`/newRequests`)}
          >
            <p className="font-semibold text-lg mb-1">Chưa xử lý</p>
          </div>
          <div
            className="ml-5 text-blueTitle cursor-pointer"
            onClick={() => navigate(`/oldRequests`)}
          >
            <p className="font-semibold text-lg mb-1">Đã xử lý</p>
            <hr className="border-t-2 border-blueTitle" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
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

          <div className="flex gap-2 justify-center items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
            <option value="Thu hồi">Thu hồi</option>
          </select>
        </div>
      </div>

      <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
        <thead className="text-gray-600 text-base bg-gray-100">
          <tr>
            <th className="p-2">STT</th>
            <th className="p-2">Mã yêu cầu</th>
            <th className="p-2">Mã số BS</th>
            <th className="p-2">Tên BS</th>
            <th className="p-2">Thời gian yêu cầu</th>
            <th className="p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {currentRequest.map((request, index) => (
            <tr
              key={request.ma_yeu_cau}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                navigate(
                  `/newRequestDetail/${request.ma_yeu_cau}/${request.ma_bac_si}`
                )
              }
            >
              <td className="px-2 py-3">{index + 1 + indexOfFirstRequest}</td>
              <td className="px-2 py-3">{request.ma_yeu_cau}</td>
              <td className="px-2 py-3">{request.ma_bac_si}</td>
              <td className="px-2 py-3 truncate max-w-xs">
                {request.ho_va_ten}
              </td>
              <td className="px-2 py-3">
                {new Date(request.thoi_diem_yeu_cau).toLocaleString()}
              </td>
              <td className={`px-2 py-3 flex justify-center items-center`}>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium block w-10/12 ${
                    request.trang_thai === "Đã duyệt"
                      ? "bg-green-200 text-green-600"
                      : request.trang_thai === "Từ chối"
                      ? "bg-red-200 text-red-600"
                      : "bg-orange-200 text-orange-600"
                  }`}
                >
                  {request.trang_thai}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Phân trang */}
      {totalPages > 1 && (
        <>
          <div className="flex justify-end mt-5 space-x-4 text-sm">
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
        </>
      )}
    </div>
  );
};

export default OldRequestComponent;
