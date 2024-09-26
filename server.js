const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

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
app.use(fileUpload());
app.use(cors({
    origin: "https://i-medicare.onrender.com", 
    credentials: true
}))

//Static Files
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

//routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/user', require('./routes/user-routes'));
app.use('/api/v1/admin', require('./routes/admin-routes'));
app.use('/api/v1/doctor', require('./routes/doctor-routes'));

mongoose.connect(process.env.MONGO_URI)
    .then(
        app.listen(port, () => {
            // console.log(`Server Running in ${process.env.NODE_MODE} Mode on Port ${port}
            // http://localhost:8080/`);
        })
    )
    .catch((err) => {
        console.log(err);
    });


//listen port
