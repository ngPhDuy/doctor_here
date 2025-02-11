// Import Express
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');
const session = require('express-session');
const {sequelize} = require('./models/index');
// Import Routes
const authRoute = require('./routes/auth.route');
const doctorRoute = require('./routes/doctor.route');
const accountRoute = require('./routes/account.route');
const appointmentRoute = require('./routes/appointment.route');
const patientRoute = require('./routes/patient.route');
const updateRequestRoute = require('./routes/updateRequest.route');

// Khởi tạo ứng dụng Express
const app = express();

app.use(express.json());
app.use(session({
    secret: 'e6f14f1cc5a763a6d7d88e8e7fcb6b50a7eecb997a37f15a67f05f78e54b5b4bfa5c8b59a883abc87d17d69fb7ff1c9c',
    resave: false,                  
    saveUninitialized: false,       
    cookie: { maxAge: 3600000 }   
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/doctor', doctorRoute);
app.use('/api/auth', authRoute);
app.use('/api/account', accountRoute);
app.use('/api/appointment', appointmentRoute);
app.use('/api/patient', patientRoute);
app.use('/api/updateRequest', updateRequestRoute);

// Test kết nối CSDL
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối thành công!');
    } catch (error) {
        console.error('Kết nối thất bại:', error);
    }
})();

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
