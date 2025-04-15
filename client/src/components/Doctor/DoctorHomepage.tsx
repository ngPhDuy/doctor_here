import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin datalabels
import { FaRegCalendar, FaRegCalendarCheck } from "react-icons/fa6";

// Đảm bảo đăng ký các thành phần của Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  ChartDataLabels
);

interface AppoinmentItem {
  id: number;
  trang_thai: string;
  ngay_lam_viec: string;
  thoi_diem_bat_dau: string;
  lam_viec_onl: boolean;
  ten_benh_nhan: string; // Tên bệnh nhân (nếu cần thiết)
}

const DoctorHomepage = () => {
  /* Trang gồm có 2 phần: Thống kê và Danh sách cuộc hẹn trong tuần */
  const navigate = useNavigate();
  const location = useLocation();
  const [countByMethod, setCountByMethod] = useState({
    onlineAppointment: 0,
    offlineAppointment: 0,
  });
  const [countByStatus, setCountByStatus] = useState({
    completedAppointment: 0,
    canceledAppointment: 0,
  });
  const [waitingToday, setWaitingToday] = useState(0);
  const [appointmentList, setAppointmentList] = useState<AppoinmentItem[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppoinmentItem[]
  >([]);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
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
  const [statusChartData, setStatusChartData] = useState({
    labels: ["Hoàn thành", "Đã hủy"],
    datasets: [
      {
        data: [
          countByStatus.completedAppointment,
          countByStatus.canceledAppointment,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  });
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Hiển thị 5 mục mỗi trang

  // Tính toán các mục hiển thị cho trang hiện tại
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Thay đổi trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Số lượng trang tổng cộng
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const fetchData = async () => {
    // Lấy danh sách cuộc hẹn từ API: api/appointment/getAppointmentSchedule?startDate1&endDate&doctorID
    //StartDate là ngày đầu tuần (thứ 2) của tuần hiện tại, EndDate là ngày cuối tuần (Chủ nhật) của tuần hiện tại
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Thứ 2
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 7); // Chủ nhật
    console.log(
      `StartDate: ${startDate.toISOString()}, EndDate: ${endDate.toISOString()}`
    );
    let appointmentList: AppoinmentItem[] = [];

    fetch(
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
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        appointmentList = data.map((item: any) => ({
          id: item.id,
          trang_thai: item.trang_thai,
          ngay_lam_viec: item.Gio_hen.ngay_lam_viec,
          //Chuyển giờ Việt Nam và trích ra giờ HH:MM
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
        setAppointmentList(appointmentList);

        let countWaitingToday = 0;
        appointmentList.forEach((appointment) => {
          if (appointment.trang_thai === "Đang chờ") {
            countWaitingToday++;
          }
        });
        setWaitingToday(countWaitingToday); // Cập nhật số ca hẹn đang chờ trong hôm nay
      })
      .catch((error) => {
        console.error("Error fetching appointment data:", error);
      });
  };

  // Lấy số lượng cuộc hẹn theo phương thức
  const fetchCountByMethod = async () => {
    try {
      const doctorID = localStorage.getItem("id");

      // Gọi đồng thời cả hai API với onlMethod=true và onlMethod=false
      const [onlineResponse, offlineResponse] = await Promise.all([
        fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/appointment/countAppointmentByMethod?onlMethod=true&doctorID=${doctorID}`,
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
          }/api/appointment/countAppointmentByMethod?onlMethod=false&doctorID=${doctorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      // Kiểm tra nếu cả hai response đều ok
      if (onlineResponse.ok && offlineResponse.ok) {
        const [onlineData, offlineData] = await Promise.all([
          onlineResponse.json(),
          offlineResponse.json(),
        ]);

        console.log("Online Data:", onlineData); // Kiểm tra dữ liệu trả về
        console.log("Offline Data:", offlineData); // Kiểm tra dữ liệu trả về

        // Set dữ liệu sau khi cả hai API đã hoàn thành
        setCountByMethod({
          onlineAppointment: onlineData.count,
          offlineAppointment: offlineData.count,
        });
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

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

        // Set dữ liệu sau khi cả hai API đã hoàn thành
        setCountByStatus({
          completedAppointment: completedData.count,
          canceledAppointment: canceledData.count,
        });
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Gọi hàm lấy dữ liệu khi component được mount
  }, []);

  useEffect(() => {
    fetchCountByMethod(); // Gọi hàm lấy dữ liệu khi component được mount
  }, []);

  useEffect(() => {
    fetchCountByStatus(); // Gọi hàm lấy dữ liệu khi component được mount
  }, []);

  useEffect(() => {
    // Lọc danh sách cuộc hẹn theo ngày trong tuần
    const filteredAppointments = appointmentList.filter((appointment) => {
      const appointmentDate = new Date(appointment.ngay_lam_viec);
      return appointmentDate.getDay() === selectedDay;
    });

    setFilteredAppointments(filteredAppointments); // Cập nhật danh sách các cuộc hẹn đã lọc
  }, [appointmentList, selectedDay]);

  useEffect(() => {
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

  useEffect(() => {
    setStatusChartData({
      labels: ["Hoàn thành", "Đã hủy"],
      datasets: [
        {
          data: [
            countByStatus.completedAppointment,
            countByStatus.canceledAppointment,
          ],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    });
  }, [countByStatus]);

  return (
    <div className="flex flex-col h-full bg-gray-100 p-2 gap-2 pb-0">
      {/* Phần thống kê gồm 2 biểu đồ và 1 ô hiển thị số liệu
     Biểu đồ tròn thể hiện số ca hẹn trực tuyến và trực tiếp
     Biểu đồ tròn thể hiện số ca hẹn 'Đang chờ', 'Hoàn thành', 'Đã hủy'
    //Ô hiển thị số liệu thể hiện số ca 'Đang chờ' trong hôm nay*/}
      <div className="flex flex-row h-1/3 gap-2">
        {/* Biểu đồ thống kê số ca hẹn trực tuyến và trực tiếp */}
        <div className="w-1/3 h-full flex items-center justify-center py-2 bg-white rounded-8 shadow-md">
          <Pie
            data={methodChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: false,
                  text: "Phương thức hẹn",
                  font: {
                    size: 20,
                  },
                },
                datalabels: {
                  display: true,
                  color: "#fff",
                  formatter: (value: number, ctx: any) => {
                    let total = 0;
                    ctx.chart.data.datasets[0].data.forEach((data: number) => {
                      total += data;
                    });
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${percentage}%`; // Hiển thị phần trăm
                  },
                },
              },
              aspectRatio: 1,
            }}
            width={100}
          />
        </div>
        {/* Biểu đồ thống kê số ca hẹn 'Đang chờ', 'Hoàn thành', 'Đã hủy' */}
        <div className="w-1/3 h-full flex items-center justify-center py-2 bg-white rounded-8 shadow-md">
          <Pie
            data={statusChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: false,
                  text: "Tình trạng hẹn",
                  font: {
                    size: 20,
                  },
                },
                datalabels: {
                  display: true,
                  color: "#fff",
                  formatter: (value: number, ctx: any) => {
                    let total = 0;
                    ctx.chart.data.datasets[0].data.forEach((data: number) => {
                      total += data;
                    });
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${percentage}%`; // Hiển thị phần trăm
                  },
                },
              },
              aspectRatio: 1,
            }}
            width={100}
          />
        </div>
        <div className="w-1/3 flex flex-col items-center justify-center py-2 bg-white rounded-8 shadow-md">
          <span className="text-3xl font-semibold">{waitingToday}</span>
          <span className="text-lg">Ca hẹn đang chờ</span>
        </div>
      </div>
      {/* Phần danh sách cuộc hẹn trong tuần: Sẽ là 1 bảng chứa danh sách các cuộc hẹn của 1 thứ, có 1 ô để chọn thứ, mặc định là thứ hôm nay */}
      <div className="flex flex-col h-2/3 bg-white rounded-8 shadow-md p-2">
        <div className="flex flex-row items-center justify-between mb-2">
          <span className="text-lg font-semibold">Cuộc hẹn tuần này</span>
          <div className="flex flex-row items-center gap-2">
            <span className="text-lg font-semibold">Chọn thứ:</span>
            <select
              name="day"
              id="day"
              className="border border-gray-300 rounded-lg px-2 py-1"
              value={selectedDay} // Sử dụng value thay vì selected
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            >
              {[
                "Chủ nhật",
                "Thứ 2",
                "Thứ 3",
                "Thứ 4",
                "Thứ 5",
                "Thứ 6",
                "Thứ 7",
              ].map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
        {currentAppointments.length === 0 ? (
          <div className="text-center text-lg">
            Không có cuộc hẹn nào trong ngày này
          </div>
        ) : (
          <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
            <thead className="text-gray-600 text-base bg-gray-100">
              <tr className="border-b border-gray-300">
                <th className="py-2">STT</th>
                <th className="py-2">Thời gian</th>
                <th className="py-2">Bệnh nhân</th>
                <th className="py-2">Phương thức</th>
                <th className="py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appointment, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-gray-100 cursor-pointer"
                  //navigate to appointment detail page: historyDetail/id
                  onClick={() => navigate(`/historyDetail/${appointment.id}`)}
                >
                  <td className="py-3">
                    {index + 1 + indexOfFirstAppointment}
                  </td>
                  <td className="py-3">{appointment.thoi_diem_bat_dau}</td>
                  <td className="py-3">{appointment.ten_benh_nhan}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.lam_viec_onl
                          ? "bg-rose-200 text-rose-600"
                          : "bg-blue-200 text-blue-700"
                      }`}
                    >
                      {appointment.lam_viec_onl ? "Trực tuyến" : "Trực tiếp"}
                    </span>
                  </td>
                  <td className="py-3 flex items-center justify-center">
                    {appointment.trang_thai === "Đang chờ" ? (
                      <FaRegCalendar className="text-yellow-500" />
                    ) : (
                      <FaRegCalendarCheck className="text-green-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <>
            {/* Phân trang */}
            <div className="flex justify-end mt-2 space-x-4 text-sm">
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
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorHomepage;
