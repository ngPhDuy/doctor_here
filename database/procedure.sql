CREATE OR REPLACE PROCEDURE insert_doctor(
    IN in_ten_dang_nhap VARCHAR(255),
    IN in_mat_khau VARCHAR(255),
    IN in_email VARCHAR(255),
    IN in_sdt VARCHAR(255),
    IN in_ngay_sinh DATE,
    IN in_gioi_tinh CHAR(3),
    IN in_ho_va_ten VARCHAR(255),
    IN in_ngay_vao_nghe DATE,
    IN in_trinh_do_hoc_van VARCHAR(255),
    IN in_mo_ta VARCHAR(255),
    IN in_dia_chi_pk VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_ten_dang_nhap VARCHAR(255);
    new_id INTEGER;
    generated_code VARCHAR(9);
BEGIN
    -- Insert into Tai_khoan table
    INSERT INTO "Tai_khoan" ("ten_dang_nhap", "mat_khau", "active", "thoi_diem_mo_tk")
    VALUES (in_ten_dang_nhap, in_mat_khau, TRUE, CURRENT_TIMESTAMP)
    RETURNING "ten_dang_nhap" INTO new_ten_dang_nhap;

    -- Insert into Nguoi_dung table
    INSERT INTO "Nguoi_dung" ("ten_dang_nhap", "email", "sdt", "ngay_sinh", "gioi_tinh", "phan_loai", "ho_va_ten")
    VALUES (new_ten_dang_nhap, in_email, in_sdt, in_ngay_sinh, in_gioi_tinh, 'bs', in_ho_va_ten)
    RETURNING "id" INTO new_id;

    -- Generate doctor code and insert into Bac_si table
    generated_code := CONCAT('BS', LPAD(new_id::TEXT, 7, '0'));
    INSERT INTO "Bac_si" ("id", "ma_bac_si", "ngay_vao_nghe", "trinh_do_hoc_van", "mo_ta", "dia_chi_pk")
    VALUES (new_id, generated_code, in_ngay_vao_nghe, in_trinh_do_hoc_van, in_mo_ta, in_dia_chi_pk);
END;
$$;

CREATE OR REPLACE PROCEDURE insert_admin(
    IN in_ten_dang_nhap VARCHAR(255),
    IN in_mat_khau VARCHAR(255),
    IN in_email VARCHAR(255),
    IN in_sdt VARCHAR(255),
    IN in_ngay_sinh DATE,
    IN in_gioi_tinh CHAR(3),
    IN in_ho_va_ten VARCHAR(255),
    IN in_que_quan VARCHAR(255),
    IN in_cccd VARCHAR(12),
    IN in_dan_toc VARCHAR(255),
    IN in_tam_tru VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_ten_dang_nhap VARCHAR(255);
    new_id INTEGER;
    generated_code VARCHAR(9);
BEGIN
    INSERT INTO "Tai_khoan" ("ten_dang_nhap", "mat_khau", "active", "thoi_diem_mo_tk")
    VALUES (in_ten_dang_nhap, in_mat_khau, TRUE, CURRENT_TIMESTAMP)
    RETURNING "ten_dang_nhap" INTO new_ten_dang_nhap;

    INSERT INTO "Nguoi_dung" ("ten_dang_nhap", "email", "sdt", "ngay_sinh", "gioi_tinh", "phan_loai", "ho_va_ten")
    VALUES (new_ten_dang_nhap, in_email, in_sdt, in_ngay_sinh, in_gioi_tinh, 'qtv', in_ho_va_ten)
    RETURNING "id" INTO new_id;

    generated_code := CONCAT('QT', LPAD(new_id::TEXT, 7, '0'));
    INSERT INTO "Quan_tri_vien" ("id", "ma_qtv", "que_quan", "cccd", "dan_toc", "tam_tru")
    VALUES (new_id, generated_code, in_que_quan, in_cccd, in_dan_toc, in_tam_tru);
END;
$$;

CREATE OR REPLACE PROCEDURE insert_patient(
    IN in_ten_dang_nhap VARCHAR(255),
    IN in_mat_khau VARCHAR(255),
    IN in_email VARCHAR(255),
    IN in_sdt VARCHAR(255),
    IN in_ngay_sinh DATE,
    IN in_gioi_tinh CHAR(3),
    IN in_ho_va_ten VARCHAR(255),
    IN in_cccd VARCHAR(12),
    IN in_dan_toc VARCHAR(255),
    IN in_nhom_mau VARCHAR(255),
    IN in_tien_su_benh VARCHAR(500),
    IN in_quoc_tich VARCHAR(50),
    IN in_dia_chi VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_ten_dang_nhap VARCHAR(255);
    new_id INTEGER;
    generated_code VARCHAR(9);
BEGIN
    INSERT INTO "Tai_khoan" ("ten_dang_nhap", "mat_khau", "active", "thoi_diem_mo_tk")
    VALUES (in_ten_dang_nhap, in_mat_khau, TRUE, CURRENT_TIMESTAMP)
    RETURNING "ten_dang_nhap" INTO new_ten_dang_nhap;

    INSERT INTO "Nguoi_dung" ("ten_dang_nhap", "email", "sdt", "ngay_sinh", "gioi_tinh", "phan_loai", "ho_va_ten")
    VALUES (new_ten_dang_nhap, in_email, in_sdt, in_ngay_sinh, in_gioi_tinh, 'bn', in_ho_va_ten)
    RETURNING "id" INTO new_id;

    generated_code := CONCAT('BN', LPAD(new_id::TEXT, 7, '0'));
    INSERT INTO "Benh_nhan" ("id", "ma_benh_nhan", "cccd", "dan_toc", "nhom_mau", "tien_su_benh", "quoc_tich", "dia_chi")
    VALUES (new_id, generated_code, in_cccd, in_dan_toc, in_nhom_mau, in_tien_su_benh, in_quoc_tich, in_dia_chi);
END;
$$;

CREATE OR REPLACE PROCEDURE auto_generate_appointments(start_date DATE, end_date DATE, slot_duration INTERVAL, input_ma_bac_si VARCHAR)
LANGUAGE plpgsql
AS $$
DECLARE
    ca RECORD;
    cur_day DATE;
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    cur_time TIMESTAMP; -- Đảm bảo biến này được khai báo
BEGIN
    -- Duyệt qua từng ngày trong khoảng từ start_date đến end_date
    cur_day := start_date;
    WHILE cur_day <= end_date LOOP
        -- Lấy tất cả các ca làm việc còn hiệu lực trong ngày hiện tại và thuộc mã bác sĩ được chỉ định
        FOR ca IN
            SELECT * 
            FROM "Ca_lam_viec_trong_tuan"
            WHERE "hieu_luc" = TRUE
              AND "ma_bac_si" = input_ma_bac_si
              AND "thu" = 
                  CASE EXTRACT(DOW FROM cur_day)
                      WHEN 1 THEN 'T2'
                      WHEN 2 THEN 'T3'
                      WHEN 3 THEN 'T4'
                      WHEN 4 THEN 'T5'
                      WHEN 5 THEN 'T6'
                      WHEN 6 THEN 'T7'
                      WHEN 0 THEN 'CN'
                  END
        LOOP
            -- Tính toán thời gian bắt đầu và kết thúc của từng ca
            start_time := cur_day + 
                          (CASE 
                              WHEN ca."buoi_lam_viec" LIKE 'Sáng%' THEN INTERVAL '7 hours'
                              WHEN ca."buoi_lam_viec" LIKE 'Trưa%' THEN INTERVAL '11 hours'
                              WHEN ca."buoi_lam_viec" LIKE 'Chiều%' THEN INTERVAL '13 hours'
                              WHEN ca."buoi_lam_viec" LIKE 'Tối%' THEN INTERVAL '17 hours'
                           END);
            end_time := start_time + 
                        (CASE 
                            WHEN ca."buoi_lam_viec" LIKE 'Sáng%' THEN INTERVAL '4 hours'
                            WHEN ca."buoi_lam_viec" LIKE 'Trưa%' THEN INTERVAL '2 hours'
                            WHEN ca."buoi_lam_viec" LIKE 'Chiều%' THEN INTERVAL '4 hours'
                            WHEN ca."buoi_lam_viec" LIKE 'Tối%' THEN INTERVAL '2 hours'
                         END);
            
            -- Lặp qua từng khoảng thời gian trong ca và chèn vào bảng Gio_hen
            cur_time := start_time; -- Gán giá trị ban đầu cho cur_time
            WHILE cur_time < end_time LOOP
                INSERT INTO "Gio_hen" ("thoi_diem_bat_dau", "thoi_diem_ket_thuc", "ngay_lam_viec", "available", "id_ca_lam_viec")
                VALUES (
                    cur_time,
                    cur_time + slot_duration,
                    cur_day,
                    TRUE,
                    ca."id"
                );
                cur_time := cur_time + slot_duration; -- Di chuyển sang khoảng giờ tiếp theo
            END LOOP;
        END LOOP;
        
        -- Chuyển sang ngày tiếp theo
        cur_day := cur_day + INTERVAL '1 day';
    END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE create_appointment(
    in_van_ban_bo_sung VARCHAR,
    in_dia_chi_phong_kham VARCHAR,
    in_trang_thai VARCHAR,
    in_thoi_diem_tao TIMESTAMP,
    in_ma_bac_si VARCHAR,
    in_ma_benh_nhan_dat_hen VARCHAR,
    in_id_gio_hen INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_cuoc_hen_id INTEGER;
BEGIN
    -- Tạo một dòng mới trong bảng Cuoc_hen
    INSERT INTO "Cuoc_hen" (
        "van_ban_bo_sung",
        "dia_chi_phong_kham",
        "trang_thai",
        "thoi_diem_tao",
        "ma_bac_si",
        "ma_benh_nhan_dat_hen",
        "id_gio_hen"
    )
    VALUES (
        in_van_ban_bo_sung,
        in_dia_chi_phong_kham,
        in_trang_thai,
        in_thoi_diem_tao,
        in_ma_bac_si,
        in_ma_benh_nhan_dat_hen,
        in_id_gio_hen
    )
    RETURNING "id" INTO new_cuoc_hen_id;

    -- Ghi nhận ID cuộc hẹn mới được tạo ra
    RAISE NOTICE 'New Cuoc_hen created with ID: %', new_cuoc_hen_id;
END;
$$;
