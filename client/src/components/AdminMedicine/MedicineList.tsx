import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdOutlineAddBox, MdDeleteForever, MdDehaze } from "react-icons/md";

interface Medicine {
  id: number;
  ten_thuoc: string;
  mo_ta: string;
  don_vi: string;
}

interface MedicineDetail {
  id: number;
  ten_thuoc: string;
  mo_ta: string;
  don_vi: string;
  ten_thuoc_moi: string;
  don_vi_moi: string;
  mo_ta_moi: string;
}

const unitList = [
  "Viên nang",
  "Dạng viên uống",
  "Viên nén",
  "Tiêm",
  "Kem bôi",
  "Dạng gel bôi",
];

const MedicineList: React.FC = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [unitFilter, setUnitFilter] = useState<string>("");
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerpage = 10;

  const indexOfLastRequest = currentPage * requestsPerpage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerpage;
  const currentRequest = filteredMedicines.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  // Chuyển trang
  const totalPages = Math.ceil(filteredMedicines.length / requestsPerpage);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`
        );
        const data = await response.json();
        setMedicines(data);
        setFilteredMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    let filtered = medicines.filter((medicine) =>
      medicine.ten_thuoc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (unitFilter) {
      filtered = filtered.filter((medicine) =>
        medicine.don_vi.toLowerCase().includes(unitFilter.toLowerCase())
      );
    }
    setFilteredMedicines(filtered);
    setCurrentPage(1);
  }, [searchTerm, medicines, unitFilter]);

  // State cho thêm thuốc mới
  const [isAddMedicine, setIsAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    id: 0,
    ten_thuoc: "",
    mo_ta: "",
    don_vi: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewMedicine({
      ...newMedicine,
      [name]: value,
    });
  };

  const handleAddMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMedicine.ten_thuoc || !newMedicine.don_vi || !newMedicine.mo_ta) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Tất cả các trường là bắt buộc!",
      });
      return;
    }

    // Gọi API để thêm thuốc mới vào cơ sở dữ liệu
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMedicine),
      }
    );

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể thêm thuốc mới.",
      });
      return;
    }

    const medicineData = await response.json();
    console.log("Thêm thuốc mới:", medicineData);

    setMedicines((prevMedicines) => [...prevMedicines, medicineData]);
    setFilteredMedicines((prevMedicines) => [...prevMedicines, medicineData]);

    setIsAddMedicine(false);
    Swal.fire({
      icon: "success",
      title: "Thêm thuốc thành công!",
    });
  };

  const toggleModalAdd = () => {
    setIsAddMedicine(!isAddMedicine);
  };

  // State cho xóa thuốc
  const [selectedMedicines, setSelectedMedicines] = useState<number[]>([]); // Mảng để lưu id của các thuốc đã chọn

  const handleCheckboxChange = (id: number) => {
    setSelectedMedicines((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa các thuốc đã chọn?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const newMedicines = medicines.filter(
          (medicine) => !selectedMedicines.includes(medicine.id)
        );
        setMedicines(newMedicines);
        setFilteredMedicines(newMedicines);
        setSelectedMedicines([]);
        Swal.fire("Đã xóa", "Các thuốc đã chọn đã bị xóa.", "success");
      }
    });
  };

  // State cho chi tiết thuốc
  const [isMedicineDetailModalOpen, setIsMedicineDetailModalOpen] =
    useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineDetail | null>(null);

  const openMedicineDetailModal = (medicine: Medicine) => {
    console.log("Selected medicine:", {
      ...medicine,
      ten_thuoc_moi: medicine.ten_thuoc,
      don_vi_moi: medicine.don_vi,
      mo_ta_moi: medicine.mo_ta,
    });

    setSelectedMedicine({
      ...medicine,
      ten_thuoc_moi: medicine.ten_thuoc,
      don_vi_moi: medicine.don_vi,
      mo_ta_moi: medicine.mo_ta,
    });
    setIsMedicineDetailModalOpen(true);
  };

  const closeMedicineDetailModal = () => {
    setIsMedicineDetailModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleMedicineDetailChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: string
  ) => {
    if (selectedMedicine) {
      setSelectedMedicine({
        ...selectedMedicine,
        [field]: e.target.value,
      });
    }
  };

  const handleSaveMedicineDetail = () => {
    if (selectedMedicine) {
      // API call to update the medicine data can be added here
      const updatedMedicine = async () => {
        let body: Record<string, any> = {};

        if (selectedMedicine.ten_thuoc !== selectedMedicine.ten_thuoc_moi) {
          body["ten_thuoc"] = selectedMedicine.ten_thuoc_moi;
        }

        if (selectedMedicine.don_vi !== selectedMedicine.don_vi_moi) {
          body["don_vi"] = selectedMedicine.don_vi_moi;
        }

        if (selectedMedicine.mo_ta !== selectedMedicine.mo_ta_moi) {
          body["mo_ta"] = selectedMedicine.mo_ta_moi;
        }

        console.log("Body:", body);
        console.log(Object.keys(body).length);

        if (Object.keys(body).length === 0) {
          Swal.fire({
            icon: "info",
            title: "Thông báo",
            text: "Không có thay đổi nào để lưu.",
          });
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine/${
            selectedMedicine.id
          }`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể cập nhật thông tin thuốc.",
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: "Cập nhật thông tin thuốc thành công!",
        });

        // Cập nhật lại ở medicines
        setMedicines((prevMedicines) =>
          prevMedicines.map((medicine) =>
            medicine.id === selectedMedicine.id
              ? {
                  ...medicine,
                  ten_thuoc: selectedMedicine.ten_thuoc_moi,
                  don_vi: selectedMedicine.don_vi_moi,
                  mo_ta: selectedMedicine.mo_ta_moi,
                }
              : medicine
          )
        );
        setFilteredMedicines((prevMedicines) =>
          prevMedicines.map((medicine) =>
            medicine.id === selectedMedicine.id
              ? {
                  ...medicine,
                  ten_thuoc: selectedMedicine.ten_thuoc_moi,
                  don_vi: selectedMedicine.don_vi_moi,
                  mo_ta: selectedMedicine.mo_ta_moi,
                }
              : medicine
          )
        );
        closeMedicineDetailModal();
      };

      updatedMedicine();
    }
  };

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold text-lg">
          <p>Thuốc ({filteredMedicines.length})</p>
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Tên hoặc mã bệnh nhân"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 outline-none px-2"
            />
            <FiSearch size={18} />
          </div>
          <select
            value={unitFilter}
            onChange={(e) => {
              setUnitFilter(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500"
          >
            <option value="">Tất cả đơn vị</option>
            {unitList.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <button className="flex items-center p-2" onClick={toggleModalAdd}>
            <MdOutlineAddBox
              size={25}
              className="cursor-pointer hover:bg-gray-200"
            />
          </button>
          {selectedMedicines.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center p-2"
            >
              <MdDeleteForever
                size={25}
                className={`cursor-pointer hover:bg-gray-200`}
              />
            </button>
          )}
        </div>
      </div>

      <table className="table-auto w-full text-center border border-gray-300 rounded-lg shadow-lg">
        <thead className="text-gray-600 text-base bg-gray-100">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                onChange={() => {
                  if (selectedMedicines.length === filteredMedicines.length) {
                    setSelectedMedicines([]);
                  } else {
                    setSelectedMedicines(
                      filteredMedicines.map((med) => med.id)
                    );
                  }
                }}
                checked={selectedMedicines.length === filteredMedicines.length}
              />
            </th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã thuốc</th>
            <th className="px-4 py-2">Tên thuốc</th>
            <th className="px-4 py-2">Đơn vị</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {currentRequest.map((medicine, index) => (
            <tr key={medicine.id} className="bg-white">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedMedicines.includes(medicine.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(medicine.id);
                  }}
                />
              </td>
              <td className="px-4 py-3">{indexOfFirstRequest + index + 1}</td>
              <td className="px-4 py-3">{`#${medicine.id}`}</td>
              <td className="px-4 py-3">{medicine.ten_thuoc}</td>
              <td className="px-4 py-3">{medicine.don_vi}</td>
              <td className="px-4 py-3 truncate max-w-60">{medicine.mo_ta}</td>
              <td className="px-4 py-3 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngừng sự kiện click trên dòng
                    openMedicineDetailModal(medicine); // Mở modal chi tiết
                  }}
                  className="flex items-center p-2"
                >
                  <MdDehaze size={20} className="m-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-5 space-x-4 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Trước
          </button>
          <span className="px-4 py-2 border rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal Add Medicine */}
      {isAddMedicine && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsAddMedicine(false)}
        >
          <div
            className="bg-white p-8 rounded-lg w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Thêm thuốc mới</h2>
            <form onSubmit={handleAddMedicineSubmit}>
              <div className="mb-4">
                <label className="block text-sm">Tên thuốc</label>
                <input
                  type="text"
                  name="ten_thuoc"
                  value={newMedicine.ten_thuoc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Đơn vị</label>
                <select
                  name="don_vi"
                  value={newMedicine.don_vi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Chọn đơn vị</option>
                  {unitList.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm">Mô tả</label>
                <input
                  type="text"
                  name="mo_ta"
                  value={newMedicine.mo_ta}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thông tin chi tiết thuốc */}
      {isMedicineDetailModalOpen && selectedMedicine && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeMedicineDetailModal}
        >
          <div
            className="bg-white p-8 rounded-lg w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Chi tiết thuốc</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm">Tên thuốc</label>
                <input
                  type="text"
                  value={selectedMedicine.ten_thuoc_moi}
                  onChange={(e) =>
                    handleMedicineDetailChange(e, "ten_thuoc_moi")
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Đơn vị</label>
                <select
                  value={selectedMedicine.don_vi_moi}
                  onChange={(e) => handleMedicineDetailChange(e, "don_vi_moi")}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {unitList.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm">Mô tả</label>
                <textarea
                  value={selectedMedicine.mo_ta_moi}
                  onChange={(e) => handleMedicineDetailChange(e, "mo_ta_moi")}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  onClick={handleSaveMedicineDetail}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineList;
