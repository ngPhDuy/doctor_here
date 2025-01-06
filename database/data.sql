INSERT INTO "Tai_khoan" (ten_dang_nhap, mat_khau, active, thoi_diem_mo_tk) 
VALUES 
('bacsi1', 'bacsi1', true, '2023-12-01 10:15:30'),
('bacsi2', 'bacsi2', true, '2023-12-02 14:20:00'),
('bacsi3', 'bacsi3', true, '2023-12-03 18:35:45'),
('bacsi4', 'bacsi4', true, '2023-12-04 22:10:20'),
('bacsi5', 'bacsi5', true, '2023-12-05 09:05:10'),
('nguoidung1', 'nguoidung1', true, '2023-12-01 10:15:30'),
('nguoidung2', 'nguoidung2', true, '2023-12-02 14:20:00'),
('nguoidung3', 'nguoidung3', true, '2023-12-03 18:35:45'),
('nguoidung4', 'nguoidung4', true, '2023-12-04 22:10:20'),
('nguoidung5', 'nguoidung5', true, '2023-12-05 09:05:10'),
('admin1', 'admin1', true, '2023-12-04 22:10:20'),
('admin2', 'admin2', true, '2023-12-05 09:05:10');

CALL insert_user('bacsi1', 'bacsi1@example.com', '0123456789', '1985-01-15', 'Nam', 'bs', 'Nguyễn Trung Hiếu');
CALL insert_user('bacsi2', 'bacsi2@example.com', '0123456790', '1990-02-20', 'Nam', 'bs', 'Nguyễn Trung Nghĩa');
CALL insert_user('bacsi3', 'bacsi3@example.com', '0123456791', '1987-03-25', 'Nam', 'bs', 'Nguyễn Trung Thành');
CALL insert_user('bacsi4', 'bacsi4@example.com', '0123456792', '1995-04-10', 'Nam', 'bs', 'Nguyễn Trung Dũng');
CALL insert_user('bacsi5', 'bacsi5@example.com', '0123456793', '1992-05-30', 'Nam', 'bs', 'Nguyễn Trung Can');
CALL insert_user('nguoidung1', 'nguoidung1@example.com', '0123456888', '1995-01-15', 'Nữ', 'bn', 'Nguyễn Thị Hiền');
CALL insert_user('nguoidung2', 'nguoidung2@example.com', '0123456889', '1996-02-25', 'Nữ', 'bn', 'Nguyễn Thị Nghĩa');
CALL insert_user('nguoidung3', 'nguoidung3@example.com', '0123456890', '1999-08-28', 'Nam', 'bn', 'Nguyễn Thành Danh');
CALL insert_user('nguoidung4', 'nguoidung4@example.com', '0123456891', '1975-04-30', 'Nam', 'bn', 'Nguyễn Dũng Dinh');
CALL insert_user('nguoidung5', 'nguoidung5@example.com', '0123456892', '1994-05-23', 'Nữ', 'bn', 'Nguyễn Can Can');
CALL insert_user('admin1', 'admin1@example.com', '0123456999', '1986-07-19', 'Nam', 'qtv', 'Nguyễn Trung Hiếu');
CALL insert_user('admin2', 'admin2@example.com', '0123456998', '1997-12-17', 'Nữ', 'qtv', 'Nguyễn Thị Loan');

UPDATE "Bac_si"
SET "ngay_vao_nghe" = '2010-09-22',
    "trinh_do_hoc_van" = 'Thạc sĩ Y học',
    "mo_ta" = 'Được bệnh nhân đánh giá cao',
    "dia_chi_pk" = 'Phòng khám B, Quận 2'
WHERE "ma_bac_si" = 'BS0000001';

UPDATE "Bac_si"
SET "ngay_vao_nghe" = '2009-05-11',
    "trinh_do_hoc_van" = 'Thạc sĩ Y học',
    "mo_ta" = 'Chuyên gia hàng đầu',
    "dia_chi_pk" = 'Phòng khám B, Quận 2'
WHERE "ma_bac_si" = 'BS0000002';

UPDATE "Bac_si"
SET "ngay_vao_nghe" = '2010-04-13',
    "trinh_do_hoc_van" = 'Tiến sĩ Y học',
    "mo_ta" = 'Thành viên hội đồng y khoa',
    "dia_chi_pk" = 'Phòng khám C, Quận 3'
WHERE "ma_bac_si" = 'BS0000003';

UPDATE "Bac_si"
SET "ngay_vao_nghe" = '2003-11-09',
    "trinh_do_hoc_van" = 'Bác sĩ Chuyên khoa II',
    "mo_ta" = 'Tận tâm với nghề',
    "dia_chi_pk" = 'Phòng khám B, Quận 2'
WHERE "ma_bac_si" = 'BS0000004';

UPDATE "Bac_si"
SET "ngay_vao_nghe" = '2006-10-27',
    "trinh_do_hoc_van" = 'Tiến sĩ Y học',
    "mo_ta" = 'Thành viên hội đồng y khoa',
    "dia_chi_pk" = 'Phòng khám C, Quận 3'
WHERE "ma_bac_si" = 'BS0000005';

UPDATE "Benh_nhan"
SET "cccd" = '0123456706', "dan_toc" = 'Tày', "diem_he_thong" = 39, 
    "nhom_mau" = 'AB', "tien_su_benh" = 'Tiền sử tiểu đường tuýp 2', "quoc_tich" = 'Việt Nam', 
    "dia_chi" = 'Số 20, Đường B, Quận 2, TP HCM'
WHERE "ma_benh_nhan" = 'BN0000006';

UPDATE "Benh_nhan"
SET "cccd" = '0123456707', "dan_toc" = 'Kinh', "diem_he_thong" = 14, 
    "nhom_mau" = 'O', "tien_su_benh" = 'Dị ứng thuốc nhẹ', "quoc_tich" = 'Việt Nam', 
    "dia_chi" = 'Số 10, Đường A, Quận 1, TP HCM'
WHERE "ma_benh_nhan" = 'BN0000007';

UPDATE "Benh_nhan"
SET "cccd" = '0123456708', "dan_toc" = 'Tày', "diem_he_thong" = 84, 
    "nhom_mau" = 'A', "tien_su_benh" = 'Tiền sử tiểu đường tuýp 2', "quoc_tich" = 'Việt Nam', 
    "dia_chi" = 'Số 20, Đường B, Quận 2, TP HCM'
WHERE "ma_benh_nhan" = 'BN0000008';

UPDATE "Benh_nhan"
SET "cccd" = '0123456709', "dan_toc" = 'Hoa', "diem_he_thong" = 5, 
    "nhom_mau" = 'A', "tien_su_benh" = 'Tiền sử tiểu đường tuýp 2', "quoc_tich" = 'Việt Nam', 
    "dia_chi" = 'Số 30, Đường C, Quận 3, TP HCM'
WHERE "ma_benh_nhan" = 'BN0000009';

UPDATE "Benh_nhan"
SET "cccd" = '0123456710', "dan_toc" = 'Tày', "diem_he_thong" = 60, 
    "nhom_mau" = 'A', "tien_su_benh" = 'Tiền sử tiểu đường tuýp 2', "quoc_tich" = 'Việt Nam', 
    "dia_chi" = 'Số 40, Đường D, Quận 4, TP HCM'
WHERE "ma_benh_nhan" = 'BN0000010';

UPDATE "Quan_tri_vien"
SET "que_quan" = 'TP HCM', "cccd" = '0123456711', "dan_toc" = 'Hoa', "tam_tru" = 'Số 30, Đường C, Quận 3, TP HCM'
WHERE "ma_qtv" = 'QT0000011';

UPDATE "Quan_tri_vien"
SET "que_quan" = 'Hải Phòng', "cccd" = '0123456712', "dan_toc" = 'Thái', "tam_tru" = 'Số 30, Đường C, Quận 3, TP HCM'
WHERE "ma_qtv" = 'QT0000012';
