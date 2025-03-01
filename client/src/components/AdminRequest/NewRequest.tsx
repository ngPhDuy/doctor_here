import apiURL from "../../../svConfig";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UpdateRequest {
  ma_yeu_cau: string;
  ma_bac_si: string;
  ho_va_ten: string;
  thoi_diem_yeu_cau: string;
  trang_thai: string;
}

const NewRequestComponent: React.FC = () => {
  const navigate = useNavigate();
  const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchUpdateRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiURL}/api/updateRequest/newRequest`
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
          className="mr-5 text-blueTitle cursor-pointer"
          onClick={() => navigate(`/newRequests`)}
        >
          <p className="font-semibold text-lg mb-2">Chưa xử lý</p>
          <hr className="border-t-2 border-blueTitle" />
        </div>
        <div
          className="ml-5 cursor-pointer"
          onClick={() => navigate(`/oldRequests`)}
        >
          <p className="font-semibold text-lg mb-2">Đã xử lý</p>
        </div>
      </div>
      <div className="flex items-center w-full pb-4 p-3 mb-4  justify-between bg-white">
        <div className="font-semibold text-base mr-50">
          <p>Số yêu cầu ({updateRequests.length})</p>
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
            <th className="px-4 py-2">Mã yêu cầu</th>
            <th className="px-4 py-2">Mã số BS</th>
            <th className="px-4 py-2">Tên BS</th>
            <th className="px-4 py-2">Thời gian yêu cầu</th>
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
              <td className="px-2 py-3">{index + 1}</td>
              <td className="px-2 py-3">{request.ma_yeu_cau}</td>
              <td className="px-2 py-3">{request.ma_bac_si}</td>
              <td className="px-2 py-3 truncate max-w-xs">
                {request.ho_va_ten}
              </td>
              <td className="px-2 py-3">
                {new Date(request.thoi_diem_yeu_cau).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewRequestComponent;
