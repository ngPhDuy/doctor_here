import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddDoctorModal from "./AddDoctor";
import { FiUserCheck, FiUserX } from "react-icons/fi";

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

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // State cho bộ lọc ngày
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Hàm kiểm tra xem ngày có nằm trong khoảng đã chọn không
  const isWithinDateRange = (doctorDate: string) => {
    if (!startDate && !endDate) return true;
    const doctorTimestamp = new Date(doctorDate).getTime();
    const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
    const endTimestamp = endDate ? new Date(endDate).getTime() : Infinity;

    return doctorTimestamp >= startTimestamp && doctorTimestamp <= endTimestamp;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/doctor`
        );
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

  // Lọc danh sách bác sĩ theo từ khóa tìm kiếm
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.Nguoi_dung.ho_va_ten
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.ma_bac_si.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lọc danh sách bác sĩ dựa trên chuyên khoa và ngày tham gia
  const displayedDoctors = filteredDoctors.filter(
    (doctor) =>
      (!selectedSpecialty || doctor.chuyen_khoa === selectedSpecialty) &&
      isWithinDateRange(doctor.ngay_vao_nghe)
  );
  // Xử lý phân trang
  const totalPages = Math.ceil(displayedDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = displayedDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Các chuyên khoa duy nhất để lọc
  // const specialties = Array.from(
  //   new Set(doctors.map((doctor) => doctor.chuyen_khoa))
  // );
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const fetchSpecialization = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/doctor/specialization`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch specialization");
        }
        const data = await response.json();
        let specialization = data.map((item: any) => item.ten_chuyen_khoa);
        setSpecialties(specialization);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecialization();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold text-lg">
          <p>Số bác sĩ ({displayedDoctors.length})</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Tên hoặc mã bác sĩ"
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

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Tất cả chuyên khoa</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
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
          <img
            src="/images/AdminList/add.png"
            alt="Add"
            className="w2r-h2r cursor-pointer hover:bg-gray-200"
            onClick={toggleAddDoctor}
          />
        </div>
      </div>

      <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
        <thead className="text-gray-600 text-base bg-gray-100">
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
          {currentDoctors.map((doctor, index) => (
            <tr
              key={doctor.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/doctorDetail/${doctor.ma_bac_si}`)}
            >
              <td className="px-4 py-3">{indexOfFirstDoctor + index + 1}</td>
              <td className="px-4 py-3">{doctor.ma_bac_si}</td>
              <td className="px-4 py-3 truncate max-w-xs">
                {doctor.Nguoi_dung.ho_va_ten}
              </td>
              <td className="px-4 py-3">{doctor.ngay_vao_nghe}</td>
              <td className="px-4 py-3">{doctor.Nguoi_dung.sdt}</td>
              <td
                className={`px-4 py-3 rounded-lg flex items-center justify-center`}
              >
                {doctor.Nguoi_dung.Tai_khoan.active ? (
                  <FiUserCheck size={20} className="text-green-500" />
                ) : (
                  <FiUserX size={20} className="text-red-500" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-5 space-x-4 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
      )}

      <AddDoctorModal isOpen={isAddDoctor} setIsOpen={toggleAddDoctor} />
    </div>
  );
};

export default DoctorListComponent;
