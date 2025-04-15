import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChangePasswordModal from "./ChangePassword";
import Swal from "sweetalert2";
import NavBar from "./NavBar";

interface DoctorInfo {
  id: number;
  ngay_vao_nghe: string;
  trinh_do_hoc_van: string;
  mo_ta: string;
  dia_chi_pk: string;
  ma_bac_si: string;
  chuyen_khoa: string;
  Nguoi_dung: {
    ten_dang_nhap: string;
    email: string;
    sdt: string;
    ngay_sinh: string;
    gioi_tinh: string;
    phan_loai: string;
    ho_va_ten: string;
    avt_url: string;
    Tai_khoan: {
      ten_dang_nhap: string;
      active: boolean;
      thoi_diem_mo_tk: string;
    };
  };
}

const DoctorSettingInfo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    ten_dang_nhap: "",
    ho_va_ten: "",
    sdt: "",
    gioi_tinh: "",
    ngay_sinh: "",
    ngay_vao_nghe: "",
    chuyen_khoa: "",
    dia_chi_pk: "",
    mo_ta: "",
  });

  const [initialFormData, setInitialFormData] = useState(formData);

  // State để quản lý việc thay đổi avatar
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Lấy thông tin bác sĩ
  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/doctor/${id || "BS0000001"}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải thông tin bác sĩ.");
        }
        const data = await response.json();

        console.log(data.Nguoi_dung);

        const formattedData = {
          email: data.Nguoi_dung.email,
          ten_dang_nhap: data.Nguoi_dung.ten_dang_nhap,
          ho_va_ten: data.Nguoi_dung.ho_va_ten,
          sdt: data.Nguoi_dung.sdt,
          gioi_tinh: data.Nguoi_dung.gioi_tinh.trim(),
          ngay_sinh: data.Nguoi_dung.ngay_sinh?.slice(0, 10), // YYYY-MM-DD
          ngay_vao_nghe: data.ngay_vao_nghe?.slice(0, 10),
          chuyen_khoa: data.chuyen_khoa,
          dia_chi_pk: data.dia_chi_pk,
          mo_ta: data.mo_ta,
        };

        console.log(formattedData);

        setFormData(formattedData);
        setInitialFormData(formattedData);
        setDoctor(data);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải thông tin bác sĩ.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetail();
  }, [id]);

  // Cập nhật avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // Hiển thị ảnh trước khi upload
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSaveAvatar = async () => {
  //   if (!newAvatar) return;

  //   const formData = new FormData();
  //   formData.append("avatar", newAvatar);

  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/api/doctor/upload-avatar`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) throw new Error("Cập nhật avatar thất bại!");

  //     Swal.fire({
  //       title: "Thành công!",
  //       text: "Avatar đã được cập nhật.",
  //       icon: "success",
  //       confirmButtonText: "Đóng",
  //       customClass: {
  //         popup: "rounded-lg",
  //         title: "text-base",
  //         confirmButton: "px-3 py-2 text-sm",
  //       },
  //     }).then(() => {
  //       window.location.reload(); // Refresh trang sau khi cập nhật avatar
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Lỗi!",
  //       text: "Đã xảy ra lỗi khi cập nhật avatar.",
  //       icon: "error",
  //       confirmButtonText: "Đóng",
  //       customClass: {
  //         popup: "rounded-lg",
  //         title: "text-base",
  //         confirmButton: "px-3 py-2 text-sm",
  //       },
  //     });
  //   }
  // };

  // Cập nhật thông tin bác sĩ
  const handleUpdateDoctor = async () => {
    // Kiểm tra nếu không có thay đổi nào
    if (
      JSON.stringify(formData) === JSON.stringify(initialFormData) &&
      !newAvatar
    ) {
      Swal.fire({
        title: "Không có thay đổi",
        text: "Bạn chưa chỉnh sửa thông tin nào hoặc chưa chọn avatar mới!",
        icon: "info",
        confirmButtonText: "Đóng",
        width: "350px",
        customClass: {
          popup: "rounded-lg",
          title: "text-base",
          confirmButton: "px-3 py-2 text-sm",
        },
      });
      return;
    }

    // Xác nhận cập nhật
    const result = await Swal.fire({
      title: "Xác nhận cập nhật?",
      text: "Bạn có chắc muốn lưu thay đổi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      width: "350px",
      customClass: {
        title: "text-base",
        popup: "rounded-lg",
        confirmButton: "px-3 py-2 text-sm",
        cancelButton: "px-3 py-2 text-sm",
      },
    });

    if (result.isConfirmed) {
      // Cập nhật thông tin bác sĩ
      try {
        // Nếu có avatar mới, upload avatar
        let newUrl;
        let updateResponse;

        if (newAvatar) {
          const formDataAvatar = new FormData();
          formDataAvatar.append("files", newAvatar);
          formDataAvatar.append("folderName", "avatar");

          const avatarResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`,
            {
              method: "POST",
              body: formDataAvatar,
            }
          );

          const avatarData = await avatarResponse.json();
          console.log(avatarData);
          newUrl = avatarData[0].url; // Lấy URL của ảnh đã upload
          console.log(newUrl);
          localStorage.setItem("avtUrl", newUrl);

          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/doctor/changeInfo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              doctorID: doctor?.ma_bac_si,
              email: formData.email,
              fullName: formData.ho_va_ten,
              phoneNumber: formData.sdt,
              birthDay: formData.ngay_sinh,
              gender: formData.gioi_tinh,
              description: formData.mo_ta,
              newAvatar: newUrl,
            }),
          });
        } else {
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/doctor/changeInfo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              doctorID: doctor?.ma_bac_si,
              email: formData.email,
              fullName: formData.ho_va_ten,
              phoneNumber: formData.sdt,
              birthDay: formData.ngay_sinh,
              gender: formData.gioi_tinh,
              description: formData.mo_ta,
            }),
          });
        }

        localStorage.setItem("fullName", formData.ho_va_ten);

        Swal.fire({
          title: "Thành công!",
          text: "Thông tin bác sĩ và avatar đã được cập nhật.",
          icon: "success",
          width: "350px",
          confirmButtonText: "Đóng",
          customClass: {
            popup: "rounded-lg",
            title: "text-base",
            confirmButton: "px-3 py-2 text-sm",
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Lỗi!",
          text:
            error instanceof Error
              ? error.message
              : "Đã xảy ra lỗi khi cập nhật.",
          icon: "error",
          width: "350px",
          confirmButtonText: "Đóng",
          customClass: {
            popup: "rounded-lg",
            title: "text-base",
            confirmButton: "px-3 py-2 text-sm",
          },
        });
      }
    }
  };

  // Đổi mật khẩu
  const [isChangePassword, setIsChangePassword] = useState(false);
  const toggleChangePassword = () => {
    setIsChangePassword(!isChangePassword);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="h-full bg-gray-100 p-2">
      {/* Thanh điều hướng */}
      <NavBar curPage="profile" />

      {/* Nội dung chính */}
      <div className="bg-white px-8 py-4 rounded-lg shadow-md">
        {/* Ảnh đại diện */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={
              avatarPreview || doctor?.Nguoi_dung.avt_url || "./images/avt.png"
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full cursor-pointer"
            onClick={() => document.getElementById("avatar-input")?.click()} // Khi click vào ảnh, mở file input
          />
          {/* Input file ẩn */}
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Form thông tin cá nhân */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <label className="text-sm font-medium block mb-2">Email</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              Tên đăng nhập
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              value={formData.ten_dang_nhap}
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Họ và tên</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.ho_va_ten}
              onChange={(e) =>
                setFormData({ ...formData, ho_va_ten: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">SĐT</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.sdt}
              onChange={(e) =>
                setFormData({ ...formData, sdt: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Giới tính</label>
            <select
              className="w-full px-3 py-2 border rounded-lg bg-white"
              value={formData.gioi_tinh}
              onChange={(e) =>
                setFormData({ ...formData, gioi_tinh: e.target.value })
              }
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Ngày sinh</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="date"
              value={formData.ngay_sinh}
              onChange={(e) =>
                setFormData({ ...formData, ngay_sinh: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              Thời điểm vào nghề
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="date"
              value={formData.ngay_vao_nghe}
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              Chuyên khoa
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.chuyen_khoa}
              disabled
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-2">
              Địa chỉ phòng khám
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.dia_chi_pk}
              disabled
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-2">Mô tả</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
              value={formData.mo_ta}
              onChange={(e) =>
                setFormData({ ...formData, mo_ta: e.target.value })
              }
            />
          </div>
        </div>

        {/* Nút chức năng */}
        <div className="flex justify-end gap-4 mt-3">
          <button
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={toggleChangePassword}
          >
            Đổi mật khẩu
          </button>
          <button
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            onClick={handleUpdateDoctor}
          >
            Chỉnh sửa
          </button>
        </div>

        {/* Modal đổi mật khẩu */}
        <ChangePasswordModal
          isOpen={isChangePassword}
          setIsOpen={toggleChangePassword}
          username={doctor?.Nguoi_dung.ten_dang_nhap || ""}
        />
      </div>
    </div>
  );
};

export default DoctorSettingInfo;
