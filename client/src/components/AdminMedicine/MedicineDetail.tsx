import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdDelete, MdDeleteForever, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import defaultImg from "../../assets/images/medicine.jpg";

interface MedicineDetail {
  id: number;
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
  truoc_an: boolean;
}

const MedicineDetail: React.FC = () => {
  const [medicineDetail, setMedicineDetail] = useState<MedicineDetail | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<MedicineDetail | null>(null);
  const [originalFormData, setOriginalFormData] =
    useState<MedicineDetail | null>(null);
  const medicineID = useParams().id; // Lấy ID thuốc từ URL
  const navigate = useNavigate();
  const [previewImg, setPreviewImg] = useState<string>("");
  const [newImg, setNewImg] = useState<File | null>(null);

  useEffect(() => {
    const fetchMedicineDetail = async () => {
      try {
        console.log("Fetching medicine detail for ID:", medicineID);
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/diagnosis/medicine/${medicineID}`
        );
        console.log("Response:", response);
        const data = await response.json();
        console.log("Medicine detail data:", data);
        setMedicineDetail(data);
        setFormData(data); // Khởi tạo form với dữ liệu hiện tại
        setOriginalFormData(data); // Lưu dữ liệu gốc
        setPreviewImg(data.url); // Lưu URL ảnh ban đầu vào previewImg
      } catch (error) {
        console.error("Error fetching medicine detail:", error);
      }
    };

    fetchMedicineDetail();
  }, [medicineID]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Kiểm tra trùng tên thành phần
    const ingredientNames = formData?.Thanh_phan?.map((tp) =>
      tp.ten_thanh_phan.toLowerCase()
    );
    if (
      ingredientNames &&
      new Set(ingredientNames).size !== ingredientNames.length
    ) {
      Swal.fire("Lỗi", "Các thành phần không được trùng tên!", "error");
      return;
    }

    // Kiểm tra không được thiếu trường nào
    const requiredFields: (keyof MedicineDetail)[] = [
      "ten_thuoc",
      "mo_ta",
      "don_vi",
      "cong_dung",
      "cach_dung",
      "chong_chi_dinh",
    ];

    const missingFields = requiredFields.filter((field) => {
      const v = (formData as any)[field];
      return !v || (typeof v === "string" && v.trim() === "");
    });

    if (missingFields.length > 0) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin!!", "error");
      return;
    }

    // Thành phần k dc trống
    if (
      formData?.Thanh_phan.length === 0 ||
      formData?.Thanh_phan.some((tp) => !tp.ten_thanh_phan || !tp.ham_luong)
    ) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin thành phần!", "error");
      return;
    }

    // thu thập chỉ các trường thay đổi
    const updates: Partial<MedicineDetail> & { id: number } = {
      id: Number(medicineID),
    };

    const fields: (keyof Omit<MedicineDetail, "id" | "Thanh_phan">)[] = [
      "ten_thuoc",
      "mo_ta",
      "don_vi",
      "cong_dung",
      "cach_dung",
      "chong_chi_dinh",
      "url",
      "truoc_an",
    ];

    for (const field of fields) {
      if (
        formData &&
        originalFormData &&
        formData[field] !== originalFormData[field]
      ) {
        (updates as any)[field] = formData[field];
      }
    }

    // luôn gửi thành phần mới nhất
    updates.Thanh_phan = formData?.Thanh_phan;

    console.log("Gửi đi:", updates.Thanh_phan);

    // Hiển thị Swal loading
    Swal.fire({
      title: "Đang cập nhật...",
      text: "Vui lòng đợi trong khi chúng tôi cập nhật dữ liệu.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Hiển thị loading spinner
      },
    });

    if (newImg) {
      const formData = new FormData();
      formData.append("files", newImg);
      formData.append("folderName", "medicine");

      const avatarResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const avatarData = await avatarResponse.json();
      console.log(avatarData);

      updates.url = avatarData[0].url; // Cập nhật URL ảnh mới vào updates
    }

    console.log("Gửi đi updates:", updates);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/diagnosis/medicine/${medicineID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const updated: MedicineDetail = await res.json();
      //Thêm thành phần mới vô updated
      updated.Thanh_phan = formData?.Thanh_phan || [];
      console.log("Updated medicine detail:", updated);

      setMedicineDetail(updated);
      setOriginalFormData(updated);
      setIsEditing(false);

      Swal.close();

      Swal.fire(
        "Lưu thành công!",
        "Thông tin thuốc đã được cập nhật.",
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire(
        "Lỗi",
        "Không thể cập nhật dữ liệu. Vui lòng thử lại.",
        "error"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleIngredientChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      const updatedIngredients = [...formData.Thanh_phan];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [name]: value,
      };
      setFormData({ ...formData, Thanh_phan: updatedIngredients });
    }
  };

  const handleAddIngredient = () => {
    if (formData) {
      const newIngredient = {
        ten_thanh_phan: "",
        ham_luong: "",
      };
      setFormData({
        ...formData,
        Thanh_phan: [...formData.Thanh_phan, newIngredient],
      });
    }
  };

  const handleDeleteIngredient = (index: number) => {
    if (formData) {
      const updatedIngredients = formData.Thanh_phan.filter(
        (_, i) => i !== index
      );
      setFormData({ ...formData, Thanh_phan: updatedIngredients });
    }
  };

  const handleCancelEdit = () => {
    setFormData(originalFormData); // Khôi phục dữ liệu ban đầu
    setIsEditing(false);
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa thuốc này?",
      text: "Thông tin này sẽ không thể phục hồi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Đã xóa", "Thuốc đã được xóa.", "success");
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idList: [medicineID] }),
        });

        navigate("/medicineList");
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewImg(file); // Lưu file ảnh mới vào state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result as string); // Hiển thị ảnh trước khi upload
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-2 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Title and Image Section */}
        <div className="text-center mb-6 flex flex-col">
          <img
            src={
              previewImg ||
              (medicineDetail?.url ? medicineDetail.url : defaultImg)
            }
            alt={medicineDetail?.ten_thuoc}
            className={`
              w-32 h-32 object-cover mb-4 mx-auto rounded
              ${
                isEditing
                  ? "border-2 border-dashed border-blue-400 cursor-pointer"
                  : ""
              }
            `}
            onClick={() => {
              if (isEditing) {
                document.getElementById("avatar-input")?.click();
              }
            }}
          />
          {/* Input file ẩn */}
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {isEditing ? (
            <input
              type="text"
              name="ten_thuoc"
              value={formData?.ten_thuoc || ""}
              onChange={handleChange}
              className="text-2xl font-semibold mb-2 p-2 border border-gray-300 rounded max-w-xs mx-auto"
            />
          ) : (
            <h2 className="text-2xl font-semibold">
              {medicineDetail?.ten_thuoc}
            </h2>
          )}
          {isEditing ? (
            <input
              type="text"
              name="don_vi"
              value={formData?.don_vi || ""}
              onChange={handleChange}
              className="text-gray-500 p-2 border border-gray-300 rounded max-w-xs mx-auto"
            />
          ) : (
            <p className="text-gray-500">({medicineDetail?.don_vi})</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-6">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
              >
                <MdEdit />
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg"
              >
                <MdDeleteForever />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blueButton hover:bg-blueButtonHover text-white rounded-lg"
              >
                Lưu
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded-lg"
              >
                Hủy
              </button>
            </>
          )}
        </div>

        {/* Overview Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Giới thiệu</h3>
          {isEditing ? (
            <textarea
              name="mo_ta"
              value={formData?.mo_ta || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows={5}
            />
          ) : (
            <p className="text-gray-700">{medicineDetail?.mo_ta}</p>
          )}
        </section>

        {/* Usage Instructions Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Công dụng</h3>
          {isEditing ? (
            <textarea
              name="cong_dung"
              value={formData?.cong_dung || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows={5}
            />
          ) : (
            <p className="text-gray-700">{medicineDetail?.cong_dung}</p>
          )}
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Cách dùng</h3>
          {isEditing ? (
            <textarea
              name="cach_dung"
              value={formData?.cach_dung || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows={5}
            />
          ) : (
            <p className="text-gray-700">{medicineDetail?.cach_dung}</p>
          )}
        </section>

        {/* Precautions Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Chống chỉ định</h3>
          {isEditing ? (
            <textarea
              name="chong_chi_dinh"
              value={formData?.chong_chi_dinh || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          ) : (
            <p className="text-gray-700">{medicineDetail?.chong_chi_dinh}</p>
          )}
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Thời điểm sử dụng</h3>
          {isEditing ? (
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData?.truoc_an}
                    onChange={() => {
                      console.log("Current State:", formData?.truoc_an);
                      setFormData((prev) =>
                        prev ? { ...prev, truoc_an: !prev.truoc_an } : prev
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-full transition"></div>
                </div>
                <span className="ml-3 text-sm text-gray-700">
                  {formData?.truoc_an
                    ? "Thuốc dùng trước khi ăn"
                    : "Thuốc dùng sau khi ăn"}
                </span>
              </label>
            </div>
          ) : (
            <p className="text-gray-700">
              {medicineDetail?.truoc_an
                ? "Thuốc dùng trước khi ăn"
                : "Thuốc dùng sau khi ăn"}
            </p>
          )}
        </section>

        {/* Ingredients Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Thành phần</h3>
          {isEditing && (
            <button
              onClick={handleAddIngredient}
              className="px-4 py-2 bg-yellow-500 text-white rounded m-2 text-sm"
            >
              Thêm Thành Phần
            </button>
          )}
          <ul className="list-disc pl-2 space-y-1">
            {formData?.Thanh_phan.map((tp, index) => (
              <li
                key={index}
                className="text-gray-700 flex justify-start items-center"
              >
                <input
                  type="text"
                  name="ten_thanh_phan"
                  value={tp.ten_thanh_phan}
                  onChange={(e) => handleIngredientChange(index, e)}
                  disabled={!isEditing}
                  className="p-1 m-1 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="ham_luong"
                  value={tp.ham_luong}
                  onChange={(e) => handleIngredientChange(index, e)}
                  disabled={!isEditing}
                  className="p-1 m-1 border border-gray-300 rounded"
                />
                {isEditing && (
                  <button
                    onClick={() => handleDeleteIngredient(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <MdDelete size={20} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default MedicineDetail;
