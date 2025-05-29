import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { IoWarningOutline } from "react-icons/io5";
import defaultAvatar from "../../assets/images/avt.png";

interface Appointment {
  id: number;
  van_ban_bo_sung: string;
  dia_chi_phong_kham: string;
  trang_thai: string;
  thoi_diem_tao: string;
  ma_bac_si: string;
  ma_benh_nhan_dat_hen: string;
  id_gio_hen: number;

  // Thông tin bệnh nhân
  benh_nhan_cccd: string;
  benh_nhan_dan_toc: string;
  benh_nhan_nhom_mau: string;
  benh_nhan_tien_su_benh: string;
  benh_nhan_quoc_tich: string;
  benh_nhan_dia_chi: string;
  benh_nhan_ma_benh_nhan: string;

  // Thông tin người dùng của bệnh nhân
  benh_nhan_ten_dang_nhap: string;
  benh_nhan_email: string;
  benh_nhan_sdt: string;
  benh_nhan_ngay_sinh: string;
  benh_nhan_gioi_tinh: string;
  benh_nhan_phan_loai: string;
  benh_nhan_ho_va_ten: string;
  benh_nhan_avt_url: string;

  // Thông tin bác sĩ
  bac_si_ngay_vao_nghe: string;
  bac_si_trinh_do_hoc_van: string;
  bac_si_mo_ta: string;
  bac_si_dia_chi_pk: string;
  bac_si_ma_bac_si: string;
  bac_si_chuyen_khoa: string;
  bac_si_avt_url: string;
  bac_si_ho_va_ten: string;
  bac_si_email: string;
  bac_si_sdt: string;

  // Thông tin giờ hẹn
  gio_hen_thoi_diem_bat_dau: string;
  gio_hen_thoi_diem_ket_thuc: string;
  gio_hen_ngay_lam_viec: string;
  gio_hen_available: boolean;
  gio_hen_id_ca_lam_viec: number;
  ca_lam_viec_lam_viec_onl: boolean;
  hinh_anh_bo_sung: string[];
}

interface Medicine {
  id: number;
  ten_thuoc: string;
  buoi_uong: string[];
  so_luong: number;
}

interface MedicineItem {
  id: number;
  ten_thuoc: string;
}

interface ResultDetailProps {
  ket_qua_chan_doan: string;
  ghi_chu_them: string;
  hinh_anh_ket_qua: string[];
}

interface UpFileResponse {
  url: string;
  type: string;
}

const defaultAppointment: Appointment = {
  id: 0,
  van_ban_bo_sung: "",
  dia_chi_phong_kham: "",
  trang_thai: "",
  thoi_diem_tao: "",
  ma_bac_si: "",
  ma_benh_nhan_dat_hen: "",
  id_gio_hen: 0,

  // Thông tin bệnh nhân
  benh_nhan_cccd: "",
  benh_nhan_dan_toc: "",
  benh_nhan_nhom_mau: "",
  benh_nhan_tien_su_benh: "",
  benh_nhan_quoc_tich: "",
  benh_nhan_dia_chi: "",
  benh_nhan_ma_benh_nhan: "",

  // Thông tin người dùng của bệnh nhân
  benh_nhan_ten_dang_nhap: "",
  benh_nhan_email: "",
  benh_nhan_sdt: "",
  benh_nhan_ngay_sinh: "",
  benh_nhan_gioi_tinh: "",
  benh_nhan_phan_loai: "",
  benh_nhan_ho_va_ten: "",
  benh_nhan_avt_url: "",

  // Thông tin bác sĩ
  bac_si_ngay_vao_nghe: "",
  bac_si_trinh_do_hoc_van: "",
  bac_si_mo_ta: "",
  bac_si_dia_chi_pk: "",
  bac_si_ma_bac_si: "",
  bac_si_chuyen_khoa: "",
  bac_si_avt_url: "",
  bac_si_ho_va_ten: "",
  bac_si_email: "",
  bac_si_sdt: "",

  // Thông tin giờ hẹn
  gio_hen_thoi_diem_bat_dau: "",
  gio_hen_thoi_diem_ket_thuc: "",
  gio_hen_ngay_lam_viec: "",
  gio_hen_available: false,
  gio_hen_id_ca_lam_viec: 0,
  ca_lam_viec_lam_viec_onl: false,
  hinh_anh_bo_sung: [],
};

const defaultMedicine: Medicine = {
  id: 0,
  ten_thuoc: "",
  buoi_uong: [],
  so_luong: 0,
};

const defaultResultDetail: ResultDetailProps = {
  ket_qua_chan_doan: "",
  ghi_chu_them: "",
  hinh_anh_ket_qua: [],
};

const PatientResult: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] =
    useState<Appointment>(defaultAppointment);
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [files, setFiles] = useState<
    (
      | {
          file: File;
          isNew: boolean;
        }
      | { url: string; isNew: boolean }
    )[]
  >([]);
  // Về thuốc và toa thuốc
  const [medicines, setMedicines] = useState<Medicine[]>([]); // Lưu trữ thông tin toa thuốc
  const [showModal, setShowModal] = useState<boolean>(false); // Trạng thái hiển thị modal
  const [newMedicine, setNewMedicine] = useState<Medicine>(defaultMedicine);
  const [medicineIdx, setMedicineIdx] = useState<number>(-1); // Chỉ số thuốc đang được chỉnh sửa
  const [startDate, setStartDate] = useState<string>(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState<string>(""); // Ngày kết thúc
  const [prescriptionName, setPrescriptionName] = useState<string>(""); // Tên đơn thuốc
  const [prescriptionNote, setPrescriptionNote] = useState<string>(""); // Ghi chú đơn thuốc
  const [isShared, setIsShared] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mở modal
  const openModal = () => setShowModal(true);

  // Đóng modal
  const closeModal = () => setShowModal(false);

  // useEffect(() => {
  //   const fetchMedicines = async () => {
  //     if (!isShared) return;

  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Không thể tải danh sách thuốc.");
  //       }
  //       const data = await response.json();

  //       let medicines: MedicineItem[] = [];
  //       medicines = data.map((item: MedicineItem) => {
  //         return {
  //           id: item.id,
  //           ten_thuoc: item.ten_thuoc,
  //         };
  //       });
  //       setListMedicines(medicines);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchMedicines();
  // }, [isShared]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/detail/${id}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải danh sách lịch sử cuộc hẹn.");
      }
      const data = await response.json();
      console.log("Data:", data);

      // Chuyển đổi dữ liệu từ nested object sang flat object
      const flatAppointment: Appointment = {
        id: data.id,
        van_ban_bo_sung: data.van_ban_bo_sung,
        dia_chi_phong_kham: data.dia_chi_phong_kham,
        trang_thai: data.trang_thai,
        thoi_diem_tao: data.thoi_diem_tao,
        ma_bac_si: data.ma_bac_si,
        ma_benh_nhan_dat_hen: data.ma_benh_nhan_dat_hen,
        id_gio_hen: data.id_gio_hen,

        // Thông tin bệnh nhân
        benh_nhan_cccd: data.Benh_nhan.cccd,
        benh_nhan_dan_toc: data.Benh_nhan.dan_toc,
        benh_nhan_nhom_mau: data.Benh_nhan.nhom_mau,
        benh_nhan_tien_su_benh: data.Benh_nhan.tien_su_benh,
        benh_nhan_quoc_tich: data.Benh_nhan.quoc_tich,
        benh_nhan_dia_chi: data.Benh_nhan.dia_chi,
        benh_nhan_ma_benh_nhan: data.Benh_nhan.ma_benh_nhan,

        // Thông tin người dùng của bệnh nhân
        benh_nhan_ten_dang_nhap: data.Benh_nhan.Nguoi_dung.ten_dang_nhap,
        benh_nhan_email: data.Benh_nhan.Nguoi_dung.email,
        benh_nhan_sdt: data.Benh_nhan.Nguoi_dung.sdt,
        benh_nhan_ngay_sinh: data.Benh_nhan.Nguoi_dung.ngay_sinh,
        benh_nhan_gioi_tinh: data.Benh_nhan.Nguoi_dung.gioi_tinh,
        benh_nhan_phan_loai: data.Benh_nhan.Nguoi_dung.phan_loai,
        benh_nhan_ho_va_ten: data.Benh_nhan.Nguoi_dung.ho_va_ten,
        benh_nhan_avt_url: data.Benh_nhan.Nguoi_dung.avt_url,

        // Thông tin bác sĩ
        bac_si_ngay_vao_nghe: data.Bac_si.ngay_vao_nghe,
        bac_si_trinh_do_hoc_van: data.Bac_si.trinh_do_hoc_van,
        bac_si_mo_ta: data.Bac_si.mo_ta,
        bac_si_dia_chi_pk: data.Bac_si.dia_chi_pk,
        bac_si_ma_bac_si: data.Bac_si.ma_bac_si,
        bac_si_chuyen_khoa: data.Bac_si.chuyen_khoa,
        bac_si_avt_url: data.Bac_si.Nguoi_dung.avt_url,
        bac_si_ho_va_ten: data.Bac_si.Nguoi_dung.ho_va_ten,
        bac_si_email: data.Bac_si.Nguoi_dung.email,
        bac_si_sdt: data.Bac_si.Nguoi_dung.sdt,

        // Thông tin giờ hẹn
        //Đổi "2025-03-25T00:00:00.000Z" sang giờ Việt Nam, trích ra giờ và phút
        gio_hen_thoi_diem_bat_dau: new Date(
          data.Gio_hen.thoi_diem_bat_dau
        ).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
        }),
        gio_hen_thoi_diem_ket_thuc: new Date(
          data.Gio_hen.thoi_diem_ket_thuc
        ).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
        }),
        gio_hen_ngay_lam_viec: new Date(
          data.Gio_hen.ngay_lam_viec
        ).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        gio_hen_available: data.Gio_hen.available,
        gio_hen_id_ca_lam_viec: data.Gio_hen.id_ca_lam_viec,
        ca_lam_viec_lam_viec_onl:
          data.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl,
        hinh_anh_bo_sung:
          data.Hinh_anh_bo_sung_cuoc_hen?.map(
            (img: { url: string }) => img.url
          ) || [],
      };
      console.log(flatAppointment);
      setAppointment(flatAppointment);
    } catch (err) {
      console.error(err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  useEffect(() => {
    const fetchResultDetail = async () => {
      if (!isShared) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/appointment/${id}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách kết quả khám bệnh.");
        }
        const data = await response.json();

        console.log("Result detail: ", data);

        if (data) {
          setDiagnosis(data.ket_qua_chan_doan);
          setNote(data.ghi_chu_them);
          if (data.Don_thuoc) {
            const medicinesData = data.Don_thuoc.Don_chua_thuoc.map(
              (med: any) => ({
                id: med.Thuoc.id,
                ten_thuoc: med.Thuoc.ten_thuoc,
                so_luong: med.tong_so,
                buoi_uong: med.buoi_uong.split(", "),
              })
            );
            setMedicines(medicinesData);
            setStartDate(data.Don_thuoc.ngay_bat_dau);
            setEndDate(data.Don_thuoc.ngay_ket_thuc);
            setPrescriptionName(data.Don_thuoc.ten_don_thuoc);
            setPrescriptionNote(data.Don_thuoc.ghi_chu);
          }
          if (data.Hinh_anh_ket_qua.length > 0) {
            const existingFiles = data.Hinh_anh_ket_qua.map(
              (item: { url: any }) => ({
                url: item.url,
                isNew: false, // Các ảnh cũ không cần upload lại
              })
            );

            console.log(existingFiles);

            setFiles((prevFiles) => [...prevFiles, ...existingFiles]);
          }
        } else {
          setDiagnosis("");
          setNote("");
          setMedicines([]);
          setStartDate("");
          setEndDate("");
          setPrescriptionName("");
          setPrescriptionNote("");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchResultDetail();
  }, [isShared]);

  useEffect(() => {
    const fetchIsShared = async () => {
      try {
        if (appointment.ma_bac_si === "") return;

        console.log(appointment.ma_bac_si, " : ", localStorage.getItem("id"));
        if (appointment.ma_bac_si === localStorage.getItem("id")) {
          console.log("return");
          setIsShared(true);
          return;
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/diagnosis/is_shared/appointment/${id}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách kết quả khám bệnh.");
        }
        const data = await response.json();
        console.log(data);

        setIsShared(data.duoc_chia_se);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIsShared();
  }, [appointment]);

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

  return (
    <div className="h-full bg-gray-50 p-2">
      <div className="flex gap-4 h-full">
        {/* Thông tin cuộc hẹn và kết quả bên trái */}
        <div className="w-2/3 bg-white px-6 py-4 rounded-lg shadow-md text-sm">
          {/* Chi tiết cuộc hẹn và nơi nhập kết quả khám bệnh */}
          <h2 className="text-xl font-semibold mb-4 text-center">
            Kết quả khám bệnh
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Mã đơn hẹn */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Mã đơn hẹn
              </label>
              <input
                type="text"
                value={`#${appointment.id}`}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hình thức */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Hình thức
              </label>
              <input
                type="text"
                value={
                  appointment.ca_lam_viec_lam_viec_onl
                    ? "Trực tuyến"
                    : "Trực tiếp"
                }
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* Tên bệnh nhân */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Tên bệnh nhân
              </label>
              <input
                type="text"
                value={appointment.benh_nhan_ho_va_ten}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Địa điểm */}
            <div>
              <label className="text-sm font-medium block mb-2">Địa điểm</label>
              <input
                type="text"
                value={appointment.bac_si_dia_chi_pk}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* Giờ bắt đầu */}
            <div>
              <label className="text-sm font-medium block mb-2">Giờ hẹn</label>
              <input
                type="text"
                value={`${appointment.gio_hen_thoi_diem_bat_dau} - ${appointment.gio_hen_thoi_diem_ket_thuc}`}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              {/* Ngày khám */}
              <label className="text-sm font-medium block mb-2">
                Ngày khám
              </label>
              <input
                type="text"
                value={appointment.gio_hen_ngay_lam_viec}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {isShared && (
            <>
              <div className="mt-2">
                {/* Chẩn đoán */}
                <label className="text-sm font-medium block mb-2">
                  Chẩn đoán
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={appointment.trang_thai === "Hoàn thành"}
                />
              </div>

              <div className="mt-2">
                {/* Ghi chú */}
                <label className="text-sm font-medium block mb-2">
                  Ghi chú
                </label>
                <textarea
                  disabled={appointment.trang_thai === "Hoàn thành"}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="mt-2">
                {/* Đính kèm file */}
                <label className="text-sm font-medium block mb-2">
                  Hình ảnh kết quả:
                </label>
                {files.length === 0 && (
                  <input
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value="Không có hình ảnh"
                    disabled
                  />
                )}
              </div>
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 cursor-pointer"
                      onClick={() =>
                        setSelectedImage("url" in file ? file.url : "")
                      }
                    >
                      <img
                        src={"url" in file ? file.url : ""}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}

              {medicines.length > 0 && (
                // Tạo ra bảng gồm các thông tin của từng loại thuốc, có nút xóa ở cuối mỗi dòng
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Tên đơn thuốc
                      </label>
                      <input
                        disabled={appointment.trang_thai === "Hoàn thành"}
                        type="text"
                        value={prescriptionName}
                        onChange={(e) => setPrescriptionName(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Ghi chú đơn thuốc
                      </label>
                      <input
                        disabled={appointment.trang_thai === "Hoàn thành"}
                        type="text"
                        value={prescriptionNote}
                        onChange={(e) => setPrescriptionNote(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Ngày bắt đầu
                      </label>
                      <input
                        disabled={appointment.trang_thai === "Hoàn thành"}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Ngày kết thúc
                      </label>
                      <input
                        disabled={appointment.trang_thai === "Hoàn thành"}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <table className="min-w-full border border-gray-300 text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Tên thuốc</th>
                        <th className="border px-4 py-2">Số lượng</th>
                        <th className="border px-4 py-2">Thời điểm dùng</th>
                        {appointment.trang_thai !== "Hoàn thành" && (
                          <>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2"></th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((med, index) => (
                        <tr key={index} className="border-b">
                          <td className="border px-4 py-2">{med.ten_thuoc}</td>
                          <td className="border px-4 py-2">{med.so_luong}</td>
                          <td className="border px-4 py-2">
                            {med.buoi_uong.join(", ")}
                          </td>
                          {appointment.trang_thai !== "Hoàn thành" && (
                            <>
                              <td>
                                <button
                                  onClick={() => {
                                    setMedicineIdx(index);
                                    setNewMedicine(med);
                                    openModal();
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <MdEdit />
                                </button>
                              </td>
                              <td className="border px-4 py-2 text-center">
                                <button
                                  onClick={() => {
                                    const updatedMedicines = medicines.filter(
                                      (_, i) => i !== index
                                    );
                                    setMedicines(updatedMedicines);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MdDelete size={20} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Thông báo rằng kết quả khám bệnh không được chia sẻ */}
          {!isShared && (
            <div className="mt-12 flex justify-center items-center">
              <div className="flex flex-col items-center text-center px-6 py-4 bg-orange-50 border border-orange-300 rounded-lg w-full max-w-md shadow">
                <IoWarningOutline className="text-orange-500 mb-2" size={60} />
                <p className="text-orange-700 font-medium">
                  Để xem kết quả khám bệnh, bạn cần có sự cho phép của cả bệnh
                  nhân và bác sĩ kê đơn này!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* Card thông tin bệnh nhân */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col items-center text-base">
              <img
                src={
                  appointment.benh_nhan_avt_url
                    ? appointment.benh_nhan_avt_url
                    : defaultAvatar
                }
                alt="Patient Avatar"
                className="w-20 h-20 rounded-full mb-4"
              />
              <p
                className="font-semibold text-center text-blue-500 cursor-pointer hover:text-blue-700 hover:underline"
                onClick={() =>
                  navigate(
                    `/patientInfoDoctor/${appointment.ma_benh_nhan_dat_hen}`
                  )
                }
              >
                {appointment.benh_nhan_ho_va_ten}
                <br />({appointment.ma_benh_nhan_dat_hen})
              </p>
              <p className="text-gray-600">
                {calculateAge(appointment.benh_nhan_ngay_sinh)} tuổi,{" "}
                {appointment.benh_nhan_gioi_tinh}
              </p>
            </div>

            <hr className="my-3 mx-auto" style={{ width: "70%" }} />
            <div className="ml-5 text-base">
              {[
                { label: "SĐT", value: appointment.benh_nhan_sdt },
                {
                  label: "Địa chỉ",
                  value: appointment.benh_nhan_dia_chi || "Chưa có",
                },
                {
                  label: "Tiền sử bệnh lý",
                  value: appointment.benh_nhan_tien_su_benh || "Chưa có",
                },
              ].map((info) => (
                <div className="mb-3" key={info.label}>
                  <p className="font-medium">{info.label}</p>
                  <p className="text-gray-500">{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card thông tin bác sĩ */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col items-center text-base">
              <img
                src={
                  appointment.bac_si_avt_url
                    ? appointment.bac_si_avt_url
                    : defaultAvatar
                }
                alt="Doctor Avatar"
                className="w-20 h-20 rounded-full mb-4"
              />
              <p className="font-semibold text-center">
                {appointment.bac_si_ho_va_ten}
                <br />({appointment.ma_bac_si})
              </p>
              <p className="text-gray-600">{appointment.bac_si_chuyen_khoa}</p>
            </div>

            <hr className="my-3 mx-auto" style={{ width: "70%" }} />
            <div className="ml-5 text-base">
              {[
                {
                  label: "Email",
                  value: appointment.bac_si_email || "Chưa có",
                },
                { label: "SĐT", value: appointment.bac_si_sdt || "Chưa có" },
              ].map((info) => (
                <div className="mb-3" key={info.label}>
                  <p className="font-medium">{info.label}</p>
                  <p className="text-gray-500">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Phóng to"
              className="max-w-full max-h-full rounded-md"
              onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click vào ảnh
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default PatientResult;
