import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const DoctorRequest: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    chuyen_khoa: "",
    dia_chi_pk: "",
    trinh_do_hoc_van: "",
    files: [] as File[],
  });

  // Fake data cho bảng
  const requestHistory = [
    {
      id: "2110168498",
      time: "20:10 20/12/2023",
      result: "Chấp thuận",
      reviewer: "Admin1",
    },
    {
      id: "3156874561",
      time: "22:11 22/11/2023",
      result: "Từ chối",
      reviewer: "Admin1",
    },
    {
      id: "1024587845",
      time: "08:30 10/01/2024",
      result: "Chấp thuận",
      reviewer: "Admin2",
    },
    {
      id: "7485901234",
      time: "09:00 11/01/2024",
      result: "Chờ duyệt",
      reviewer: "Admin3",
    },
    {
      id: "3154789521",
      time: "12:15 12/01/2024",
      result: "Từ chối",
      reviewer: "Admin4",
    },
    {
      id: "5812369571",
      time: "14:45 13/01/2024",
      result: "Chấp thuận",
      reviewer: "Admin5",
    },
    {
      id: "9746538492",
      time: "10:25 15/01/2024",
      result: "Chờ duyệt",
      reviewer: "Admin6",
    },
    {
      id: "8357021493",
      time: "16:00 17/01/2024",
      result: "Chấp thuận",
      reviewer: "Admin7",
    },
    {
      id: "5812369571",
      time: "14:45 13/01/2024",
      result: "Chấp thuận",
      reviewer: "Admin5",
    },
    {
      id: "9746538492",
      time: "10:25 15/01/2024",
      result: "Chờ duyệt",
      reviewer: "Admin6",
    },
    {
      id: "8357021493",
      time: "16:00 17/01/2024",
      result: "Chấp thuận",
      reviewer: "Admin7",
    },
  ];

  const recordsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm xử lý thay đổi input text hoặc select
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý thay đổi file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // Kiểm tra số lượng file đã chọn
    if (formData.files.length + selectedFiles.length > 5) {
      alert("Bạn chỉ có thể chọn tối đa 5 hình ảnh.");
      return;
    }

    // Cập nhật lại state files, nối thêm file mới vào
    setFormData({
      ...formData,
      files: [...formData.files, ...selectedFiles], // Nối thêm file mới vào danh sách
    });
  };

  // Xóa file đã chọn
  const handleDeleteFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    setFormData({ ...formData, files: newFiles });
  };

  const handleSubmitRequest = async () => {
    Swal.fire({
      title: "Xác nhận gửi yêu cầu?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Gửi yêu cầu",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newForm = new FormData();
          newForm.append("doctorID", "BS0000001");
          newForm.append("speciality", formData.chuyen_khoa);
          newForm.append("address", formData.dia_chi_pk);
          newForm.append("education", formData.trinh_do_hoc_van);

          // Thêm các file vào FormData
          formData.files.forEach((file) => {
            newForm.append("files", file);
          });

          const response = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/api/updateRequest/createUpdateRequest`,
            {
              method: "POST",
              body: newForm,
            }
          );

          if (response.ok) {
            Swal.fire("Thành công!", "Yêu cầu của bạn đã được gửi.", "success");
          } else {
            Swal.fire("Lỗi", "Đã có lỗi xảy ra khi gửi yêu cầu.", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Lỗi", "Đã có lỗi xảy ra khi gửi yêu cầu.", "error");
        }
      }
    });
  };

  // Logic to calculate visible records based on the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = requestHistory.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(requestHistory.length / recordsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="h-full bg-gray-100 p-3">
      {/* Thanh điều hướng */}
      <div className="flex items-center p-3 mb-4 bg-white rounded-lg shadow-md">
        <div
          className="p-3 cursor-pointer"
          onClick={() => navigate("/doctorList")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.57 5.92969L3.5 11.9997L9.57 18.0697"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5 12H3.67001"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="mr-5 cursor-pointer">
          <p className="font-semibold text-lg mb-1 ml-1">Cá nhân</p>
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <p className="font-semibold text-lg mb-1">Các đánh giá</p>
        </div>
        <div
          className="ml-5 cursor-pointer text-blueTitle"
          onClick={() => navigate("/")}
        >
          <p className="font-semibold text-lg mb-1">Các yêu cầu cập nhật</p>
          <hr className="border-t-2 border-blueTitle ml-1" />
        </div>
        <div className="ml-5 cursor-pointer" onClick={() => navigate("/")}>
          <p className="font-semibold text-lg mb-1">Lịch làm việc</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6">
        {/* Left Side: Form */}
        <div className="w-7/12 bg-white py-8 px-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-y-2">
            <h1 className="text-center text-lg font-bold">GỬI YÊU CẦU</h1>
            <div>
              <label className="text-sm font-medium">Chuyên khoa</label>
              <br />
              <select
                className="w-3/5 px-3 py-2 border rounded-lg"
                value={formData.chuyen_khoa}
                name="chuyen_khoa"
                onChange={handleInputChange}
              >
                <option value="Ngoại">Ngoại</option>
                <option value="Nội">Nội</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Địa chỉ phòng khám</label>
              <br />
              <input
                className="w-3/5 px-3 py-2 border rounded-lg"
                value={formData.dia_chi_pk}
                name="dia_chi_pk"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Trình độ học vấn</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                value={formData.trinh_do_hoc_van}
                name="trinh_do_hoc_van"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Gửi mình chứng (tối đa 5 hình ảnh)
              </label>
              <div
                className="w-full h-32 border-2 border-dashed border-gray-300 p-4 rounded-lg flex justify-center items-center cursor-pointer hover:border-blue-500 transition-all duration-300"
                onClick={() => document.getElementById("file-input")?.click()} // Mở chọn file khi click vào ô
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <span className="text-gray-600 text-sm">
                    Drop your file, or{" "}
                  </span>
                  <span className="text-blue-600 text-sm font-semibold">
                    Browse
                  </span>
                  <div className="mt-2 text-gray-500 text-xs">
                    Max size 10MB
                  </div>
                </div>
              </div>
            </div>

            {/* Hiển thị các file đã chọn */}
            {formData.files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {formData.files.map((file, index) => (
                  <div key={index} className="relative w-20 h-20">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Selected"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">{file.name}</span>
                    )}
                    {/* Nút xóa file */}
                    <button
                      onClick={() => handleDeleteFile(index)}
                      className="absolute top-0 right-0 text-white bg-red-500 hover:bg-red-700 rounded-full p-1 w-6 h-6 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    >
                      <span className="text-sm font-semibold">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Request */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleSubmitRequest}
            >
              Gửi yêu cầu
            </button>
          </div>
        </div>

        {/* Right Side: Request History */}
        <div className="w-5/12 bg-white py-2 px-6 rounded-lg shadow-md">
          <div>
            <h3 className="font-semibold  mb-3">Lịch sử yêu cầu</h3>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-sm">Mã yêu cầu</th>
                  <th className="px-3 py-2 text-sm">Thời điểm</th>
                  <th className="px-3 py-2 text-sm">Kết quả</th>
                  <th className="px-3 py-2 text-sm">Duyệt bởi</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((request, index) => (
                  <tr key={index}>
                    <td className="border px-3 py-2 text-sm">{request.id}</td>
                    <td className="border px-3 py-2 text-sm">{request.time}</td>
                    <td className="border px-3 py-3 text-sm">
                      {request.result === "Chấp thuận" && (
                        <span className="px-1 py-1 rounded-full bg-green-200 text-green-600 font-medium">
                          {request.result}
                        </span>
                      )}
                      {request.result === "Từ chối" && (
                        <span className="px-2 py-1 rounded-full bg-red-200 text-red-600 font-medium">
                          {request.result}
                        </span>
                      )}
                      {request.result === "Chờ duyệt" && (
                        <span className="px-2 py-1 rounded-full bg-blue-200 text-blue-600 font-medium">
                          {request.result}
                        </span>
                      )}
                    </td>
                    <td className="border px-3 py-2 text-sm">
                      {request.reviewer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {requestHistory.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-gray-300 rounded-md mx-1"
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 mx-1 rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 rounded-md mx-1"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRequest;
