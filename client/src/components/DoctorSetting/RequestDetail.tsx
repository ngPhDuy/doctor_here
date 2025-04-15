import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "./NavBar";
import { request } from "node:https";

interface RequestHistory {
  id: string;
  thoi_diem_yeu_cau: string;
  ma_yeu_cau: string;
  trang_thai: string;
}

interface RequestDetailProps {
  ma_yeu_cau: string;
  chuyen_khoa_cu: string;
  dia_chi_pk_cu: string;
  trinh_do_hoc_van_cu: string;
  chuyen_khoa_moi: string;
  dia_chi_pk_moi: string;
  trinh_do_hoc_van_moi: string;
  urls: string[];
  thoi_diem_yeu_cau: string;
  duyet_boi: string;
  trang_thai: string;
}

const defaultRequestDetail: RequestDetailProps = {
  ma_yeu_cau: "",
  chuyen_khoa_cu: "",
  dia_chi_pk_cu: "",
  trinh_do_hoc_van_cu: "",
  chuyen_khoa_moi: "",
  dia_chi_pk_moi: "",
  trinh_do_hoc_van_moi: "",
  urls: [],
  thoi_diem_yeu_cau: "",
  duyet_boi: "",
  trang_thai: "",
};

const RequestDetail: React.FC = () => {
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [requestDetail, setRequestDetail] =
    useState<RequestDetailProps>(defaultRequestDetail);

  const recordsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [requestID, setRequestID] = useState<string>(
    useParams().requestID || ""
  );

  // Hàm để mở modal khi nhấn vào hình ảnh
  const handleImageClick = (url: string) => {
    setSelectedImage(url); // Lưu url của ảnh vào state
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  const cancelHandler = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn thu hồi yêu cầu này?",
      text: "Yêu cầu sẽ bị thu hồi và không thể khôi phục lại.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/updateRequest/cancelRequest`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestID: requestDetail.ma_yeu_cau,
              doctorID: localStorage.getItem("id"),
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to cancel request");
        }
        Swal.fire("Thành công!", "Yêu cầu đã được thu hồi.", "success").then(
          () => {
            window.location.reload();
          }
        );
      } catch (error) {
        console.error(error);
        Swal.fire("Lỗi", "Đã xảy ra lỗi khi thu hồi yêu cầu.", "error");
      }
    }
  };

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
          id: request.id,
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
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/updateRequest/requestDetail/${requestID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch request details");
        }
        const data = await response.json();

        console.log(data);

        let requestDetail: RequestDetailProps = {
          ma_yeu_cau: data.ma_yeu_cau,
          chuyen_khoa_cu: data.chuyen_khoa_cu,
          dia_chi_pk_cu: data.dia_chi_pk_cu,
          trinh_do_hoc_van_cu: data.trinh_do_hoc_van_cu,
          chuyen_khoa_moi: data.chuyen_khoa_moi,
          dia_chi_pk_moi: data.dia_chi_pk_moi,
          trinh_do_hoc_van_moi: data.trinh_do_hoc_van_moi,
          urls: data.Anh_minh_chung.map((item: { url: string }) => item.url),
          thoi_diem_yeu_cau: data.thoi_diem_yeu_cau,
          duyet_boi: data.Duyet_yeu_cau_cap_nhat
            ? data.Duyet_yeu_cau_cap_nhat.ma_qtv
            : "",
          trang_thai: data.trang_thai,
        };

        setRequestDetail(requestDetail);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetail();
  }, [requestID]);

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
              {`#${requestDetail.ma_yeu_cau}`}
            </h1>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                {
                  label: "Chuyên khoa cũ",
                  value: requestDetail.chuyen_khoa_cu,
                },
                {
                  label: "Chuyên khoa mới",
                  value: requestDetail.chuyen_khoa_moi,
                },
                { label: "Địa chỉ PK cũ", value: requestDetail.dia_chi_pk_cu },
                {
                  label: "Địa chỉ PK mới",
                  value: requestDetail.dia_chi_pk_moi,
                },
                {
                  label: "Trình độ học vấn cũ",
                  value: requestDetail.trinh_do_hoc_van_cu,
                },
                {
                  label: "Trình độ học vấn mới",
                  value: requestDetail.trinh_do_hoc_van_moi,
                },
                {
                  label: "Yêu cầu lúc",
                  value: new Date(
                    requestDetail.thoi_diem_yeu_cau
                  ).toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
                {
                  label: "Duyệt bởi",
                  value: requestDetail.duyet_boi,
                },
              ].map((info, index) => (
                <div key={index}>
                  <label className="text-sm font-medium block mb-2">
                    {info.label}
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                    value={info.value}
                    disabled
                  />
                </div>
              ))}

              {/* Các minh chứng kèm theo */}
              {requestDetail.urls.length > 0 && (
                <>
                  <div className="col-span-2">
                    <label className="text-sm font-medium block mb-2">
                      Các minh chứng kèm theo
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {requestDetail.urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`File ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                          onClick={() => handleImageClick(url || "")} // Mở modal khi nhấn vào ảnh
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modal hiển thị hình ảnh lớn */}
          {selectedImage && (
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={closeModal}
            >
              <div
                className="bg-white p-4 rounded-lg"
                onClick={(e) => e.stopPropagation()} // Ngừng propagation để tránh đóng modal khi click vào ảnh
              >
                <img
                  src={selectedImage}
                  alt="large image"
                  className="max-w-full max-h-[90vh] object-contain"
                />
              </div>
            </div>
          )}

          {/* Submit Request */}
          <div className="flex justify-center gap-4 mt-6">
            <span
              className={`px-4 py-2 rounded-full font-medium ${
                requestDetail.trang_thai === "Đã duyệt"
                  ? "bg-green-200 text-green-600"
                  : requestDetail.trang_thai === "Từ chối"
                  ? "bg-red-200 text-red-600"
                  : requestDetail.trang_thai === "Chờ duyệt"
                  ? "bg-blue-200 text-blue-600"
                  : "bg-orange-200 text-orange-600"
              }`}
            >
              {requestDetail.trang_thai}
            </span>
          </div>

          {requestDetail.trang_thai === "Chờ duyệt" && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                onClick={cancelHandler}
              >
                Thu hồi yêu cầu
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Request History */}
        <div className="w-5/12 h-full bg-white py-4 px-6 rounded-lg shadow-md text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-base">Lịch sử yêu cầu</h3>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-sm">Mã yêu cầu</th>
                  <th className="px-3 py-2 text-sm">Thời điểm</th>
                  <th className="px-3 py-2 text-sm">Kết quả</th>
                  {/* <th className="px-3 py-2 text-sm">Duyệt bởi</th> */}
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((request, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      setRequestID(request.ma_yeu_cau);
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

export default RequestDetail;
