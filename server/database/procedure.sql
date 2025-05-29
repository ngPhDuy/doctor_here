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
    IN in_dia_chi_pk VARCHAR(255),
    In in_chuyen_khoa VARCHAR(50)
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
    VALUES (in_ten_dang_nhap, in_mat_khau, TRUE, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')
    RETURNING "ten_dang_nhap" INTO new_ten_dang_nhap;

    -- Insert into Nguoi_dung table
    INSERT INTO "Nguoi_dung" ("ten_dang_nhap", "email", "sdt", "ngay_sinh", "gioi_tinh", "phan_loai", "ho_va_ten", "avt_url")
    VALUES (new_ten_dang_nhap, in_email, in_sdt, in_ngay_sinh, in_gioi_tinh, 'bs', in_ho_va_ten, NULL)
    RETURNING "id" INTO new_id;

    -- Generate doctor code and insert into Bac_si table
    generated_code := CONCAT('BS', LPAD(new_id::TEXT, 7, '0'));
    INSERT INTO "Bac_si" ("id", "ma_bac_si", "ngay_vao_nghe", "trinh_do_hoc_van", "mo_ta", "dia_chi_pk", "chuyen_khoa")
    VALUES (new_id, generated_code, in_ngay_vao_nghe, in_trinh_do_hoc_van, in_mo_ta, in_dia_chi_pk, in_chuyen_khoa);
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
    VALUES (in_ten_dang_nhap, in_mat_khau, TRUE, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')
    RETURNING "ten_dang_nhap" INTO new_ten_dang_nhap;

    INSERT INTO "Nguoi_dung" ("ten_dang_nhap", "email", "sdt", "ngay_sinh", "gioi_tinh", "phan_loai", "ho_va_ten", "avt_url")
    VALUES (new_ten_dang_nhap, in_email, in_sdt, in_ngay_sinh, in_gioi_tinh, 'qtv', in_ho_va_ten, NULL)
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
    VALUES (in_ten_dang_nhap, in_mat_khau, TRUE, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')
    RETURNING "ten_dang_nhap" INTO new_ten_dang_nhap;

    INSERT INTO "Nguoi_dung" ("ten_dang_nhap", "email", "sdt", "ngay_sinh", "gioi_tinh", "phan_loai", "ho_va_ten", "avt_url")
    VALUES (new_ten_dang_nhap, in_email, in_sdt, in_ngay_sinh, in_gioi_tinh, 'bn', in_ho_va_ten, NULL)
    RETURNING "id" INTO new_id;

    generated_code := CONCAT('BN', LPAD(new_id::TEXT, 7, '0'));
    INSERT INTO "Benh_nhan" ("id", "ma_benh_nhan", "cccd", "dan_toc", "nhom_mau", "tien_su_benh", "quoc_tich", "dia_chi")
    VALUES (new_id, generated_code, in_cccd, in_dan_toc, in_nhom_mau, in_tien_su_benh, in_quoc_tich, in_dia_chi);
END;
$$;

CREATE OR REPLACE PROCEDURE auto_generate_appointments(slot_duration INTERVAL, input_ma_bac_si VARCHAR)
LANGUAGE plpgsql
AS $$
DECLARE
    ca RECORD;
    cur_day DATE;
    start_of_month DATE := date_trunc('month', CURRENT_DATE)::DATE;
    end_of_month DATE := (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE;
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    cur_time TIMESTAMP;
BEGIN
    -- 1. Update các Ca_lam_viec_trong_tuan cần kích hoạt
    UPDATE "Ca_lam_viec_trong_tuan"
    SET "hieu_luc" = TRUE
    WHERE "hieu_luc" = FALSE
      AND "het_hieu_luc" = FALSE
      AND "ma_bac_si" = input_ma_bac_si;

    -- 2. Sinh các Gio_hen cho toàn bộ tháng hiện tại
    cur_day := start_of_month;
    WHILE cur_day <= end_of_month LOOP
        FOR ca IN
            SELECT * 
            FROM "Ca_lam_viec_trong_tuan"
            WHERE "het_hieu_luc" = FALSE
              AND "ma_bac_si" = input_ma_bac_si
              AND "thu" = CASE EXTRACT(DOW FROM cur_day)
                          WHEN 1 THEN 'Thứ 2'
                          WHEN 2 THEN 'Thứ 3'
                          WHEN 3 THEN 'Thứ 4'
                          WHEN 4 THEN 'Thứ 5'
                          WHEN 5 THEN 'Thứ 6'
                          WHEN 6 THEN 'Thứ 7'
                          WHEN 0 THEN 'Chủ nhật'
                      END
        LOOP
            start_time := cur_day + ca."gio_bat_dau";
            end_time := cur_day + ca."gio_ket_thuc";

            cur_time := start_time;
            WHILE cur_time < end_time LOOP
                INSERT INTO "Gio_hen" (
                    "thoi_diem_bat_dau",
                    "thoi_diem_ket_thuc",
                    "ngay_lam_viec",
                    "available",
                    "id_ca_lam_viec"
                )
                VALUES (
                    cur_time,
                    cur_time + slot_duration,
                    cur_day,
                    TRUE,
                    ca."id"
                );
                cur_time := cur_time + slot_duration;
            END LOOP;
        END LOOP;

        cur_day := cur_day + INTERVAL '1 day';
    END LOOP;
END;
$$;


CREATE OR REPLACE PROCEDURE create_appointment(
    in_van_ban_bo_sung VARCHAR,
    in_ma_bac_si VARCHAR,
    in_ma_benh_nhan_dat_hen VARCHAR,
    in_id_gio_hen INTEGER
)
LANGUAGE plpgsql
AS $$

DECLARE
    new_cuoc_hen_id INTEGER;
    in_dia_chi_phong_kham VARCHAR; -- Khai báo biến để lưu địa chỉ phòng khám
BEGIN
    -- Lấy địa chỉ phòng khám từ bảng Bac_si dựa trên ma_bac_si
    SELECT dia_chi_pk INTO in_dia_chi_phong_kham
    FROM "Bac_si"
    WHERE "ma_bac_si" = in_ma_bac_si;

    -- Kiểm tra nếu không có địa chỉ phòng khám nào được tìm thấy
    IF in_dia_chi_phong_kham IS NULL THEN
        RAISE EXCEPTION 'Dia chi phong kham not found for ma_bac_si: %', in_ma_bac_si;
    END IF;

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
        'Đang chờ',
        CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh',
        in_ma_bac_si,
        in_ma_benh_nhan_dat_hen,
        in_id_gio_hen
    )
    RETURNING "id" INTO new_cuoc_hen_id;

    -- Ghi nhận ID cuộc hẹn mới được tạo ra
    RAISE NOTICE 'New Cuoc_hen created with ID: %', new_cuoc_hen_id;
END;
$$;

CREATE OR REPLACE PROCEDURE create_update_request(
    in_trinh_do_hoc_van_moi VARCHAR(255),
    in_dia_chi_pk_moi VARCHAR(255),
    in_chuyen_khoa_moi VARCHAR(50),
    in_ma_bac_si VARCHAR(9),
    OUT out_ma_yeu_cau VARCHAR(9) -- Thêm OUT parameter để trả về ma_yeu_cau
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_id INTEGER;
    generated_code VARCHAR(9);
    current_trinh_do_hoc_van VARCHAR(255);
    current_dia_chi_pk VARCHAR(255);
    current_chuyen_khoa VARCHAR(50);
BEGIN
    -- Lấy thông tin hiện tại của bác sĩ từ bảng Bac_si
    SELECT "trinh_do_hoc_van", "dia_chi_pk", "chuyen_khoa"
    INTO current_trinh_do_hoc_van, current_dia_chi_pk, current_chuyen_khoa
    FROM "Bac_si"
    WHERE "ma_bac_si" = in_ma_bac_si;

    -- Kiểm tra nếu không tìm thấy bác sĩ với mã số đã cho
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bác sĩ với mã số % không tồn tại!', in_ma_bac_si;
    END IF;

    -- Nếu một trong ba trường mới là NULL, dùng giá trị hiện tại từ bảng Bac_si
    INSERT INTO "Yeu_cau_cap_nhat_thong_tin" (
        "trang_thai",
        "thoi_diem_yeu_cau",
        "ma_yeu_cau",
        "trinh_do_hoc_van_cu",
        "trinh_do_hoc_van_moi",
        "dia_chi_pk_cu",
        "dia_chi_pk_moi",
        "chuyen_khoa_cu",
        "chuyen_khoa_moi",
        "ma_bac_si"
    )
    VALUES (
        'Chờ duyệt',
        CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh',
        'N/A',
        current_trinh_do_hoc_van,
        COALESCE(in_trinh_do_hoc_van_moi, current_trinh_do_hoc_van), -- Nếu NULL thì lấy giá trị hiện tại
        current_dia_chi_pk,
        COALESCE(in_dia_chi_pk_moi, current_dia_chi_pk), -- Nếu NULL thì lấy giá trị hiện tại
        current_chuyen_khoa,
        COALESCE(in_chuyen_khoa_moi, current_chuyen_khoa), -- Nếu NULL thì lấy giá trị hiện tại
        in_ma_bac_si
    )
    RETURNING "id" INTO new_id;

    -- Tạo mã yêu cầu và cập nhật lại vào bảng Yeu_cau_cap_nhat_thong_tin
    generated_code := CONCAT('YCCN', LPAD(new_id::TEXT, 5, '0'));
    UPDATE "Yeu_cau_cap_nhat_thong_tin"
    SET "ma_yeu_cau" = generated_code
    WHERE "id" = new_id;

    -- Cập nhật OUT parameter với ma_yeu_cau
    SELECT "ma_yeu_cau" INTO out_ma_yeu_cau
    FROM "Yeu_cau_cap_nhat_thong_tin"
    WHERE "id" = new_id;
END;
$$;



CREATE OR REPLACE PROCEDURE insert_weekly_work(
    in_ma_bac_si VARCHAR(9),
    in_thu VARCHAR(2),
    in_buoi_lam_viec VARCHAR[],
    in_lam_viec_onl BOOLEAN,
    in_cap_nhat_luc TIMESTAMP,
    in_gia_tien INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_buoi_lam_viec VARCHAR(255);
BEGIN
    -- Cập nhật hieu_luc của các buổi làm việc cũ của bác sĩ theo thứ làm việc thành False
    UPDATE "Ca_lam_viec_trong_tuan"
    SET "hieu_luc" = FALSE
    WHERE "ma_bac_si" = in_ma_bac_si
      AND "thu" = in_thu;

    -- Chèn các buổi làm việc mới
    FOREACH current_buoi_lam_viec IN ARRAY in_buoi_lam_viec
    LOOP
        INSERT INTO "Ca_lam_viec_trong_tuan" (
            "ma_bac_si", 
            "thu", 
            "buoi_lam_viec", 
            "lam_viec_onl", 
            "cap_nhat_luc", 
            "hieu_luc", 
            "gia_tien"
        )
        VALUES (
            in_ma_bac_si, 
            in_thu, 
            current_buoi_lam_viec, 
            in_lam_viec_onl, 
            in_cap_nhat_luc, 
            TRUE, 
            in_gia_tien
        );
    END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE insert_steps(
    p_ma_benh_nhan VARCHAR(9),
    p_thoi_diem_ghi_nhan TIMESTAMP,
    p_tong_so_buoc INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existing_steps INTEGER := 0;
    v_current_date DATE := DATE(p_thoi_diem_ghi_nhan);
    v_record_exists BOOLEAN;
BEGIN
    -- Kiểm tra xem đã có bản ghi nào trong ngày hay chưa
    SELECT EXISTS(
        SELECT 1 FROM "So_buoc_di_trong_ngay"
        WHERE ma_benh_nhan = p_ma_benh_nhan
          AND DATE(thoi_diem_ghi_nhan) = v_current_date
    ) INTO v_record_exists;
    
    -- Nếu có bản ghi trong ngày, lấy tổng số bước hiện tại và cộng dồn
    IF v_record_exists THEN
        -- Lấy tổng số bước hiện tại
        SELECT tong_so_buoc INTO v_existing_steps
        FROM "So_buoc_di_trong_ngay"
        WHERE ma_benh_nhan = p_ma_benh_nhan
          AND DATE(thoi_diem_ghi_nhan) = v_current_date
        ORDER BY thoi_diem_ghi_nhan DESC
        LIMIT 1;
        
        -- Xóa bản ghi cũ
        DELETE FROM "So_buoc_di_trong_ngay"
        WHERE ma_benh_nhan = p_ma_benh_nhan
          AND DATE(thoi_diem_ghi_nhan) = v_current_date;
        
        -- Chèn bản ghi mới với tổng số bước đã cộng dồn
        INSERT INTO "So_buoc_di_trong_ngay" (ma_benh_nhan, thoi_diem_ghi_nhan, tong_so_buoc)
        VALUES (p_ma_benh_nhan, p_thoi_diem_ghi_nhan, v_existing_steps + p_tong_so_buoc);
    ELSE
        -- Nếu chưa có bản ghi nào trong ngày, tạo mới
        INSERT INTO "So_buoc_di_trong_ngay" (ma_benh_nhan, thoi_diem_ghi_nhan, tong_so_buoc)
        VALUES (p_ma_benh_nhan, p_thoi_diem_ghi_nhan, p_tong_so_buoc);
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION luu_token(
    _id_nguoi_dung INTEGER,
    _token VARCHAR
)
RETURNS TABLE (
    id INTEGER,
    token VARCHAR,
    id_nguoi_dung INTEGER
)
AS $$
BEGIN
    -- Kiểm tra xem thiết bị đã tồn tại chưa
    IF EXISTS (
        SELECT 1 FROM "Token_thong_bao" t WHERE t."token" = _token
    ) THEN
        -- Nếu tồn tại và cùng người dùng, cập nhật token
        IF EXISTS (
            SELECT 1 FROM "Token_thong_bao"
            t WHERE t."token" = _token AND t."id_nguoi_dung" = _id_nguoi_dung
        ) THEN
            UPDATE "Token_thong_bao" t
            SET "token" = _token
            WHERE t."token" = _token AND t."id_nguoi_dung" = _id_nguoi_dung;
        ELSE
            -- Nếu thiết bị thuộc user khác, xóa bản ghi cũ
            DELETE FROM "Token_thong_bao" t
            WHERE t."token" = _token;

            -- Sau đó thêm bản ghi mới
            INSERT INTO "Token_thong_bao" ("token","id_nguoi_dung")
            VALUES (_token, _id_nguoi_dung);
        END IF;
    ELSE
        -- Nếu thiết bị chưa tồn tại, thêm mới
        INSERT INTO "Token_thong_bao" ("token", "id_nguoi_dung")
        VALUES (_token, _id_nguoi_dung);
    END IF;

    -- Trả về bản ghi vừa tạo hoặc vừa cập nhật
    RETURN QUERY
    SELECT * FROM "Token_thong_bao" t
    WHERE t."token" = _token AND t."id_nguoi_dung" = _id_nguoi_dung;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE Ket_thuc_cuoc_hen(v_cuoc_hen_id INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INTEGER;
    v_kq_id INTEGER;
    v_don_thuoc_id INTEGER;
    v_bat_dau DATE;
    v_ket_thuc DATE;

    rec_don RECORD;
    v_ngay_ht DATE;
    v_buoi TEXT;
    v_gio TIME;
    v_lan_uong_id INTEGER;
    v_so_ngay INTEGER;
    v_so_luong_moi_lan INTEGER;

    v_ma_bac_si VARCHAR(9);
    v_ma_benh_nhan VARCHAR(9);
BEGIN
    -- Bắt đầu transaction
    BEGIN
        -- 1. Kiểm tra xem có dữ liệu trong bảng Cuoc_hen không
        SELECT COUNT(*) INTO v_count FROM "Cuoc_hen" WHERE "id" = v_cuoc_hen_id;
        IF v_count = 0 THEN
            RAISE EXCEPTION 'Không tìm thấy cuộc hẹn với id = %', v_cuoc_hen_id;
        END IF;

        -- 2. Kiểm tra bảng Ket_qua_kham_benh
        SELECT "id" INTO v_kq_id FROM "Ket_qua_kham_benh" WHERE "ma_cuoc_hen" = v_cuoc_hen_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Yêu cầu nhập kết quả khám bệnh trước khi kết thúc cuộc hẹn';
        END IF;

        -- 3. Kiểm tra Don_thuoc
        SELECT "id", "ngay_bat_dau", "ngay_ket_thuc"
        INTO v_don_thuoc_id, v_bat_dau, v_ket_thuc
        FROM "Don_thuoc"
        WHERE "id_ket_qua" = v_kq_id;

        IF NOT FOUND THEN
            -- Không có đơn thuốc, cập nhật trạng thái và kết thúc
            UPDATE "Cuoc_hen" SET "trang_thai" = 'Hoàn thành' WHERE "id" = v_cuoc_hen_id;
            -- Tiếp tục kiểm tra và thêm vào Chi_dinh_an_kq_cua_bac_si
            SELECT "ma_bac_si", "ma_benh_nhan_dat_hen"
            INTO v_ma_bac_si, v_ma_benh_nhan
            FROM "Cuoc_hen"
            WHERE "id" = v_cuoc_hen_id;

            -- Kiểm tra nếu chưa tồn tại thì thêm
            SELECT COUNT(*) INTO v_count
            FROM "Chi_dinh_an_kq_cua_bac_si"
            WHERE "ma_bac_si" = v_ma_bac_si AND "ma_benh_nhan" = v_ma_benh_nhan;

            IF v_count = 0 THEN
                INSERT INTO "Chi_dinh_an_kq_cua_bac_si" ("ma_bac_si", "ma_benh_nhan", "an_kq")
                VALUES (v_ma_bac_si, v_ma_benh_nhan, FALSE);
            END IF;
            RETURN;
        END IF;

        -- 4. Có đơn thuốc, xử lý tạo lịch uống
        v_so_ngay := v_ket_thuc - v_bat_dau + 1;

        FOR rec_don IN
            SELECT * FROM "Don_chua_thuoc"
            WHERE "id_don_thuoc" = v_don_thuoc_id
        LOOP
            -- Tính số lượng mỗi lần uống
            SELECT ROUND(rec_don."tong_so"::DECIMAL / v_so_ngay / array_length(string_to_array(rec_don."buoi_uong", ','), 1))
            INTO v_so_luong_moi_lan;

            FOR i IN 0..(v_so_ngay - 1) LOOP
                v_ngay_ht := v_bat_dau + i;

                FOREACH v_buoi IN ARRAY string_to_array(rec_don."buoi_uong", ',') LOOP
                    v_buoi := TRIM(v_buoi); -- Xử lý khoảng trắng

                    -- Xác định giờ tương ứng
                    IF v_buoi = 'Sáng' THEN
                        v_gio := TIME '06:00';
                    ELSIF v_buoi = 'Trưa' THEN
                        v_gio := TIME '12:00';
                    ELSIF v_buoi = 'Chiều' THEN
                        v_gio := TIME '18:00';
                    ELSE
                        RAISE EXCEPTION 'Buổi uống không hợp lệ: %', v_buoi;
                    END IF;

                    -- Tạo bản ghi Lan_uong nếu chưa có
                    INSERT INTO "Lan_uong" ("gio", "ngay", "don_thuoc", "nhac_nho", "buoi_uong")
                    VALUES (v_gio, v_ngay_ht, v_don_thuoc_id, TRUE, v_buoi)
                    ON CONFLICT ("gio", "ngay", "don_thuoc") DO NOTHING;

                    -- Lấy id bản ghi Lan_uong
                    SELECT "id" INTO v_lan_uong_id
                    FROM "Lan_uong"
                    WHERE "gio" = v_gio AND "ngay" = v_ngay_ht AND "don_thuoc" = v_don_thuoc_id;

                    -- Thêm vào bảng Thuoc_trong_mot_lan_uong
                    INSERT INTO "Thuoc_trong_mot_lan_uong" ("id_lan_uong", "thuoc", "so_luong")
                    VALUES (v_lan_uong_id, rec_don."id_thuoc", v_so_luong_moi_lan)
                    ON CONFLICT DO NOTHING;
                END LOOP;
            END LOOP;
        END LOOP;

        -- Cập nhật trạng thái Cuoc_hen
        UPDATE "Cuoc_hen" SET "trang_thai" = 'Hoàn thành' WHERE "id" = v_cuoc_hen_id;

        -- Thêm vào bảng Chi_dinh_an_kq_cua_bac_si nếu chưa có
        SELECT "ma_bac_si", "ma_benh_nhan_dat_hen"
        INTO v_ma_bac_si, v_ma_benh_nhan
        FROM "Cuoc_hen"
        WHERE "id" = v_cuoc_hen_id;

        SELECT COUNT(*) INTO v_count
        FROM "Chi_dinh_an_kq_cua_bac_si"
        WHERE "ma_bac_si" = v_ma_bac_si AND "ma_benh_nhan" = v_ma_benh_nhan;

        IF v_count = 0 THEN
            INSERT INTO "Chi_dinh_an_kq_cua_bac_si" ("ma_bac_si", "ma_benh_nhan", "an_kq")
            VALUES (v_ma_bac_si, v_ma_benh_nhan, FALSE);
        END IF;

    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Lỗi xảy ra: %', SQLERRM;
        ROLLBACK;
        RAISE;
    END;
END;
$$;


--function
CREATE OR REPLACE FUNCTION get_medicine_notifications()
RETURNS TABLE (
    id_lan_uong INT,
    id_nguoi_dung INT,
    push_token VARCHAR,
    ten_nguoi_dung VARCHAR,
    ten_don_thuoc VARCHAR,
    gio TIME,
    ngay DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id AS id_lan_uong,
    nd.id AS id_nguoi_dung,
    t.token AS push_token,
    nd.ho_va_ten AS ten_nguoi_dung,
    d.ten_don_thuoc,
    l.gio,
    l.ngay
  FROM
    "Lan_uong" l
    INNER JOIN "Don_thuoc" d ON l.don_thuoc = d.id
    INNER JOIN "Ket_qua_kham_benh" kq ON d.id_ket_qua = kq.id
    INNER JOIN "Cuoc_hen" ch ON kq.ma_cuoc_hen = ch.id
    INNER JOIN "Benh_nhan" bn ON ch.ma_benh_nhan_dat_hen = bn.ma_benh_nhan
    INNER JOIN "Nguoi_dung" nd ON bn.id = nd.id
    INNER JOIN "Token_thong_bao" t ON t.id_nguoi_dung = nd.id
  WHERE
    l.nhac_nho = true
    AND (
      (l.ngay + l.gio) AT TIME ZONE 'Asia/Ho_Chi_Minh' BETWEEN
      (now() AT TIME ZONE 'Asia/Ho_Chi_Minh' - INTERVAL '5 minutes') AND
      (now() AT TIME ZONE 'Asia/Ho_Chi_Minh' + INTERVAL '5 minutes')
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_upcoming_appointments() 
RETURNS TABLE(
  cuoc_hen_id INTEGER,
  bac_si_ma VARCHAR,
  ten_bac_si VARCHAR,
  thoi_diem_bat_dau TIMESTAMPTZ,
  push_token VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS cuoc_hen_id,
    c.ma_bac_si AS bac_si_ma,  -- Mã bác sĩ
    nd.ho_va_ten AS ten_bac_si,  -- Tên bác sĩ
    g.thoi_diem_bat_dau,  -- Thời gian bắt đầu cuộc hẹn
    t.token AS push_token  -- Token thông báo của bệnh nhân
  FROM
    "Cuoc_hen" c
  INNER JOIN
    "Gio_hen" g ON c.id_gio_hen = g.id
  INNER JOIN
    "Bac_si" b ON c.ma_bac_si = b.ma_bac_si  -- Liên kết để lấy tên bác sĩ từ bảng Bac_si
    INNER JOIN "Benh_nhan" bn ON c.ma_benh_nhan_dat_hen = bn.ma_benh_nhan
    INNER JOIN    "Nguoi_dung" nd ON bn.id = nd.id  -- Liên kết để lấy thông tin người dùng
  INNER JOIN
    "Token_thong_bao" t ON    t.id_nguoi_dung = nd.id  -- Liên kết để lấy token thông báo của bệnh nhân
  WHERE
    c.trang_thai = 'Đang chờ'  -- Cuộc hẹn đang chờ
    AND c.nhac_nho = TRUE  -- Cuộc hẹn cần nhắc nhở
    AND g.thoi_diem_bat_dau BETWEEN (now() AT TIME ZONE 'Asia/Ho_Chi_Minh' + INTERVAL '30 minutes') AND (now() AT TIME ZONE 'Asia/Ho_Chi_Minh' + INTERVAL '60 minutes')
	ORDER BY g.thoi_diem_bat_dau ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thong_ke_cuoc_hen_theo_thang(
    p_ma_bac_si VARCHAR(9),
    p_nam INTEGER
)
RETURNS TABLE (thang INTEGER, tong_so_cuoc_hen BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(MONTH FROM gh.ngay_lam_viec)::INTEGER AS thang,
        COUNT(*) AS tong_so_cuoc_hen
    FROM "Cuoc_hen" ch
    INNER JOIN "Gio_hen" gh ON ch.id_gio_hen = gh.id
    WHERE ch.ma_bac_si = p_ma_bac_si
      AND EXTRACT(YEAR FROM gh.ngay_lam_viec) = p_nam
    GROUP BY thang
    ORDER BY thang;
END;
$$;

CREATE OR REPLACE FUNCTION thong_ke_cuoc_hen_theo_nam(
    p_ma_bac_si VARCHAR(9)
)
RETURNS TABLE (nam INTEGER, tong_so_cuoc_hen BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(YEAR FROM gh.ngay_lam_viec)::INTEGER AS nam,
        COUNT(*) AS tong_so_cuoc_hen
    FROM "Cuoc_hen" ch
    INNER JOIN "Gio_hen" gh ON ch.id_gio_hen = gh.id
    WHERE ch.ma_bac_si = p_ma_bac_si
    GROUP BY nam
    ORDER BY nam;
END;
$$;

CREATE OR REPLACE FUNCTION thong_ke_hinh_thuc_theo_thang(
    p_ma_bac_si VARCHAR(9),
    p_thang INT,
    p_nam INT
)
RETURNS TABLE(so_cuoc_hen_onl INT, so_cuoc_hen_khong_onl INT)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CAST(SUM(CASE WHEN clv.lam_viec_onl = TRUE THEN 1 ELSE 0 END) AS INTEGER) AS so_cuoc_hen_onl,
        CAST(SUM(CASE WHEN clv.lam_viec_onl = FALSE THEN 1 ELSE 0 END) AS INTEGER) AS so_cuoc_hen_khong_onl
    FROM 
        "Cuoc_hen" ch
    JOIN 
        "Gio_hen" gh ON ch.id_gio_hen = gh.id
    JOIN 
        "Ca_lam_viec_trong_tuan" clv ON gh.id_ca_lam_viec = clv.id
    WHERE 
        ch.ma_bac_si = p_ma_bac_si
        AND EXTRACT(MONTH FROM gh.ngay_lam_viec) = p_thang
        AND EXTRACT(YEAR FROM gh.ngay_lam_viec) = p_nam
        AND ch.trang_thai = 'Hoàn thành';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION thong_ke_hinh_thuc_theo_nam(
    p_ma_bac_si VARCHAR(9),
    p_nam INT
)
RETURNS TABLE(so_cuoc_hen_onl INT, so_cuoc_hen_khong_onl INT)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CAST(SUM(CASE WHEN clv.lam_viec_onl = TRUE THEN 1 ELSE 0 END) AS INTEGER) AS so_cuoc_hen_onl,
        CAST(SUM(CASE WHEN clv.lam_viec_onl = FALSE THEN 1 ELSE 0 END) AS INTEGER) AS so_cuoc_hen_khong_onl
    FROM 
        "Cuoc_hen" ch
    JOIN 
        "Gio_hen" gh ON ch.id_gio_hen = gh.id
    JOIN 
        "Ca_lam_viec_trong_tuan" clv ON gh.id_ca_lam_viec = clv.id
    WHERE 
        ch.ma_bac_si = p_ma_bac_si
        AND EXTRACT(YEAR FROM gh.ngay_lam_viec) = p_nam
        AND ch.trang_thai = 'Hoàn thành'; -- chỉ tính các cuộc hẹn đã hoàn thành
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lay_ket_qua_cua_benh_nhan(p_ma_benh_nhan VARCHAR)
RETURNS TABLE (
  ho_va_ten_bac_si VARCHAR,
  avt_url_bac_si VARCHAR,
  ma_bac_si VARCHAR,
  ma_benh_nhan VARCHAR,
  duoc_chia_se BOOLEAN,
  lam_viec_onl BOOLEAN,
  thoi_diem_bat_dau TIMESTAMPTZ,
  id_cuoc_hen INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    nd.ho_va_ten,
    nd.avt_url,
    bs.ma_bac_si,
    ch.ma_benh_nhan_dat_hen,
    CASE
      WHEN bn.chia_se_kq_cho_tat_ca = TRUE AND bs.chia_se_kq_cho_tat_ca = TRUE THEN
        CASE
          WHEN c.an_kq IS NULL THEN TRUE
          WHEN c.an_kq = FALSE THEN TRUE
          ELSE FALSE
        END
      ELSE FALSE
    END AS duoc_chia_se,
    clv.lam_viec_onl,
    gh.thoi_diem_bat_dau,
    ch.id  -- id cuộc hẹn
  FROM "Ket_qua_kham_benh" kq
  JOIN "Cuoc_hen" ch ON kq.ma_cuoc_hen = ch.id
  JOIN "Bac_si" bs ON kq.ma_bac_si = bs.ma_bac_si
  JOIN "Nguoi_dung" nd ON bs.id = nd.id
  JOIN "Benh_nhan" bn ON ch.ma_benh_nhan_dat_hen = bn.ma_benh_nhan
  LEFT JOIN "Chi_dinh_an_kq_cua_bac_si" c
    ON c.ma_benh_nhan = bn.ma_benh_nhan AND c.ma_bac_si = bs.ma_bac_si
  LEFT JOIN "Gio_hen" gh ON ch.id_gio_hen = gh.id
  LEFT JOIN "Ca_lam_viec_trong_tuan" clv ON gh.id_ca_lam_viec = clv.id
  WHERE ch.ma_benh_nhan_dat_hen = p_ma_benh_nhan;
END;
$$ LANGUAGE plpgsql;

