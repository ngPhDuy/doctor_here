import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddDoctorModal from "./AddDoctor";
// Định nghĩa kiểu dữ liệu của một bác sĩ
interface Doctor {
  id: number;
  code: string;
  name: string;
  joinDate: string;
  phone: string;
  status: string;
}

// Dữ liệu mẫu
const initialDoctors: Doctor[] = [
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

const DoctorListComponent: React.FC = () => {
  const navigate = useNavigate();
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const [isAddDoctor, setIsAddDoctor] = useState(false);

  const toggleAddDoctor = () => {
    setIsAddDoctor(!isAddDoctor);
  };
  // Xử lý update
  const handleUpdate = (id: number) => {
    alert(`Update doctor with ID: ${id}`);
  };

  // Xử lý delete
  const handleDelete = (id: number) => {
    alert(`Delete doctor with ID: ${id}`);
  };

  return (
    <div className="p-5 h-full bg-gray-50">
      <p className="font-bold text-xl mb-4">Danh sách bác sĩ</p>
      <div className="flex items-center w-full pb-4 p-3 mb-4  justify-between bg-white">
        <div className="font-semibold text-lg mr-50">
          <p>Số bác sĩ (430)</p>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src="/images/AdminList/search.png"
            alt="Search"
            className="w-10 h-10"
          />
          <img
            src="/images/AdminList/add.png"
            alt="Add"
            className="w-10 h-10"
          />
          <img
            src="/images/AdminList/filter.png"
            alt="Filter"
            className="w-10 h-10"
          />
        </div>
      </div>
      <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
        <thead className="text-gray-600 text-lg bg-gray-100">
          <tr>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã số BS</th>
            <th className="px-4 py-2">Tên BS</th>
            <th className="px-4 py-2">Ngày tham gia</th>
            <th className="px-4 py-2">SĐT</th>
            <th className="px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr
              key={doctor.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/doctorInfo/`)}
            >
              <td className="px-4 py-4">{index + 1}</td>
              <td className="px-4 py-4">{doctor.code}</td>
              <td className="px-4 py-4 truncate max-w-xs">{doctor.name}</td>
              <td className="px-4 py-4">{doctor.joinDate}</td>
              <td className="px-4 py-4">{doctor.phone}</td>
              <td
                className={`px-4 py-4 ${
                  doctor.status === "Active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {doctor.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddDoctorModal
        isOpen={isAddDoctor}
        setIsOpen={toggleAddDoctor}
        id={"5"}
      />
    </div>
  );
};

export default DoctorListComponent;
