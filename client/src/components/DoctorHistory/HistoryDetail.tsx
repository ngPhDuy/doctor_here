import React, { useState, useEffect } from "react";
import { FaPhone } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface Appointment {
  id: number;
  van_ban_bo_sung: string;
  dia_chi_phong_kham: string;
  trang_thai: string;
  thoi_diem_tao: string;
  ma_bac_si: string;
  ma_benh_nhan_dat_hen: string;
  id_gio_hen: number;

  // Thông tin bệnh nhân
  benh_nhan_cccd: string;
  benh_nhan_dan_toc: string;
  benh_nhan_nhom_mau: string;
  benh_nhan_tien_su_benh: string;
  benh_nhan_quoc_tich: string;
  benh_nhan_dia_chi: string;
  benh_nhan_ma_benh_nhan: string;

  // Thông tin người dùng của bệnh nhân
  benh_nhan_ten_dang_nhap: string;
  benh_nhan_email: string;
  benh_nhan_sdt: string;
  benh_nhan_ngay_sinh: string;
  benh_nhan_gioi_tinh: string;
  benh_nhan_phan_loai: string;
  benh_nhan_ho_va_ten: string;
  benh_nhan_avt_url: string;

  // Thông tin bác sĩ
  bac_si_ngay_vao_nghe: string;
  bac_si_trinh_do_hoc_van: string;
  bac_si_mo_ta: string;
  bac_si_dia_chi_pk: string;
  bac_si_ma_bac_si: string;
  bac_si_chuyen_khoa: string;

  // Thông tin giờ hẹn
  gio_hen_thoi_diem_bat_dau: string;
  gio_hen_thoi_diem_ket_thuc: string;
  gio_hen_ngay_lam_viec: string;
  gio_hen_available: boolean;
  gio_hen_id_ca_lam_viec: number;
  ca_lam_viec_lam_viec_onl: boolean;
  hinh_anh_bo_sung: string[];
}

const defaultAppointment: Appointment = {
  id: 0,
  van_ban_bo_sung: "",
  dia_chi_phong_kham: "",
  trang_thai: "",
  thoi_diem_tao: "",
  ma_bac_si: "",
  ma_benh_nhan_dat_hen: "",
  id_gio_hen: 0,

  // Thông tin bệnh nhân
  benh_nhan_cccd: "",
  benh_nhan_dan_toc: "",
  benh_nhan_nhom_mau: "",
  benh_nhan_tien_su_benh: "",
  benh_nhan_quoc_tich: "",
  benh_nhan_dia_chi: "",
  benh_nhan_ma_benh_nhan: "",

  // Thông tin người dùng của bệnh nhân
  benh_nhan_ten_dang_nhap: "",
  benh_nhan_email: "",
  benh_nhan_sdt: "",
  benh_nhan_ngay_sinh: "",
  benh_nhan_gioi_tinh: "",
  benh_nhan_phan_loai: "",
  benh_nhan_ho_va_ten: "",
  benh_nhan_avt_url: "",

  // Thông tin bác sĩ
  bac_si_ngay_vao_nghe: "",
  bac_si_trinh_do_hoc_van: "",
  bac_si_mo_ta: "",
  bac_si_dia_chi_pk: "",
  bac_si_ma_bac_si: "",
  bac_si_chuyen_khoa: "",

  // Thông tin giờ hẹn
  gio_hen_thoi_diem_bat_dau: "",
  gio_hen_thoi_diem_ket_thuc: "",
  gio_hen_ngay_lam_viec: "",
  gio_hen_available: false,
  gio_hen_id_ca_lam_viec: 0,
  ca_lam_viec_lam_viec_onl: false,
  hinh_anh_bo_sung: [],
};

const HistoryDetailComponent: React.FC = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] =
    useState<Appointment>(defaultAppointment);
  const { id } = useParams<{ id: string }>();

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const clickFinishHandler = () => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hoàn thành cuộc hẹn này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        finishHandler();
      }
    });
  };

  const finishHandler = async () => {
    // Xử lý hoàn thành ở đây
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/appointment/finish/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          return response.json().then((data) => {
            // Trả về thông báo lỗi từ server
            console.log(data.message);
            throw new Error(
              data.message || "Không thể cập nhật trạng thái cuộc hẹn."
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        //Đổi appointment.trang_thai thành "Hoàn thành"
        console.log("Trạng thái cuộc hẹn đã được cập nhật:", data);
        setAppointment((prev) => ({ ...prev, trang_thai: "Hoàn thành" }));
        Swal.fire("Thành công!", "Cuộc hẹn đã được hoàn thành.", "success");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.message,
        });
      });
  };

  const formatTime = (isoString: string): string => {
    if (!isoString) return "00:00";

    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`.trim();
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const fetchAppointment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/detail/${id}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải danh sách lịch sử cuộc hẹn.");
      }
      const data = await response.json();
      console.log("Dữ liệu cuộc hẹn:", data);

      // Chuyển đổi dữ liệu từ nested object sang flat object
      const flatAppointment: Appointment = {
        id: data.id,
        van_ban_bo_sung: data.van_ban_bo_sung,
        dia_chi_phong_kham: data.dia_chi_phong_kham,
        trang_thai: data.trang_thai,
        thoi_diem_tao: data.thoi_diem_tao,
        ma_bac_si: data.ma_bac_si,
        ma_benh_nhan_dat_hen: data.ma_benh_nhan_dat_hen,
        id_gio_hen: data.id_gio_hen,

        // Thông tin bệnh nhân
        benh_nhan_cccd: data.Benh_nhan.cccd,
        benh_nhan_dan_toc: data.Benh_nhan.dan_toc,
        benh_nhan_nhom_mau: data.Benh_nhan.nhom_mau,
        benh_nhan_tien_su_benh: data.Benh_nhan.tien_su_benh,
        benh_nhan_quoc_tich: data.Benh_nhan.quoc_tich,
        benh_nhan_dia_chi: data.Benh_nhan.dia_chi,
        benh_nhan_ma_benh_nhan: data.Benh_nhan.ma_benh_nhan,

        // Thông tin người dùng của bệnh nhân
        benh_nhan_ten_dang_nhap: data.Benh_nhan.Nguoi_dung.ten_dang_nhap,
        benh_nhan_email: data.Benh_nhan.Nguoi_dung.email,
        benh_nhan_sdt: data.Benh_nhan.Nguoi_dung.sdt,
        benh_nhan_ngay_sinh: data.Benh_nhan.Nguoi_dung.ngay_sinh,
        benh_nhan_gioi_tinh: data.Benh_nhan.Nguoi_dung.gioi_tinh,
        benh_nhan_phan_loai: data.Benh_nhan.Nguoi_dung.phan_loai,
        benh_nhan_ho_va_ten: data.Benh_nhan.Nguoi_dung.ho_va_ten,
        benh_nhan_avt_url: data.Benh_nhan.Nguoi_dung.avt_url,

        // Thông tin bác sĩ
        bac_si_ngay_vao_nghe: data.Bac_si.ngay_vao_nghe,
        bac_si_trinh_do_hoc_van: data.Bac_si.trinh_do_hoc_van,
        bac_si_mo_ta: data.Bac_si.mo_ta,
        bac_si_dia_chi_pk: data.Bac_si.dia_chi_pk,
        bac_si_ma_bac_si: data.Bac_si.ma_bac_si,
        bac_si_chuyen_khoa: data.Bac_si.chuyen_khoa,

        // Thông tin giờ hẹn
        gio_hen_thoi_diem_bat_dau: data.Gio_hen.thoi_diem_bat_dau,
        gio_hen_thoi_diem_ket_thuc: data.Gio_hen.thoi_diem_ket_thuc,
        gio_hen_ngay_lam_viec: data.Gio_hen.ngay_lam_viec,
        gio_hen_available: data.Gio_hen.available,
        gio_hen_id_ca_lam_viec: data.Gio_hen.id_ca_lam_viec,
        ca_lam_viec_lam_viec_onl:
          data.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl,
        hinh_anh_bo_sung:
          data.Hinh_anh_bo_sung_cuoc_hen?.map(
            (img: { url: string }) => img.url
          ) || [],
      };
      console.log(flatAppointment);
      setAppointment(flatAppointment);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/updateStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentID: id,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật trạng thái.");

      // Hiển thị thông báo thành công
      setMessage(`Cập nhật trạng thái thành công: ${newStatus}`);
      setMessageType("success");

      fetchAppointment();

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Lỗi:", error);
      setMessage("Cập nhật trạng thái thất bại!");
      setMessageType("error");

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Nếu chưa đến tháng sinh hoặc ngày sinh trong năm nay thì trừ đi 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="h-full bg-gray-50 p-2">
      <div className="flex gap-4 h-full">
        {/* Thông tin chuyên ngành bên trái */}
        <div className="w-2/3 bg-white px-6 py-4 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <svg
              width="35"
              height="35"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="44"
                height="44"
                rx="7.5"
                fill="#3995C5"
              />
              <rect
                x="0.5"
                y="0.5"
                width="44"
                height="44"
                rx="7.5"
                stroke="white"
              />
              <path
                d="M22.5 17.7188V23.625"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M32.7148 18.6525V26.3475C32.7148 27.6075 32.0398 28.7775 30.9485 29.4188L24.266 33.2775C23.1748 33.9075 21.8248 33.9075 20.7223 33.2775L14.0398 29.4188C12.9485 28.7888 12.2735 27.6187 12.2735 26.3475V18.6525C12.2735 17.3925 12.9485 16.2225 14.0398 15.5812L20.7223 11.7225C21.8135 11.0925 23.1635 11.0925 24.266 11.7225L30.9485 15.5812C32.0398 16.2225 32.7148 17.3813 32.7148 18.6525Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.5 27.2246V27.3371"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 className="text-lg font-semibold ml-4">Thông tin chi tiết</h2>
            <span
              className={`px-3 py-2 text-sm font-medium rounded-full ml-auto capitalize ${
                appointment.trang_thai === "Đang chờ"
                  ? "bg-blue-200 text-blue-700"
                  : appointment.trang_thai === "Hoàn thành"
                  ? "bg-green-200 text-green-700"
                  : "bg-red-200 text-red-700"
              }`}
            >
              {appointment.trang_thai}
            </span>
            {appointment.ca_lam_viec_lam_viec_onl &&
              appointment.trang_thai === "Đang chờ" &&
              (() => {
                let startTime = new Date(appointment.gio_hen_thoi_diem_bat_dau);
                const now = new Date();
                startTime = new Date(startTime.getTime() - 5 * 60 * 1000);
                let endTime = new Date(appointment.gio_hen_thoi_diem_ket_thuc);

                if (now >= startTime && now <= endTime) {
                  return (
                    <button
                      className="p-2 rounded-full"
                      onClick={() => {
                        navigate(
                          `/video_call/${appointment.ma_benh_nhan_dat_hen}/${appointment.id}`
                        );
                      }}
                    >
                      <FaPhone className="text-green-500 hover:text-green-700  ml-2 text-xl transition-all duration-300 transform hover:scale-110" />
                    </button>
                  );
                }
                return null;
              })()}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <label className="text-sm font-medium block mb-2">
                Mã đơn hẹn
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                value={appointment.id}
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Tạo lúc</label>
              <input
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                value={formatDateTime(appointment.thoi_diem_tao)}
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Hình thức
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                value={
                  appointment.ca_lam_viec_lam_viec_onl ? "Online" : "Offline"
                }
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">
                Thời điểm hẹn
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                value={`${formatTime(
                  appointment.gio_hen_thoi_diem_bat_dau
                )} - ${formatTime(
                  appointment.gio_hen_thoi_diem_ket_thuc
                )} ${formatDate(appointment.gio_hen_ngay_lam_viec)}`}
                disabled
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium block mb-2">Địa chỉ</label>
              <input
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                value={appointment.bac_si_dia_chi_pk}
                disabled
              />
            </div>
          </div>
          {/* Văn bản bổ sung */}
          <div className="mt-2">
            <label className="text-sm font-medium block mb-2">
              Văn bản bổ sung
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
              rows={3}
              value={appointment.van_ban_bo_sung}
              disabled
            />
          </div>

          {/* File đính kèm */}
          <div className="mt-2">
            <label className="text-sm font-medium block mb-2">
              Hình ảnh bổ sung
            </label>
            <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm flex gap-2">
              {appointment.hinh_anh_bo_sung &&
              appointment.hinh_anh_bo_sung.length > 0 ? (
                appointment.hinh_anh_bo_sung.map(
                  (file: string, index: number) => {
                    // Kiểm tra nếu file là ảnh (đuôi .png, .jpg, .jpeg, .gif)
                    const isImage = /\.(jpeg|jpg|png|gif)$/i.test(file);

                    return (
                      <div key={index} className="relative w-20 h-20">
                        {/* <a
                          href={file}
                          className="text-blue-500 underline block"
                          target={isImage ? "_blank" : ""}
                          rel="noopener noreferrer"
                          download={!isImage} // Chỉ tải xuống nếu không phải ảnh
                        >
                          {
                            //Tách tên file từ URL
                            file.split("/").pop()
                          }
                        </a> */}
                        <img
                          src={file}
                          alt="Uploaded"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-gray-500">Không có hình ảnh bổ sung</p>
              )}
            </div>
          </div>

          <div>
            {/* Hiển thị thông báo */}
            {message && (
              <div
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white ${
                  messageType === "success" ? "bg-green-500" : "bg-red-500"
                } transition-opacity duration-500`}
              >
                {message}
              </div>
            )}

            {/* Nút chức năng */}
            {appointment.trang_thai?.toLowerCase() === "đang chờ" ? (
              <div className="flex justify-center gap-4 mt-6 text-sm">
                <button
                  onClick={() => navigate(`/resultDetail/${id}`)}
                  className="px-6 py-2 text-white bg-blue-800 rounded-lg font-medium hover:bg-blue-900 transition duration-200"
                >
                  Gửi kết quả
                </button>
                <button
                  onClick={clickFinishHandler}
                  className="px-6 py-2 text-white bg-green-600 rounded-lg font-medium hover:bg-green-700 transition duration-200"
                >
                  Hoàn thành
                </button>
              </div>
            ) : appointment.trang_thai?.toLowerCase() === "hoàn thành" ? (
              <div className="mt-6 text-center">
                <button
                  className="text-blue-500 underline"
                  onClick={() => navigate(`/resultDetail/${id}`)}
                >
                  Bác sĩ kê đơn
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-base">
            <img
              src={
                appointment.benh_nhan_avt_url
                  ? appointment.benh_nhan_avt_url
                  : "/images/avt.png"
              }
              alt="Doctor Avatar"
              className="w-20 h-20 rounded-full mb-4"
            />
            <p
              className="font-semibold text-center text-blue-500 cursor-pointer hover:text-blue-700 hover:underline"
              onClick={() =>
                navigate(
                  `/patientInfoDoctor/${appointment.ma_benh_nhan_dat_hen}`
                )
              }
            >
              {appointment.benh_nhan_ho_va_ten}
              <br />({appointment.ma_benh_nhan_dat_hen})
            </p>
            <p className="text-gray-600">
              {calculateAge(appointment.benh_nhan_ngay_sinh)} tuổi,{" "}
              {appointment.benh_nhan_gioi_tinh}
            </p>
          </div>

          <hr className="my-3" />
          <div className="ml-5 text-base">
            {[
              {
                label: "Email",
                value: appointment.benh_nhan_email
                  ? appointment.benh_nhan_email
                  : "Chưa có",
              },
              { label: "SĐT", value: appointment.benh_nhan_sdt },
              { label: "Ngày sinh", value: appointment.benh_nhan_ngay_sinh },
              {
                label: "Địa chỉ",
                value: appointment.benh_nhan_dia_chi
                  ? appointment.benh_nhan_dia_chi
                  : "Chưa có",
              },
              {
                label: "Tiền sử bệnh lý",
                value: appointment.benh_nhan_tien_su_benh
                  ? appointment.benh_nhan_tien_su_benh
                  : "Chưa có",
              },
            ].map((info) => (
              <div className="mb-3" key={info.label}>
                <p className="font-medium">{info.label}</p>
                <p className="text-gray-500">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Nút chức năng */}
    </div>
  );
};

export default HistoryDetailComponent;
