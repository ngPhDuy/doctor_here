import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

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

const ResultDetail: React.FC = () => {
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
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [resultDetail, setResultDetail] =
    useState<ResultDetailProps>(defaultResultDetail);
  // Về thuốc và toa thuốc
  const [medicines, setMedicines] = useState<Medicine[]>([]); // Lưu trữ thông tin toa thuốc
  const [showModal, setShowModal] = useState<boolean>(false); // Trạng thái hiển thị modal
  const [newMedicine, setNewMedicine] = useState<Medicine>(defaultMedicine);
  const [listMedicines, setListMedicines] = useState<MedicineItem[]>([]); // Danh sách thuốc có sẵn
  const [startDate, setStartDate] = useState<string>(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState<string>(""); // Ngày kết thúc
  const [prescriptionName, setPrescriptionName] = useState<string>(""); // Tên đơn thuốc
  const [prescriptionNote, setPrescriptionNote] = useState<string>(""); // Ghi chú đơn thuốc

  const saveHandler = async () => {
    // Kiểm tra đầu vào
    if (diagnosis.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập kết quả khám bệnh.",
      });
      return;
    }

    if (medicines.length > 0) {
      if (startDate === "" || endDate === "" || prescriptionName === "") {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Vui lòng nhập đầy đủ thông tin đơn thuốc.",
        });
        return;
      }

      // Kiểm tra ngày bắt đầu và ngày kết thúc
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.",
        });
        return;
      }
    }

    let urls: string[] = [];
    //upload file mới lên server
    if (files.length > 0) {
      let formData = new FormData();
      files.forEach((file) => {
        if ("file" in file && file.isNew) {
          formData.append("files", file.file);
        }
      });
      formData.append("folderName", "diagnosis");
      setFiles([]); // Xóa file đã upload khỏi state

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cloud/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          urls = data.map((item: UpFileResponse) => item.url);
          // Cập nhật lại các URL từ server vào các ảnh
          console.log(urls);
          let newFiles = urls.map((url) => {
            return {
              isNew: false,
              url: url,
            };
          });
          setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        });
    }

    console.log("Deleted files:", deletedFiles);

    const updateResultAndPrescription = async () => {
      try {
        // Cập nhật kết quả khám bệnh
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/diagnosis/appointment/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              diagnosis,
              note,
              drID: appointment.ma_bac_si,
              urls: urls,
              deleteUrls: deletedFiles,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Không thể cập nhật kết quả khám bệnh.");
        }

        const result = await response.json();
        const diagnosisId = result.id; // Lấy Diagnosis ID

        // Nếu không có thuốc nào, chỉ cần thông báo và kết thúc
        if (!medicines || medicines.length === 0) {
          console.log("Không có thuốc nào được thêm.");
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Kết quả khám bệnh đã được cập nhật.",
          });
          return; // Kết thúc ở đây nếu không có thuốc
        }

        // Nếu có thuốc, tiếp tục tạo đơn thuốc
        const prescriptionResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/prescription`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              appointmentID: id,
              resultID: diagnosisId, // Truyền Diagnosis ID vào
              startDate,
              endDate,
              note: prescriptionNote,
              name: prescriptionName,
              ptID: appointment.ma_benh_nhan_dat_hen,
              medicines: medicines.map((med) => ({
                medicineID: med.id,
                total: med.so_luong,
                dose: med.buoi_uong.join(", "),
              })),
            }),
          }
        );

        if (!prescriptionResponse.ok) {
          throw new Error("Không thể cập nhật đơn thuốc.");
        }

        const prescriptionData = await prescriptionResponse.json();
        console.log("Đơn thuốc đã được cập nhật:", prescriptionData);

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đơn thuốc đã được cập nhật.",
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
        });
      }
    };

    await updateResultAndPrescription();
  };

  const finishHandler = async () => {
    // Xử lý hoàn thành ở đây
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/appointment/finish/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          return response.json().then((data) => {
            // Trả về thông báo lỗi từ server
            console.log(data.message);
            throw new Error(
              data.message || "Không thể cập nhật trạng thái cuộc hẹn."
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        //Đổi appointment.trang_thai thành "Hoàn thành"
        console.log("Trạng thái cuộc hẹn đã được cập nhật:", data);
        setAppointment((prev) => ({ ...prev, trang_thai: "Hoàn thành" }));
        Swal.fire("Thành công!", "Cuộc hẹn đã được hoàn thành.", "success");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.message,
        });
      });
  };

  const clickFinishHandler = () => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hoàn thành cuộc hẹn này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        finishHandler();
      }
    });
  };

  // Mở modal
  const openModal = () => setShowModal(true);

  // Đóng modal
  const closeModal = () => setShowModal(false);

  // Thêm thuốc vào toa
  const addMedicine = () => {
    //validate dữ liệu
    if (
      newMedicine.ten_thuoc === "" ||
      newMedicine.so_luong <= 0 ||
      newMedicine.buoi_uong.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập đầy đủ thông tin thuốc.",
      });
      return;
    }
    setMedicines([...medicines, newMedicine]);
    setNewMedicine(defaultMedicine);
    closeModal();
  };

  // Cập nhật buổi uống khi checkbox được chọn hoặc bỏ chọn
  const handleBuoiUongChange = (value: string) => {
    setNewMedicine((prev) => {
      const newBuoiUong = prev.buoi_uong.includes(value)
        ? prev.buoi_uong.filter((buoi) => buoi !== value)
        : [...prev.buoi_uong, value];

      console.log({ ...prev, buoi_uong: newBuoiUong });
      return { ...prev, buoi_uong: newBuoiUong };
    });
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/medicine`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách thuốc.");
        }
        const data = await response.json();

        let medicines: MedicineItem[] = [];
        medicines = data.map((item: MedicineItem) => {
          return {
            id: item.id,
            ten_thuoc: item.ten_thuoc,
          };
        });
        setListMedicines(medicines);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMedicines();
  }, []);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/detail/${id}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải danh sách lịch sử cuộc hẹn.");
      }
      const data = await response.json();

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
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/diagnosis/appointment/${id}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách kết quả khám bệnh.");
        }
        const data = await response.json();

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
  }, []);

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

  // Hàm xử lý thay đổi file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // Kiểm tra số lượng file đã chọn
    if (files.length + selectedFiles.length > 5) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn tối đa 5 hình ảnh.",
      });
      return;
    }

    // Cập nhật lại state files, nối thêm file mới vào với `isNew: true`
    setFiles((prevFiles) => [
      ...prevFiles,
      ...selectedFiles.map((file) => ({ file, isNew: true })),
    ]);
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => {
      return prevFiles
        .map((file, i) => {
          if (i === index) {
            if (!file.isNew) {
              // Nếu là ảnh cũ, thêm vào mảng deletedFiles
              setDeletedFiles((prevDeletedFiles) => [
                ...prevDeletedFiles,
                "url" in file ? file.url : "", // Lưu URL của ảnh cũ vào mảng deletedFiles
              ]);
            }
            // Nếu là ảnh mới, chỉ xóa khỏi mảng files
            return null;
          }
          return file;
        })
        .filter((file) => file !== null); // Loại bỏ phần tử null (ảnh mới bị xóa)
    });
  };

  return (
    <div className="h-full bg-gray-50 p-2">
      <div className="flex gap-4 h-full">
        {/* Thông tin cuộc hẹn và kết quả bên phải */}
        <div className="w-2/3 bg-white px-6 py-4 rounded-lg shadow-md text-sm">
          {/* Chi tiết cuộc hẹn và nơi nhập kết quả khám bệnh */}
          <h2 className="text-xl font-semibold mb-4 text-center">
            Gửi kết quả khám bệnh
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

          <div className="mt-2">
            {/* Chẩn đoán */}
            <label className="text-sm font-medium block mb-2">Chẩn đoán</label>
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
            <label className="text-sm font-medium block mb-2">Ghi chú</label>
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
              Gửi kết quả (tối đa 5 hình ảnh)
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
                disabled={appointment.trang_thai === "Hoàn thành"}
              />
              <div className="flex flex-col items-center">
                <span className="text-gray-600 text-sm">
                  Drop your file, or{" "}
                </span>
                <span className="text-blue-600 text-sm font-semibold">
                  Browse
                </span>
                <div className="mt-2 text-gray-500 text-xs">Max size 10MB</div>
              </div>
            </div>
          </div>
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative w-20 h-20">
                  {file.isNew ? (
                    "file" in file && file.file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file.file)}
                        alt="Selected"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">
                        {"file" in file ? file.file.name : ""}
                      </span>
                    )
                  ) : (
                    <img
                      src={"url" in file ? file.url : ""}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-md"
                    />
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

          {appointment.trang_thai !== "Hoàn thành" && (
            <>
              <div className="mt-4 flex justify-start">
                <button
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 font-semibold transition-all duration-300"
                  onClick={openModal}
                >
                  Thêm thuốc
                </button>
              </div>
            </>
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
                      <th className="border px-4 py-2"></th>
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
        </div>

        {/* Modal thêm thuốc */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-md w-1/3"
              onClick={(e) => e.stopPropagation()} // Ngừng sự kiện click để modal không đóng khi nhấn vào bên trong
            >
              <h2 className="text-xl font-semibold mb-4">Thêm thuốc</h2>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Tên thuốc
                </label>
                <select
                  value={newMedicine.ten_thuoc}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      ten_thuoc: e.target.value,
                      id:
                        listMedicines.find(
                          (med) => med.ten_thuoc === e.target.value
                        )?.id || 0,
                    })
                  }
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn thuốc</option>
                  {listMedicines.map((med) => (
                    <option key={med.id} value={med.ten_thuoc}>
                      {med.ten_thuoc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <label className="text-sm font-medium block mb-2">
                  Số lượng
                </label>
                <input
                  type="number"
                  value={newMedicine.so_luong}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      so_luong: parseInt(e.target.value, 10),
                    })
                  }
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Thời điểm dùng thuốc */}
              <div className="mt-2">
                <label className="text-sm font-medium block mb-2">
                  Thời điểm dùng thuốc
                </label>
                <div className="flex gap-4">
                  <label
                    className={`w-1/3 text-center cursor-pointer p-2 border ${
                      newMedicine.buoi_uong.includes("Sáng")
                        ? "bg-[#3995C5] text-white"
                        : "border-gray-300"
                    } rounded-lg`}
                  >
                    <input
                      type="checkbox"
                      value="Sáng"
                      checked={newMedicine.buoi_uong.includes("Sáng")}
                      onChange={() => handleBuoiUongChange("Sáng")}
                      className="hidden"
                    />
                    <span>Sáng</span>
                  </label>
                  <label
                    className={`w-1/3 text-center cursor-pointer p-2 border ${
                      newMedicine.buoi_uong.includes("Trưa")
                        ? "bg-[#3995C5] text-white"
                        : "border-gray-300"
                    } rounded-lg`}
                  >
                    <input
                      type="checkbox"
                      value="Trưa"
                      checked={newMedicine.buoi_uong.includes("Trưa")}
                      onChange={() => handleBuoiUongChange("Trưa")}
                      className="hidden"
                    />
                    <span>Trưa</span>
                  </label>
                  <label
                    className={`w-1/3 text-center cursor-pointer p-2 border ${
                      newMedicine.buoi_uong.includes("Chiều")
                        ? "bg-[#3995C5] text-white"
                        : "border-gray-300"
                    } rounded-lg`}
                  >
                    <input
                      type="checkbox"
                      value="Chiều"
                      checked={newMedicine.buoi_uong.includes("Chiều")}
                      onChange={() => handleBuoiUongChange("Chiều")}
                      className="hidden"
                    />
                    <span>Chiều</span>
                  </label>
                </div>
              </div>
              <div className="mt-4 flex justify-center text-sm">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg  font-semibold transition-all duration-300 mr-2"
                  onClick={closeModal}
                >
                  Hủy bỏ
                </button>
                <button
                  className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                  onClick={addMedicine}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-base">
            <img
              src={
                appointment.benh_nhan_avt_url
                  ? appointment.benh_nhan_avt_url
                  : "/images/avt.png"
              }
              alt="Doctor Avatar"
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

          <hr className="my-3" />
          <div className="ml-5 text-base">
            {[
              {
                label: "Email",
                value: appointment.benh_nhan_email
                  ? appointment.benh_nhan_email
                  : "Chưa có",
              },
              { label: "SĐT", value: appointment.benh_nhan_sdt },
              { label: "Ngày sinh", value: appointment.benh_nhan_ngay_sinh },
              {
                label: "Địa chỉ",
                value: appointment.benh_nhan_dia_chi
                  ? appointment.benh_nhan_dia_chi
                  : "Chưa có",
              },
              {
                label: "Tiền sử bệnh lý",
                value: appointment.benh_nhan_tien_su_benh
                  ? appointment.benh_nhan_tien_su_benh
                  : "Chưa có",
              },
            ].map((info) => (
              <div className="mb-3" key={info.label}>
                <p className="font-medium">{info.label}</p>
                <p className="text-gray-500">{info.value}</p>
              </div>
            ))}
          </div>

          {/* Hai nút Lưu và Hoàn thành */}
          <div className="flex justify-center items-center mt-5 text-sm">
            {appointment.trang_thai !== "Hoàn thành" ? (
              <>
                <button
                  className="bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-900 font-semibold transition-all duration-300 mr-2 w-1/3"
                  onClick={saveHandler}
                >
                  Lưu
                </button>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-semibold transition-all duration-300 w-2/5"
                  onClick={clickFinishHandler}
                >
                  Hoàn thành
                </button>
              </>
            ) : (
              <div className="px-4 py-3 text-base">
                <span className="px-3 py-1 rounded-full font-medium bg-green-200 text-green-600">
                  Đã hoàn thành
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultDetail;
