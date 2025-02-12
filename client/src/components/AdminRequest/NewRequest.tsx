import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Request {
  requestCode: string;
  doctorCode: string;
  doctorName: string;
  requestTime: string;
  result: string;
}

// Dữ liệu mẫu
const initialRequests: Request[] = [
  {
    requestCode: "REQ001",
    doctorCode: "DOC123",
    doctorName: "Dr. Nguyễn Văn A",
    requestTime: "2024-02-12T08:30:00Z",
    result: "Chờ xử lý",
  },
  {
    requestCode: "REQ002",
    doctorCode: "DOC124",
    doctorName: "Dr. Trần Thị B",
    requestTime: "2024-02-12T09:00:00Z",
    result: "Chấp thuận",
  },
  {
    requestCode: "REQ003",
    doctorCode: "DOC125",
    doctorName: "Dr. Lê Văn C",
    requestTime: "2024-02-12T10:15:00Z",
    result: "Bị từ chối",
  },
  {
    requestCode: "REQ004",
    doctorCode: "DOC126",
    doctorName: "Dr. Phạm Thị D",
    requestTime: "2024-02-12T11:45:00Z",
    result: "Chờ xử lý",
  },
  {
    requestCode: "REQ005",
    doctorCode: "DOC127",
    doctorName: "Dr. Hồ Minh E",
    requestTime: "2024-02-12T13:20:00Z",
    result: "Chấp thuận",
  },
  {
    requestCode: "REQ006",
    doctorCode: "DOC128",
    doctorName: "Dr. Nguyễn Thị F",
    requestTime: "2024-02-12T14:10:00Z",
    result: "Bị từ chối",
  },
  {
    requestCode: "REQ007",
    doctorCode: "DOC129",
    doctorName: "Dr. Đỗ Văn G",
    requestTime: "2024-02-12T15:30:00Z",
    result: "Chờ xử lý",
  },
  {
    requestCode: "REQ008",
    doctorCode: "DOC130",
    doctorName: "Dr. Bùi Thị H",
    requestTime: "2024-02-12T16:05:00Z",
    result: "Chấp thuận",
  },
  {
    requestCode: "REQ009",
    doctorCode: "DOC131",
    doctorName: "Dr. Trương Văn I",
    requestTime: "2024-02-12T17:40:00Z",
    result: "Bị từ chối",
  },
  {
    requestCode: "REQ010",
    doctorCode: "DOC132",
    doctorName: "Dr. Phan Thị J",
    requestTime: "2024-02-12T18:50:00Z",
    result: "Chờ xử lý",
  },
];

const NewRequestComponent: React.FC = () => {
  const navigate = useNavigate();
  const [requests] = useState<Request[]>(initialRequests);

  return (
    <div className="p-5 h-full bg-gray-50">
      <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md">
        <div
          className="p-3 cursor-pointer"
          onClick={() => navigate(`/oldRequests`)}
        >
          <p className="font-semibold text-xl mb-2">Yêu cầu cũ</p>
        </div>
        <div
          className="p-3 mr-5 text-blueTitle cursor-pointer"
          onClick={() => navigate(`/newRequests`)}
        >
          <p className="font-semibold text-xl mb-2">Yêu cầu mới</p>
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
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr
              key={request.requestCode}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/newRequestDetail`)}
            >
              <td className="px-4 py-4">{index + 1}</td>
              <td className="px-4 py-4">{request.requestCode}</td>
              <td className="px-4 py-4">{request.doctorCode}</td>
              <td className="px-4 py-4 truncate max-w-xs">
                {request.doctorName}
              </td>
              <td className="px-4 py-4">
                {new Date(request.requestTime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewRequestComponent;
