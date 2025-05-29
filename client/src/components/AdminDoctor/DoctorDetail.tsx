import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChangeDoctorInforModal from "./ChangeDoctorInfor";
import ChangePasswordModal from "./ChangePassword";
import { TextInput, TextAreaInput } from "../Input/InputComponents";
import Swal from "sweetalert2";

interface Doctor {
  id: number;
  ngay_vao_nghe: string;
  trinh_do_hoc_van: string;
  mo_ta: string;
  dia_chi_pk: string;
  ma_bac_si: string;
  chuyen_khoa: string;

  // Thông tin từ Nguoi_dung
  nguoi_dung_ten_dang_nhap: string;
  nguoi_dung_email: string;
  nguoi_dung_sdt: string;
  nguoi_dung_ngay_sinh: string;
  nguoi_dung_gioi_tinh: string;
  nguoi_dung_phan_loai: string;
  nguoi_dung_ho_va_ten: string;
  nguoi_dung_avt_url: string;

  // Thông tin từ Tai_khoan
  tai_khoan_ten_dang_nhap: string;
  tai_khoan_active: boolean;
  tai_khoan_thoi_diem_mo_tk: string;
}

const defaultDoctor: Doctor = {
  id: 0,
  ngay_vao_nghe: "",
  trinh_do_hoc_van: "",
  mo_ta: "",
  dia_chi_pk: "",
  ma_bac_si: "",
  chuyen_khoa: "",

  nguoi_dung_ten_dang_nhap: "",
  nguoi_dung_email: "",
  nguoi_dung_sdt: "",
  nguoi_dung_ngay_sinh: "",
  nguoi_dung_gioi_tinh: "",
  nguoi_dung_phan_loai: "",
  nguoi_dung_ho_va_ten: "",
  nguoi_dung_avt_url: "",

  tai_khoan_ten_dang_nhap: "",
  tai_khoan_active: false,
  tai_khoan_thoi_diem_mo_tk: "",
};

const DoctorInfor: React.FC = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor>(defaultDoctor);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/doctor/${id}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải danh sách bác sĩ.");
      }
      const data = await response.json();

      // Chuyển đổi dữ liệu từ nested object sang flat object
      const flatDoctor: Doctor = {
        id: data.id,
        ngay_vao_nghe: data.ngay_vao_nghe,
        trinh_do_hoc_van: data.trinh_do_hoc_van,
        mo_ta: data.mo_ta,
        dia_chi_pk: data.dia_chi_pk,
        ma_bac_si: data.ma_bac_si,
        chuyen_khoa: data.chuyen_khoa,

        nguoi_dung_ten_dang_nhap: data.Nguoi_dung.ten_dang_nhap,
        nguoi_dung_email: data.Nguoi_dung.email,
        nguoi_dung_sdt: data.Nguoi_dung.sdt,
        nguoi_dung_ngay_sinh: data.Nguoi_dung.ngay_sinh,
        nguoi_dung_gioi_tinh: data.Nguoi_dung.gioi_tinh,
        nguoi_dung_phan_loai: data.Nguoi_dung.phan_loai,
        nguoi_dung_ho_va_ten: data.Nguoi_dung.ho_va_ten,
        nguoi_dung_avt_url: data.Nguoi_dung.avt_url,

        tai_khoan_ten_dang_nhap: data.Nguoi_dung.Tai_khoan.ten_dang_nhap,
        tai_khoan_active: data.Nguoi_dung.Tai_khoan.active,
        tai_khoan_thoi_diem_mo_tk: data.Nguoi_dung.Tai_khoan.thoi_diem_mo_tk,
      };

      setDoctor(flatDoctor);
    } catch (err) {
      setError("Lỗi khi tải danh sách bác sĩ.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDoctor();
  }, []);

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      console.log("field", field, "value", e.target.value);
      setDoctor((prevData) => ({
        ...prevData,
        [field]: e.target.value,
      }));
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

  const [isChangeDoctorInfor, setIsChangeDoctorInfor] = useState(false);

  const toggleChangeDoctorInfor = () => {
    setIsChangeDoctorInfor(!isChangeDoctorInfor);
    fetchDoctor();
  };

  const resetPassword = async (username: string) => {
    try {
      Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Nếu người dùng xác nhận, thực hiện đặt lại mật khẩu
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/account/reset_password`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
            }
          );

          if (!response.ok) throw new Error("Không thể đặt lại mật khẩu.");

          Swal.fire({
            title: "Thành công",
            text: "Đặt lại mật khẩu thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi đặt lại mật khẩu.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const toggleAccountStatus = async (username: string) => {
    try {
      //Modal để xác nhận trước
      let mess = doctor.tai_khoan_active
        ? "Bạn có chắc chắn muốn khóa tài khoản này không?"
        : "Bạn có chắc chắn muốn mở khóa tài khoản này không?";

      Swal.fire({
        title: "Xác nhận",
        text: mess,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Nếu người dùng xác nhận, thực hiện thay đổi trạng thái tài khoản
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/account/toggle_active`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
            }
          );

          if (!response.ok)
            throw new Error("Không thể thay đổi trạng thái tài khoản.");

          //Sửa lại doctor trong state
          setDoctor((prevDoctor) => ({
            ...prevDoctor,
            tai_khoan_active: !prevDoctor.tai_khoan_active,
          }));

          Swal.fire({
            title: "Thành công",
            text: "Thay đổi trạng thái tài khoản thành công",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi thay đổi trạng thái tài khoản.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
            <h2 className="text-lg font-semibold ml-4">Chi tiết bác sĩ</h2>
          </div>

          <div className="grid gap-4 mb-4 sm:grid-cols-2 my-4">
            {[
              {
                id: "ngay_vao_nghe",
                label: "Thời điểm vào nghề",
                type: "date",
              },
              { id: "dia_chi_pk", label: "Địa chỉ phòng khám", type: "text" },
              { id: "trinh_do_hoc_van", label: "Học vấn", type: "text" },
              { id: "chuyen_khoa", label: "Chuyên khoa", type: "text" },
            ].map((input) => (
              <div key={input.id}>
                <TextInput
                  label={input.label}
                  id={input.id}
                  type={input.type}
                  value={String(doctor[input.id as keyof typeof doctor] ?? "")}
                  onChange={(e) => handleChange(input.id)(e)}
                  disabled={true}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <TextAreaInput
              label="Mô tả"
              id="description"
              value={doctor.mo_ta}
              onChange={handleChange("description")}
              disabled={true}
            />
          </div>

          <div className="flex justify-end mt-10 mb-20">
            <button
              className="px-4 py-2 mr-3 bg-blueButton hover:bg-blueButtonHover text-white rounded-lg"
              onClick={toggleChangeDoctorInfor}
            >
              Chỉnh sửa
            </button>
            <button
              className="px-4 py-2 mr-3 bg-yellowButton hover:bg-yellowButtonHover text-white rounded-lg"
              onClick={() => resetPassword(doctor.nguoi_dung_ten_dang_nhap)}
            >
              Đặt lại mật khẩu
            </button>
            <button
              onClick={() =>
                toggleAccountStatus(doctor.nguoi_dung_ten_dang_nhap)
              }
              className={`px-4 py-2 text-white rounded-lg ${
                doctor.tai_khoan_active
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {doctor.tai_khoan_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            </button>
          </div>
        </div>

        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-base">
            <img
              src={
                doctor.nguoi_dung_avt_url
                  ? doctor.nguoi_dung_avt_url
                  : "/images/avt.png"
              }
              alt="Doctor Avatar"
              className="w-20 h-20 rounded-full mb-4"
            />
            <p className="font-semibold text-center">
              {doctor.nguoi_dung_ho_va_ten}
            </p>
            <p className="text-gray-600">
              {calculateAge(doctor.nguoi_dung_ngay_sinh)} tuổi,{" "}
              {doctor.nguoi_dung_gioi_tinh}
            </p>
          </div>

          <hr className="my-3" />
          <div className="ml-5 text-base">
            {[
              { label: "Email", value: doctor.nguoi_dung_email },
              { label: "SĐT", value: doctor.nguoi_dung_sdt },
              { label: "Ngày sinh", value: doctor.nguoi_dung_ngay_sinh },
              { label: "Địa chỉ", value: doctor.dia_chi_pk },
              {
                label: "Mở tài khoản lúc",
                value: new Date(
                  doctor.tai_khoan_thoi_diem_mo_tk
                ).toLocaleString(),
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
      <ChangeDoctorInforModal
        isOpen={isChangeDoctorInfor}
        setIsOpen={toggleChangeDoctorInfor}
        doctor={doctor}
        handleChange={handleChange}
      />
    </div>
  );
};

export default DoctorInfor;
