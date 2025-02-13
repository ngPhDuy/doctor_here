import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, FileInput } from "../Input/InputComponents";

const Request = {
  requestCode: "",
  doctorCode: "",
  doctorName: "",
  oldSpecialty: "",
  newSpecialty: "",
  oldClinicAddress: "",
  newClinicAddress: "",
  oldDegree: "",
  newDegree: "",
  evidence: null as File | null, // Chấp nhận null hoặc File
};

interface RequestHistory {
  requestCode: string;
  doctorCode: string;
  doctorName: string;
  requestTime: string;
  result: string;
}
const initialRequests: RequestHistory[] = [
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
];

const NewRequestDetail: React.FC = () => {
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState(Request);
  const [requestsHistory] = useState<RequestHistory[]>(initialRequests);

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setRequestData((prevData) => ({ ...prevData, [field]: e.target.value }));
    };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Kiểm tra files có tồn tại không
    if (file) {
      setRequestData((prevData) => ({
        ...prevData,
        evidence: file, // Không còn lỗi
      }));
    }
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md">
        <div
          className="p-3 cursor-pointer"
          onClick={() => navigate("/oldRequests")}
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
        <div className="p-3 mr-5 text-blueTitle cursor-pointer">
          <p className="font-semibold text-xl mb-2">Thông tin chi tiết</p>
          <hr className="border-t-2 border-blueTitle" />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Thông tin chuyên ngành bên trái */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-8">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="44"
                height="44"
                rx="7.5"
                fill="#3995C5"
              />
              <rect
                x="0.5"
                y="0.5"
                width="44"
                height="44"
                rx="7.5"
                stroke="white"
              />
              <path
                d="M22.5 17.7188V23.625"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M32.7148 18.6525V26.3475C32.7148 27.6075 32.0398 28.7775 30.9485 29.4188L24.266 33.2775C23.1748 33.9075 21.8248 33.9075 20.7223 33.2775L14.0398 29.4188C12.9485 28.7888 12.2735 27.6187 12.2735 26.3475V18.6525C12.2735 17.3925 12.9485 16.2225 14.0398 15.5812L20.7223 11.7225C21.8135 11.0925 23.1635 11.0925 24.266 11.7225L30.9485 15.5812C32.0398 16.2225 32.7148 17.3813 32.7148 18.6525Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.5 27.2246V27.3371"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 className="text-xl font-semibold ml-4">Chi tiết yêu cầu</h2>
          </div>

          <h3 className="text-xl font-semibold">Yêu cầu cập nhật thông tin</h3>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 my-4">
            {[
              { id: "oldSpecialty", label: "Chuyên khoa cũ", type: "text" },
              { id: "newSpecialty", label: "Chuyên khoa mới", type: "text" },
              {
                id: "oldClinicAddress",
                label: "Địa chỉ phòng khám cũ",
                type: "text",
              },
              {
                id: "newClinicAddress",
                label: "Địa chỉ phòng khám mới",
                type: "text",
              },
              { id: "oldDegree", label: "Trình độ học vấn cũ", type: "text" },
              { id: "newDegree", label: "Trình độ học vấn mới", type: "text" },
            ].map((input) => (
              <div key={input.id}>
                <TextInput
                  label={input.label}
                  id={input.id}
                  type={input.type}
                  value={
                    typeof requestData[input.id as keyof typeof requestData] ===
                    "string"
                      ? (requestData[
                          input.id as keyof typeof requestData
                        ] as string)
                      : ""
                  }
                  onChange={(e) => handleChange(input.id)(e)}
                />
              </div>
            ))}
          </div>

          {/* Minh chứng */}
          <div className="grid gap-4 mb-4 sm:grid-cols-1 my-4">
            <FileInput
              label="Minh chứng"
              id="evidence"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end mt-10 mb-20">
            <button className="px-4 py-2 mr-3 bg-greenButton hover:bg-greenButtonHover text-white rounded-lg">
              Chấp thuận
            </button>
            <button className="px-4 py-2 bg-redButton hover:bg-redButtonHover text-white rounded-lg">
              Từ chối
            </button>
          </div>
        </div>

        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <img
              src="/images/avt.png"
              alt="Doctor Avatar"
              className="w-30 h-30 rounded-full mb-4"
            />
            <p className="text-xl font-semibold">Nguyễn Văn A (5151)</p>
            <p className="text-gray-600">21 tuổi, Nam</p>
          </div>

          <hr className="mt-10 mb-3" />
          <div className="">
            <table className="table-auto w-full text-center">
              <thead className="text-gray-600 text-lg bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Mã yêu cầu</th>
                  <th className="px-4 py-2">Thời gian yêu cầu</th>
                  <th className="px-4 py-2">Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {requestsHistory.map((request, index) => (
                  <tr
                    key={request.requestCode}
                    className="bg-white hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/oldRequestDetail`)}
                  >
                    <td className="px-4 py-4">{request.requestCode}</td>
                    <td className="px-4 py-4">
                      {new Date(request.requestTime).toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-4 ${
                        request.result === "Chấp thuận"
                          ? "text-green-500"
                          : request.result === "Bị từ chối"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {request.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequestDetail;
