import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: number;
  ten_dang_nhap: string;
  email: string;
  sdt: string;
  ngay_sinh: string;
  gioi_tinh: string;
  phan_loai: string;
  ho_va_ten: string;

  cccd: string;
  dan_toc: string;
  nhom_mau: string;
  tien_su_benh: string;
  quoc_tich: string;
  dia_chi: string;
  ma_benh_nhan: string;

  ma_bhyt: string;
  bv_dang_ky: string;
  ngay_cap: string;
  ngay_het_han: string;
}

const PatientListDoctorComponent: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");

  // State cho bộ lọc ngày
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/patient/getAllByDoctorID?doctorID=${localStorage.getItem("id")}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách bệnh nhân.");
        }
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (err) {
        setError("Lỗi khi tải danh sách bệnh nhân.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Lọc danh sách bác sĩ theo từ khóa tìm kiếm và theo ngày
  const filteredPatients = patients.filter((patient) => {
    const patientDate = patient.ngay_sinh.split("T")[0];

    const startDateStr = startDate
      ? new Date(startDate).toISOString().split("T")[0]
      : "";
    const endDateStr = endDate
      ? new Date(endDate).toISOString().split("T")[0]
      : "";

    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      // Lọc theo từ khóa tìm kiếm (ho_va_ten, ma_bhyt, bv_dang_ky)
      (patient.ho_va_ten.toLowerCase().includes(lowerSearchTerm) ||
        patient.ma_bhyt.toLowerCase().includes(lowerSearchTerm) ||
        patient.bv_dang_ky.toLowerCase().includes(lowerSearchTerm)) &&
      // Lọc theo khoảng ngày sinh
      (!startDateStr || patientDate >= startDateStr) &&
      (!endDateStr || patientDate <= endDateStr)
    );
  });

  // Xử lý phân trang
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-2 h-full bg-gray-50">
      {/* <div className="font-medium text-xl mb-4 text-blue-600">Lịch sử cuộc hẹn</div> */}
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold text-lg">
          <p>Tổng bệnh nhân ({filteredPatients.length})</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Tên, BHYT, Bệnh viện"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 outline-none px-2"
            />
            <FiSearch size={18} />
          </div>

          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
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
        <thead className="text-gray-600 text-base bg-gray-100">
          <tr>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã bệnh nhân</th>
            <th className="px-4 py-2">Tên bệnh nhân</th>
            <th className="px-4 py-2">Ngày sinh</th>
            <th className="px-4 py-2">BHYT</th>
            <th className="px-4 py-2">Bệnh viện đăng ký</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient, index) => (
            <tr
              key={patient.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                navigate(`/patientInfoDoctor/${patient.ma_benh_nhan}`)
              }
            >
              <td className="px-4 py-3">{indexOfFirstPatient + index + 1}</td>
              <td className="px-4 py-3">{patient.ma_benh_nhan}</td>
              <td className="px-4 py-3 truncate max-w-xs">
                {patient.ho_va_ten}
              </td>
              <td className="px-4 py-3">{patient.ngay_sinh}</td>
              <td className="px-4 py-3">{patient.ma_bhyt}</td>
              <td className="px-4 py-3">{patient.bv_dang_ky}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-end mt-5 space-x-4 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Trước
        </button>
        <span className="px-4 py-2 border rounded-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default PatientListDoctorComponent;
