import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextInput } from "../Input/InputComponents";
import Swal from "sweetalert2";

const adminID = "QT0000011"; // ID của quản trị viên xử lý yêu cầu

const RequestDetail = {
  id: 0,
  trang_thai: "Chờ duyệt",
  thoi_diem_yeu_cau: "",
  ma_yeu_cau: "",
  trinh_do_hoc_van_cu: "",
  trinh_do_hoc_van_moi: "",
  dia_chi_pk_cu: "",
  dia_chi_pk_moi: "",
  ma_bac_si: "",
  thoi_diem_thu_hoi: null,
  chuyen_khoa_cu: "",
  chuyen_khoa_moi: "",
  Bac_si: {
    ngay_vao_nghe: "",
    trinh_do_hoc_van: "",
    mo_ta: "",
    dia_chi_pk: "",
    ma_bac_si: "",
    chuyen_khoa: "",
    Nguoi_dung: {
      ten_dang_nhap: "",
      email: "",
      sdt: "",
      ngay_sinh: "",
      gioi_tinh: "",
      phan_loai: "",
      ho_va_ten: "",
    },
  },
  Anh_minh_chung: [
    {
      url: "",
    },
  ],
  Duyet_yeu_cau_cap_nhat: {
    yeu_cau_cap_nhat: "",
    ma_qtv: "",
    thoi_diem_duyet: "",
    ly_do: "",
  },
};

type RequestHistory = {
  trang_thai: string;
  thoi_diem_yeu_cau: string;
  ma_yeu_cau: string;
  ma_bac_si: string;
  ho_va_ten: string;
};

const NewRequestDetail: React.FC = () => {
  const navigate = useNavigate();
  const { requestId, doctorId } = useParams<{
    requestId: string;
    doctorId: string;
  }>();
  const [requestDetail, setRequestDetail] = useState(RequestDetail);
  const [requestsHistory, setRequestsHistory] = useState<RequestHistory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerpage = 5;

  const indexOfLastRequest = currentPage * requestsPerpage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerpage;
  const currentRequest = requestsHistory.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  // Chuyển trang
  const totalPages = Math.ceil(requestsHistory.length / requestsPerpage);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Hàm mở modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý khi nhấn xác nhận
  const handleConfirm = () => {
    handleRequest(false, reason); // Gọi handleRequest với lý do
    closeModal(); // Đóng modal
  };

  const acceptHandler = () => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn chấp thuận yêu cầu này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Chấp thuận",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRequest(true, "");
      }
    });
  };

  useEffect(() => {
    if (!requestId) return;
    const fetchRequestDetail = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/updateRequest/requestDetail/${requestId}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu yêu cầu cập nhật.");
        }

        const data = await response.json();
        setRequestDetail(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết yêu cầu:", error);
      }
    };

    fetchRequestDetail();
  }, [requestId]);

  useEffect(() => {
    if (!doctorId) return;

    const fetchRequestHistory = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/updateRequest/requestByDoctorID/${doctorId}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách lịch sử yêu cầu.");
        }

        const data = await response.json();

        // Chỉ lấy các thông tin cần thiết (bao gồm mã bác sĩ và họ tên)
        const formattedData = data.map((item: any) => ({
          trang_thai: item.trang_thai,
          thoi_diem_yeu_cau: item.thoi_diem_yeu_cau,
          ma_yeu_cau: item.ma_yeu_cau,
          ma_bac_si: item.ma_bac_si,
          ho_va_ten: item.Bac_si?.Nguoi_dung?.ho_va_ten || "Không rõ",
        }));

        setRequestsHistory(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu:", error);
      }
    };

    fetchRequestHistory();
  }, [doctorId]);

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setRequestDetail((prevData) => ({
        ...prevData,
        [field]: e.target.value,
      }));
    };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Nếu chưa đến tháng sinh hoặc ngày sinh trong năm nay thì trừ đi 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleRequest = async (approved: boolean, reason: string) => {
    if (!requestDetail) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/updateRequest/handleRequest`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestID: requestDetail.ma_yeu_cau,
            approved,
            reason,
            adminID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xử lý yêu cầu.");
      }

      Swal.fire({
        title: "Thành công",
        text: "Yêu cầu đã được xử lý thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });

      const data = await response.json();
      alert(data.message); // Hiển thị thông báo từ server

      // Cập nhật trạng thái sau khi xử lý
      setRequestDetail((prev) =>
        prev
          ? { ...prev, trang_thai: approved ? "Chấp thuận" : "Bị từ chối" }
          : prev
      );
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi xử lý yêu cầu.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    window.location.reload();
  };
  return (
    <div className="h-full bg-gray-50 p-2">
      <div className="flex gap-4 h-full">
        {/* Thông tin chuyên ngành bên trái */}
        <div className="w-6/12 bg-white px-6 py-4 rounded-lg shadow-md">
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
            <h2 className="text-lg font-semibold ml-4">
              Yêu cầu cập nhật thông tin
            </h2>
          </div>

          <div className="grid gap-4 mb-4 sm:grid-cols-2 my-4 text-sm">
            {[
              { id: "chuyen_khoa_cu", label: "Chuyên khoa cũ", type: "text" },
              { id: "chuyen_khoa_moi", label: "Chuyên khoa mới", type: "text" },
              {
                id: "dia_chi_pk_cu",
                label: "Địa chỉ phòng khám cũ",
                type: "text",
              },
              {
                id: "dia_chi_pk_moi",
                label: "Địa chỉ phòng khám mới",
                type: "text",
              },
              {
                id: "trinh_do_hoc_van_cu",
                label: "Trình độ học vấn cũ",
                type: "text",
              },
              {
                id: "trinh_do_hoc_van_moi",
                label: "Trình độ học vấn mới",
                type: "text",
              },
            ].map((input) => (
              <div key={input.id}>
                <TextInput
                  label={input.label}
                  id={input.id}
                  type={input.type}
                  value={String(
                    requestDetail[input.id as keyof typeof requestDetail] ?? ""
                  )}
                  onChange={(e) => handleChange(input.id)(e)}
                  disabled={true}
                />
              </div>
            ))}
          </div>

          {/* Ảnh minh chứng */}
          <div className="mb-4">
            <div className="mb-2 text-sm font-medium text-blueText">
              Minh chứng
            </div>
            <div className="w-full p-2.5 text-sm text-blueText border border-gray-300 rounded-lg bg-gray-200">
              {requestDetail.Anh_minh_chung[0]?.url ? (
                <a
                  href={requestDetail.Anh_minh_chung[0]?.url}
                  download
                  target="_blank"
                  className="text-blue-500"
                >
                  {requestDetail.Anh_minh_chung[0]?.url.split("/").pop()}
                </a>
              ) : (
                <span>Không có ảnh minh chứng</span>
              )}
            </div>
          </div>

          {/* {requestDetail.trang_thai === "Từ chối" ? (
            <div className="mb-4">
              <div className="mb-2 text-sm font-medium text-blueText">
                Lý do từ chối
              </div>
              <div className="w-full p-2.5 text-sm text-blueText border border-gray-300 rounded-lg bg-gray-200">
                {requestDetail.Duyet_yeu_cau_cap_nhat.ly_do}
              </div>
            </div>
          ) : null} */}

          <div className="flex justify-end my-3">
            {requestDetail.trang_thai === "Chờ duyệt" ? (
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 mr-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  onClick={acceptHandler}
                >
                  Chấp thuận
                </button>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  onClick={openModal}
                >
                  Từ chối
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center my-3">
                <div
                  className={`border rounded-lg px-5 py-3 ${
                    requestDetail.trang_thai === "Đã duyệt"
                      ? "text-green-700 bg-green-200"
                      : "text-red-700 bg-red-200"
                  }`}
                >
                  {requestDetail.trang_thai === "Đã duyệt"
                    ? "Đã duyệt"
                    : "Từ chối"}
                </div>
                {requestDetail.Duyet_yeu_cau_cap_nhat && (
                  <div className="flex justify-center mt-3">
                    Được duyệt bởi {requestDetail.Duyet_yeu_cau_cap_nhat.ma_qtv}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Thông tin cá nhân bên phải */}
        <div className="w-6/12 bg-white p-3 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-base">
            <img
              src="/images/avt.png"
              alt="Doctor Avatar"
              className="w-30 h-30 rounded-full"
            />
            <p className="text-base font-semibold">
              {requestDetail.Bac_si.Nguoi_dung.ho_va_ten}
            </p>
            {calculateAge(requestDetail.Bac_si.Nguoi_dung.ngay_sinh)} tuổi,{" "}
            {requestDetail.Bac_si.Nguoi_dung.gioi_tinh}
          </div>

          <hr className="mt-3 mb-3" />
          <div className="">
            <table className="table-auto w-full text-center">
              <thead className="text-gray-600 text-base bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Mã yêu cầu</th>
                  <th className="px-4 py-2">Thời gian yêu cầu</th>
                  <th className="px-4 py-2">Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {currentRequest.map((request, index) => (
                  <tr
                    key={request.ma_yeu_cau}
                    className="bg-white hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/newRequestDetail/${request.ma_yeu_cau}/${doctorId}`
                      )
                    }
                  >
                    <td className="px-4 py-2">{request.ma_yeu_cau}</td>
                    <td className="px-4 py-2">
                      {new Date(request.thoi_diem_yeu_cau).toLocaleString()}
                    </td>
                    <td
                      className={`px-2 py-3 flex justify-center items-center`}
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium block w-10/12 ${
                          request.trang_thai === "Đã duyệt"
                            ? "bg-green-200 text-green-600"
                            : request.trang_thai === "Từ chối"
                            ? "bg-red-200 text-red-600"
                            : request.trang_thai === "Chờ duyệt"
                            ? "bg-blue-200 text-blue-600"
                            : "bg-orange-200 text-orange-600"
                        }`}
                      >
                        {request.trang_thai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex justify-end mt-5 text-sm gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blueButton hover:bg-blueButtonHover text-white"
                }`}
              >
                Trước
              </button>
              <span className="px-4 py-2 border rounded-lg">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blueButton hover:bg-blueButtonHover text-white"
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl mb-4">Nhập lý do từ chối</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)} // Cập nhật lý do khi người dùng nhập
              className="w-full p-2 border rounded mb-4"
              placeholder="Nhập lý do..."
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal} // Đóng modal mà không làm gì
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm} // Xác nhận từ chối với lý do
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRequestDetail;
