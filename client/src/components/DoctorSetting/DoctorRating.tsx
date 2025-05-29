import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Swal from "sweetalert2";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

interface RatingInfo {
  id: number;
  ho_va_ten: string;
  avt_benh_nhan: string;
  id_cuoc_hen: number;
  diem_danh_gia: number;
  noi_dung: string;
  thoi_gian: string;
  binh_luan: {
    noi_dung: string;
    thoi_diem: string;
  }[];
}

const DoctorRating: React.FC = () => {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState<number>(0);
  const [ratings, setRatings] = useState<RatingInfo[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<RatingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingsPerPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseVisible, setResponseVisible] = useState<number | null>(null);
  const [responseContent, setResponseContent] = useState<string>("");

  let avtUrl =
    !localStorage.getItem("avtUrl") || localStorage.getItem("avtUrl") === "null"
      ? "./images/avt.png"
      : localStorage.getItem("avtUrl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/rating/doctor/${localStorage.getItem("id")}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch ratings");
        }
        const data = await response.json();
        console.log(data);

        let formattedData: RatingInfo[] = data.ratings.map((item: any) => ({
          id: item.id,
          ho_va_ten: item.Benh_nhan.Nguoi_dung.ho_va_ten,
          avt_benh_nhan: item.Benh_nhan.Nguoi_dung.avt_url,
          id_cuoc_hen: item.id_cuoc_hen,
          diem_danh_gia: item.diem_danh_gia,
          noi_dung: item.noi_dung,
          thoi_gian: item.thoi_diem,
          binh_luan: item.Binh_luan,
        }));

        setRatings(formattedData);
        setFilteredRatings(formattedData);
        setAvgRating(
          //làm tròn 1 số thập phân data.averageRating
          Math.round(data.averageRating * 10) / 10
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Khi người dùng nhập dữ liệu vào ô input
  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponseContent(e.target.value);
  };

  const sendComment = async (ratingId: number, comment: string) => {
    try {
      const response = fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/rating/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            drID: localStorage.getItem("id"),
            content: comment,
            ratingID: ratingId,
          }),
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to send comment");
        }
        return res.json();
      });

      //cập nhật vào mảng binh_luan của rating
      const updatedRatings = ratings.map((rating) => {
        if (rating.id === ratingId) {
          return {
            ...rating,
            binh_luan: [
              ...rating.binh_luan,
              {
                noi_dung: comment,
                thoi_diem: new Date().toISOString(),
              },
            ],
          };
        }
        return rating;
      });
      setRatings(updatedRatings);
      setFilteredRatings(updatedRatings);
      setResponseContent("");
    } catch (error) {
      console.error("Error sending comment:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi gửi phản hồi.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCommentClick = (ratingId: number, comment: string) => {
    if (!comment || comment.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập nội dung phản hồi.",
        confirmButtonText: "OK",
      });
      return;
    }
    sendComment(ratingId, comment);
  };

  // Tính toán các đánh giá cần hiển thị cho trang hiện tại
  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = filteredRatings.slice(
    indexOfFirstRating,
    indexOfLastRating
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredRatings.length / ratingsPerPage);

  // Hàm tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Lọc đánh giá theo tên bệnh nhân hoặc nội dung
    const filtered = ratings.filter(
      (rating) =>
        rating.ho_va_ten.toLowerCase().includes(query) ||
        rating.noi_dung.toLowerCase().includes(query)
    );

    setFilteredRatings(filtered); // Cập nhật danh sách đánh giá đã lọc
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const toggleResponse = (ratingId: number) => {
    if (responseVisible === ratingId) {
      setResponseVisible(null); // Nếu đã mở thì đóng lại
    } else {
      setResponseVisible(ratingId); // Mở ô phản hồi cho đánh giá này
    }
  };

  return (
    <div className="h-full bg-gray-100 p-2">
      {/* Thanh điều hướng */}
      <NavBar curPage="rating" />

      {/* Nội dung chính: hiển thị các đánh giá của bệnh nhân cho bác sĩ đó */}
      <div className="space-y-6 text-sm">
        <div className="w-full bg-white rounded-lg shadow-md p-6 py-2 ">
          <div className="flex justify-between items-center mb-4">
            {/* Khung Avatar và Average Rating */}
            <div className="flex items-center gap-3">
              <img
                src={avtUrl || "./images/avt.png"}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex items-center">
                <span className="text-xl font-semibold mr-2">{avgRating}</span>
                <span className="text-sm text-gray-500">
                  Đánh giá trung bình
                </span>
              </div>
            </div>
            {/* Thanh tìm kiếm */}
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 mb-2">
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 outline-none px-2"
              />
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.3176 21.3191L16.8478 16.8413M19.3248 10.857C19.3248 13.1032 18.4325 15.2574 16.8442 16.8457C15.2559 18.434 13.1017 19.3263 10.8555 19.3263C8.60933 19.3263 6.45513 18.434 4.86683 16.8457C3.27853 15.2574 2.38623 13.1032 2.38623 10.857C2.38623 8.61079 3.27853 6.4566 4.86683 4.86829C6.45513 3.27999 8.60933 2.3877 10.8555 2.3877C13.1017 2.3877 15.2559 3.27999 16.8442 4.86829C18.4325 6.4566 19.3248 8.61079 19.3248 10.857V10.857Z"
                  stroke="#333333"
                  stroke-width="2.13512"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>

          {currentRatings.length > 0 ? (
            currentRatings.map((rating) => (
              <div
                onClick={() => toggleResponse(rating.id)}
                key={rating.id}
                className="border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-all duration-300 py-2"
              >
                <div className="px-1 flex items-center gap-2">
                  <div className="flex-col justify-center items-center w-2/12">
                    <img
                      src={rating.avt_benh_nhan ?? "./images/avt.png"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full shadow-md m-auto"
                    />
                    <h3 className="text-sm font-semibold text-center">
                      {rating.ho_va_ten}
                    </h3>
                  </div>
                  <div className="flex-col justify-start items-center flex-grow w-10/12">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-blue-500 text-sm cursor-pointer hover:underline"
                        onClick={() => {
                          navigate(`/historyDetail/${rating.id_cuoc_hen}`);
                        }}
                      >
                        Cuộc hẹn #{rating.id_cuoc_hen}
                      </span>

                      <span className="flex items-start gap-1">
                        {Array.from({
                          length: Math.floor(rating.diem_danh_gia), // Đếm số ngôi sao đầy đủ
                        }).map((_, index) => (
                          // <svg
                          //   key={index}
                          //   xmlns="http://www.w3.org/2000/svg"
                          //   width="15"
                          //   height="15"
                          //   viewBox="0 0 24 24"
                          //   fill="none"
                          // >
                          //   <path
                          //     d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                          //     fill="#FFC107"
                          //   />
                          // </svg>
                          <IoIosStar
                            key={index}
                            size={15}
                            color="#FFC107"
                            className="text-yellow-500"
                          />
                        ))}

                        {/* Kiểm tra xem có nửa ngôi sao không */}
                        {rating.diem_danh_gia % 1 == 0.5 && (
                          // <svg
                          //   xmlns="http://www.w3.org/2000/svg"
                          //   width="15"
                          //   height="15"
                          //   viewBox="0 0 24 24"
                          //   fill="none"
                          // >
                          //   <path
                          //     d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                          //     fill="#FFC107"
                          //   />
                          // </svg>
                          <IoIosStarHalf
                            size={15}
                            color="#FFC107"
                            className="text-yellow-500"
                          />
                        )}

                        {/* Ngôi sao trống */}
                        {Array.from({
                          length: 5 - Math.ceil(rating.diem_danh_gia), // Đếm ngôi sao trống
                        }).map((_, index) => (
                          // <svg
                          //   key={index}
                          //   xmlns="http://www.w3.org/2000/svg"
                          //   width="15"
                          //   height="15"
                          //   viewBox="0 0 24 24"
                          //   fill="none"
                          // >
                          //   <path
                          //     d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                          //     fill="#E0E0E0"
                          //   />
                          // </svg>
                          <IoIosStarOutline
                            key={index}
                            size={15}
                            color="#FFC107"
                            className="text-gray-300"
                          />
                        ))}
                      </span>

                      <span className="text-gray-500 text-sm">
                        {new Date(rating.thoi_gian).toLocaleString("vi-VN")}
                      </span>
                    </div>

                    <p className=" text-gray-700 pr-2">{rating.noi_dung}</p>

                    {/* Hiển thị các bình luận đã có */}
                    <div className="mt-3">
                      <span className="font-semibold text-sm">
                        Phản hồi của bác sĩ
                      </span>
                      {rating.binh_luan.map((comment, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-100 rounded-lg my-2 flex justify-between"
                        >
                          <p className="text-gray-700 text-sm w-5/6">
                            {comment.noi_dung}
                          </p>
                          <span className="text-xs text-gray-500 w-1/6 text-right">
                            {new Date(comment.thoi_diem).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {responseVisible === rating.id && (
                      <div
                        className="mt-2 flex gap-2 text-sm justify-between"
                        //Chặn sự kiện click vào div cha
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={responseContent} // Sử dụng state để quản lý giá trị ô input
                          onChange={handleResponseChange}
                          placeholder="Phản hồi của bác sĩ..."
                          className="border border-gray-300 rounded-lg p-2 w-5/6 h-full"
                        />
                        <button
                          className="bg-blue-500 h-full text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 w-1/6"
                          onClick={(e) =>
                            handleCommentClick(
                              rating.id,
                              responseContent // Truyền giá trị của responseContent vào hàm gửi phản hồi
                            )
                          }
                        >
                          Gửi phản hồi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào.</p>
          )}
        </div>

        <div className="flex justify-end mt-2 space-x-4 text-sm">
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
      </div>
    </div>
  );
};

export default DoctorRating;
