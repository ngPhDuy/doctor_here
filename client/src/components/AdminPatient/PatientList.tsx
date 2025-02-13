import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu của một bác sĩ
interface Patient {
  id: number;
  code: string;
  name: string;
  joinDate: string;
  phone: string;
  status: string;
}

// Dữ liệu mẫu
const initialPatients: Patient[] = [
  {
    id: 1,
    code: "BS001",
    name: "Nguyen Van A",
    joinDate: "2023-01-15",
    phone: "0987654321",
    status: "Active",
  },
  {
    id: 2,
    code: "BS002",
    name: "Tran Thi B",
    joinDate: "2022-05-20",
    phone: "0912345678",
    status: "Inactive",
  },
  {
    id: 3,
    code: "BS003",
    name: "Le Van C",
    joinDate: "2021-09-10",
    phone: "0901122334",
    status: "Active",
  },
  {
    id: 4,
    code: "BS004",
    name: "Pham Thi D",
    joinDate: "2020-12-25",
    phone: "0977766554",
    status: "Inactive",
  },
  {
    id: 5,
    code: "BS005",
    name: "Hoang Van E",
    joinDate: "2019-07-30",
    phone: "0966677889",
    status: "Active",
  },
  {
    id: 6,
    code: "BS006",
    name: "Do Thi F",
    joinDate: "2023-03-10",
    phone: "0933344556",
    status: "Active",
  },
  {
    id: 7,
    code: "BS004",
    name: "Pham Thi D",
    joinDate: "2020-12-25",
    phone: "0977766554",
    status: "Inactive",
  },
  {
    id: 5,
    code: "BS005",
    name: "Hoang Van E",
    joinDate: "2019-07-30",
    phone: "0966677889",
    status: "Active",
  },
  {
    id: 6,
    code: "BS006",
    name: "Do Thi F",
    joinDate: "2023-03-10",
    phone: "0933344556",
    status: "Active",
  },
];

const PatientListComponent: React.FC = () => {
  const navigate = useNavigate();
  const [Patients] = useState<Patient[]>(initialPatients);

  return (
    <div className="p-5 h-full bg-gray-50">
      <p className="font-bold text-xl mb-4">Danh sách bệnh nhân</p>
      <div className="flex items-center w-full pb-4 p-3 mb-4  justify-between bg-white">
        <div className="font-semibold text-lg mr-50">
          <p>Số bệnh nhân (430)</p>
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
            <th className="px-4 py-2">Mã số BN</th>
            <th className="px-4 py-2">Tên BN</th>
            <th className="px-4 py-2">Ngày tham gia</th>
            <th className="px-4 py-2">SĐT</th>
            <th className="px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {Patients.map((Patient, index) => (
            <tr
              key={Patient.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/patientInfor/`)}
            >
              <td className="px-4 py-4">{index + 1}</td>
              <td className="px-4 py-4">{Patient.code}</td>
              <td className="px-4 py-4 truncate max-w-xs">{Patient.name}</td>
              <td className="px-4 py-4">{Patient.joinDate}</td>
              <td className="px-4 py-4">{Patient.phone}</td>
              <td
                className={`px-4 py-4 ${
                  Patient.status === "Active"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {Patient.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientListComponent;
