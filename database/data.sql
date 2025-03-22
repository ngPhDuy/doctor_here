CALL insert_doctor(
    'bacsi1', 'bacsi1', 'bacsi1@example.com', '0123456789', 
    '1985-01-15', 'Nam', 'Nguyễn Trung Hiếu', 
    '2010-09-22', 'Thạc sĩ Y học', 'Được bệnh nhân đánh giá cao', 
    'Phòng khám B, Quận 2', 'Nhi khoa'
);

CALL insert_doctor(
    'bacsi2', 'bacsi2', 'bacsi2@example.com', '0123456790', 
    '1990-02-20', 'Nam', 'Nguyễn Trung Nghĩa', 
    '2009-05-11', 'Thạc sĩ Y học', 'Chuyên gia hàng đầu', 
    'Phòng khám B, Quận 2', 'Nội khoa'
);

CALL insert_doctor(
    'bacsi3', 'bacsi3', 'bacsi3@example.com', '0123456791', 
    '1987-03-25', 'Nam', 'Nguyễn Trung Thành', 
    '2010-04-13', 'Tiến sĩ Y học', 'Thành viên hội đồng y khoa', 
    'Phòng khám C, Quận 3', 'Dịch kính võng mạc'
);

CALL insert_doctor(
    'bacsi4', 'bacsi4', 'bacsi4@example.com', '0123456792', 
    '1995-04-10', 'Nam', 'Nguyễn Trung Dũng', 
    '2003-11-09', 'Bác sĩ Chuyên khoa II', 'Tận tâm với nghề', 
    'Phòng khám B, Quận 2', 'Khoa tiết niệu'
);

CALL insert_doctor(
    'bacsi5', 'bacsi5', 'bacsi5@example.com', '0123456793', 
    '1992-05-30', 'Nam', 'Nguyễn Trung Can', 
    '2006-10-27', 'Tiến sĩ Y học', 'Thành viên hội đồng y khoa', 
    'Phòng khám C, Quận 3', 'Khoa tim mạch'
);

CALL insert_patient(
    'nguoidung1', 'nguoidung1', 'nguoidung1@example.com', '0123456888', 
    '1995-01-15', 'Nữ', 'Nguyễn Thị Hiền', 
    '0123456706', 'Tày', 'AB', 'Tiền sử tiểu đường tuýp 2', 
    'Việt Nam', 'Số 20, Đường B, Quận 2, TP HCM'
);

CALL insert_patient(
    'nguoidung2', 'nguoidung2', 'nguoidung2@example.com', '0123456889', 
    '1996-02-25', 'Nữ', 'Nguyễn Thị Nghĩa', 
    '0123456707', 'Kinh', 'O', 'Dị ứng thuốc nhẹ', 
    'Việt Nam', 'Số 10, Đường A, Quận 1, TP HCM'
);

CALL insert_patient(
    'nguoidung3', 'nguoidung3', 'nguoidung3@example.com', '0123456890', 
    '1999-08-28', 'Nam', 'Nguyễn Thành Danh', 
    '0123456708', 'Tày', 'A', 'Tiền sử tiểu đường tuýp 2', 
    'Việt Nam', 'Số 20, Đường B, Quận 2, TP HCM'
);

CALL insert_patient(
    'nguoidung4', 'nguoidung4', 'nguoidung4@example.com', '0123456891', 
    '1975-04-30', 'Nam', 'Nguyễn Dũng Dinh', 
    '0123456709', 'Hoa', 'A', 'Tiền sử tiểu đường tuýp 2', 
    'Việt Nam', 'Số 30, Đường C, Quận 3, TP HCM'
);

CALL insert_patient(
    'nguoidung5', 'nguoidung5', 'nguoidung5@example.com', '0123456892', 
    '1994-05-23', 'Nữ', 'Nguyễn Can Can', 
    '0123456710', 'Tày', 'A', 'Tiền sử tiểu đường tuýp 2', 
    'Việt Nam', 'Số 40, Đường D, Quận 4, TP HCM'
);

CALL insert_admin(
    'admin1', 'admin1', 'admin1@example.com', '0123456999', 
    '1986-07-19', 'Nam', 'Nguyễn Trung Hiếu', 
    'TP HCM', '0123456711', 'Hoa', 'Số 30, Đường C, Quận 3, TP HCM'
);

CALL insert_admin(
    'admin2', 'admin2', 'admin2@example.com', '0123456998', 
    '1997-12-17', 'Nữ', 'Nguyễn Thị Loan', 
    'Hải Phòng', '0123456712', 'Thái', 'Số 30, Đường C, Quận 3, TP HCM'
);


INSERT INTO "Ca_lam_viec_trong_tuan" ("ma_bac_si", "thu", "buoi_lam_viec", "lam_viec_onl", "cap_nhat_luc", "hieu_luc", "gia_tien")
VALUES
    -- Dữ liệu cho Thứ 2
    ('BS0000001', 'T2', 'Sáng: 7-11h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T2', 'Trưa: 11-13h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T2', 'Chiều: 13-17h', FALSE, '2023-01-05', TRUE, NULL),
    
    -- Dữ liệu cho Thứ 3
    ('BS0000001', 'T3', 'Sáng: 7-11h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T3', 'Trưa: 11-13h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T3', 'Chiều: 13-17h', FALSE, '2023-01-05', TRUE, NULL),
    
    -- Dữ liệu cho Thứ 4
    ('BS0000001', 'T4', 'Sáng: 7-11h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T4', 'Trưa: 11-13h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T4', 'Chiều: 13-17h', FALSE, '2023-01-05', TRUE, NULL),
    
    -- Dữ liệu cho Thứ 5
    ('BS0000001', 'T5', 'Sáng: 7-11h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T5', 'Trưa: 11-13h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T5', 'Chiều: 13-17h', FALSE, '2023-01-05', TRUE, NULL),
    
    -- Dữ liệu cho Thứ 6
    ('BS0000001', 'T6', 'Sáng: 7-11h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T6', 'Trưa: 11-13h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T6', 'Chiều: 13-17h', FALSE, '2023-01-05', TRUE, NULL),
    
    -- Dữ liệu cho Thứ 7
    ('BS0000001', 'T7', 'Sáng: 7-11h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T7', 'Trưa: 11-13h', FALSE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'T7', 'Chiều: 13-17h', FALSE, '2023-01-05', TRUE, NULL),
    
    -- Dữ liệu cho Chủ Nhật
    ('BS0000001', 'CN', 'Sáng: 7-11h', TRUE, '2023-01-05', TRUE, NULL),
    ('BS0000001', 'CN', 'Trưa: 11-13h', TRUE, '2023-01-05', TRUE, NULL);

CALL auto_generate_appointments('2025-01-01', '2025-01-07', '15 minutes', 'BS0000001');

call create_appointment('Bệnh nhân bị đau đầu và chóng mặt', 'Phòng khám B, Quận 2', 'Đang chờ', '2025-01-01 10:00:00', 'BS0000001', 'BN0000006', 50);
call create_appointment('Bệnh nhân bị đau đầu và chóng mặt', '', 'Đang chờ', '2025-01-02 07:00:00', 'BS0000001', 'BN0000006', 162);

--Thêm yêu cầu cập nhật thông tin
call create_update_request('trình độ mới', 'địa chỉ mới', 'chuyên khoa mới', 'BS0000001')

CALL insert_weekly_work(
    'BS0000002'::VARCHAR,  -- Mã bác sĩ
    'T2'::VARCHAR,         -- Thứ làm việc
    ARRAY['Sáng: 7-11h', 'Trưa: 11-13h']::VARCHAR[],  -- Mảng giờ làm việc
    TRUE,                   -- Làm việc online (boolean)
    CURRENT_TIMESTAMP::TIMESTAMP,      -- Thời điểm cập nhật
    500000                  -- Giá thành
);

call create_update_request('trình độ mới 1', 'địa chỉ mới 1', 'chuyên khoa mới 1', 'BS0000001');
call create_update_request('trình độ mới 2', 'địa chỉ mới 2', 'chuyên khoa mới 2', 'BS0000001');
call create_update_request('trình độ mới 3', 'địa chỉ mới 3', 'chuyên khoa mới 3', 'BS0000001');
call create_update_request('trình độ mới 4', 'địa chỉ mới 4', 'chuyên khoa mới 4', 'BS0000001');
call create_update_request('trình độ mới 5', 'địa chỉ mới 5', 'chuyên khoa mới 5', 'BS0000001');
call create_update_request('trình độ mới 6', 'địa chỉ mới 6', 'chuyên khoa mới 6', 'BS0000001');
call create_update_request('trình độ mới 7', 'địa chỉ mới 7', 'chuyên khoa mới 7', 'BS0000001');
call create_update_request('trình độ mới 8', 'địa chỉ mới 8', 'chuyên khoa mới 8', 'BS0000001');
call create_update_request('trình độ mới 9', 'địa chỉ mới 9', 'chuyên khoa mới 9', 'BS0000001');
call create_update_request('trình độ mới 10', 'địa chỉ mới 10', 'chuyên khoa mới 10', 'BS0000001');

call create_update_request('trình độ mới 1', 'địa chỉ mới 1', 'chuyên khoa mới 1', 'BS0000002');
call create_update_request('trình độ mới 2', 'địa chỉ mới 2', 'chuyên khoa mới 2', 'BS0000002');
call create_update_request('trình độ mới 3', 'địa chỉ mới 3', 'chuyên khoa mới 3', 'BS0000002');

call create_update_request('trình độ mới 1', 'địa chỉ mới 1', 'chuyên khoa mới 1', 'BS0000003');
call create_update_request('trình độ mới 2', 'địa chỉ mới 2', 'chuyên khoa mới 2', 'BS0000003');
call create_update_request('trình độ mới 3', 'địa chỉ mới 3', 'chuyên khoa mới 3', 'BS0000003');

INSERT INTO "Yeu_thich_bac_si" ("ma_benh_nhan", "ma_bac_si")
VALUES
('BN0000006', 'BS0000002'),
('BN0000006', 'BS0000004'),
('BN0000006', 'BS0000005'),
('BN0000007', 'BS0000004'),
('BN0000007', 'BS0000005'),
('BN0000008', 'BS0000004'),
('BN0000009', 'BS0000004');
