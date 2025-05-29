import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "./NavBar";

interface RequestHistory {
  thoi_diem_yeu_cau: string;
  ma_yeu_cau: string;
  trang_thai: string;
}

const DoctorRequest: React.FC = () => {
  const navigate = useNavigate();
  // const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    chuyen_khoa: "",
    dia_chi_pk: "",
    trinh_do_hoc_van: "",
    files: [] as File[],
  });
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [specialization, setSpecialization] = useState<string[]>([]);

  const recordsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRequestHistory = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/updateRequest/requestByDoctorID/${localStorage.getItem("id")}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch request history");
        }
        const data = await response.json();

        const formattedData = data.map((request: any) => ({
          thoi_diem_yeu_cau: request.thoi_diem_yeu_cau,
          trang_thai: request.trang_thai,
          ma_yeu_cau: request.ma_yeu_cau,
        }));

        setRequestHistory(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequestHistory();
  }, []);

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
        let specialization = data.map((item: any) => item.ten_chuyen_khoa);
        setSpecialization(specialization);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecialization();
  }, []);

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
        // Kiểm tra xem đã chọn đủ thông tin chưa: ít nhất chứa 1 trường, file thì ít nhất là 1
        if (
          formData.chuyen_khoa === "" &&
          formData.dia_chi_pk === "" &&
          formData.trinh_do_hoc_van === ""
        ) {
          Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin yêu cầu.", "error");
          return;
        }

        if (formData.files.length === 0) {
          Swal.fire("Lỗi", "Vui lòng gửi ít nhất 1 minh chứng.", "error");
          return;
        }

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
            //Cập nhật lại request history
            const data = await response.json();
            console.log(data);
            let newRequest: RequestHistory = {
              thoi_diem_yeu_cau: new Date().toISOString(),
              trang_thai: "Chờ duyệt",
              ma_yeu_cau: data.ma_yeu_cau,
            };
            console.log("newRequest", newRequest);

            setRequestHistory((prev) => [newRequest, ...prev]);
            //clear form
            setFormData({
              chuyen_khoa: "",
              dia_chi_pk: "",
              trinh_do_hoc_van: "",
              files: [],
            });
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
    <div className="h-full bg-gray-100 p-2">
      {/* Thanh điều hướng */}
      <NavBar curPage="request" />

      {/* Main content */}
      <div className="flex gap-4" style={{ height: "90%" }}>
        {/* Left Side: Form */}
        <div className="w-7/12 bg-white py-4 px-8 rounded-lg shadow-md text-sm">
          <div className="grid grid-cols-1 gap-y-2">
            <h1 className="text-center text-base font-bold mb-2">
              GỬI YÊU CẦU
            </h1>
            <div className="flex flex-row w-full justify-between items-center gap-2">
              <div className="w-4/12 flex flex-col gap-2">
                <label className="text-sm font-medium block">Chuyên khoa</label>
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={formData.chuyen_khoa}
                  name="chuyen_khoa"
                  onChange={handleInputChange}
                >
                  <option value="">Chọn chuyên khoa</option>
                  {specialization &&
                    specialization.map((item: string, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-8/12 flex flex-col gap-2">
                <label className="text-sm font-medium block">
                  Địa chỉ phòng khám
                </label>
                <input
                  className="px-3 py-2 border rounded-lg"
                  value={formData.dia_chi_pk}
                  name="dia_chi_pk"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Trình độ học vấn
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                value={formData.trinh_do_hoc_van}
                name="trinh_do_hoc_van"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">
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
              <div className="mt-2 flex flex-wrap gap-4">
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
        <div className="w-5/12 h-full bg-white py-4 px-6 rounded-lg shadow-md text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-base">Lịch sử yêu cầu</h3>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-sm">Mã yêu cầu</th>
                  <th className="px-3 py-2 text-sm">Tạo lúc</th>
                  <th className="px-3 py-2 text-sm">Kết quả</th>
                  {/* <th className="px-3 py-2 text-sm">Duyệt bởi</th> */}
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((request, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      navigate(`/requestDetail/${request.ma_yeu_cau}`);
                    }}
                    className="cursor-pointer hover:bg-gray-100 text-center"
                  >
                    <td className="border px-3 py-2 text-sm">
                      {request.ma_yeu_cau}
                    </td>
                    <td className="border px-3 py-2 text-sm">
                      {new Date(request.thoi_diem_yeu_cau).toLocaleString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="border p-2 text-sm flex justify-center items-center">
                      {request.trang_thai === "Đã duyệt" && (
                        <span className="px-1 py-1 rounded-full bg-green-200 text-green-600 font-medium w-11/12">
                          {request.trang_thai}
                        </span>
                      )}
                      {request.trang_thai === "Từ chối" && (
                        <span className="px-2 py-1 rounded-full bg-red-200 text-red-600 font-medium w-11/12">
                          {request.trang_thai}
                        </span>
                      )}
                      {request.trang_thai === "Chờ duyệt" && (
                        <span className="px-2 py-1 rounded-full bg-blue-200 text-blue-600 font-medium w-11/12">
                          {request.trang_thai}
                        </span>
                      )}
                      {request.trang_thai === "Thu hồi" && (
                        <span className="px-2 py-1 rounded-full bg-orange-200 text-orange-600 font-medium w-11/12">
                          {request.trang_thai}
                        </span>
                      )}
                    </td>
                    {/* <td className="border px-3 py-2 text-sm">
                      {request.reviewer}
                    </td> */}
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
