import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddDoctorModal from "./AddDoctor";

interface Doctor {
  id: number;
  ma_bac_si: string;
  ngay_vao_nghe: string;
  chuyen_khoa: string;
  dia_chi_pk: string;
  mo_ta: string;
  trinh_do_hoc_van: string;
  Nguoi_dung: {
    ho_va_ten: string;
    ten_dang_nhap: string;
    email: string;
    sdt: string;
    ngay_sinh: string;
    gioi_tinh: string;
    phan_loai: string;
    Tai_khoan: {
      ten_dang_nhap: string;
      active: boolean;
      thoi_diem_mo_tk: string;
    };
  };
}

const DoctorListComponent: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAddDoctor, setIsAddDoctor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/doctor");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách bác sĩ.");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError("Lỗi khi tải danh sách bác sĩ.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const toggleAddDoctor = () => {
    setIsAddDoctor(!isAddDoctor);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5 h-full bg-gray-50">
      <p className="font-bold text-xl mb-4">Danh sách bác sĩ</p>
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white">
        <div className="font-semibold text-lg mr-50">
          <p>Số bác sĩ ({doctors.length})</p>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src="/images/AdminList/search.png"
            alt="Search"
            className="w-10 h-10 cursor-pointer hover:bg-gray-200"
          />
          <img
            src="/images/AdminList/add.png"
            alt="Add"
            className="w-10 h-10 cursor-pointer hover:bg-gray-200"
            onClick={toggleAddDoctor}
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
              onClick={() => navigate(`/doctorDetail/${doctor.ma_bac_si}`)}
            >
              <td className="px-4 py-4">{index + 1}</td>
              <td className="px-4 py-4">{doctor.ma_bac_si}</td>
              <td className="px-4 py-4 truncate max-w-xs">
                {doctor.Nguoi_dung.ho_va_ten}
              </td>
              <td className="px-4 py-4">{doctor.ngay_vao_nghe}</td>
              <td className="px-4 py-4">{doctor.Nguoi_dung.sdt}</td>
              <td
                className={`px-4 py-2 text-white rounded-lg ${
                  doctor.Nguoi_dung.Tai_khoan.active
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {doctor.Nguoi_dung.Tai_khoan.active ? "Kích hoạt" : "Bị khóa"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddDoctorModal isOpen={isAddDoctor} setIsOpen={toggleAddDoctor} />
    </div>
  );
};

export default DoctorListComponent;
