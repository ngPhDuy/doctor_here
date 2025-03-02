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

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10; // Mỗi trang hiển thị 10 bệnh nhân

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");

  // State cho bộ lọc ngày
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Hàm kiểm tra xem ngày có nằm trong khoảng đã chọn không
  const isWithinDateRange = (patientDate: string) => {
    if (!startDate && !endDate) return true;
    const patientTimestamp = new Date(patientDate).getTime();
    const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
    const endTimestamp = endDate ? new Date(endDate).getTime() : Infinity;

    return (
      patientTimestamp >= startTimestamp && patientTimestamp <= endTimestamp
    );
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/patient`
        );
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

  // Lọc danh sách bệnh nhân theo từ khóa tìm kiếm
  const filteredPatients = patients.filter(
    (patient) =>
      patient.Nguoi_dung.ho_va_ten
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.ma_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lọc danh sách bệnh nhân dựa trên ngày tham gia
  const displayedPatients = filteredPatients.filter((patient) =>
    isWithinDateRange(patient.Nguoi_dung.Tai_khoan.thoi_diem_mo_tk)
  );

  // Tính toán chỉ số bắt đầu và kết thúc của danh sách hiển thị
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = displayedPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  // Chuyển trang
  const totalPages = Math.ceil(displayedPatients.length / patientsPerPage);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5 h-full bg-gray-50">
      <div className="flex items-center w-full pb-4 p-3 mb-4  justify-between bg-white">
        <div className="font-semibold text-lg mr-50">
          <p>Số bệnh nhân ({displayedPatients.length})</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Tên hoặc mã bệnh nhân"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none px-2"
            />
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.3176 21.3191L16.8478 16.8413M19.3248 10.857C19.3248 13.1032 18.4325 15.2574 16.8442 16.8457C15.2559 18.434 13.1017 19.3263 10.8555 19.3263C8.60933 19.3263 6.45513 18.434 4.86683 16.8457C3.27853 15.2574 2.38623 13.1032 2.38623 10.857C2.38623 8.61079 3.27853 6.4566 4.86683 4.86829C6.45513 3.27999 8.60933 2.3877 10.8555 2.3877C13.1017 2.3877 15.2559 3.27999 16.8442 4.86829C18.4325 6.4566 19.3248 8.61079 19.3248 10.857V10.857Z"
                stroke="#333333"
                stroke-width="2.13512"
                stroke-linecap="round"
              />
            </svg>
          </div>

          {/* Bộ lọc theo ngày */}
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
          {currentPatients.map((Patient, index) => (
            <tr
              key={Patient.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/patientDetail/${Patient.ma_benh_nhan}`)}
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{Patient.ma_benh_nhan}</td>
              <td className="px-4 py-3 truncate max-w-xs">
                {Patient.Nguoi_dung.ho_va_ten}
              </td>
              <td className="px-4 py-3">
                {
                  new Date(Patient.Nguoi_dung.Tai_khoan.thoi_diem_mo_tk)
                    .toISOString()
                    .split("T")[0]
                }
              </td>
              <td className="px-4 py-3">{Patient.Nguoi_dung.sdt}</td>
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
      {/* Phân trang */}
      <div className="flex justify-end mt-5 space-x-4">
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
    </div>
  );
};

export default PatientListComponent;
