CREATE OR REPLACE PROCEDURE insert_user(
    IN ten_dang_nhap VARCHAR(255),
    IN email VARCHAR(255),
    IN sdt VARCHAR(255),
    IN ngay_sinh DATE,
    IN gioi_tinh CHAR(3),
    IN phan_loai VARCHAR(3),
    IN ho_va_ten VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_id INTEGER;
    generated_code VARCHAR(9);
BEGIN
    -- Bước 1: Thêm vào bảng Nguoi_dung
    INSERT INTO "Nguoi_dung" ("ten_dang_nhap", "email", "sdt", "ngay_sinh", "gioi_tinh", "phan_loai", "ho_va_ten")
    VALUES (ten_dang_nhap, email, sdt, ngay_sinh, gioi_tinh, phan_loai, ho_va_ten)
    RETURNING id INTO new_id;

    -- Bước 2: Tạo mã dựa trên loại người dùng
    IF phan_loai = 'bs' THEN
        generated_code := CONCAT('BS', LPAD(new_id::TEXT, 7, '0')); -- Tạo mã BS
        INSERT INTO "Bac_si" ("id", "ma_bac_si") VALUES (new_id, generated_code);
    ELSIF phan_loai = 'qtv' THEN
        generated_code := CONCAT('QT', LPAD(new_id::TEXT, 7, '0')); -- Tạo mã QT
        INSERT INTO "Quan_tri_vien" ("id", "ma_qtv") VALUES (new_id, generated_code);
    ELSIF phan_loai = 'bn' THEN
        generated_code := CONCAT('BN', LPAD(new_id::TEXT, 7, '0')); -- Tạo mã BN
        INSERT INTO "Benh_nhan" ("id", "ma_benh_nhan") VALUES (new_id, generated_code);
    END IF;

END;
$$;
