const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//dotenv config
dotenv.config()

//MongoDB Connection
connectDB();

//REST Object
const app = express();
const port = process.env.PORT || 8080

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/user', require('./routes/user-routes'));
app.use('/api/v1/admin', require('./routes/admin-routes'));
app.use('/api/v1/doctor', require('./routes/doctor-routes'));

mongoose.connect(process.env.MONGO_URI)
    .then(
        app.listen(port, () => {
            console.log(`Server Running in ${process.env.NODE_MODE} Mode on Port ${port}
            http://localhost:8080/`);
        })
    )
    .catch((err) => {
        console.log(err);
    });


//listen port
