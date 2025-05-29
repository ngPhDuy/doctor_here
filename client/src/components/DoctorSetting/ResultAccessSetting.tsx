import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import defaultAvatar from "../../assets/images/avt.png";

interface Patient {
  ma_benh_nhan: string;
  ho_va_ten: string;
  avt_url: string;
  an_kq: boolean;
}

const ITEMS_PER_PAGE = 9;

const ResultAccessSetting: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shareAll, setShareAll] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/diagnosis/patients/${localStorage.getItem("id")}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data);
        console.log("Danh sách bệnh nhân", data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchShareAll = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/diagnosis/share_all/doctor/${localStorage.getItem("id")}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch shareAll");
        }

        const data = await response.json();
        console.log("ShareAll", data.chia_se_kq_cho_tat_ca);
        setShareAll(data.chia_se_kq_cho_tat_ca);
      } catch (error) {
        console.error("Error fetching shareAll:", error);
      }
    };

    fetchShareAll();
  }, []);

  const toggleShareAll = async () => {
    try {
      const newValue = !shareAll;

      console.log("newStateShareAll ", newValue);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/diagnosis/share_all/doctor/${localStorage.getItem("id")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newState: newValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shareAll");
      }

      console.log("Response:", response);

      setShareAll(newValue);
      console.log("Cập nhật shareAll =", newValue);
    } catch (error) {
      console.error("Error updating shareAll:", error);
    }
  };

  const togglePatient = async (ma_benh_nhan: string) => {
    try {
      const thisPatient = patients.find((p) => p.ma_benh_nhan === ma_benh_nhan);
      const newState = !thisPatient?.an_kq;

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/diagnosis/hidden_state/${localStorage.getItem(
          "id"
        )}/${ma_benh_nhan}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newState }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }

      console.log("Response:", response);

      const newPatients = patients.map((p) =>
        p.ma_benh_nhan === ma_benh_nhan ? { ...p, an_kq: newState } : p
      );
      setPatients(newPatients);
      console.log("Cập nhật bệnh nhân", newPatients);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.ho_va_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ma_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const displayedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  //   if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="h-full bg-gray-100 p-2">
      <NavBar curPage="accessSetting" />

      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* PHẦN 1: Chia sẻ toàn bộ */}
        <div className="pb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Cài đặt chia sẻ kết quả khám
          </h2>
          <p className="text-gray-600 mb-4">
            Bạn có thể chia sẻ kết quả khám cho tất cả bệnh nhân, hoặc điều
            chỉnh từng người.
          </p>
          <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">
                Chia sẻ với tất cả bệnh nhân
              </p>
              <p className="text-sm text-gray-500">
                Kết quả khám bệnh sẽ được chia sẻ với tất cả bác sĩ khác
              </p>
            </div>

            {shareAll !== null && (
              <>
                <label className="inline-flex items-center cursor-pointer border border-gray-300 rounded-full ">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    onChange={toggleShareAll}
                    checked={shareAll}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </>
            )}
          </div>
        </div>

        {/* PHẦN 2: Tìm kiếm và danh sách bệnh nhân */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Quản lý chia sẻ theo từng bệnh nhân
          </h3>

          <input
            type="text"
            placeholder="Tìm bệnh nhân theo tên..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 w-full px-4 py-2 border rounded-md"
          />

          {filteredPatients.length === 0 ? (
            <p className="text-gray-500 italic">Không tìm thấy bệnh nhân.</p>
          ) : (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {displayedPatients.map((patient) => (
                  <li
                    key={patient.ma_benh_nhan}
                    className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={patient.avt_url || defaultAvatar}
                        alt={patient.ho_va_ten}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{patient.ho_va_ten}</p>
                        <p className="text-xs text-gray-500">
                          {patient.ma_benh_nhan}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePatient(patient.ma_benh_nhan)}
                      className={`text-xl hover:scale-110 transition ${
                        patient.an_kq ? "text-red-500" : "text-green-600"
                      }`}
                      title={
                        patient.an_kq ? "Chia sẻ với bác sĩ" : "Ngừng chia sẻ"
                      }
                    >
                      {patient.an_kq ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultAccessSetting;
