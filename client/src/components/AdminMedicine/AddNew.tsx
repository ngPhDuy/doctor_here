import React, { useState } from "react";
import Swal from "sweetalert2";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../assets/images/medicine.jpg";

interface MedicineDetail {
  ten_thuoc: string;
  mo_ta: string;
  don_vi: string;
  cong_dung: string;
  cach_dung: string;
  chong_chi_dinh: string;
  url: string;
  Thanh_phan: {
    ten_thanh_phan: string;
    ham_luong: string;
  }[];
}

const CreateMedicine: React.FC = () => {
  const navigate = useNavigate();

  // Khởi tạo form với các giá trị rỗng
  const [formData, setFormData] = useState<MedicineDetail>({
    ten_thuoc: "",
    mo_ta: "",
    don_vi: "",
    cong_dung: "",
    cach_dung: "",
    chong_chi_dinh: "",
    url: "",
    Thanh_phan: [],
  });

  const [previewImg, setPreviewImg] = useState<string>(defaultImg);
  const [newImg, setNewImg] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const list = [...prev.Thanh_phan];
      list[idx] = { ...list[idx], [name]: value };
      return { ...prev, Thanh_phan: list };
    });
  };

  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      Thanh_phan: [...prev.Thanh_phan, { ten_thanh_phan: "", ham_luong: "" }],
    }));
  };

  const handleDeleteIngredient = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      Thanh_phan: prev.Thanh_phan.filter((_, i) => i !== idx),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setNewImg(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // 1. Validate bắt buộc
    const required: (keyof MedicineDetail)[] = [
      "ten_thuoc",
      "mo_ta",
      "don_vi",
      "cong_dung",
      "cach_dung",
      "chong_chi_dinh",
    ];
    const missing = required.filter(
      (f) =>
        !formData[f] || (typeof formData[f] === "string" && !formData[f].trim())
    );
    if (missing.length) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    // 2. Validate thành phần
    if (
      formData.Thanh_phan.length === 0 ||
      formData.Thanh_phan.some((tp) => !tp.ten_thanh_phan || !tp.ham_luong)
    ) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin thành phần!", "error");
      return;
    }
    const names = formData.Thanh_phan.map((tp) =>
      tp.ten_thanh_phan.toLowerCase()
    );
    if (new Set(names).size !== names.length) {
      Swal.fire("Lỗi", "Các thành phần không được trùng tên!", "error");
      return;
    }

    // 3. Loading
    Swal.fire({
      title: "Đang tạo thuốc...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    // 4. Upload ảnh nếu có
    let imageUrl = "";
    if (newImg) {
      const fd = new FormData();
      fd.append("files", newImg);
      fd.append("folderName", "medicine");
      const r = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`,
        { method: "POST", body: fd }
      );
      const data = await r.json();
      imageUrl = data[0].url;
    }

    // 5. POST tạo mới
    try {
      const payload = {
        ...formData,
        url: imageUrl || "", // url rỗng nếu ko upload
      };
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      const newMedicine = await res.json();
      Swal.close();
      Swal.fire({
        title: "Thành công!",
        text: "Bạn muốn làm gì tiếp theo?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Xem chi tiết",
        cancelButtonText: "Tạo mới tiếp",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // 1. Chuyển sang trang chi tiết của thuốc vừa tạo
          navigate(`/medicine/${newMedicine.id}`);
        } else {
          // 2. Giữ lại trên trang và reset form để tạo mới
          setFormData({
            ten_thuoc: "",
            mo_ta: "",
            don_vi: "",
            cong_dung: "",
            cach_dung: "",
            chong_chi_dinh: "",
            url: "",
            Thanh_phan: [],
          });
          setPreviewImg(defaultImg);
          setNewImg(null);
        }
      });
    } catch (err) {
      console.error(err);
      Swal.close();
      Swal.fire(
        "Lỗi",
        "Có lỗi khi thêm thuốc mới. Vui lòng kiểm tra lại thông tin.",
        "error"
      );
    }
  };

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Tạo Thuốc Mới</h1>

        {/* Avatar Upload */}
        <div className="text-center mb-6">
          <div className="relative inline-block group">
            <img
              src={previewImg}
              alt="preview"
              className={`w-32 h-32 object-cover rounded mb-2 ${"cursor-pointer border-2 border-dashed border-blue-400"}`}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <MdEdit className="text-white text-3xl" />
            </div>
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Tên Thuốc</label>
            <input
              name="ten_thuoc"
              value={formData.ten_thuoc}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Đơn vị</label>
            <input
              name="don_vi"
              value={formData.don_vi}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Giới thiệu</label>
            <textarea
              name="mo_ta"
              value={formData.mo_ta}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Công dụng</label>
            <textarea
              name="cong_dung"
              value={formData.cong_dung}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Cách dùng</label>
            <textarea
              name="cach_dung"
              value={formData.cach_dung}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Chống chỉ định</label>
            <textarea
              name="chong_chi_dinh"
              value={formData.chong_chi_dinh}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-medium mb-2">Thành phần</h3>
            <button
              onClick={handleAddIngredient}
              className="px-4 py-2 bg-yellow-500 text-white rounded m-2 text-sm"
            >
              Thêm thành phần
            </button>
            <ul className="space-y-2">
              {formData.Thanh_phan.map((tp, index) => (
                <li
                  key={index}
                  className="text-gray-700 flex justify-start items-center"
                >
                  <input
                    type="text"
                    name="ten_thanh_phan"
                    value={tp.ten_thanh_phan}
                    onChange={(e) => handleIngredientChange(index, e)}
                    className="p-1 m-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    name="ham_luong"
                    value={tp.ham_luong}
                    onChange={(e) => handleIngredientChange(index, e)}
                    className="p-1 m-1 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleDeleteIngredient(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <MdDelete size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blueButton hover:bg-blueButtonHover text-white rounded-lg"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMedicine;
