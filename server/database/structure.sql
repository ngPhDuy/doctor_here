ALTER USER postgres WITH PASSWORD 'doctor_here';

CREATE TABLE "Chuyen_khoa" (
  "ten_chuyen_khoa" VARCHAR(50),
  "img_url" VARCHAR(255),
  PRIMARY KEY ("ten_chuyen_khoa")
);

CREATE TABLE "Tai_khoan" (
  "ten_dang_nhap" VARCHAR(255) UNIQUE NOT NULL,
  "mat_khau" VARCHAR(255) NOT NULL,
  "active" BOOLEAN NOT NULL,
  "thoi_diem_mo_tk" TIMESTAMP NOT NULL,
  PRIMARY KEY ("ten_dang_nhap")
);

CREATE TABLE "Nguoi_dung" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "ten_dang_nhap" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255),
  "sdt" VARCHAR(255) NOT NULL UNIQUE,
  "ngay_sinh" DATE NOT NULL,
  "gioi_tinh" CHAR(3) NOT NULL,
  "phan_loai" VARCHAR(3),--bs, bn, qtv
  "ho_va_ten" VARCHAR(255) NOT NULL,
  "avt_url" VARCHAR(255),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("ten_dang_nhap") REFERENCES "Tai_khoan" ("ten_dang_nhap") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Quan_tri_vien" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "que_quan" VARCHAR(255),
  "cccd" VARCHAR(12),
  "dan_toc" VARCHAR(255),
  "tam_tru" VARCHAR(255),
  "ma_qtv" VARCHAR(9) UNIQUE NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("id") REFERENCES "Nguoi_dung" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Bac_si" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "ngay_vao_nghe" DATE,
  "trinh_do_hoc_van" VARCHAR(255),
  "mo_ta" VARCHAR(255),
  "dia_chi_pk" VARCHAR(255),
  "ma_bac_si" VARCHAR(9) UNIQUE NOT NULL,
  "chuyen_khoa" VARCHAR(50),
  "chia_se_kq_cho_tat_ca" BOOLEAN DEFAULT FALSE,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("id") REFERENCES "Nguoi_dung" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("chuyen_khoa") REFERENCES "Chuyen_khoa" ("ten_chuyen_khoa") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Benh_nhan" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "cccd" VARCHAR(12) UNIQUE,
  "dan_toc" VARCHAR(255),
  "nhom_mau" VARCHAR(255),
  "tien_su_benh" varchar(500),
  "quoc_tich" varchar(50),
  "dia_chi" VARCHAR(255),
  "ma_benh_nhan" varchar(9) UNIQUE NOT NULL,
  "chieu_cao" real,
  "can_nang" real,
  "dong_bo" boolean,
  "chia_se_kq_cho_tat_ca" BOOLEAN DEFAULT FALSE,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("id") REFERENCES "Nguoi_dung" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Chi_dinh_an_kq_cua_bac_si" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "ma_benh_nhan" varchar(9),
  "ma_bac_si" varchar(9),
  "an_kq" boolean default false,
  UNIQUE ("ma_benh_nhan", "ma_bac_si"),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION
)

CREATE TABLE "Yeu_cau_cap_nhat_thong_tin" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "trang_thai" VARCHAR(255),-- Chờ duyệt, Đã duyệt, Từ chối, Thu hồi
  "thoi_diem_yeu_cau" TIMESTAMP,
  "ma_yeu_cau" varchar(9) UNIQUE NOT NULL,
  "trinh_do_hoc_van_cu" VARCHAR(255),
  "trinh_do_hoc_van_moi" VARCHAR(255),
  "dia_chi_pk_cu" VARCHAR(255),
  "dia_chi_pk_moi" VARCHAR(255),
  "chuyen_khoa_cu" VARCHAR(50),
  "chuyen_khoa_moi" VARCHAR(50),
  "ma_bac_si" varchar(9),
  "thoi_diem_thu_hoi" TIMESTAMP,
  PRIMARY KEY ("id")
);

CREATE TABLE "Ca_lam_viec_trong_tuan" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "ma_bac_si" varchar(9),
  "thu" VARCHAR(10), --Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7, Chủ nhật
  "gio_bat_dau" time,
  "gio_ket_thuc" time,
  "lam_viec_onl" BOOLEAN,
  "cap_nhat_luc" TIMESTAMP,
  "hieu_luc" BOOLEAN,--Đang hiệu lực hoặc chờ có hiệu lực
  "het_hieu_luc" BOOLEAN,
  "gia_tien" INTEGER,
  PRIMARY KEY ("id")
);

CREATE TABLE "Gio_hen" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY,
  "thoi_diem_bat_dau" TIMESTAMP UNIQUE,
  "thoi_diem_ket_thuc" TIMESTAMP,
  "ngay_lam_viec" DATE,
  "available" BOOLEAN,
  "id_ca_lam_viec" INTEGER,
  PRIMARY KEY ("id")
);

CREATE TABLE "Ket_qua_kham_benh" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "ket_qua_chan_doan" VARCHAR(255),
  "ghi_chu_them" VARCHAR(255),
  "ma_cuoc_hen" INTEGER,
  "ma_bac_si" varchar(9),
  PRIMARY KEY ("id")
);

CREATE TABLE "Cuoc_hen" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "van_ban_bo_sung" VARCHAR(255),
  "dia_chi_phong_kham" VARCHAR(255),
  "trang_thai" VARCHAR(255),--Đang chờ, Hoàn thành, Đã hủy
  "thoi_diem_tao" timestamp,
  "ma_bac_si" varchar(9),
  "ma_benh_nhan_dat_hen" varchar(9),
  "id_gio_hen" INTEGER,
  "nhac_nho" BOOLEAN DEFAULT TRUE,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("ma_benh_nhan_dat_hen") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("id_gio_hen") REFERENCES "Gio_hen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Cuoc_goi" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "trang_thai" VARCHAR(50),-- 0 (Bi nho), 1 (Da bat may), 2 (Đã kết thúc)
  "thoi_diem_goi" TIMESTAMP,
  "thoi_diem_ket_thuc" TIMESTAMP,
  "id_cuoc_hen" INTEGER,
  "ben_goi_di" CHAR(3),--BN or BS
  PRIMARY KEY ("id")
);

CREATE TABLE "Thong_bao_cuoc_goi" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "thoi_diem_thong_bao" TIMESTAMP,
  "noi_dung" VARCHAR(255),
  "cuoc_goi" INTEGER,
  PRIMARY KEY ("id")
);

CREATE TABLE "Cuoc_hoi_thoai" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "thoi_diem_tao" TIMESTAMP,
  "ma_bac_si" varchar(9),
  "ma_benh_nhan" varchar(9),
  "thoi_diem_tin_nhan_cuoi" TIMESTAMP,
  PRIMARY KEY ("id"),
  constraint "uq_cuoc_hoi_thoai" UNIQUE ("ma_bac_si", "ma_benh_nhan")
);

CREATE TABLE "Tin_nhan" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "kieu_noi_dung" VARCHAR(255),
  "noi_dung_van_ban" VARCHAR(255),
  "media_url" VARCHAR(255),
  "thoi_diem_gui" TIMESTAMP,
  "thoi_diem_da_xem" TIMESTAMP,
  "cuoc_hoi_thoai" INTEGER,
  "ben_gui_di" VARCHAR(3),
  PRIMARY KEY ("id")
);

CREATE TABLE "Thong_bao_tin_nhan" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "thoi_diem_thong_bao" TIMESTAMP,
  "noi_dung" VARCHAR(255),
  "id_tin_nhan" INTEGER,
  PRIMARY KEY ("id")
);

-- CREATE TABLE "Giao_dich" (
--   "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
--   "thoi_diem" TIMESTAMP,
--   "khoan_giao_dich" INTEGER,
--   "ket_qua" VARCHAR(255),
--   "ma_benh_nhan" varchar(9),
--   PRIMARY KEY ("id")
-- );

CREATE TABLE "So_buoc_di_trong_ngay" (
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "tong_so_buoc" INTEGER,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan")
);

CREATE TABLE "BMI" (
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "chieu_cao" real,
  "can_nang" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan")
);

CREATE TABLE "Nhip_tim" (
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan")
);

CREATE TABLE "Nhip_tho" (
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan")
);

CREATE TABLE "Huyet_ap"(
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "huyet_ap_tam_thu" real,
  "huyet_ap_tam_truong" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Duong_huyet"(
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Oxy_mau"(
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Than_nhiet"(
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Khoang_cach"(
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Chieu_cao"(
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Can_nang"(
  "ma_benh_nhan" varchar(9),
  "thoi_diem_ghi_nhan" TIMESTAMP,
  "gia_tri" real,
  PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
  FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Duyet_yeu_cau_cap_nhat" (
  "yeu_cau_cap_nhat" varchar(9) NOT NULL,
  "ma_qtv" varchar(9),
  "thoi_diem_duyet" TIMESTAMP,
  "ly_do" varchar(255),
  PRIMARY KEY ("yeu_cau_cap_nhat")
);

CREATE TABLE "Yeu_thich_bac_si" (
  "ma_benh_nhan" varchar(9),
  "ma_bac_si" varchar(9),
  PRIMARY KEY ("ma_benh_nhan", "ma_bac_si")
);

CREATE TABLE "Danh_gia" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "diem_danh_gia" INTEGER,
  "noi_dung" VARCHAR(255),
  "thoi_diem" TIMESTAMP,
  "id_cuoc_hen" INTEGER,
  "ma_benh_nhan_danh_gia" varchar(9),
  "ma_bac_si" varchar(9),
  FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION,
  PRIMARY KEY ("id"),
  UNIQUE ("id_cuoc_hen", "ma_benh_nhan_danh_gia")
);

CREATE TABLE "Binh_luan" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "noi_dung" VARCHAR(255),
  "thoi_diem" TIMESTAMP,
  "ma_bac_si_binh_luan" varchar(9),
  "id_danh_gia" INTEGER,
  PRIMARY KEY ("id")
);

-- CREATE TABLE "Chuyen_khoa_cu_yeu_cau" (
--   "ma_yeu_cau" varchar(9),
--   "chuyen_khoa" VARCHAR(50),
--   PRIMARY KEY ("ma_yeu_cau", "chuyen_khoa")
-- );

-- CREATE TABLE "Chuyen_khoa_moi_yeu_cau" (
--   "ma_yeu_cau" varchar(9),
--   "chuyen_khoa" VARCHAR(50),
--   PRIMARY KEY ("ma_yeu_cau", "chuyen_khoa")
-- );

CREATE TABLE "Hinh_anh_bo_sung_cuoc_hen" (
  "id_cuoc_hen" INTEGER,
  "url" VARCHAR(255),
  PRIMARY KEY ("id_cuoc_hen", "url")
);

CREATE TABLE "Hinh_anh_ket_qua" (
  "id_ket_qua" INTEGER,
  "url" VARCHAR(255),
  PRIMARY KEY ("id_ket_qua", "url")
);

CREATE TABLE "Don_thuoc" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "id_ket_qua" INTEGER,
  "ngay_bat_dau" DATE,
  "ngay_ket_thuc" DATE,
  "trang_thai" varchar(50), --Đang chờ, Hoàn thành, Đã hủy
  "ghi_chu" varchar(255),
  "ten_don_thuoc" varchar(255),
  PRIMARY KEY ("id")
);

-- Bảng Thuốc
CREATE TABLE "Thuoc" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "ten_thuoc" VARCHAR(255),
  "mo_ta" TEXT,
  "don_vi" VARCHAR(255),
  "cong_dung" TEXT,
  "cach_dung" TEXT,
  "chong_chi_dinh" TEXT,
  "url" VARCHAR(255),
  "bi_xoa" BOOLEAN DEFAULT FALSE,
  "truoc_an" BOOLEAN DEFAULT FALSE
);

-- Bảng Thành Phần
CREATE TABLE "Thanh_phan" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "thuoc_id" INTEGER NOT NULL,
  "ten_thanh_phan" VARCHAR(255) NOT NULL,
  "ham_luong" VARCHAR(100),
  FOREIGN KEY ("thuoc_id") REFERENCES "Thuoc"("id") ON DELETE CASCADE
);


CREATE TABLE "Don_chua_thuoc" (
  "id_thuoc" INTEGER,
  "id_don_thuoc" INTEGER,
  "tong_so" INTEGER,
  "buoi_uong" varchar(50), --[Sáng, Trưa, Chiều]
  PRIMARY KEY ("id_thuoc", "id_don_thuoc")
);

CREATE TABLE "Lan_uong" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "gio" TIME,
  "ngay" DATE,
  "don_thuoc" INTEGER,
  "nhac_nho" BOOLEAN,
  "thoi_diem_da_uong" TIMESTAMP,
  "buoi_uong" varchar(10), --Sáng, Trưa, Tối
  PRIMARY KEY ("id"),
  UNIQUE ("gio", "ngay", "don_thuoc"),
  FOREIGN KEY ("don_thuoc") REFERENCES "Don_thuoc" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CREATE TABLE "Gio_hen_trong_cuoc_hen" (
--   "id_gio_hen" INTEGER,
--   "id_cuoc_hen" INTEGER,
--   PRIMARY KEY ("id_gio_hen", "id_cuoc_hen")
-- );

CREATE TABLE "Thuoc_trong_mot_lan_uong" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "id_lan_uong" INTEGER,
  "thuoc" INTEGER,
  "so_luong" INTEGER,
  PRIMARY KEY ("id"),
  UNIQUE ("id_lan_uong", "thuoc"),
  FOREIGN KEY ("thuoc") REFERENCES "Thuoc" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("id_lan_uong") REFERENCES "Lan_uong" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Bao_hiem_y_te" (
  "ma_bhyt" VARCHAR(255) UNIQUE NOT NULL,
  "bv_dang_ky" VARCHAR(255),
  "ngay_cap" DATE,
  "ngay_het_han" DATE,
  "ma_benh_nhan" varchar(9),
  PRIMARY KEY ("ma_bhyt")
);

-- CREATE TABLE "Giao_dich_phat_luong" (
--   "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
--   "khoan_giao_dich" INTEGER,
--   "thoi_diem_giao_dich" TIMESTAMP,
--   "ket_qua" VARCHAR(255),
--   "ngay_bat_dau" DATE,
--   "ngay_ket_thuc" DATE,
--   "ma_bac_si" varchar(9),
--   PRIMARY KEY ("id")
-- );

CREATE TABLE "Hinh_anh_minh_chung" (
  "ma_yeu_cau" varchar(9),
  "url" VARCHAR(255),
  PRIMARY KEY ("ma_yeu_cau", "url")
);

CREATE TABLE "Nguoi_than" (
  "ma_benh_nhan_1" varchar(9),
  "ma_benh_nhan_2" varchar(9),
  "than_phan" varchar(50),
  "da_xac_nhan" boolean,
  PRIMARY KEY ("ma_benh_nhan_1", "ma_benh_nhan_2")
);

CREATE TABLE "Token_thong_bao" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE NOT NULL,
  "token" VARCHAR(255),
  "id_nguoi_dung" INTEGER,
  UNIQUE ("token"),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("id_nguoi_dung") REFERENCES "Nguoi_dung" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
  )



ALTER TABLE "Nguoi_than" ADD FOREIGN KEY ("ma_benh_nhan_1") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Nguoi_than" ADD FOREIGN KEY ("ma_benh_nhan_2") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "So_buoc_di_trong_ngay" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "BMI" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Nhip_tim" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Nhip_tho" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Yeu_cau_cap_nhat_thong_tin" ADD FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Ket_qua_kham_benh" ADD FOREIGN KEY ("ma_cuoc_hen") REFERENCES "Cuoc_hen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Ket_qua_kham_benh" ADD FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Cuoc_goi" ADD FOREIGN KEY ("id_cuoc_hen") REFERENCES "Cuoc_hen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Cuoc_hoi_thoai" ADD FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Cuoc_hoi_thoai" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Tin_nhan" ADD FOREIGN KEY ("cuoc_hoi_thoai") REFERENCES "Cuoc_hoi_thoai" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Duyet_yeu_cau_cap_nhat" ADD FOREIGN KEY ("ma_qtv") REFERENCES "Quan_tri_vien" ("ma_qtv") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Duyet_yeu_cau_cap_nhat" ADD FOREIGN KEY ("yeu_cau_cap_nhat") REFERENCES "Yeu_cau_cap_nhat_thong_tin" ("ma_yeu_cau") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Ca_lam_viec_trong_tuan" ADD FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Thong_bao_tin_nhan" ADD FOREIGN KEY ("id_tin_nhan") REFERENCES "Tin_nhan" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Thong_bao_cuoc_goi" ADD FOREIGN KEY ("cuoc_goi") REFERENCES "Cuoc_goi" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Yeu_thich_bac_si" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Yeu_thich_bac_si" ADD FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Danh_gia" ADD FOREIGN KEY ("id_cuoc_hen") REFERENCES "Cuoc_hen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Danh_gia" ADD FOREIGN KEY ("ma_benh_nhan_danh_gia") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Giao_dich" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Binh_luan" ADD FOREIGN KEY ("id_danh_gia") REFERENCES "Danh_gia" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Binh_luan" ADD FOREIGN KEY ("ma_bac_si_binh_luan") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Chuyen_khoa_cu_yeu_cau" ADD FOREIGN KEY ("ma_yeu_cau") REFERENCES "Yeu_cau_cap_nhat_thong_tin" ("ma_yeu_cau") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Gio_hen" ADD FOREIGN KEY ("id_ca_lam_viec") REFERENCES "Ca_lam_viec_trong_tuan" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Hinh_anh_ket_qua" ADD FOREIGN KEY ("id_ket_qua") REFERENCES "Ket_qua_kham_benh" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Don_thuoc" ADD FOREIGN KEY ("id_ket_qua") REFERENCES "Ket_qua_kham_benh" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Don_chua_thuoc" ADD FOREIGN KEY ("id_don_thuoc") REFERENCES "Don_thuoc" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Don_chua_thuoc" ADD FOREIGN KEY ("id_thuoc") REFERENCES "Thuoc" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Lan_uong" ADD FOREIGN KEY ("don_thuoc") REFERENCES "Don_thuoc" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Gio_hen_trong_cuoc_hen" ADD FOREIGN KEY ("id_cuoc_hen") REFERENCES "Cuoc_hen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Gio_hen_trong_cuoc_hen" ADD FOREIGN KEY ("id_gio_hen") REFERENCES "Gio_hen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Bao_hiem_y_te" ADD FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Giao_dich_phat_luong" ADD FOREIGN KEY ("ma_bac_si") REFERENCES "Bac_si" ("ma_bac_si") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Hinh_anh_minh_chung" ADD FOREIGN KEY ("ma_yeu_cau") REFERENCES "Yeu_cau_cap_nhat_thong_tin" ("ma_yeu_cau") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Hinh_anh_bo_sung_cuoc_hen" ADD FOREIGN KEY ("id_cuoc_hen") REFERENCES "Cuoc_hen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Chuyen_khoa_moi_yeu_cau" ADD FOREIGN KEY ("ma_yeu_cau") REFERENCES "Yeu_cau_cap_nhat_thong_tin" ("ma_yeu_cau") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ALTER TABLE "Tin_nhan"
-- ALTER COLUMN "thoi_diem_gui"
-- TYPE timestamp with time zone
-- USING "thoi_diem_gui" AT TIME ZONE 'Asia/Ho_Chi_Minh';
