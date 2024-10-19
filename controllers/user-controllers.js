const { User, Doctor, Appointment, Patient , OrganDonation,MedicalRecord} = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const path = require('path');
const fs = require('fs');


//regiser callback
const registerController = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: `User Already Exist`, success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send({ message: 'Register Success', success: true });
    } catch (error) {
        //console.log(error);
        res.status(500).send({ success: false, messgae: `Register Controller ${error.messgae}` });
    }
}


//login callback
const loginController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: `User not found`, success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: `Invalid email or password`, success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: `Login Successfully`, success: true, token });


    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: `Error in Login Controller ${error.message}` });
    }
}

const authController = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: `User Not Found`,
                success: false
            })
        } else {
            res.status(200).send({
                success: true, data: user
            });
        }
    } catch (err) {
        //console.log(err);
        res.status(500).send({
            message: `Auth Error`,
            success: false,
            err
        })
    }
};

const applyDoctorController = async (req, res) => {
    try{
        const newDoctor = await Doctor({...req.body, status:'pending'})
        await newDoctor.save();
        const adminUser = await User.findOne({isAdmin: true});
        const notification = adminUser.notification;
        notification.push({
            type:'apply-doctor-request',
            message: `${newDoctor.first_name} ${newDoctor.last_name} Has Applied for a Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.first_name + ' ' + newDoctor.last_name,
                onClickPath: '/admin/doctors'
            }
        })
        await User.findByIdAndUpdate(adminUser._id, {notification})
        res.status(201).send({
            success: true,
            message: 'Doctor Account Applied Sucessfully'
        })
    }catch(e){
        //console.log(e);
        res.status(500).send({
            success:false,
            e,
            message: 'Error While Applying fo Doctor'
        })
    }
};

const getAllNotificationController = async (req, res) => {
    try{
        const user = await User.findById(req.body.userId);
        const seenNotification = user.seenNotification;
        const notification = user.notification;

        seenNotification.push(...notification);
        user.notification = [];
        user.seenNotification = notification;
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: 'All Notification Marked as Read',
            data: updatedUser
        })
    }catch(err){
        //console.log(err);
        res.status(500).send({
            message: 'Error in Notification',
            success: false,
            err
        })
    }
}
//delete all notification
const deleteAllNotificationController = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.body.userId})
        user.notification = [];
        user.seenNotification = [];
        const updateUser = await user.save();
        updateUser.password = undefined;

        res.status(200).send({
            success: true,
            message: 'Notifications Deleted Successfully',
            data: updateUser
        })
    }catch(err){
        //console.log(err);
        res.status(500).send({
            message: 'Unable to delete all Notification',
            success: false,
            err
        })
    }
}

//Get All Doc
const getAllDoctorController = async (req, res) => {
    try{
        const doctors = await Doctor.find({status: 'approved'});
        res.status(200).send({
            success: true,
            message: 'Doctor List Fetched Successfully',
            data: doctors
        })
    }catch(err){
        //console.log(err);
        res.status(500).send({
            success:false,
            err,
            message: 'Error While Fetching error'
        })
    }
}

const bookAppointmentController = async (req,res) => {
    try{
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        req.body.time = moment(req.body.time, 'HH:mm').toISOString()
        req.body.status = "pending";
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        const user = await User.findOne({_id: req.body.doctorInfo.userId})
        user.notification.push({
            type: 'New Appointment Request',
            messgae: `A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath:'/user/appointments'
        }) 
        await user.save();
        res.status(200).send({
            success: true,
            message:'Appointment Book Successfully'
        })
    }catch(err){
        //console.log(err);
        res.status(500).send({
            err,
            success: false,
            message: 'Error While Booking Appointment'
        })
    }
}

const bookingAvailabilityController = async (req, res) => {
    try{
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString()
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString()
        const doctorId = req.body.doctor_id;
        const appointments = await Appointment.find({
            doctor_id: doctorId, 
            date, 
            time: {
                $gte:fromTime, $lte:toTime,
            }
        })
        if(appointments.length>0){
            return res.status(200).send({
                message:'Appointments not Available at this time',
                success: true
            })
        }else{
                return res.status(200).send({
                    success: true,
                    message: 'Appointment Available'
                })
        }
    }catch(err){
        //console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error While Checking Booking Avaiability',
            err
        })
    }
}

const userAppointmentController = async (req,res) => {
    try{
        const appointment = await Appointment.find({user_id: req.body.userId})
        res.status(200).send({
            success:true,
            message:'User Appointment Fetched SUccessfully',
            data: appointment
        });
    }catch(err){
        //console.log(err);
        res.status(500).send({
            success:false,
            message: 'Error While Fetching User Appointment',
            err
        })
    }
}

const getUserInfoController = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.body.userId});
        const patient = await Patient.findOne({userId: req.body.userId});
        res.status(200).send({
            success: true,
            message: 'User Fetch Successfully',
            user,
            patient
        })
    }catch(err){
        //console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error While Fetching User Info',
            err
        })
    }
}

const updateProfileController = async (req, res) => {
    try{
        //console.log(req.body);
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };
        const user = await User.findOneAndUpdate({_id: req.body.userId}, userData)
        const pdfFile = req.files ? req.files.last_reports : null;

        let pdfPath;
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)){
            fs.mkdirSync(uploadsDir);
        }
        if (pdfFile) {
            const uploadPath = path.join(__dirname, '..', 'uploads', pdfFile.name); // Set the desired upload path
            pdfFile.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).send({ success: false, message: "Error in uploading file", err });
                }
            });
            pdfPath = uploadPath;  // Store the path of the uploaded file
        }
        const patientData = {
            date_of_birth: req.body.dob,
            gender: req.body.gender,
            address: req.body.address,
            contact_number: req.body.contact_number,
            blood_group: req.body.blood_group,
            last_reports: pdfPath ? pdfPath : undefined,  // Store the path in the database
        };
        
        let patient = await Patient.findOneAndUpdate({ userId: req.body.userId }, patientData);
        if (!patient) {
            patient = new Patient({ ...patientData, userId: req.body.userId });
            await patient.save();
        }
        res.status(200).send({
            success: true,
            data: user,
            message: "User Profile Updated"
        })
    }catch(err){
        //console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in Updating the user",
            err
        })
    }
}



const registerOrganDonationController = async (req, res) => {
    try {
      const { name, email, mobile_number, organ_type, date_of_donation } = req.body;
  
      // Create a new organ donation entry
      const newDonation = new OrganDonation({
        name,
        email,
        mobile_number, // Store mobile number
        organ_type,
        date_of_donation,
      });
  
      await newDonation.save(); // Save to the database
  
      res.status(200).json({
        success: true,
        message: 'Organ donation registered successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to register organ donation',
        error: error.message,
      });
    }
  };




const getUserMedicalHistory = async (req, res) => {
    try {
        const { email } = req.body; // Get the email from the request body

        // Fetch medical records by patient email
        const records = await MedicalRecord.find({ patient_email: email });

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        if (records.length === 0) {
            return res.status(404).json({ success: false, message: 'No medical records found for this user.' });
        }

        return res.status(200).json({ success: true, records });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};



module.exports = {
    loginController,
    registerController,
    authController,
    applyDoctorController, 
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentController,
    getUserInfoController,
    updateProfileController,
    registerOrganDonationController,
    getUserMedicalHistory

};
