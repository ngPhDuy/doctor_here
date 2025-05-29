import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  FaRegCalendar,
  FaRegCalendarCheck,
  FaCalendarXmark,
} from "react-icons/fa6";

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
    thoi_diem_bat_dau: string;
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

  // State cho hình thức online/offline
  const [isOnlineFilter, setIsOnlineFilter] = useState<boolean | null>(null);

  // State cho trạng thái
  const [status, setStatus] = useState("");

  // Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // State cho sắp xếp
  const [sortField, setSortField] = useState("thoi_diem_bat_dau"); // "id" or "thoi_diem_bat_dau"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/getAllByDoctorID?doctorID=${localStorage.getItem(
            "id"
          )}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách lịch hẹn.");
        }
        const data: Appointment[] = await response.json();
        console.log(data[0]);
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
    const appointmentDate = new Date(appointment.thoi_diem_tao).setHours(
      0,
      0,
      0,
      0
    );

    const startTimestamp = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : -Infinity;
    const endTimestamp = endDate
      ? new Date(endDate).setHours(23, 59, 59, 999)
      : Infinity;

    // Kiểm tra online/offline
    let isOnline = true;
    if (isOnlineFilter !== null) {
      isOnline =
        appointment.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl ===
        isOnlineFilter;
    }

    // Kiểm tra trạng thái
    let isStatusMatch = true;
    if (status) {
      isStatusMatch =
        appointment.trang_thai.toLowerCase() === status.toLowerCase();
    }

    return (
      (appointment.Benh_nhan.ma_benh_nhan
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        appointment.Benh_nhan.Nguoi_dung.ho_va_ten
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      appointmentDate >= startTimestamp &&
      appointmentDate <= endTimestamp &&
      isOnline &&
      isStatusMatch
    );
  });

  // Sắp xếp theo trường đã chọn
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }
    if (sortField === "thoi_diem_bat_dau") {
      const dateA = new Date(a.Gio_hen.thoi_diem_bat_dau).getTime();
      const dateB = new Date(b.Gio_hen.thoi_diem_bat_dau).getTime();
      console.log(a.Gio_hen.thoi_diem_bat_dau, " ", dateA);
      console.log(b.Gio_hen.thoi_diem_bat_dau, " ", dateB);
      console.log("----------------------------------");
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // Xử lý phân trang
  const totalPages = Math.ceil(sortedAppointments.length / appointmentsPerPage);
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = sortedAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const handleFilterModalToggle = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setIsOnlineFilter(null);
    setStatus("");
    setIsFilterModalOpen(false);
    setCurrentPage(1); // Reset to the first page after clearing filters
  };

  const handleModalClose = (e: React.MouseEvent) => {
    // Close the modal if clicked outside the modal content
    if (e.target === e.currentTarget) {
      setIsFilterModalOpen(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold text-lg">
          <p>Tổng cuộc hẹn ({sortedAppointments.length})</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {/* Sắp xếp */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
            <select
              className="outline-none"
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
              value={sortField}
            >
              <option value="id">SX: Mã đơn hẹn</option>
              <option value="thoi_diem_bat_dau">SX: Thời điểm hẹn</option>
            </select>
            <select
              className="outline-none ml-2"
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              value={sortOrder}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Tên hoặc mã bệnh nhân"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 outline-none px-2"
            />
            <FiSearch size={18} />
          </div>

          <button
            onClick={handleFilterModalToggle}
            className="p-2 flex items-center border rounded-lg bg-white shadow-sm"
          >
            <FiFilter size={18} />
          </button>
        </div>
      </div>

      <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
        <thead className="text-gray-600 text-base bg-gray-100">
          <tr>
            <th className="px-4 py-2">Mã đơn hẹn</th>
            <th className="px-4 py-2">Tên bệnh nhân</th>
            <th className="px-4 py-2">Hẹn lúc</th>
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
              <td className="px-4 py-3">{`#${appointment.id}`}</td>
              <td className="px-4 py-3 truncate max-w-xs">
                {appointment.Benh_nhan.Nguoi_dung.ho_va_ten}
              </td>
              <td className="px-4 py-3">
                {new Date(appointment.Gio_hen.thoi_diem_bat_dau).toLocaleString(
                  "vi-VN"
                )}
              </td>
              <td className="px-4 py-3 flex justify-center items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium w-10/12 ${
                    appointment.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl
                      ? "bg-rose-200 text-rose-600"
                      : "bg-blue-200 text-blue-700"
                  }`}
                >
                  {appointment.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl
                    ? "Trực tuyến"
                    : "Trực tiếp"}
                </span>
              </td>
              <td className="px-4 py-3">
                {appointment.trang_thai === "Hoàn thành" ? (
                  <FaRegCalendarCheck className="text-green-500 m-auto" />
                ) : appointment.trang_thai === "Đang chờ" ? (
                  <FaRegCalendar className="text-yellow-500 m-auto" />
                ) : (
                  <FaCalendarXmark className="text-red-500 m-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
          onClick={handleModalClose} // Close modal when clicked outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold mb-4 text-center">
              Lọc lịch hẹn
            </h2>

            <div className="flex flex-row items-center mb-4 gap-3">
              <label className="flex items-center w-full">
                <span className="mr-2 w-3/12 font-semibold">Hình thức:</span>
                <select
                  onChange={(e) => {
                    setIsOnlineFilter(
                      e.target.value === "online"
                        ? true
                        : e.target.value === "offline"
                        ? false
                        : null
                    );

                    setCurrentPage(1); // Reset to the first page after filtering
                  }}
                  value={
                    isOnlineFilter === null
                      ? "all"
                      : isOnlineFilter
                      ? "online"
                      : "offline"
                  }
                  className="px-4 py-2 border rounded-lg w-7/12"
                >
                  <option value="all">Tất cả</option>
                  <option value="online">Trực tuyến</option>
                  <option value="offline">Trực tiếp</option>
                </select>
              </label>
            </div>

            <div className="flex flex-row items-center mb-4 gap-3">
              <label className="flex items-center w-full">
                <span className="mr-2 w-3/12 font-semibold">Trạng thái:</span>
                <select
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setCurrentPage(1); // Reset to the first page after filtering
                  }}
                  className="px-4 py-2 border rounded-lg w-7/12"
                  value={status}
                >
                  <option value="">Tất cả</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đang chờ">Đang chờ</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </label>
            </div>

            <div className="flex flex-row items-center justify-center mb-4 gap-2 w-full">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1); // Reset to the first page after filtering
                }}
                className="border px-2 py-2 rounded-lg w-5/12"
              />

              <span>-</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1); // Reset to the first page after filtering
                }}
                className="border px-2 py-2 rounded-lg w-5/12"
              />
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={handleClearFilter}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

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

export default HistoryListComponent;
