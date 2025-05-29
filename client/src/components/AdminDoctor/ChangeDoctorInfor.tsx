import React, { useEffect, useState } from "react";
import {
  TextInput,
  SelectInput,
  TextAreaInput,
} from "../Input/InputComponents";
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

  // Thông tin từ Tai_khoan
  tai_khoan_ten_dang_nhap: string;
  tai_khoan_active: boolean;
  tai_khoan_thoi_diem_mo_tk: string;
}

type ChangeDoctorInforModalProps = {
  isOpen: boolean; // Trạng thái mở/đóng của modal
  setIsOpen: () => void; // Hàm để thay đổi trạng thái modal
  doctor: Doctor; // Dữ liệu bác sĩ, có thể undefined nếu chưa fetch xong
  handleChange: (
    field: string
  ) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void; // Hàm cập nhật dữ liệu bác sĩ
};

const ChangeDoctorInforModal: React.FC<ChangeDoctorInforModalProps> = ({
  isOpen,
  setIsOpen,
  doctor,
  handleChange,
}) => {
  const [participateTime, setParticipateTime] = useState("");

  const updateDoctorInfo = async (doctorData: {
    doctorID: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    birthDay: string;
    gender: string;
    description: string;
  }) => {
    console.log("Dữ liệu gửi lên:", doctorData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/doctor/changeInfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctorData),
        }
      );

      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }

      const data = await response.json();
      console.log("Thông tin cập nhật thành công:", data);
      return data;
    } catch (error) {
      console.error("Lỗi khi cập nhật bác sĩ:", error);
      throw error;
    }
  };

  console.log(doctor);

  const handleUpdateDoctor = async () => {
    // Hiển thị hộp thoại xác nhận trước
    const confirmResult = await Swal.fire({
      title: "Xác nhận cập nhật",
      text: "Bạn có chắc chắn muốn cập nhật thông tin bác sĩ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      if (doctor.nguoi_dung_email === "") {
        Swal.fire("Lỗi", "Email không được để trống", "error");
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(doctor.nguoi_dung_email)) {
        Swal.fire("Lỗi", "Email không hợp lệ", "error");
        return;
      }
      if (doctor.nguoi_dung_sdt === "") {
        Swal.fire("Lỗi", "Số điện thoại không được để trống", "error");
        return;
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(doctor.nguoi_dung_sdt)) {
        Swal.fire("Lỗi", "Số điện thoại không hợp lệ", "error");
        return;
      }
      if (doctor.nguoi_dung_ngay_sinh === "") {
        Swal.fire("Lỗi", "Ngày sinh không được để trống", "error");
        return;
      }
      if (doctor.nguoi_dung_gioi_tinh === "") {
        Swal.fire("Lỗi", "Giới tính không được để trống", "error");
        return;
      }
      if (doctor.mo_ta === "") {
        Swal.fire("Lỗi", "Mô tả không được để trống", "error");
        return;
      }
      if (doctor.ngay_vao_nghe === "") {
        Swal.fire("Lỗi", "Ngày vào nghề không được để trống", "error");
        return;
      }
      if (doctor.chuyen_khoa === "") {
        Swal.fire("Lỗi", "Chuyên khoa không được để trống", "error");
        return;
      }
      if (doctor.trinh_do_hoc_van === "") {
        Swal.fire("Lỗi", "Trình độ học vấn không được để trống", "error");
        return;
      }
      if (doctor.dia_chi_pk === "") {
        Swal.fire("Lỗi", "Địa chỉ phòng khám không được để trống", "error");
        return;
      }

      const updatedData = {
        doctorID: doctor?.ma_bac_si,
        email: doctor.nguoi_dung_email,
        fullName: doctor.nguoi_dung_ho_va_ten,
        phoneNumber: doctor.nguoi_dung_sdt,
        birthDay: doctor.nguoi_dung_ngay_sinh,
        gender: doctor.nguoi_dung_gioi_tinh,
        description: doctor.mo_ta,
      };

      const result = await updateDoctorInfo(updatedData);
      console.log("Kết quả cập nhật:", result);

      await Swal.fire({
        title: "Thành công",
        text: "Cập nhật thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });

      window.location.reload(); // Reload lại trang
    } catch (error) {
      Swal.fire("Lỗi", "Cập nhật thất bại, vui lòng thử lại!", "error");
    }
  };

  const [specialtyOptions, setSpecialtyOptions] = useState<any[]>([]);

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
        let specialization = data.map((item: any) => {
          return {
            value: item.ten_chuyen_khoa,
            label: item.ten_chuyen_khoa,
          };
        });

        specialization.unshift({ value: "", label: "Chuyên khoa" });
        setSpecialtyOptions(specialization);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecialization();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pt-1 flex items-center justify-center w-full overflow-y-auto bg-gray-800 bg-opacity-75">
      <div className="w-full mt-auto mb-10 max-w-4xl p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Chỉnh sửa thông tin bác sĩ
          </h3>
          <button
            type="button"
            onClick={setIsOpen}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <TextInput
            label="Email"
            id="nguoi_dung_email"
            type="email"
            value={doctor.nguoi_dung_email}
            required
            onChange={handleChange("nguoi_dung_email")}
          />
          <TextInput
            label="Tên đăng nhập"
            id="nguoi_dung_ten_dang_nhap"
            value={doctor.nguoi_dung_ten_dang_nhap}
            disabled={true}
            onChange={handleChange("nguoi_dung_ten_dang_nhap")}
          />

          <TextInput
            label="SĐT"
            id="nguoi_dung_sdt"
            value={doctor.nguoi_dung_sdt}
            type="tel"
            onChange={handleChange("nguoi_dung_sdt")}
          />
          <TextInput
            label="Họ và tên"
            id="nguoi_dung_ho_va_ten"
            value={doctor.nguoi_dung_ho_va_ten}
            onChange={handleChange("nguoi_dung_ho_va_ten")}
          />
          <TextInput
            label="Ngày sinh"
            id="nguoi_dung_ngay_sinh"
            type="date"
            value={doctor.nguoi_dung_ngay_sinh}
            onChange={handleChange("nguoi_dung_ngay_sinh")}
          />
          <SelectInput
            label="Giới tính"
            id="nguoi_dung_gioi_tinh"
            value={doctor.nguoi_dung_gioi_tinh}
            onChange={handleChange("nguoi_dung_gioi_tinh")}
            options={[
              { value: "Nam", label: "Nam" },
              { value: "Nữ", label: "Nữ" },
            ]}
          />
          <TextInput
            label="Thời điểm vào nghề"
            id="ngay_vao_nghe"
            type="date"
            value={doctor.ngay_vao_nghe}
            onChange={handleChange("ngay_vao_nghe")}
          />
          <SelectInput
            label="Chuyên khoa"
            id="chuyen_khoa"
            value={doctor.chuyen_khoa}
            onChange={handleChange("chuyen_khoa")}
            required={true}
            options={specialtyOptions}
            disabled
          />
          <TextInput
            label="Học vấn"
            id="trinh_do_hoc_van"
            value={doctor.trinh_do_hoc_van}
            onChange={handleChange("trinh_do_hoc_van")}
            disabled
          />
        </div>
        <div className="grid gap-4 mb-4">
          <TextInput
            label="Địa chỉ phòng khám"
            id="dia_chi_pk"
            value={doctor.dia_chi_pk}
            onChange={handleChange("dia_chi_pk")}
            disabled
          />
          <TextAreaInput
            label="Mô tả"
            id="mo_ta"
            value={doctor.mo_ta}
            onChange={handleChange("mo_ta")}
          />
        </div>
        <div className="grid gap-4 mb-4 sm:grid-cols-4">
          <TextInput
            label="Ngày gia nhập"
            id="tai_khoan_thoi_diem_mo_tk"
            value={new Date(doctor.tai_khoan_thoi_diem_mo_tk).toLocaleString()}
            disabled={true}
            onChange={handleChange("tai_khoan_thoi_diem_mo_tk")}
          />
          <SelectInput
            label="Trạng thái"
            id="tai_khoan_active"
            value={String(doctor.tai_khoan_active)}
            onChange={handleChange("tai_khoan_active")}
            options={[
              { value: "True", label: "Active" },
              { value: "False", label: "Inactive" },
            ]}
          />
          <div>
            <label
              htmlFor="addBy"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Cập nhật bởi
            </label>
            <input
              type="text"
              name="addBy"
              id="addBy"
              disabled
              value={"Tan Tai"}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="participateTime"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Vào lúc
            </label>
            <input
              name="participateTime"
              id="participateTime"
              value={participateTime}
              disabled
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-lg"
              onChange={(e) => setParticipateTime(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              handleUpdateDoctor();
              setIsOpen();
            }}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg text-white bg-blueButton hover:bg-blueButtonHover"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDoctorInforModal;
