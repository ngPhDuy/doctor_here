import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchUpdateRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3001/api/updateRequest/oldRequest"
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách yêu cầu mới.");
      }

      const data: UpdateRequest[] = await response.json();
      setUpdateRequests(data);
    } catch (err) {
      setError("Lỗi khi tải danh sách yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdateRequests();
  }, []);

  if (loading) return <p>Đang tải danh sách yêu cầu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5 h-full bg-gray-50">
      <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md">
        <div
          className="p-3 mr-5  cursor-pointer"
          onClick={() => navigate(`/newRequests`)}
        >
          <p className="font-semibold text-xl mb-2">Yêu cầu mới</p>
        </div>
        <div
          className="p-3 text-blueTitle cursor-pointer"
          onClick={() => navigate(`/oldRequests`)}
        >
          <p className="font-semibold text-xl mb-2">Yêu cầu cũ</p>
          <hr className="border-t-2 border-blueTitle" />
        </div>
      </div>
      <div className="flex items-center w-full pb-4 p-3 mb-4  justify-between bg-white">
        <div className="font-semibold text-lg mr-50">
          <p>Số yêu cầu (430)</p>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src="/images/AdminList/search.png"
            alt="Search"
            className="w-10 h-10 cursor-pointer hover:bg-gray-200"
          />
          <img
            src="/images/AdminList/filter.png"
            alt="Filter"
            className="w-10 h-10 cursor-pointer hover:bg-gray-200"
          />
        </div>
      </div>
      <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
        <thead className="text-gray-600 text-lg bg-gray-100">
          <tr>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã yêu cầu</th>
            <th className="px-4 py-2">Mã số BS</th>
            <th className="px-4 py-2">Tên BS</th>
            <th className="px-4 py-2">Thời gian yêu cầu</th>
            <th className="px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {updateRequests.map((request, index) => (
            <tr
              key={request.ma_yeu_cau}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                navigate(
                  `/newRequestDetail/${request.ma_yeu_cau}/${request.ma_bac_si}`
                )
              }
            >
              <td className="px-4 py-4">{index + 1}</td>
              <td className="px-4 py-4">{request.ma_yeu_cau}</td>
              <td className="px-4 py-4">{request.ma_bac_si}</td>
              <td className="px-4 py-4 truncate max-w-xs">
                {request.ho_va_ten}
              </td>
              <td className="px-4 py-4">
                {new Date(request.thoi_diem_yeu_cau).toLocaleString()}
              </td>
              <td
                className={`px-4 py-4 ${
                  request.trang_thai === "Đã duyệt"
                    ? "text-green-500"
                    : request.trang_thai === "Từ chối"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {request.trang_thai}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OldRequestComponent;
