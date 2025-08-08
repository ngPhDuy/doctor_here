import React from "react";
import { FaStar } from "react-icons/fa";

type Props = {
  data: {
    averageRating: number;
    ratings: {
      id: number;
      diem_danh_gia: number;
      noi_dung: string;
      thoi_diem: string;
      Benh_nhan: {
        Nguoi_dung: {
          ho_va_ten: string;
          avt_url: string;
        };
      };
      Binh_luan: {
        noi_dung: string;
        thoi_diem: string;
      }[];
    }[];
  };
};

const ListReviewsDoctor: React.FC<Props> = ({ data }) => {
  if (!data || !data.ratings || data.ratings.length === 0)
    return <p>Không có đánh giá nào.</p>;

  return (
    <div className="w-full space-y-4">
      {/* ✅ Dòng AI bên ngoài khung */}
      <p className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md italic flex items-center gap-1">
        🤖 <span>Dưới đây là thông tin các đánh giá bệnh nhân mà tôi tìm được:</span>
      </p>
      {/* ⭐ Trung bình đánh giá */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
        <h2 className="text-xl font-bold text-yellow-600 flex items-center gap-2">
          ⭐ Đánh giá trung bình: {data.averageRating.toFixed(1)} / 5
        </h2>
        <p className="text-sm text-gray-500">
          Tổng số đánh giá: {data.ratings.length}
        </p>
      </div>

      {/* 🔁 Danh sách đánh giá */}
      {data.ratings.map((rating) => {
        const user = rating.Benh_nhan.Nguoi_dung;
        return (
          <div
            key={rating.id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-100 space-y-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avt_url}
                alt={user.ho_va_ten}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-800">{user.ho_va_ten}</p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(rating.diem_danh_gia) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {rating.diem_danh_gia}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Nội dung đánh giá */}
            {rating.noi_dung && (
              <p className="text-gray-700 text-sm mt-1">{rating.noi_dung}</p>
            )}

            {/* Thời gian đánh giá */}
            <p className="text-xs text-gray-500 italic">
              {new Date(rating.thoi_diem).toLocaleString("vi-VN", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>

            {/* Các bình luận (nếu có) */}
            {rating.Binh_luan.length > 0 && (
              <div className="bg-gray-50 rounded-md p-2 mt-2 space-y-1 text-sm">
                <p className="font-medium text-gray-700">💬 Phản hồi:</p>
                {rating.Binh_luan.map((cmt, idx) => (
                  <div key={idx} className="text-gray-600">
                    {cmt.noi_dung}
                    <span className="ml-2 text-xs text-gray-400">
                      ({new Date(cmt.thoi_diem).toLocaleString("vi-VN")})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListReviewsDoctor;
