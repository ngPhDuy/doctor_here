import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  MdOutlineAddBox,
  MdDeleteForever,
  MdDescription,
} from "react-icons/md";

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
  const [totalMedicines, setTotalMedicines] = useState<number>(0);
  const [currentMedicines, setCurrentMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  // const indexOfLastRequest = currentPage * requestsPerPage;
  // const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  // const currentRequest = medicines.slice(
  //   indexOfFirstRequest,
  //   indexOfLastRequest
  // );
  // console.log(
  //   "Page: ",
  //   currentPage,
  //   indexOfFirstRequest,
  //   indexOfLastRequest,
  //   currentRequest
  // );

  // Total number of pages based on the total count from API
  const totalPages = Math.ceil(totalMedicines / requestsPerPage);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const limit = 10;
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/diagnosis/medicine?page=${currentPage}&search=${searchTerm}&limit=${limit}`
        );
        const data = await response.json();
        console.log(data);
        setMedicines(data.medicines);
        setTotalMedicines(data.total); // Set total medicines count from API
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when search term changes
  }, [searchTerm]);

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
        setSelectedMedicines([]);
        Swal.fire("Đã xóa", "Các thuốc đã chọn đã bị xóa.", "success");
        // call api
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idList: selectedMedicines }),
        });
      }
    });
  };

  const handleDeleteMedicine = (id: number) => {
    Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa thuốc này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const newMedicines = medicines.filter((medicine) => medicine.id !== id);
        setMedicines(newMedicines);
        Swal.fire("Đã xóa", "Thuốc đã được xóa.", "success");
        setTotalMedicines(totalMedicines - 1);
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idList: [id] }),
        });
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Pagination functions
  const handlePageChange = (page: number) => {
    console.log("Go to page:", page);
    setCurrentPage(page);
  };

  return (
    <div className="p-2 h-full bg-gray-50">
      <div className="flex items-center w-full pb-4 p-3 mb-4 justify-between bg-white shadow-md">
        <div className="font-semibold text-lg">
          <p>Thuốc ({totalMedicines})</p>
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Tên thuốc..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 outline-none px-2"
            />
            <FiSearch size={18} />
          </div>
          <button
            className="flex items-center p-2"
            onClick={() => navigate("/medicine/add")}
          >
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
            {/* <th className="px-4 py-2">
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
            </th> */}
            <th className="px-4 py-2">Mã thuốc</th>
            <th className="px-4 py-2">Tên thuốc</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine, index) => (
            <tr key={medicine.id} className="bg-white">
              {/* <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedMedicines.includes(medicine.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(medicine.id);
                  }}
                />
              </td> */}
              <td className="px-4 py-3">{`#${medicine.id}`}</td>
              <td className="px-4 py-3">{medicine.ten_thuoc}</td>
              <td className="px-4 py-3 truncate max-w-60">{medicine.mo_ta}</td>
              <td className="px-4 py-3 flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngừng sự kiện click trên dòng
                    navigate(`/medicine/${medicine.id}`); // Chuyển đến trang chi tiết thuốc
                  }}
                  className="flex items-center p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  <MdDescription size={20} className="m-auto" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngừng sự kiện click trên dòng
                    handleDeleteMedicine(medicine.id); // Xóa thuốc
                  }}
                  className="flex items-center p-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  <MdDeleteForever size={20} className="m-auto" />
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
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  );
};

export default MedicineList;
