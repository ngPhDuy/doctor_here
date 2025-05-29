import React, { useEffect, useState } from "react";
import {
  TextInput,
  SelectInput,
  TextAreaInput,
  PasswordInput,
} from "../Input/InputComponents";
import Swal from "sweetalert2";

type AddDoctorModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

interface Doctor {
  tenDangNhap: string;
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
    email: "",
    sdt: "",
    ngaySinh: "",
    gioiTinh: "nam",
    hoVaTen: "",
    thoiDiemVaoNghe: "",
    trinhDoHocVan: "",
    moTa: "",
    diaChiPhongKham: "",
    chuyenKhoa: "",
  });
  const [specialtyOptions, setSpecialtyOptions] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent, doctor: Doctor) => {
    e.preventDefault();
    try {
      console.log(doctor);
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

      // alert("Thêm bác sĩ thành công!");
      Swal.fire({
        title: "Thành công!",
        text: "Thêm bác sĩ thành công",
        icon: "success",
      });

      setDoctor({
        tenDangNhap: "",
        email: "",
        sdt: "",
        ngaySinh: "",
        gioiTinh: "nam",
        hoVaTen: "",
        thoiDiemVaoNghe: "",
        trinhDoHocVan: "",
        moTa: "",
        diaChiPhongKham: "",
        chuyenKhoa: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Có lỗi khi thêm bác sĩ mới vào hệ thống", "error");
    }
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
    <div className="fixed inset-0 z-50 pt-14 flex items-center justify-center w-full min-h-screen overflow-y-auto bg-gray-800 bg-opacity-75">
      <div className="w-full mt-auto mb-10 max-w-4xl p-4 bg-white rounded-lg shadow">
        <form>
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
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
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
              options={specialtyOptions}
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
              onClick={(e) => handleSubmit(e, doctor)}
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
