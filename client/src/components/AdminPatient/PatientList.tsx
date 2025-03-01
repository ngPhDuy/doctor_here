import apiURL from "../../../svConfig";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu của một bệnh nhân
interface Patient {
  id: number;
  ma_benh_nhan: string;
  cccd: string;
  dan_toc: string;
  nhom_mau: string;
  tien_su_benh: string;
  quoc_tich: string;
  dia_chi: string;
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

const PatientListComponent: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${apiURL}/api/patient`);
        if (!response.ok) {
          throw new Error("Không thể tải danh sách bệnh nhân.");
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError("Lỗi khi tải danh sách bệnh nhân.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5 h-full bg-gray-50">
      <div className="flex items-center w-full pb-4 p-3 mb-4  justify-between bg-white">
        <div className="font-semibold text-base mr-50">
          <p>Danh sách bệnh nhân ({patients.length})</p>
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
            <th className="px-4 py-2">Mã số BN</th>
            <th className="px-4 py-2">Tên BN</th>
            <th className="px-4 py-2">Ngày tham gia</th>
            <th className="px-4 py-2">SĐT</th>
            <th className="px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((Patient, index) => (
            <tr
              key={Patient.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/patientDetail/${Patient.ma_benh_nhan}`)}
            >
              <td className="px-2 py-3">{index + 1}</td>
              <td className="px-2 py-3">{Patient.ma_benh_nhan}</td>
              <td className="px-2 py-3 truncate max-w-xs">
                {Patient.Nguoi_dung.ho_va_ten}
              </td>
              <td className="px-2 py-3">{Patient.Nguoi_dung.ngay_sinh}</td>
              <td className="px-2 py-3">{Patient.Nguoi_dung.sdt}</td>
              <td
                className={`px-4 py-2 rounded-lg ${
                  Patient.Nguoi_dung.Tai_khoan.active
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {Patient.Nguoi_dung.Tai_khoan.active ? "Kích hoạt" : "Bị khóa"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientListComponent;
