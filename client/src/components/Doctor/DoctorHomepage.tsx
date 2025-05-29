import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale, // <<== Thêm dòng này
  BarElement, // <<== Và thêm BarElement để vẽ Bar chart
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin datalabels
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

// Đảm bảo đăng ký các thành phần của Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  ChartDataLabels,
  LinearScale, // <<== Thêm LinearScale
  BarElement // <<== Thêm BarElement
);

interface AppoinmentItem {
  id: number;
  trang_thai: string;
  ngay_lam_viec: string;
  thoi_diem_bat_dau: string;
  lam_viec_onl: boolean;
  ten_benh_nhan: string; // Tên bệnh nhân (nếu cần thiết)
}

interface StatisticByYear {
  nam: number;
  tong_so_cuoc_hen: number;
}

interface StatisticByMonth {
  thang: number;
  tong_so_cuoc_hen: number;
}

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [appointmentList, setAppointmentList] = useState<AppoinmentItem[]>([]);
  const [viewMode, setViewMode] = useState<string>("week"); // "week" | "month"

  // Cho viewMode month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const appointmentsByDate = appointmentList.reduce((acc, appointment) => {
    const date = new Date(appointment.ngay_lam_viec).getDate();
    if (!acc[date]) acc[date] = [];
    acc[date].push(appointment);
    return acc;
  }, {} as Record<number, AppoinmentItem[]>);

  // Cho viewMode week
  const hours = Array.from({ length: 24 }, (_, i) => {
    return (i < 10 ? "0" : "") + i + ":00"; // Đảm bảo có 2 chữ số cho giờ
  });

  const days = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const startOfWeek = new Date(currentDate);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(
    currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  );

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const getAppointmentsForDayHour = (date: Date, hour: string) => {
    const dateStr = date.toISOString().split("T")[0]; // yyyy-mm-dd
    return appointmentList.filter((appointment) => {
      const apptDate = new Date(appointment.ngay_lam_viec)
        .toISOString()
        .split("T")[0];
      const apptHour = appointment.thoi_diem_bat_dau.split(":")[0]; // e.g. "14"
      return apptDate === dateStr && hour.startsWith(apptHour);
    });
  };

  //Auto Scroll khi viewMode là week
  const timeTableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewMode === "week" && timeTableRef.current) {
      const now = new Date();
      const currentHour = now.getHours(); // 0 -> 23

      // Tìm hàng tương ứng với giờ hiện tại
      const rowHeight = 45; // giả định mỗi hàng cao 40px, bạn có thể điều chỉnh theo UI thật
      const scrollTop = currentHour * rowHeight;

      timeTableRef.current.scrollTop = scrollTop;
    }
  }, [viewMode]);

  const openModal = (day: number) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      );
    } else {
      setCurrentDate(
        (prev) =>
          new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7)
      );
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      );
    } else {
      setCurrentDate(
        (prev) =>
          new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7)
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/getAppointmentSchedule?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&doctorID=${localStorage.getItem(
            "id"
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("startDate ", startDate.toISOString());
        console.log("endDate ", endDate.toISOString());
        console.log("data ", data);
        const appointmentListt: AppoinmentItem[] = data.map((item: any) => ({
          id: item.id,
          trang_thai: item.trang_thai,
          ngay_lam_viec: item.Gio_hen.ngay_lam_viec,
          thoi_diem_bat_dau: new Date(
            item.Gio_hen.thoi_diem_bat_dau
          ).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour: "2-digit",
            minute: "2-digit",
          }),
          lam_viec_onl: item.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl,
          ten_benh_nhan: item.Benh_nhan.Nguoi_dung.ho_va_ten,
        }));

        setAppointmentList(appointmentListt);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchData();
  }, [year, month]); // ⚡ Cập nhật dependency để fetch lại khi đổi tháng

  useEffect(() => {
    setCurrentDate(new Date()); // Reset về hôm nay mỗi khi đổi view mode
  }, [viewMode]);

  const now = new Date();
  const currentHourStr = `${
    now.getHours() < 10 ? "0" : ""
  }${now.getHours()}:00`;

  return (
    <div className="flex flex-col bg-white rounded-8 shadow-md p-2 relative">
      <div className="flex flex-row items-center justify-between mb-2 px-4">
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={handlePrevious}
            className="text-gray-500 hover:bg-gray-200 flex items-center justify-center rounded-full w-8 h-8"
          >
            <FaChevronLeft className="inline-block" />
          </button>

          <button
            onClick={handleNext}
            className="text-gray-500 hover:bg-gray-200 flex items-center justify-center rounded-full w-8 h-8"
          >
            <FaChevronRight className="inline-block" />
          </button>
        </div>

        <span className="text-lg font-semibold">
          Cuộc hẹn tháng {month + 1}/{year}
        </span>

        <div className="flex flex-row items-center px-2 py-1 border border-gray-300 rounded-3xl cursor-pointer">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="cursor-pointer"
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
          </select>
        </div>
      </div>

      {viewMode === "month" && (
        <div className="grid grid-cols-7 gap-2 flex-grow">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const appointments = appointmentsByDate[day] || [];

            const sortedAppointments = appointments.sort((a, b) =>
              a.thoi_diem_bat_dau.localeCompare(b.thoi_diem_bat_dau)
            );

            const appointmentsToShow = sortedAppointments.slice(0, 2);

            const today = new Date();
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <div
                key={day}
                className="h-24 border rounded-lg p-2 flex flex-col hover:bg-gray-100 cursor-pointer overflow-hidden"
                onClick={() => openModal(day)}
              >
                <div className="flex justify-center mb-1">
                  {isToday ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold">
                      {day}
                    </div>
                  ) : (
                    <div className="text-sm font-bold">{day}</div>
                  )}
                </div>

                <div className="flex flex-col gap-1 overflow-hidden">
                  {appointmentsToShow.map((appointment, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          appointment.lam_viec_onl
                            ? "bg-blue-500"
                            : "bg-rose-500"
                        }`}
                      ></div>
                      <div className="text-xs">
                        {appointment.thoi_diem_bat_dau}
                      </div>
                    </div>
                  ))}
                  {appointments.length > 2 && (
                    <div className="text-xs text-gray-500">...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "week" && (
        <div>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th
                  className="p-2 border-b text-center"
                  style={{ width: "8%" }}
                ></th>
                {weekDates.map((date, idx) => {
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  return (
                    <th
                      key={idx}
                      className={`p-2 border-b text-center`}
                      style={{ width: "13.14%" }}
                    >
                      <div className="flex flex-col gap-2 justify-start">
                        <div className={`${isToday ? "text-blue-700" : ""}`}>
                          {days[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                        </div>
                        <div
                          className={`text-sm ${
                            isToday
                              ? "text-white bg-blue-700 rounded-full h-10 w-10 flex items-center justify-center m-auto"
                              : ""
                          }`}
                        >
                          {date.getDate()}/{date.getMonth() + 1}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
          </table>

          <div
            ref={timeTableRef}
            className="overflow-y-auto w-full h-auto max-h-[450px]"
          >
            <table className="table-auto w-full border-collapse">
              <tbody>
                {hours.map((hour, hIdx) => {
                  const isCurrentHour = hour === currentHourStr;
                  return (
                    <tr key={hIdx}>
                      <td
                        className={`p-1.5 text-center text-sm`}
                        style={{ width: "8%" }}
                      >
                        <span
                          className={`${
                            isCurrentHour
                              ? "bg-blue-700 text-white rounded-xl px-2 py-1"
                              : ""
                          }`}
                        >
                          {hour}
                        </span>
                      </td>
                      {weekDates.map((date, dIdx) => {
                        const appointments = getAppointmentsForDayHour(
                          date,
                          hour
                        );
                        return (
                          <td
                            key={dIdx}
                            className="border p-1 text-left text-xs"
                            style={{ width: "13.14%", height: "45px" }}
                          >
                            {appointments.map((appt, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 mb-1"
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    appt.lam_viec_onl
                                      ? "bg-blue-500"
                                      : "bg-rose-500"
                                  }`}
                                ></div>
                                <span>
                                  {appt.thoi_diem_bat_dau} -{" "}
                                  <span className="text-xs">
                                    {appt.ten_benh_nhan}
                                  </span>
                                </span>
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedDay !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-h-[80%] overflow-y-auto w-80 relative">
            <button
              className="absolute top-2 right-5 text-gray-600"
              onClick={closeModal}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 mx-auto text-center">
              {selectedDay}/{month + 1}/{year}
            </h2>

            {(appointmentsByDate[selectedDay] || []).length > 0 ? (
              <div className="flex flex-col gap-2">
                {appointmentsByDate[selectedDay]
                  .sort((a, b) =>
                    a.thoi_diem_bat_dau.localeCompare(b.thoi_diem_bat_dau)
                  )
                  .map((appointment, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                      onClick={() => {
                        navigate(`/historyDetail/${appointment.id}`);
                      }}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          appointment.lam_viec_onl
                            ? "bg-blue-500"
                            : "bg-rose-500"
                        }`}
                      ></div>
                      <div className="text-sm">
                        {appointment.thoi_diem_bat_dau}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.ten_benh_nhan}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Không có cuộc hẹn.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DoctorHomepage = () => {
  /* Trang gồm có 2 phần: Thống kê và Danh sách cuộc hẹn trong tuần */
  const [countByMethod, setCountByMethod] = useState({
    onlineAppointment: 0,
    offlineAppointment: 0,
  });
  const [appointmentList, setAppointmentList] = useState<AppoinmentItem[]>([]);
  const [statisBy, setStatisBy] = useState<string>("month"); // month or year
  const [statisticValues, setStatisticValues] = useState<
    StatisticByMonth[] | StatisticByYear[]
  >([]); // Dữ liệu thống kê theo tháng hoặc năm
  // Chart data
  const [methodChartData, setMethodChartData] = useState({
    labels: ["Trực tuyến", "Trực tiếp"],
    datasets: [
      {
        data: [
          countByMethod.onlineAppointment,
          countByMethod.offlineAppointment,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  });

  // Data cho biểu đồ cột
  const [barChartData, setBarChartData] = useState({
    labels: statisticValues.map((item) =>
      "thang" in item ? `${item.thang}` : `${item.nam}`
    ),
    datasets: [
      {
        label: "Số lượng cuộc hẹn",
        data: statisticValues.map((item) => item.tong_so_cuoc_hen),
        backgroundColor: "#36A2EB",
      },
    ],
  });

  // Cho Pie chart
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];
  const [viewMode, setViewMode] = useState("month"); // 'month' | 'year'
  const [selectedMonthPie, setSelectedMonthPie] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYearPie, setSelectedYearPie] = useState(currentYear);

  useEffect(() => {
    const fecthMethodCount = async () => {
      const doctorID = localStorage.getItem("id");
      let response;
      if (viewMode === "month") {
        response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/method/${selectedMonthPie}/${selectedYearPie}/${doctorID}`,
          {
            method: "GET",
          }
        );
      } else {
        response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/method/${selectedYearPie}/${doctorID}`,
          {
            method: "GET",
          }
        );
      }

      if (!response.ok) {
        console.log(response);
        return;
      }

      const data = await response.json();
      console.log(data);

      setCountByMethod({
        onlineAppointment: data[0].so_cuoc_hen_onl ?? 0,
        offlineAppointment: data[0].so_cuoc_hen_khong_onl ?? 0,
      });
    };

    fecthMethodCount();
  }, [viewMode, selectedMonthPie, selectedYearPie]);

  // useEffect(() => {
  //   const updateData = async () => {
  //     const data = await fetchDataByTime(timeRange);
  //     setChartData(data);
  //   };
  //   updateData();
  // }, [timeRange]);

  useEffect(() => {
    setBarChartData({
      labels: statisticValues.map((item) =>
        "thang" in item ? `T${item.thang}` : `${item.nam}`
      ),
      datasets: [
        {
          label: "Số lượng cuộc hẹn",
          data: statisticValues.map((item) => item.tong_so_cuoc_hen),
          backgroundColor: "#36A2EB",
        },
      ],
    });
  }, [statisticValues]);

  useEffect(() => {
    const getStatistic = async () => {
      const doctorID = localStorage.getItem("id");
      let response;
      if (statisBy === "month") {
        let thisYear = new Date().getFullYear();
        console.log("thisYear", thisYear);
        response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/month/${thisYear}/doctor/${doctorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/year/doctor/${doctorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.ok) {
        const data = await response.json();

        if (statisBy === "month") {
          // Nếu statisBy là "month", thì data phải đủ 12 tháng, nếu không thì thêm các tháng còn thiếu vào data với giá trị 0
          const monthsInYear = Array.from({ length: 12 }, (_, i) => i + 1);
          // console.log("monthsInYear", monthsInYear);
          const monthData = monthsInYear.map((month) => {
            const foundMonth = data.find((item: StatisticByMonth) => {
              // console.log("item", item);
              return item.thang === month;
            });
            return foundMonth || { thang: month, tong_so_cuoc_hen: 0 };
          });
          // console.log("monthData", monthData);
          setStatisticValues(monthData);
        } else {
          // Nếu statisBy là "year", thì data phải đủ 5 năm, nếu không thì thêm các năm còn thiếu vào data với giá trị 0
          const currentYear = new Date().getFullYear();
          const yearsInRange = Array.from(
            { length: 5 },
            (_, i) => currentYear - i
          );
          const yearData = yearsInRange.map((year) => {
            const foundYear = data.find((item: StatisticByYear) => {
              return item.nam === year;
            });
            return foundYear || { nam: year, tong_so_cuoc_hen: 0 };
          });

          //Đảo ngược lại để hiển thị năm gần nhất ở bên trái
          yearData.reverse();
          setStatisticValues(yearData);
        }
      } else {
        console.error("Error fetching statistic data:", response.statusText);
      }
    };
    getStatistic();
  }, [statisBy]);

  // Lấy số lượng cuộc hẹn theo trạng thái
  const fetchCountByStatus = async () => {
    try {
      const doctorID = localStorage.getItem("id");

      // Gọi đồng thời cả hai API với status=completed và status=canceled
      const [completedResponse, canceledResponse] = await Promise.all([
        fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/countAppointmentByStatus?status=2&doctorID=${doctorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
        fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/countAppointmentByStatus?status=3&doctorID=${doctorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      // Kiểm tra nếu cả hai response đều ok
      if (completedResponse.ok && canceledResponse.ok) {
        const [completedData, canceledData] = await Promise.all([
          completedResponse.json(),
          canceledResponse.json(),
        ]);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {
    fetchCountByStatus(); // Gọi hàm lấy dữ liệu khi component được mount
  }, []);

  useEffect(() => {
    console.log("Set Method Chart Data with countByMethod:", countByMethod);
    setMethodChartData({
      labels: ["Trực tuyến", "Trực tiếp"],
      datasets: [
        {
          data: [
            countByMethod.onlineAppointment,
            countByMethod.offlineAppointment,
          ],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    });
  }, [countByMethod]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  return (
    <div className="flex flex-col h-full bg-gray-100 p-2 gap-2 pb-0">
      {/* Phần thống kê gồm 2 biểu đồ và 1 ô hiển thị số liệu
     Biểu đồ tròn thể hiện số ca hẹn trực tuyến và trực tiếp
     Biểu đồ tròn thể hiện số ca hẹn 'Đang chờ', 'Hoàn thành', 'Đã hủy'
    //Ô hiển thị số liệu thể hiện số ca 'Đang chờ' trong hôm nay*/}
      <div className="flex flex-row gap-2">
        {/* Biểu đồ thống kê số ca hẹn trực tuyến và trực tiếp */}
        <div className="w-1/2 h-full flex-row items-center justify-center p-2 bg-white rounded-8 shadow-md">
          {/* Controls */}
          <div className="flex gap-2 items-center justify-end">
            <select
              className="border rounded p-1 text-sm"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>

            {viewMode === "month" && (
              <select
                className="border rounded p-1 text-sm"
                value={selectedMonthPie}
                onChange={(e) => setSelectedMonthPie(Number(e.target.value))}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}

            <select
              className="border rounded p-1 text-sm"
              value={selectedYearPie}
              onChange={(e) => setSelectedYearPie(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Chart */}
          <div className="flex-1">
            <Pie
              data={methodChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  datalabels: {
                    display: true,
                    color: "#fff",
                    formatter: (value: number, ctx: any) => {
                      const total = ctx.chart.data.datasets[0].data.reduce(
                        (a: number, b: number) => a + b,
                        0
                      );
                      return total
                        ? `${((value / total) * 100).toFixed(2)}%`
                        : "0%";
                    },
                  },
                },
                aspectRatio: 1,
              }}
            />
          </div>
        </div>
        {/* Biểu đồ cột số lượng theo tháng/năm */}
        <div className="w-1/2 h-full flex-row items-center justify-center p-2 bg-white rounded-8 shadow-md">
          {/* Phần chọn thống kê theo tháng hoặc năm */}
          <div className="flex justify-end">
            <select
              value={statisBy}
              onChange={(e) => setStatisBy(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              <option value="month">Thống kê theo tháng</option>
              <option value="year">Thống kê theo năm</option>
            </select>
          </div>
          <div>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text:
                      statisBy === "month"
                        ? "Số lượng theo tháng"
                        : "Số lượng theo năm",
                    font: { size: 18 },
                  },
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      {/* Phần danh sách cuộc hẹn trong tuần: Sẽ là 1 bảng chứa danh sách các cuộc hẹn của 1 thứ, có 1 ô để chọn thứ, mặc định là thứ hôm nay */}
      <CalendarView />
    </div>
  );
};

export default DoctorHomepage;
