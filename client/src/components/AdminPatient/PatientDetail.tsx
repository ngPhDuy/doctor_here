import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChangePatientPasswordModal from "./ChangePatientPassword";
import { TextInput, TextAreaInput } from "../Input/InputComponents";
import Swal from "sweetalert2";

interface Patient {
  id: number;
  ma_benh_nhan: string;
  cccd: string;
  dan_toc: string;
  nhom_mau: string;
  tien_su_benh: string;
  quoc_tich: string;
  dia_chi: string;
  ten_dang_nhap: string;
  email: string;
  sdt: string;
  ngay_sinh: string;
  gioi_tinh: string;
  ho_va_ten: string;
  avt_url: string;
  active: boolean;
  thoi_diem_mo_tk: string;
}

const defaultPatient: Patient = {
  id: 0,
  ma_benh_nhan: "",
  cccd: "",
  dan_toc: "",
  nhom_mau: "",
  tien_su_benh: "",
  quoc_tich: "",
  dia_chi: "",
  ten_dang_nhap: "",
  email: "",
  sdt: "",
  ngay_sinh: "",
  gioi_tinh: "",
  ho_va_ten: "",
  active: false,
  thoi_diem_mo_tk: "",
  avt_url: "",
};

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient>(defaultPatient);
  const { id } = useParams<{ id: string }>();

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setPatient((prevData) => ({ ...prevData, [field]: e.target.value }));
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

  const fetchPatientById = async (
    patientID: string
  ): Promise<Patient | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/patient/detail/${patientID}`
      );
      if (!response.ok) throw new Error("Không thể tải thông tin bệnh nhân.");

      const data = await response.json();

      return {
        id: data.id,
        ma_benh_nhan: data.ma_benh_nhan,
        cccd: data.cccd,
        dan_toc: data.dan_toc ?? "",
        nhom_mau: data.nhom_mau ?? "",
        tien_su_benh: data.tien_su_benh ?? "",
        quoc_tich: data.quoc_tich ?? "",
        dia_chi: data.dia_chi ?? "",
        ten_dang_nhap: data.Nguoi_dung.ten_dang_nhap,
        email: data.Nguoi_dung.email ?? "",
        sdt: data.Nguoi_dung.sdt ?? "",
        ngay_sinh: data.Nguoi_dung.ngay_sinh,
        gioi_tinh: data.Nguoi_dung.gioi_tinh,
        ho_va_ten: data.Nguoi_dung.ho_va_ten,
        active: data.Nguoi_dung.Tai_khoan.active,
        thoi_diem_mo_tk: data.Nguoi_dung.Tai_khoan.thoi_diem_mo_tk,
        avt_url: data.Nguoi_dung.avt_url,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  useEffect(() => {
    if (id) {
      fetchPatientById(id).then((data) => {
        console.log(data);
        if (data) setPatient(data);
      });
    }
  }, [id]);

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

  const toggleAccountStatus = async (username: string) => {
    try {
      //Modal để xác nhận trước
      let mess = patient.active
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

          //Set lại trạng thái tài khoản
          setPatient((prevPatient) => ({
            ...prevPatient,
            active: !prevPatient.active,
          }));

          Swal.fire({
            title: "Thành công",
            text: `Đã ${
              patient.active ? "khóa" : "mở khóa"
            } tài khoản thành công!`,
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      });
    } catch (error) {
      console.log(error);
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
            <h2 className="text-xl font-semibold ml-4">Chi tiết bệnh nhân</h2>
          </div>

          <div className="grid gap-4 mb-4 sm:grid-cols-2 my-4">
            {[
              { id: "ho_va_ten", label: "Họ và tên", type: "text" },
              { id: "ma_benh_nhan", label: "Mã bệnh nhân", type: "text" },
              { id: "ngay_sinh", label: "Ngày sinh", type: "date" },
              { id: "gioi_tinh", label: "Giới tính", type: "text" },
              { id: "sdt", label: "Số điện thoại", type: "text" },
              { id: "quoc_tich", label: "Quốc tịch", type: "text" },
            ].map((input) => (
              <div key={input.id}>
                <TextInput
                  label={input.label}
                  id={input.id}
                  type={input.type}
                  value={
                    String(patient[input.id as keyof typeof patient]) || ""
                  }
                  onChange={(e) => handleChange(input.id)(e)}
                  disabled={true}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 mb-4 sm:grid-cols-1 my-4">
            <TextAreaInput
              label="Địa chỉ"
              id="dia_chi"
              value={patient.dia_chi}
              onChange={handleChange("dia_chi")}
              disabled={true}
            />
          </div>
          <div className="flex justify-end mt-10 mb-20">
            <button
              className="px-4 py-2 mr-3 bg-yellowButton hover:bg-yellowButtonHover text-white rounded-lg"
              onClick={() => resetPassword(patient.ten_dang_nhap)}
            >
              Đặt lại mật khẩu
            </button>
            <button
              onClick={() => toggleAccountStatus(patient.ten_dang_nhap)}
              className={`px-4 py-2 text-white rounded-lg ${
                patient.active
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {patient.active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            </button>
          </div>
        </div>

        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-base">
            <img
              src={patient.avt_url ? patient.avt_url : "/images/avt.png"}
              alt="Patient Avatar"
              className="w-20 h-20 rounded-full mb-4"
            />
            <p className="text-base font-semibold">{patient.ho_va_ten}</p>
            {calculateAge(patient.ngay_sinh)} tuổi, {patient.gioi_tinh}
          </div>

          <hr className="my-3" />
          <div className="ml-5">
            {[
              { label: "Email", value: patient.email },
              { label: "SĐT", value: patient.sdt },
              { label: "Ngày sinh", value: patient.ngay_sinh },
              { label: "Địa chỉ", value: patient.dia_chi },
              {
                label: "Mở tài khoản lúc",
                value: new Date(patient.thoi_diem_mo_tk).toLocaleString(),
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
    </div>
  );
};

export default PatientDetail;
