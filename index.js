// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const patientRoutes = require('./routes/patient-routes');
// const doctorRoutes = require('./routes/doctor-routes');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(patientRoutes);
// app.use(doctorRoutes);


// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.log('Error connecting to MongoDB', err);
// });

// app.listen(port, () => {
//     console.log('Server is running on port: ', port);
// })