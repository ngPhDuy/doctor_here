const weekdayMap = {
  "Thứ hai": "Thứ 2",
  "Thứ ba": "Thứ 3",
  "Thứ tư": "Thứ 4",
  "Thứ năm": "Thứ 5",
  "Thứ sáu": "Thứ 6",
  "Thứ bảy": "Thứ 7",
  "thứ hai": "Thứ 2",
  "thứ ba": "Thứ 3",
  "thứ tư": "Thứ 4",
  "thứ năm": "Thứ 5",
  "thứ sáu": "Thứ 6",
  "thứ bảy": "Thứ 7",
  "chủ nhật": "Chủ nhật",
  "Thứ Hai": "Thứ 2",
  "Thứ Ba": "Thứ 3",
  "Thứ Tư": "Thứ 4",
  "Thứ Năm": "Thứ 5",
  "Thứ Sáu": "Thứ 6",
  "Thứ Bảy": "Thứ 7",
  "Chủ Nhật": "Chủ nhật"
};

const mapWeekday = (weekday) => {
  return weekdayMap[weekday] || weekday;
};

module.exports = { mapWeekday };