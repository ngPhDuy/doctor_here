import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextInput, TextAreaInput } from "../Input/InputComponents"; // Các component nhập liệu
import Swal from "sweetalert2";

interface Medicine {
  id: number;
  ten_thuoc: string;
  mo_ta: string;
  don_vi: string;
}

const defaultMedicine: Medicine = {
  id: 0,
  ten_thuoc: "",
  mo_ta: "",
  don_vi: "",
};

const MedicineInfor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine>(defaultMedicine);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMedicine = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/medicine/${id}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải thông tin thuốc.");
      }
      const data = await response.json();
      setMedicine(data);
    } catch (err) {
      setError("Lỗi khi tải thông tin thuốc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //set mẫu
    setMedicine({
      id: 1,
      ten_thuoc: "Paracetamol",
      mo_ta: "Giảm đau, hạ sốt",
      don_vi: "Viên nén",
    });
    // fetchMedicine();
  }, [id]);

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setMedicine((prevData) => ({
        ...prevData,
        [field]: e.target.value,
      }));
    };

  const [isChangeMedicineInfor, setIsChangeMedicineInfor] = useState(false);

  const toggleChangeMedicineInfor = () => {
    setIsChangeMedicineInfor(!isChangeMedicineInfor);
    fetchMedicine(); // Fetch lại thông tin khi đóng modal
  };

  return (
    <div className="h-full bg-gray-50 p-2">
      <div className="flex gap-4 h-full">
        {/* Thông tin thuốc bên trái */}
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
            <h2 className="text-lg font-semibold ml-4">Chi tiết thuốc</h2>
          </div>

          <div className="grid gap-4 mb-4 sm:grid-cols-2 my-4">
            {[
              { id: "ten_thuoc", label: "Tên thuốc", type: "text" },
              { id: "don_vi", label: "Đơn vị", type: "text" },
            ].map((input) => (
              <div key={input.id}>
                <TextInput
                  label={input.label}
                  id={input.id}
                  type={input.type}
                  value={String(
                    medicine[input.id as keyof typeof medicine] ?? ""
                  )}
                  onChange={(e) => handleChange(input.id)(e)}
                  disabled={true}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <TextAreaInput
              label="Mô tả"
              id="mo_ta"
              value={medicine.mo_ta}
              onChange={handleChange("mo_ta")}
              disabled={true}
            />
          </div>

          <div className="flex justify-end mt-10 mb-20">
            <button
              className="px-4 py-2 mr-3 bg-blueButton hover:bg-blueButtonHover text-white rounded-lg"
              onClick={toggleChangeMedicineInfor}
            >
              Chỉnh sửa
            </button>
          </div>
        </div>

        {/* Thông tin bên phải */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-base">
            <p className="font-semibold text-center">{medicine.ten_thuoc}</p>
          </div>

          <hr className="my-3" />
          <div className="ml-5 text-base">
            {[
              { label: "Đơn vị", value: medicine.don_vi },
              { label: "Mô tả", value: medicine.mo_ta },
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

export default MedicineInfor;
