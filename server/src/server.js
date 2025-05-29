// Import Express
// Nạp dotenv ngay khi bắt đầu ứng dụng
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerOptions");
const session = require("express-session");
const { sequelize } = require("./models/index");
const http = require("http");

// Import Routes
const authRoute = require("./routes/auth.route");
const doctorRoute = require("./routes/doctor.route");
const accountRoute = require("./routes/account.route");
const appointmentRoute = require("./routes/appointment.route");
const patientRoute = require("./routes/patient.route");
const updateRequestRoute = require("./routes/updateRequest.route");
const ratingRoute = require("./routes/rating.route");
const firebaseRoute = require("./routes/firebase.route");
const relativeRoute = require("./routes/relative.route");
const loveListRoute = require("./routes/loveList.route");
const doctorScheduleRoute = require("./routes/doctorSchedule.route");
const messRoute = require("./routes/mess.route");
const cloudRoute = require("./routes/cloud.route");
const timeSlotRoute = require("./routes/timeslot.route");
const diagnosisRoute = require("./routes/diagnosis.route");
const trackerRoute = require("./routes/tracker.route");
const getTokenRoute = require("./routes/token.route");
const predictRoute = require("./routes/predict.route");
// Cronjob
const {
  medicineScheduleReminder,
} = require("./cronjobs/sendMedScheNotification.cron");

const {
  appointmentReminder,
} = require("./cronjobs/sendAppoitmentNotification.cron");

const { generateTimeSlots } = require("./cronjobs/genTimeSlots.cron");

// Import Firebase admin
// const fbAdmin = require('./fire_base_config/firebaseConfig');
// Add socket
const socketServer = require("./socket/socket");

const PORT = process.env.PORT || 8080;
// Khởi tạo ứng dụng Express
const app = express();
const server = http.createServer(app);
////////////////////////////////////////////////////////////////////////////////////////////////
socketServer(server);
// Sử dụng middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Hỗ trợ đọc query params
app.use(
  session({
    secret:
      "e6f14f1cc5a763a6d7d88e8e7fcb6b50a7eecb997a37f15a67f05f78e54b5b4bfa5c8b59a883abc87d17d69fb7ff1c9c",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);
// app.use((req, res, next) => {
//     console.log(`🌍 Received request: ${req.method} ${req.originalUrl}`);
//     console.log("🟢 Query parameters:", req.query);
//     next();
// });
app.use(cors());
// CDN CSS
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl: CSS_URL,
  })
);
app.use("/api/doctor", doctorRoute);
app.use("/api/auth", authRoute);
app.use("/api/account", accountRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/patient", patientRoute);
app.use("/api/updateRequest", updateRequestRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/firebase", firebaseRoute);
app.use("/api/relative", relativeRoute);
app.use("/api/loveList", loveListRoute);
app.use("/api/drSchedule", doctorScheduleRoute);
app.use("/api", messRoute);
app.use("/api/cloud", cloudRoute);
app.use("/api/timeslot", timeSlotRoute);
app.use("/api/diagnosis", diagnosisRoute);
app.use("/api/tracker", trackerRoute);
app.use("/api/token", getTokenRoute);
app.use("/api/predict", predictRoute);
// Test kết nối CSDL
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Kết nối thành công!");
  } catch (error) {
    console.error("Kết nối thất bại:", error);
  }
})();
////////////////////////////////////////////////////////////////////////////////////////////////
// const { sendEmail } = require("./services/emailServices");
// app.get("/api/chat/send-message", async (req, res) => {
//   await sendEmail("tkshiha2003@gmail.com", "123456");
//   console.log("Email sent");
//   res.send("Email sent");
// });

// console.log("Stream client initialized ", streamClient);

// Start cronjob
// medicineScheduleReminder();
// appointmentReminder();
// generateTimeSlots();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api/docs`);
});
