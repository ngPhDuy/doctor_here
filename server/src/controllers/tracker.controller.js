const service = require("../services/tracker.service.js");
/*---------------------------- BMI ----------------------------*/
exports.getDailyBMI = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyBMI(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily BMI:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu BMI hàng ngày" });
  }
};

exports.getMonthlyBMI = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyBMI(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly BMI:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu BMI hàng tháng" });
  }
};

exports.getYearlyBMI = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyBMI(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly BMI:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu BMI hàng năm" });
  }
};

/*---------------------------- Daily Step ----------------------------*/
exports.getDailySteps = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailySteps(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily steps:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu bước hàng ngày" });
  }
};

exports.getMonthlySteps = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlySteps(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly steps:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu bước hàng tháng" });
  }
};

exports.getYearlySteps = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlySteps(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly steps:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu bước hàng năm" });
  }
};

/*---------------------------- Heart Beat ----------------------------*/
exports.getDailyHeartBeat = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyHeartBeat(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily heart beat:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu nhịp tim hàng ngày" });
  }
};

exports.getMonthlyHeartBeat = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyHeartBeat(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly heart beat:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu nhịp tim hàng tháng" });
  }
};

exports.getYearlyHeartBeat = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyHeartBeat(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly heart beat:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu nhịp tim hàng năm" });
  }
};

/*---------------------------- Breath Beat ----------------------------*/
exports.getDailyBreathBeat = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyBreathBeat(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily breath beat:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu nhịp thở hàng ngày" });
  }
};

exports.getMonthlyBreathBeat = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyBreathBeat(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly breath beat:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu nhịp thở hàng tháng" });
  }
};

exports.getYearlyBreathBeat = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyBreathBeat(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly breath beat:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu nhịp thở hàng năm" });
  }
};

/*---------------------------- Blood Pressure ----------------------------*/
exports.getDailyBloodPressure = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyBloodPressure(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily blood pressure:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu huyết áp hàng ngày" });
  }
};

exports.getMonthlyBloodPressure = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyBloodPressure(
      ptID,
      startMonth,
      endMonth
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly blood pressure:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu huyết áp hàng tháng" });
  }
};

exports.getYearlyBloodPressure = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyBloodPressure(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly blood pressure:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu huyết áp hàng năm" });
  }
};

/*---------------------------- Blood Sugar ----------------------------*/
exports.getDailyBloodSugar = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyBloodSugar(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily blood sugar:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu đường huyết hàng ngày" });
  }
};

exports.getMonthlyBloodSugar = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyBloodSugar(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly blood sugar:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu đường huyết hàng tháng" });
  }
};

exports.getYearlyBloodSugar = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyBloodSugar(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly blood sugar:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu đường huyết hàng năm" });
  }
};

/*---------------------------- Blood Oxygen ----------------------------*/
exports.getDailyBloodOxygen = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyBloodOxygen(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily blood oxygen:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu oxy trong máu hàng ngày" });
  }
};

exports.getMonthlyBloodOxygen = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyBloodOxygen(
      ptID,
      startMonth,
      endMonth
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly blood oxygen:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu oxy trong máu hàng tháng" });
  }
};

exports.getYearlyBloodOxygen = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyBloodOxygen(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly blood oxygen:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu oxy trong máu hàng năm" });
  }
};

/*---------------------------- Body Temperature ----------------------------*/
exports.getDailyBodyTemperature = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyBodyTemperature(
      ptID,
      startDate,
      endDate
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily body temperature:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu nhiệt độ cơ thể hàng ngày" });
  }
};

exports.getMonthlyBodyTemperature = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyBodyTemperature(
      ptID,
      startMonth,
      endMonth
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly body temperature:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu nhiệt độ cơ thể hàng tháng" });
  }
};

exports.getYearlyBodyTemperature = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyBodyTemperature(
      ptID,
      startYear,
      endYear
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly body temperature:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu nhiệt độ cơ thể hàng năm" });
  }
};

/*---------------------------- Distance ----------------------------*/
exports.getDailyDistance = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyDistance(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily distance:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu khoảng cách hàng ngày" });
  }
};

exports.getMonthlyDistance = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyDistance(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly distance:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu khoảng cách hàng tháng" });
  }
};

exports.getYearlyDistance = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyDistance(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly distance:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu khoảng cách hàng năm" });
  }
};

/*---------------------------- Height ----------------------------*/
exports.getDailyHeight = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyHeight(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily Height:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu chiều cao hàng ngày" });
  }
};

exports.getMonthlyHeight = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyHeight(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly Height:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu chiều cao hàng tháng" });
  }
};

exports.getYearlyHeight = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyHeight(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly Height:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu chiều cao hàng năm" });
  }
};

/*---------------------------- Weight ----------------------------*/
exports.getDailyWeight = async (req, res) => {
  const { ptID } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const data = await service.getDailyWeight(ptID, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching daily weight:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu cân nặng hàng ngày" });
  }
};

exports.getMonthlyWeight = async (req, res) => {
  const { ptID } = req.params;
  const { startMonth, endMonth } = req.query;
  try {
    const data = await service.getMonthlyWeight(ptID, startMonth, endMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly weight:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu cân nặng hàng tháng" });
  }
};

exports.getYearlyWeight = async (req, res) => {
  const { ptID } = req.params;
  const { startYear, endYear } = req.query;
  try {
    const data = await service.getYearlyWeight(ptID, startYear, endYear);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching yearly weight:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu cân nặng hàng năm" });
  }
};

/*---------------------------- Add ----------------------------*/
exports.addBMI = async (req, res) => {
  const { ptID } = req.params;
  const { data, timeStamp } = req.body;
  try {
    console.log(ptID, " ", data);
    const rs = await service.addBMI(ptID, data, timeStamp);
    res.status(200).json(rs);
  } catch (error) {
    console.error("Error adding BMI:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu BMI" });
  }
};

exports.addSteps = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addSteps(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding steps:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu bước" });
  }
};

exports.addHeartBeat = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addHeartBeat(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding heart beat:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu nhịp tim" });
  }
};

exports.addBreathBeat = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addBreathBeat(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding breath beat:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu nhịp thở" });
  }
};

exports.addBloodPressure = async (req, res) => {
  const { ptID } = req.params;
  const { data, timeStamp } = req.body;
  try {
    const rs = await service.addBloodPressure(ptID, data, timeStamp);
    res.status(200).json(rs);
  } catch (error) {
    console.error("Error adding blood pressure:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu huyết áp" });
  }
};

exports.addBloodSugar = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addBloodSugar(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding blood sugar:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu đường huyết" });
  }
};

exports.addBloodOxygen = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addBloodOxygen(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding blood oxygen:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu oxy trong máu" });
  }
};

exports.addBodyTemperature = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addBodyTemperature(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding body temperature:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu nhiệt độ cơ thể" });
  }
};

exports.addDistance = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addDistance(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding distance:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu khoảng cách" });
  }
};

exports.addHeight = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addHeight(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding height:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu chiều cao" });
  }
};

exports.addWeight = async (req, res) => {
  const { ptID } = req.params;
  const { value, timeStamp } = req.body;
  try {
    const data = await service.addWeight(ptID, value, timeStamp);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding weight:", error);
    res.status(500).json({ error: "Lỗi khi thêm dữ liệu cân nặng" });
  }
};

//Synchronous
exports.getSyncData = async (req, res) => {
  try {
    const { ptID } = req.params;
    const data = await service.getSyncData(ptID);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting sync data:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

exports.updateSyncData = async (req, res) => {
  try {
    const { ptID } = req.params;
    const { newSync } = req.body;
    const data = await service.updateSyncData(ptID, newSync);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating sync data:", error);
    res.status(500).json({ error: "Lỗi khi cap nhật dữ liệu" });
  }
};

exports.getLatestData = async (req, res) => {
  try {
    const { ptID, type } = req.params;
    const data = await service.getLatestData(ptID, type);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting latest data:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};
