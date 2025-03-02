import React, { useState } from "react";
import {
  TextInput,
  SelectInput,
  TextAreaInput,
  PasswordInput,
} from "../Input/InputComponents";

type AddDoctorModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

interface Doctor {
  tenDangNhap: string;
  matKhau: string;
  email: string;
  sdt: string;
  ngaySinh: string;
  gioiTinh: string;
  hoVaTen: string;
  thoiDiemVaoNghe: string;
  trinhDoHocVan: string;
  moTa: string;
  diaChiPhongKham: string;
  chuyenKhoa: string;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [doctor, setDoctor] = useState<Doctor>({
    tenDangNhap: "",
    matKhau: "",
    email: "",
    sdt: "",
    ngaySinh: "",
    gioiTinh: "",
    hoVaTen: "",
    thoiDiemVaoNghe: "",
    trinhDoHocVan: "",
    moTa: "",
    diaChiPhongKham: "",
    chuyenKhoa: "",
  });

  const handleSubmit = async (e: React.FormEvent, doctor: Doctor) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/doctor/addDoctor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctor),
        }
      );

      if (!response.ok) throw new Error("Không thể thêm bác sĩ.");

      alert("Thêm bác sĩ thành công!");
    } catch (error) {
      console.error(error);
      alert("Thêm bác sĩ thất bại!");
    }
    window.location.reload();
  };

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setDoctor((prevData) => ({
        ...prevData,
        [field]: e.target.value,
      }));
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pt-14 flex items-center justify-center w-full min-h-screen overflow-y-auto bg-gray-800 bg-opacity-75">
      <div className="w-full mt-auto mb-10 max-w-4xl p-4 bg-white rounded-lg shadow">
        <form onSubmit={(e) => handleSubmit(e, doctor)}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
            <h3 className="text-lg font-semibold">Thêm bác sĩ</h3>
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
              id="email"
              value={doctor.email}
              onChange={handleChange("email")}
              required={true}
            />
            <PasswordInput
              label="Mật khẩu"
              id="password"
              value={doctor.matKhau}
              onChange={handleChange("matKhau")}
              required={true}
            />
            <TextInput
              label="Tên đăng nhập"
              id="username"
              value={doctor.tenDangNhap}
              onChange={handleChange("tenDangNhap")}
              required={true}
            />
            <TextInput
              label="SĐT"
              id="phoneNumber"
              value={doctor.sdt}
              onChange={handleChange("sdt")}
              required={true}
            />
            <TextInput
              label="Họ và tên"
              id="fullName"
              value={doctor.hoVaTen}
              onChange={handleChange("hoVaTen")}
              required={true}
            />
            <TextInput
              label="Ngày sinh"
              id="birthday"
              type="date"
              value={doctor.ngaySinh}
              onChange={handleChange("ngaySinh")}
              required={true}
            />
            <SelectInput
              label="Giới tính"
              id="gender"
              value={doctor.gioiTinh}
              onChange={handleChange("gioiTinh")}
              required={true}
              options={[
                { value: "Male", label: "Nam" },
                { value: "Female", label: "Nữ" },
                { value: "None", label: "Khác" },
              ]}
            />
            <TextInput
              label="Thời điểm vào nghề"
              id="beginWorkDay"
              type="date"
              value={doctor.thoiDiemVaoNghe}
              onChange={handleChange("thoiDiemVaoNghe")}
              required={true}
            />
            <SelectInput
              label="Chuyên khoa"
              id="specialty"
              value={doctor.chuyenKhoa}
              onChange={handleChange("chuyenKhoa")}
              required={true}
              options={[
                { value: "Nội tổng quát", label: "Nội tổng quát" },
                { value: "Nội tim mạch", label: "Nội tim mạch" },
                { value: "Nội tiêu hóa", label: "Nội tiêu hóa" },
                { value: "Nội thần kinh", label: "Nội thần kinh" },
                {
                  value: "Nội tiết - đái tháo đường",
                  label: "Nội tiết - đái tháo đường",
                },
                { value: "Ngoại tổng quát", label: "Ngoại tổng quát" },
                { value: "Ngoại thần kinh", label: "Ngoại thần kinh" },
                { value: "Ngoại tim mạch", label: "Ngoại tim mạch" },
                { value: "Sản phụ khoa", label: "Sản phụ khoa" },
                { value: "Nhi khoa", label: "Nhi khoa" },
                { value: "Mắt (Nhãn khoa)", label: "Mắt (Nhãn khoa)" },
                { value: "Tai mũi họng", label: "Tai mũi họng" },
                { value: "Răng hàm mặt", label: "Răng hàm mặt" },
                { value: "Da liễu", label: "Da liễu" },
                { value: "Ung bướu", label: "Ung bướu" },
                { value: "Tâm thần", label: "Tâm thần" },
                { value: "Phục hồi chức năng", label: "Phục hồi chức năng" },
              ]}
            />

            <TextInput
              label="Học vấn"
              id="degree"
              value={doctor.trinhDoHocVan}
              onChange={handleChange("trinhDoHocVan")}
              required={true}
            />
          </div>
          <div className="grid gap-4 mb-4">
            <TextInput
              label="Địa chỉ phòng khám"
              id="address"
              value={doctor.diaChiPhongKham}
              onChange={handleChange("diaChiPhongKham")}
              required={true}
            />
            <TextAreaInput
              label="Mô tả"
              id="description"
              value={doctor.moTa}
              onChange={handleChange("moTa")}
              required={true}
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 rounded-lg"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
