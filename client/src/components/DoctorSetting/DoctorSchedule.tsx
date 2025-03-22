import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "./NavBar";

//Dữ liệu mẫu giờ làm việc của bác sĩ bao gồm: thứ, từ giờ đến giờ, trạng thái (online/offline)
const workSchedule = [
  { id: 1, start: "06:00", end: "08:00", status: "offline", day: "Thứ 2" },
  { id: 2, start: "14:00", end: "18:00", status: "offline", day: "Thứ 2" },
  { id: 3, start: "08:00", end: "12:00", status: "online", day: "Thứ 3" },
  { id: 4, start: "14:00", end: "18:00", status: "offline", day: "Thứ 3" },
  { id: 5, start: "08:00", end: "12:00", status: "online", day: "Thứ 4" },
  { id: 6, start: "14:00", end: "18:00", status: "offline", day: "Thứ 4" },
  { id: 7, start: "08:00", end: "12:00", status: "online", day: "Thứ 5" },
  { id: 8, start: "14:00", end: "18:00", status: "offline", day: "Thứ 5" },
  { id: 9, start: "08:00", end: "12:00", status: "online", day: "Thứ 6" },
  { id: 10, start: "14:00", end: "18:00", status: "offline", day: "Thứ 6" },
  { id: 11, start: "08:00", end: "12:00", status: "online", day: "Thứ 7" },
  { id: 12, start: "14:00", end: "18:00", status: "offline", day: "Thứ 7" },
  { id: 13, start: "08:00", end: "12:00", status: "online", day: "Chủ nhật" },
  { id: 14, start: "14:00", end: "18:00", status: "offline", day: "Chủ nhật" },
];

interface WorkTime {
  id: number;
  day: string;
  start: string;
  end: string;
  status: string;
  active: boolean;
}

interface WorkTimeModalProps {
  workTime: WorkTime;
  onClose: () => void;
  onSave: (updatedWorkTime: WorkTime) => void;
  onDelete: (id: number) => void;
}

interface ServerResponse {
  id: number; // ID của lịch làm việc
  thu: string; // Ngày trong tuần (ví dụ: "Thứ 2", "Thứ 3", ...)
  gio_bat_dau: string; // Giờ bắt đầu (định dạng "HH:mm:ss")
  gio_ket_thuc: string; // Giờ kết thúc (định dạng "HH:mm:ss")
  lam_viec_onl: boolean; // Trạng thái làm việc (online/offline)
  hieu_luc: boolean; // Trạng thái hiệu lực (true/false)
}

const WorkTimeModal: React.FC<WorkTimeModalProps> = ({
  workTime,
  onClose,
  onSave,
  onDelete,
}) => {
  const [newWorkTime, setNewWorkTime] = useState(workTime);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Nếu là type time thì chỉ lấy h sau đó đảm bảo HH:mm
    if (name === "start" || name === "end") {
      const hour = value.split(":")[0];
      setNewWorkTime((prev) => ({ ...prev, [name]: `${hour}:00` }));
      return;
    }
    // console.log(name, value);
    setNewWorkTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // console.log(newWorkTime);
    onSave(newWorkTime); // Lưu thay đổi và đóng modal
    onClose();
  };

  const handleDelete = () => {
    onDelete(workTime.id); // Xóa khung giờ và đóng modal
    onClose();
  };

  // Đóng modal khi click vào background
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose(); // Đóng modal khi click vào vùng ngoài modal
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick} // Thêm sự kiện click để đóng modal khi click ngoài
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Ngừng sự kiện click khi click vào nội dung modal
      >
        <h3 className="text-lg font-semibold mb-4">
          Chỉnh sửa khung giờ làm việc
        </h3>
        <form>
          <label className="text-sm font-semibold mb-1">Thứ</label>
          <input
            type="text"
            name="day"
            value={newWorkTime.day}
            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            readOnly
          />

          <label className="text-sm font-semibold mb-1">Giờ bắt đầu</label>
          <input
            type="time"
            name="start"
            value={
              newWorkTime.start.length === 4
                ? "0" + newWorkTime.start
                : newWorkTime.start
            }
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
          />

          <label className="text-sm font-semibold mb-1">Giờ kết thúc</label>
          <input
            type="time"
            name="end"
            value={
              newWorkTime.end.length === 4
                ? "0" + newWorkTime.end
                : newWorkTime.end
            }
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
          />

          <label className="text-sm font-semibold mb-1">Trạng thái</label>
          <select
            name="status"
            value={newWorkTime.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
          >
            <option value="online">Trực tuyến</option>
            <option value="offline">Trực tiếp</option>
          </select>

          {/* Các nút Lưu và Xóa */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Xóa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Hàm chuyển đổi từ kiểu server về kiểu client
const convertToClientFormat = (serverData: ServerResponse[]) => {
  return serverData.map((schedule) => {
    // Tách giờ ra để đảm bảo định dạng HH:mm
    const startTime = schedule.gio_bat_dau.slice(0, 5);
    const endTime = schedule.gio_ket_thuc.slice(0, 5);

    // Xác định trạng thái làm việc
    const status = schedule.lam_viec_onl ? "online" : "offline";
    const active = schedule.hieu_luc;

    // Trả về kết quả với các trường theo định dạng của client
    return {
      id: schedule.id,
      start: startTime,
      end: endTime,
      status: status,
      day: schedule.thu, // Chuyển từ "thu" sang "day"
      active: active,
    };
  });
};

const DoctorSchedule: React.FC = () => {
  const [isShowAddForm, setShowAddForm] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<any>([]);
  const [selectedWorkTime, setSelectedWorkTime] = useState<WorkTime | null>(
    null
  );
  const navigate = useNavigate();
  const mergedCells: Set<string> = new Set();
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

  useEffect(() => {
    // Lấy dữ liệu từ server ${import.meta.env.VITE_API_BASE_URL}/api/drSchedule/doctor/${id || "BS0000001"}
    const id = localStorage.getItem("id");
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/drSchedule/doctor/${
        id || "BS0000001"
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const clientData = convertToClientFormat(data);
        setSchedule(clientData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // Hàm để kiểm tra trạng thái làm việc tại một khung giờ và ngày
  const getInfo = (day: string, hour: string) => {
    // console.log(typeof schedule);
    // console.log(schedule);
    const rs = schedule.find(
      (item: WorkTime) => item.day === day && item.start === hour
    );

    if (!rs)
      return {
        status: null,
        id: null,
        active: null,
      };
    else {
      return {
        status: rs.status,
        id: rs.id,
        active: rs.active,
      };
    }
  };

  // Hàm để xác định các ô có thể gộp lại
  const getRowSpan = (day: string, hour: string) => {
    const workTime = schedule.find((item: WorkTime) => {
      return item.day === day && item.start === hour;
    });

    if (!workTime) {
      return 1;
    }

    const end = parseInt(workTime.end.split(":")[0]);
    const start = parseInt(workTime.start.split(":")[0]);

    return end - start;
  };

  const handleEditWorkTime = (id: number) => {
    const workTime = schedule.find((item: WorkTime) => item.id === id);
    if (workTime) {
      setSelectedWorkTime(workTime);
    }
  };

  const handleSave = (updatedWorkTime: WorkTime) => {
    // console.log(updatedWorkTime);
    const existingWorkTimes = schedule.filter(
      (item: WorkTime) =>
        item.day === updatedWorkTime.day && item.id !== updatedWorkTime.id
    );
    const newStart = parseInt(updatedWorkTime.start.split(":")[0]);
    const newEnd = parseInt(updatedWorkTime.end.split(":")[0]);
    const isOverlap = existingWorkTimes.some((item: WorkTime) => {
      const start = parseInt(item.start.split(":")[0]);
      const end = parseInt(item.end.split(":")[0]);
      return newStart < end && newEnd > start;
    });

    if (isOverlap) {
      Swal.fire({
        icon: "error",
        title: "Khung giờ làm việc bị trùng!",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    // call API để cập nhật lịch làm việc
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/drSchedule`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: updatedWorkTime.id,
        gio_bat_dau: updatedWorkTime.start,
        gio_ket_thuc: updatedWorkTime.end,
        lam_viec_onl: updatedWorkTime.status === "online",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const clientData = convertToClientFormat([data]);
        const updatedSchedule = schedule.map((item: WorkTime) => {
          if (item.id === updatedWorkTime.id) {
            return clientData[0];
          }
          return item;
        });

        setSchedule(updatedSchedule);

        Swal.fire({
          icon: "success",
          title: "Cập nhật khung giờ thành công!",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // const updatedSchedule = schedule.map((item: WorkTime) => {
    //   if (item.id === updatedWorkTime.id) {
    //     return updatedWorkTime;
    //   }
    //   return item;
    // });
    // console.log(updatedSchedule);
    // setSchedule(updatedSchedule);
    // Swal.fire({
    //   icon: "success",
    //   title: "Cập nhật khung giờ thành công!",
    //   showConfirmButton: false,
    //   timer: 1000,
    // });
  };

  const handleDelete = (id: number) => {
    console.log("Xóa khung giờ", id);
    // Xác nhận xóa
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // Xác nhận xóa
        deleteWorkTime(id);
      }
    });
  };

  const deleteWorkTime = (id: number) => {
    // call api
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/drSchedule/schedule/${id}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const updatedSchedule = schedule.filter(
          (item: WorkTime) => item.id !== id
        );
        setSchedule(updatedSchedule);
        Swal.fire({
          icon: "success",
          title: "Xóa khung giờ thành công!",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  //Modal AddForm
  const AddForm: React.FC = () => {
    const [newWorkTime, setNewWorkTime] = useState({
      day: "Thứ 2",
      start: "",
      end: "",
      status: "online",
    });

    const handleAddWorkTime = () => {
      // Lógica thêm giờ làm việc
      console.log("Thêm giờ làm việc", newWorkTime);
      const newId = schedule.length + 1;
      const existingWorkTimes = schedule.filter(
        (item: WorkTime) => item.day === newWorkTime.day
      );
      const newStart = parseInt(newWorkTime.start.split(":")[0]);
      const newEnd = parseInt(newWorkTime.end.split(":")[0]);
      const isOverlap = existingWorkTimes.some((item: WorkTime) => {
        const start = parseInt(item.start.split(":")[0]);
        const end = parseInt(item.end.split(":")[0]);
        return newStart < end && newEnd > start;
      });

      if (isOverlap) {
        Swal.fire({
          icon: "error",
          title: "Khung giờ làm việc bị trùng!",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      //gọi api để thêm khung giờ làm việc
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/drSchedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ma_bac_si: localStorage.getItem("id")
            ? localStorage.getItem("id")
            : "BS0000001",
          thu: newWorkTime.day,
          gio_bat_dau: newWorkTime.start,
          gio_ket_thuc: newWorkTime.end,
          lam_viec_onl: newWorkTime.status === "online",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const clientData = convertToClientFormat([data]);
          const updatedSchedule = [...schedule, clientData[0]];
          setSchedule(updatedSchedule);
          setShowAddForm(false);
          Swal.fire({
            icon: "success",
            title: "Thêm khung giờ thành công!",
            showConfirmButton: false,
            timer: 1000,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // const newWorkTimeData = {
      //   id: newId,
      //   day: newWorkTime.day,
      //   start: newWorkTime.start,
      //   end: newWorkTime.end,
      //   status: newWorkTime.status,
      // };

      // const updatedSchedule = [...schedule, newWorkTimeData];
      // console.log(updatedSchedule);
      // setSchedule(updatedSchedule);
      // // Đóng modal
      // setShowAddForm(false);
      // Swal.fire({
      //   icon: "success",
      //   title: "Thêm khung giờ thành công!",
      //   showConfirmButton: false,
      //   timer: 1000,
      // });
    };

    return (
      <div>
        {/* Modal */}
        {isShowAddForm && (
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowAddForm(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()} // Ngừng sự kiện click từ việc đóng modal khi nhấn vào form
            >
              <h3 className="text-lg font-semibold mb-4">Thêm giờ làm việc</h3>
              <form>
                <label className="text-sm font-semibold mb-1">Thứ</label>
                <select
                  className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                  value={newWorkTime.day}
                  onChange={(e) =>
                    setNewWorkTime({ ...newWorkTime, day: e.target.value })
                  }
                >
                  <option value="Thứ 2">Thứ 2</option>
                  <option value="Thứ 3">Thứ 3</option>
                  <option value="Thứ 4">Thứ 4</option>
                  <option value="Thứ 5">Thứ 5</option>
                  <option value="Thứ 6">Thứ 6</option>
                  <option value="Thứ 7">Thứ 7</option>
                  <option value="Chủ nhật">Chủ nhật</option>
                </select>

                <label className="text-sm font-semibold mb-1">Từ giờ</label>
                <input
                  type="time"
                  className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                  value={newWorkTime.start}
                  onChange={(e) => {
                    const hour = e.target.value.split(":")[0]; // Lấy giờ (phần trước dấu ":")
                    setNewWorkTime({ ...newWorkTime, start: `${hour}:00` });
                  }}
                />

                <label className="text-sm font-semibold mb-1">Đến giờ</label>
                <input
                  type="time"
                  className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                  value={newWorkTime.end}
                  onChange={(e) => {
                    const hour = e.target.value.split(":")[0]; // Lấy giờ (phần trước dấu ":")
                    setNewWorkTime({ ...newWorkTime, end: `${hour}:00` });
                  }}
                />

                <label className="text-sm font-semibold mb-1">Trạng thái</label>
                <select
                  className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                  value={newWorkTime.status}
                  onChange={(e) =>
                    setNewWorkTime({ ...newWorkTime, status: e.target.value })
                  }
                >
                  <option value="online">Trực tuyến</option>
                  <option value="offline">Trực tiếp</option>
                </select>

                <button
                  type="button"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mt-4"
                  onClick={handleAddWorkTime}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-black py-2 px-4 rounded-md w-full mt-2"
                  onClick={() => setShowAddForm(false)}
                >
                  Hủy
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  //Return DoctorSchedule
  return (
    <div className="h-full bg-gray-100 pt-4 ps-4 pe-2">
      <NavBar curPage="schedule" />
      <div
        className="bg-white p-4 rounded-lg shadow-md overflow-y-auto"
        // style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-center flex-1">
            Bảng thời gian làm việc
          </h2>
        </div>
        {/* Nút thêm */}
        <button
          className="p-2 bg-blue-600 text-white font-semibold rounded mb-1 text-sm"
          onClick={() => setShowAddForm(!isShowAddForm)}
        >
          Thêm khung giờ
        </button>
        {/* Bảng thời gian làm việc */}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th
                className="p-2 border-b text-center"
                style={{ width: "12.5%" }}
              >
                Giờ
              </th>
              {days.map((day, index) => (
                <th key={index} className="p-2 border-b text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 19rem)" }}
        >
          <table className="table-auto w-full border-collapse">
            <tbody>
              {hours.map((hour, index) => (
                <tr key={index}>
                  <td
                    className="p-2 text-center h-5 text-sm"
                    style={{ width: "12.5%" }}
                  >
                    {hour}
                  </td>
                  {days.map((day, dayIndex) => {
                    const info = getInfo(day, hour);
                    const status = info?.status;
                    const id = info?.id;
                    const active = info?.active;
                    // console.log(day + " " + hour + " " + status + " " + id);
                    const rowSpan = getRowSpan(day, hour); // Lấy rowSpan cho ô này
                    const cellKey = `${day}-${hour}`;
                    // console.log(hour);

                    // Nếu ô đã được gộp, không render lại
                    if (mergedCells.has(cellKey)) {
                      // console.log("Skip", cellKey);
                      return null;
                    }

                    // Nếu rowSpan > 1, thì đánh dấu các ô đã được gộp
                    if (rowSpan > 1) {
                      for (let i = 1; i < rowSpan; i++) {
                        let nextHour = parseInt(hour.split(":")[0]) + i;
                        let str = "";
                        if (nextHour < 10) {
                          str = "0" + nextHour + ":00";
                        } else {
                          str = nextHour + ":00";
                        }
                        mergedCells.add(`${day}-${str}`);
                      }
                    }

                    // console.log(mergedCells);

                    return (
                      <td
                        key={dayIndex}
                        className={`box-border text-center h-5 border-x border-y ${
                          status !== null ? "pe-4 pb-3" : ""
                        }`}
                        rowSpan={rowSpan > 1 ? rowSpan : undefined} // Sử dụng rowSpan nếu có
                        onClick={() => handleEditWorkTime(id)}
                        style={{ width: "12.5%" }}
                      >
                        {status !== null && (
                          <div
                            className={`${
                              !active
                                ? "bg-gray-200 text-gray-800"
                                : status === "online"
                                ? "bg-green-500 text-white"
                                : "bg-amber-500 text-white"
                            } cursor-pointer rounded-md px-2 py-1 w-full flex items-center justify-center flex-grow`}
                            style={{ height: "100%" }}
                          >
                            {status === "online" && "Trực tuyến"}
                            {status === "offline" && "Trực tiếp"}
                          </div>
                        )}
                        {/* {status === null && (
                        <hr className="border-t-1 border-gray-300" />
                      )} */}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {<AddForm />}
      {/* Hiển thị Modal nếu có workTime được chọn */}
      {selectedWorkTime && (
        <WorkTimeModal
          workTime={selectedWorkTime}
          onClose={() => setSelectedWorkTime(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
export default DoctorSchedule;
