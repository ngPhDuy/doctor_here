const {
  BMI,
  DailyStep,
  HeartBeat,
  BreathBeat,
  BloodPressure,
  SugarBlood,
  OxygenBlood,
  BodyTemperature,
  sequelize,
  User,
  Patient,
  Distance,
  Height,
  Weight,
} = require("../models");
const { Op, fn, col } = require("sequelize");

/*---------------------------- BMI ----------------------------*/
exports.getDailyBMI = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1); // Thêm 1 ngày vào endDate để bao gồm cả ngày cuối cùng

  const datas = await BMI.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalCanNang: 0,
        count: 0,
        totalChieuCao: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalCanNang += item.can_nang;
    groupedData[dayMonthYear].totalChieuCao += item.chieu_cao;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];

    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_can_nang: dayData.totalCanNang / dayData.count, // Trung bình cân nặng
      trung_binh_chieu_cao: dayData.totalChieuCao / dayData.count, // Trung bình chiều cao
    };
  });
  return result;
};

//startMonth, endMonth: YYYY-MM
exports.getMonthlyBMI = async (ptID, startMonth, endMonth) => {
  //Tăng endMonth lên 1 tháng
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await BMI.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  // Hàm để xử lý dữ liệu và tính toán trung bình
  const processBMIData = (data) => {
    // Nhóm dữ liệu theo tháng (YYYY-MM)
    const groupedData = {};

    // Lặp qua tất cả dữ liệu và nhóm theo tháng
    data.forEach((item) => {
      const date = new Date(item.thoi_diem_ghi_nhan);
      const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
      const year = date.getFullYear(); // Năm (YYYY)
      const monthYear = `${year}-${month < 10 ? "0" + month : month}`; // Định dạng YYYY-MM

      if (!groupedData[monthYear]) {
        groupedData[monthYear] = {
          totalCanNang: 0,
          count: 0,
          totalChieuCao: 0,
        };
      }

      // Cộng dồn các giá trị để tính trung bình
      groupedData[monthYear].totalCanNang += item.can_nang;
      groupedData[monthYear].totalChieuCao += item.chieu_cao;
      groupedData[monthYear].count += 1;
    });

    // Tính trung bình cho mỗi tháng và trả về kết quả
    const result = Object.keys(groupedData).map((monthYear) => {
      const monthData = groupedData[monthYear];
      return {
        thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
        trung_binh_can_nang: monthData.totalCanNang / monthData.count, // Trung bình cân nặng
        trung_binh_chieu_cao: monthData.totalChieuCao / monthData.count, // Trung bình chiều cao
      };
    });

    return result;
  };

  // Gọi hàm để xử lý dữ liệu
  const processedData = processBMIData(datas);

  return processedData;
};

//startYear, endYear: YYYY
exports.getYearlyBMI = async (ptID, startYear, endYear) => {
  //Xử lý định dạng startYear, endYear
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await BMI.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  // Hàm để xử lý dữ liệu và tính toán trung bình
  const groupedData = {};

  datas.forEach((item) => {
    // Lấy năm từ thoi_diem_ghi_nhan
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalCanNang: 0,
        count: 0,
        totalChieuCao: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalCanNang += item.can_nang;
    groupedData[year].totalChieuCao += item.chieu_cao;
    groupedData[year].count += 1;
  });

  // Tính trung bình cho mỗi năm và trả về kết quả
  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_can_nang: yearData.totalCanNang / yearData.count, // Trung bình cân nặng
      trung_binh_chieu_cao: yearData.totalChieuCao / yearData.count, // Trung bình chiều cao
    };
  });

  // Sắp xếp theo năm
  result.sort(
    (a, b) => new Date(a.thoi_diem_ghi_nhan) - new Date(b.thoi_diem_ghi_nhan)
  );

  return result;
};

/*---------------------------- Daily Step ----------------------------*/
//startDate, endDate: YYYY-MM-DD
exports.getDailySteps = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1); // Thêm 1 ngày vào endDate để bao gồm cả ngày cuối cùng

  const datas = await DailyStep.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalStep: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalStep += item.tong_so_buoc;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      tong_so_buoc: dayData.totalStep,
    };
  });

  return result;
};

//startMonth, endMonth: YYYY-MM
exports.getMonthlySteps = async (ptID, startMonth, endMonth) => {
  //Tăng endMonth lên 1 tháng
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await DailyStep.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  // Nhóm dữ liệu theo tháng (YYYY-MM)
  const groupedData = {};

  // Lặp qua tất cả dữ liệu và nhóm theo tháng
  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`; // Định dạng YYYY-MM

    console.log(monthYear);
    console.log(item);

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalBuocDi: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalBuocDi += item.tong_so_buoc;
    groupedData[monthYear].count += 1;

    console.log(groupedData[monthYear]);
    console.log("----------");
  });

  // Tính trung bình cho mỗi tháng và trả về kết quả
  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      tong_so_buoc: monthData.totalBuocDi,
    };
  });

  return result;
};

//startYear, endYear: YYYY
exports.getYearlySteps = async (ptID, startYear, endYear) => {
  //Xử lý định dạng startYear, endYear
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await DailyStep.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  // Nhóm dữ liệu theo năm (YYYY)
  const groupedData = {};

  // Lặp qua tất cả dữ liệu và nhóm theo năm
  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalBuocDi: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalBuocDi += item.tong_so_buoc;
    groupedData[year].count += 1;
  });

  // Tính trung bình cho mỗi năm và trả về kết quả
  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      tong_so_buoc: yearData.totalBuocDi,
    };
  });

  return result;
};

/*---------------------------- Heart Beat ----------------------------*/
exports.getDailyHeartBeat = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const datas = await HeartBeat.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalNhipTim: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalNhipTim += item.gia_tri;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_nhip_tim: dayData.totalNhipTim / dayData.count, // Trung bình nhịp tim
    };
  });

  return result;
};

exports.getMonthlyHeartBeat = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await HeartBeat.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalNhipTim: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalNhipTim += item.gia_tri;
    groupedData[monthYear].count += 1;
  });

  // Tính trung bình cho mỗi tháng và trả về kết quả
  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_nhip_tim: monthData.totalNhipTim / monthData.count, // Trung bình nhịp tim
    };
  });

  return result;
};

exports.getYearlyHeartBeat = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await HeartBeat.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalNhipTim: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalNhipTim += item.gia_tri;
    groupedData[year].count += 1;
  });

  // Tính trung bình cho mỗi năm và trả về kết quả
  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_nhip_tim: yearData.totalNhipTim / yearData.count, // Trung bình nhịp tim
    };
  });

  return result;
};

/*---------------------------- Breath Beat ----------------------------*/
exports.getDailyBreathBeat = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const datas = await BreathBeat.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalNhipTho: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalNhipTho += item.gia_tri;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_nhip_tho: dayData.totalNhipTho / dayData.count, // Trung bình nhịp thở
    };
  });

  return result;
};

exports.getMonthlyBreathBeat = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await BreathBeat.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalNhipTho: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalNhipTho += item.gia_tri;
    groupedData[monthYear].count += 1;
  });

  // Tính trung bình cho mỗi tháng và trả về kết quả
  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_nhip_tho: monthData.totalNhipTho / monthData.count, // Trung bình nhịp thở
    };
  });

  return result;
};

exports.getYearlyBreathBeat = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await BreathBeat.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalNhipTho: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalNhipTho += item.gia_tri;
    groupedData[year].count += 1;
  });

  // Tính trung bình cho mỗi năm và trả về kết quả
  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_nhip_tho: yearData.totalNhipTho / yearData.count, // Trung bình nhịp thở
    };
  });

  return result;
};

/*---------------------------- Blood Pressure ----------------------------*/
exports.getDailyBloodPressure = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const datas = await BloodPressure.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalHuyetApTamTruong: 0,
        totalHuyetApTamThu: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalHuyetApTamTruong += item.huyet_ap_tam_truong;
    groupedData[dayMonthYear].totalHuyetApTamThu += item.huyet_ap_tam_thu;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_huyet_ap_tam_truong:
        dayData.totalHuyetApTamTruong / dayData.count, // Trung bình huyết áp tâm trương
      trung_binh_huyet_ap_tam_thu: dayData.totalHuyetApTamThu / dayData.count, // Trung bình huyết áp tâm thường
    };
  });

  return result;
};

exports.getMonthlyBloodPressure = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await BloodPressure.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalHuyetApTamTruong: 0,
        totalHuyetApTamThu: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalHuyetApTamTruong += item.huyet_ap_tam_truong;
    groupedData[monthYear].totalHuyetApTamThu += item.huyet_ap_tam_thu;
    groupedData[monthYear].count += 1;
  });

  // Tính trung bình cho mỗi tháng và trả về kết quả
  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_huyet_ap_tam_truong:
        monthData.totalHuyetApTamTruong / monthData.count, // Trung bình huyết áp tâm trương
      trung_binh_huyet_ap_tam_thu:
        monthData.totalHuyetApTamThu / monthData.count, // Trung bình huyết áp tâm thường
    };
  });

  return result;
};

exports.getYearlyBloodPressure = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await BloodPressure.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalHuyetApTamTruong: 0,
        totalHuyetApTamThu: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalHuyetApTamTruong += item.huyet_ap_tam_truong;
    groupedData[year].totalHuyetApTamThu += item.huyet_ap_tam_thu;
    groupedData[year].count += 1;
  });

  // Tính trung bình cho mỗi năm và trả về kết quả
  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_huyet_ap_tam_truong:
        yearData.totalHuyetApTamTruong / yearData.count, // Trung bình huyết áp tâm trương
      trung_binh_huyet_ap_tam_thu: yearData.totalHuyetApTamThu / yearData.count, // Trung bình huyết áp tâm thường
    };
  });

  return result;
};

/*---------------------------- Blood Sugar ----------------------------*/
exports.getDailyBloodSugar = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const datas = await SugarBlood.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalDuongHuyet: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalDuongHuyet += item.gia_tri;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_duong_huyet: dayData.totalDuongHuyet / dayData.count, // Trung bình đường huyết
    };
  });

  return result;
};

exports.getMonthlyBloodSugar = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await SugarBlood.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalDuongHuyet: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalDuongHuyet += item.gia_tri;
    groupedData[monthYear].count += 1;
  });

  // Tính trung bình cho mỗi tháng và trả về kết quả
  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_duong_huyet: monthData.totalDuongHuyet / monthData.count, // Trung bình đường huyết
    };
  });

  return result;
};

exports.getYearlyBloodSugar = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await SugarBlood.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalDuongHuyet: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalDuongHuyet += item.gia_tri;
    groupedData[year].count += 1;
  });

  // Tính trung bình cho mỗi năm và trả về kết quả
  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_duong_huyet: yearData.totalDuongHuyet / yearData.count, // Trung bình đường huyết
    };
  });

  return result;
};

/*---------------------------- Blood Oxygen ----------------------------*/
exports.getDailyBloodOxygen = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const datas = await OxygenBlood.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalOxyMau: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalOxyMau += item.gia_tri;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_oxy_mau: dayData.totalOxyMau / dayData.count, // Trung bình oxy máu
    };
  });

  return result;
};

exports.getMonthlyBloodOxygen = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await OxygenBlood.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalOxyMau: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalOxyMau += item.gia_tri;
    groupedData[monthYear].count += 1;
  });

  // Tính trung bình cho mỗi tháng và trả về kết quả
  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_oxy_mau: monthData.totalOxyMau / monthData.count, // Trung bình oxy máu
    };
  });

  return result;
};

exports.getYearlyBloodOxygen = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await OxygenBlood.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalOxyMau: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalOxyMau += item.gia_tri;
    groupedData[year].count += 1;
  });

  // Tính trung bình cho mỗi năm và trả về kết quả
  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_oxy_mau: yearData.totalOxyMau / yearData.count, // Trung bình oxy máu
    };
  });

  return result;
};

/*---------------------------- Body Temperature ----------------------------*/
exports.getDailyBodyTemperature = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const datas = await BodyTemperature.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        totalNhietDo: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].totalNhietDo += item.gia_tri;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_nhiet_do: dayData.totalNhietDo / dayData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

exports.getMonthlyBodyTemperature = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await BodyTemperature.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalNhietDo: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalNhietDo += item.gia_tri;
    groupedData[monthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_nhiet_do: monthData.totalNhietDo / monthData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

exports.getYearlyBodyTemperature = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await BodyTemperature.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalNhietDo: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalNhietDo += item.gia_tri;
    groupedData[year].count += 1;
  });

  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_nhiet_do: yearData.totalNhietDo / yearData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};
/*---------------------------- Distance ----------------------------*/
exports.getDailyDistance = async (ptID, startDay, endDay) => {
  const start = new Date(startDay);
  const end = new Date(endDay);
  end.setDate(end.getDate() + 1); // để bao gồm cả ngày endDay

  const results = await Distance.findAll({
    attributes: [
      [fn("DATE", col("thoi_diem_ghi_nhan")), "thoi_diem_ghi_nhan"],
      [fn("SUM", col("gia_tri")), "tong_quang_duong"],
    ],
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
    },
    group: [fn("DATE", col("thoi_diem_ghi_nhan"))],
    order: [[fn("DATE", col("thoi_diem_ghi_nhan")), "ASC"]],
    raw: true,
  });

  return results;
};

exports.getMonthlyDistance = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1); // để bao gồm tháng endMonth

  const datas = await Distance.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        totalDistance: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].totalDistance += item.gia_tri;
  });

  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      tong_quang_duong: monthData.totalDistance,
    };
  });

  return result;
};

exports.getYearlyDistance = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await Distance.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        totalDistance: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].totalDistance += item.gia_tri;
  });

  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      tong_quang_duong: yearData.totalDistance,
    };
  });

  return result;
};
/*---------------------------- Height ----------------------------*/
exports.getDailyHeight = async (ptID, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const datas = await Height.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate(); // Ngày (1-31)
    const month = date.getMonth() + 1; // Tháng (0-11) => (1-12)
    const year = date.getFullYear(); // Năm (YYYY)
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`; // Định dạng YYYY-MM-DD

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        total: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].total += item.gia_tri;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_chieu_cao: dayData.total / dayData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

exports.getMonthlyHeight = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await Height.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        total: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].total += item.gia_tri;
    groupedData[monthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_chieu_cao: monthData.total / monthData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

exports.getYearlyHeight = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await Height.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear(); // Năm (YYYY)

    if (!groupedData[year]) {
      groupedData[year] = {
        total: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].total += item.gia_tri;
    groupedData[year].count += 1;
  });

  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_chieu_cao: yearData.total / yearData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

/*---------------------------- Height ----------------------------*/
exports.getDailyWeight = async (ptID, startDay, endDay) => {
  const start = new Date(startDay);
  const end = new Date(endDay);
  end.setDate(end.getDate() + 1); // để bao gồm cả ngày endDay

  const datas = await Weight.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayMonthYear = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

    if (!groupedData[dayMonthYear]) {
      groupedData[dayMonthYear] = {
        total: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[dayMonthYear].total += item.gia_tri;
    groupedData[dayMonthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((dayMonthYear) => {
    const dayData = groupedData[dayMonthYear];
    return {
      thoi_diem_ghi_nhan: dayMonthYear, // Ngày (YYYY-MM-DD)
      trung_binh_can_nang: dayData.total / dayData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

exports.getMonthlyWeight = async (ptID, startMonth, endMonth) => {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  end.setMonth(end.getMonth() + 1);

  const datas = await Weight.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {
        total: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[monthYear].total += item.gia_tri;
    groupedData[monthYear].count += 1;
  });

  const result = Object.keys(groupedData).map((monthYear) => {
    const monthData = groupedData[monthYear];
    return {
      thoi_diem_ghi_nhan: monthYear, // Tháng (YYYY-MM)
      trung_binh_can_nang: monthData.total / monthData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

exports.getYearlyWeight = async (ptID, startYear, endYear) => {
  const start = new Date(startYear, 0, 1); // Ngày đầu năm
  const end = new Date(endYear, 0, 1);
  end.setFullYear(end.getFullYear() + 1); // Ngày đầu năm tiếp theo

  const datas = await Weight.findAll({
    where: {
      ma_benh_nhan: ptID,
      thoi_diem_ghi_nhan: {
        [Op.between]: [start, end],
      },
    },
    attributes: {
      exclude: ["ma_benh_nhan"],
    },
    order: [["thoi_diem_ghi_nhan", "ASC"]],
  });

  const groupedData = {};

  datas.forEach((item) => {
    const date = new Date(item.thoi_diem_ghi_nhan);
    const year = date.getFullYear();

    if (!groupedData[year]) {
      groupedData[year] = {
        total: 0,
        count: 0,
      };
    }

    // Cộng dồn các giá trị để tính trung bình
    groupedData[year].total += item.gia_tri;
    groupedData[year].count += 1;
  });

  const result = Object.keys(groupedData).map((year) => {
    const yearData = groupedData[year];
    return {
      thoi_diem_ghi_nhan: year, // Năm (YYYY)
      trung_binh_can_nang: yearData.total / yearData.count, // Trung bình nhiệt độ
    };
  });

  return result;
};

/*---------------------------- Add ----------------------------*/
exports.addBMI = async (ptID, data, timeStamp) => {
  if (!ptID || !data) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  console.log(data.height, data.weight);
  if (!data.height || !data.weight || data.height <= 0 || data.weight <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  const { height, weight } = data;
  // const currentTime = new Date();
  // //chuyển sang giờ Việt Nam
  // currentTime.setHours(currentTime.getHours() + 7);
  // //Chuyển 2025-04-03T23:06:03.434Z thành 2025-04-03 23:06:03
  // const formattedTime = currentTime
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");

  const result = await BMI.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    chieu_cao: height,
    can_nang: weight,
  });

  return result;
};

exports.addSteps = async (ptID, steps, timeStamp) => {
  if (!steps || steps < 0) {
    throw new Error("Giá trị không hợp lệ");
  }

  const query = await DailyStep.create({
    ma_benh_nhan: ptID,
    tong_so_buoc: steps,
    thoi_diem_ghi_nhan: timeStamp,
  });

  return query;
};

exports.addHeartBeat = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  // const currentTime = new Date();
  // currentTime.setHours(currentTime.getHours() + 7);
  // const formattedTime = currentTime
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");

  const result = await HeartBeat.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  return result;
};

exports.addBreathBeat = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  // const currentTime = new Date();
  // currentTime.setHours(currentTime.getHours() + 7);
  // const formattedTime = currentTime
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");

  const result = await BreathBeat.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  return result;
};

exports.addBloodPressure = async (ptID, data, timeStamp) => {
  if (!ptID || !data) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (
    !data.huyet_ap_tam_truong ||
    !data.huyet_ap_tam_thu ||
    data.huyet_ap_tam_truong <= 0 ||
    data.huyet_ap_tam_thu <= 0
  ) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  // const currentTime = new Date();
  // currentTime.setHours(currentTime.getHours() + 7);
  // const formattedTime = currentTime
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");

  const result = await BloodPressure.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    huyet_ap_tam_truong: data.huyet_ap_tam_truong,
    huyet_ap_tam_thu: data.huyet_ap_tam_thu,
  });

  return result;
};

exports.addBloodSugar = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  // const currentTime = new Date();
  // currentTime.setHours(currentTime.getHours() + 7);
  // const formattedTime = currentTime
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");

  const result = await SugarBlood.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  return result;
};

exports.addBloodOxygen = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  // const currentTime = new Date();
  // currentTime.setHours(currentTime.getHours() + 7);
  // const formattedTime = currentTime
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");

  const result = await OxygenBlood.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  return result;
};

exports.addBodyTemperature = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  // const currentTime = new Date();
  // currentTime.setHours(currentTime.getHours() + 7);
  // const formattedTime = currentTime
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");

  const result = await BodyTemperature.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  return result;
};

exports.addDistance = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  const result = await Distance.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  return result;
};

exports.addHeight = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  const result = await Height.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  const updateHeight = await Patient.update(
    { chieu_cao: value },
    { where: { ma_benh_nhan: ptID } }
  );

  return result;
};

exports.addWeight = async (ptID, value, timeStamp) => {
  if (!ptID || !value) {
    throw new Error("Yêu cầu truyền vào mã bệnh nhân và dữ liệu");
  }

  if (!value || value <= 0) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  const result = await Weight.create({
    ma_benh_nhan: ptID,
    thoi_diem_ghi_nhan: timeStamp,
    gia_tri: value,
  });

  const updateWeight = await Patient.update(
    { can_nang: value },
    { where: { ma_benh_nhan: ptID } }
  );

  return result;
};

//Synchronous
//timeStamp: YYYY-MM-DDTHH:mm:ss
//type: steps, bmi, heartbeat, breath, blood_pressure, blood_sugar, blood_oxygen, body_temperature
exports.getSyncData = async (ptID) => {
  //Kiểm tra định dạng timeStamp

  // timeStamp = new Date(timeStamp).toISOString();

  // let result;

  // //Get One: ma_benh_nhan, thoi_diem_ghi_nhan -> primary key
  // if (type === "steps") {
  //   result = await DailyStep.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "bmi") {
  //   result = await BMI.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "heartbeat") {
  //   result = await HeartBeat.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "breath") {
  //   result = await BreathBeat.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "blood_pressure") {
  //   result = await BloodPressure.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "blood_sugar") {
  //   result = await SugarBlood.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "blood_oxygen") {
  //   result = await OxygenBlood.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "body_temperature") {
  //   result = await BodyTemperature.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // }

  // return result;

  const result = await Patient.findOne({
    where: {
      ma_benh_nhan: ptID,
    },
    attributes: ["dong_bo"],
  });

  return result;
};

exports.updateSyncData = async (ptID, newSync) => {
  //Kiểm tra định dạng timeStamp
  // timeStamp = new Date(timeStamp).toISOString();

  // let result;

  // //Get One: ma_benh_nhan, thoi_diem_ghi_nhan -> primary key
  // if (type === "steps") {
  //   result = await DailyStep.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "bmi") {
  //   result = await BMI.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "heartbeat") {
  //   result = await HeartBeat.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "breath") {
  //   result = await BreathBeat.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "blood_pressure") {
  //   result = await BloodPressure.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "blood_sugar") {
  //   result = await SugarBlood.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "blood_oxygen") {
  //   result = await OxygenBlood.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // } else if (type === "body_temperature") {
  //   result = await BodyTemperature.findOne({
  //     where: {
  //       ma_benh_nhan: ptID,
  //       thoi_diem_ghi_nhan: timeStamp,
  //     },
  //   });
  // }

  // if (!result) {
  //   throw new Error("Không tìm thấy dữ liệu");
  // }

  // result.dong_bo = newSync;
  // await result.save();

  // return result;

  const result = await Patient.findOne({
    where: {
      ma_benh_nhan: ptID,
    },
  });

  result.dong_bo = newSync;
  await result.save();

  return result;
};

exports.getLatestData = async (ptID, type) => {
  let result;

  if (type === "steps") {
    result = await DailyStep.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "bmi") {
    result = await BMI.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "heartbeat") {
    result = await HeartBeat.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "breath") {
    result = await BreathBeat.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "blood_pressure") {
    result = await BloodPressure.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "blood_sugar") {
    result = await SugarBlood.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "blood_oxygen") {
    result = await OxygenBlood.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "body_temperature") {
    result = await BodyTemperature.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "distance") {
    result = await Distance.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "height") {
    result = await Height.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  } else if (type === "weight") {
    result = await Weight.findOne({
      where: {
        ma_benh_nhan: ptID,
      },
      order: [["thoi_diem_ghi_nhan", "DESC"]],
    });
  }

  return result;
};
