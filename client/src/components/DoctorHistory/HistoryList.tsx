import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
    id: number;
    van_ban_bo_sung: string;
    dia_chi_phong_kham: string;
    trang_thai: string;
    thoi_diem_tao: string;
    ma_bac_si: string;
    ma_benh_nhan_dat_hen: string;
    id_gio_hen: number;
    Gio_hen: {
      id: number;
      Ca_lam_viec_trong_tuan: {
        lam_viec_onl: boolean;
      };
    };
    Benh_nhan: {
      ma_benh_nhan: string;
      Nguoi_dung: {
        ho_va_ten: string;
        gioi_tinh: string;
      };
    };
  }

const HistoryListComponent: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 10;

    // State cho tìm kiếm và lọc
    const [searchTerm, setSearchTerm] = useState("");

    // State cho bộ lọc ngày
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
        try {
            const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/appointment/getAllByDoctorID?doctorID=BS0000001`
            );
            if (!response.ok) {
                throw new Error("Không thể tải danh sách lịch hẹn.");
            }
            const data: Appointment[] = await response.json();
            setAppointments(data);
        } catch (err) {
            setError("Lỗi khi tải danh sách lịch hẹn.");
        } finally {
            setLoading(false);
        }
        };
        fetchAppointments();
    }, []);

  // Lọc danh sách bác sĩ theo từ khóa tìm kiếm và theo ngày
  const filteredAppointments = appointments.filter((appointment) => {

    const appointmentDate = new Date(appointment.thoi_diem_tao).setHours(0, 0, 0, 0);
  
    const startTimestamp = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : -Infinity;
    const endTimestamp = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
  
    return (
      (appointment.Benh_nhan.ma_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.Benh_nhan.Nguoi_dung.ho_va_ten.toLowerCase().includes(searchTerm.toLowerCase())) &&
      appointmentDate >= startTimestamp && appointmentDate <= endTimestamp
    );
  });
  

  // Xử lý phân trang
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5 h-full bg-gray-50">
      {/* <div className="font-medium text-xl mb-4 text-blue-600">Lịch sử cuộc hẹn</div> */}
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white">
        <div className="font-semibold text-lg">
          <p>Tổng cuộc hẹn ({filteredAppointments.length})</p>
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
        <thead className="text-gray-600 text-base bg-gray-100">
          <tr>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã đơn hẹn</th>
            <th className="px-4 py-2">Tên bệnh nhân</th>
            <th className="px-4 py-2">Mã bệnh nhân</th>
            <th className="px-4 py-2">Ngày đặt lịch</th>
            <th className="px-4 py-2">Hình thức</th>
            <th className="px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.map((appointment, index) => (
            <tr
              key={appointment.id}
              className="bg-white hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/historyDetail/${appointment.id}`)}
            >
              <td className="px-4 py-3">{indexOfFirstAppointment + index + 1}</td>
              <td className="px-4 py-3">{appointment.ma_benh_nhan_dat_hen}</td>
              <td className="px-4 py-3 truncate max-w-xs">
                {appointment.Benh_nhan.Nguoi_dung.ho_va_ten}
              </td>
              <td className="px-4 py-3">{appointment.Benh_nhan.ma_benh_nhan}</td>
              <td className="px-4 py-3">{new Date(appointment.thoi_diem_tao).toISOString().split("T")[0]}</td>
              <td className={`px-4 py-3 ${
                    appointment.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl ? "text-blue-600" : "text-red-600"
                }`}
              >
                {appointment.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl ? "Online" : "Offline"}
              </td>
              <td className="px-4 py-3">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${
                        appointment.trang_thai === "Hoàn thành"
                        ? "bg-green-200 text-green-700"
                        : appointment.trang_thai === "Đang chờ"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-red-200 text-red-700"
                    }
                `}
              >
                    {appointment.trang_thai}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-end mt-5 space-x-4">
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

export default HistoryListComponent;
