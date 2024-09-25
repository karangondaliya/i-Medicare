const { Doctor, Appointment, User } = require("../models/models");

const getDoctorInfoController = async (req,res) => {
    try{
        console.log(req.body);
        const doctor = await Doctor.findOne({userId: req.body.userId});
        res.status(200).send({
            success: true,
            message: "Doctor Info Fetched Successfully",
            doctor
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in Fetching Doctor Info",
            err
        })
    }
}

const updateProfileController = async (req, res) => {
    try{
        const doctor = await Doctor.findOneAndUpdate({userId: req.body.userId}, req.body)
        res.status(200).send({
            success: true,
            data: doctor,
            message: "Doctor Profile Updated"
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in Updating the user",
            err
        })
    }
}

//GET SINGLE DOC INFO
const getDoctorByIdController = async (req, res) => {
    try{
        const doctor = await Doctor.findOne({_id: req.body.doctorId});
        res.status(200).send({
            success: true,
            message: "Doctor Info Fetched Successfully",
            data: doctor
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in Fetching Doctor Info",
            err
        })
    }
}

const doctorAppointmentController = async (req,res) => {
    try{
        const doctor = await Doctor.find({userId: req.body.userId})
        const appointments = await Appointment.find({doctor_id: doctor[0]._id})
        res.status(200).send({
            success:true,
            message:'Doctor Appointment Fetched Successfully',
            data: appointments
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error While Fetching Appointments',
            err
        })
    }
}

const updateStatusController = async (req,res) => {
    try{
        const {appointmentId, status} = req.body;
        const appointments = await Appointment.findById(appointmentId, {status});
        const user = await User.findOne({_id: appointments.userId})
        const notification = user.notification;
        notification.push({
            type: 'Status Updated',
            messgae: `Your Appointment has been updated ${status}`,
            onClickPath:'/doctor-appointments'
        }) 
        await user.save();
        res.status(200).send({
            success:true,
            message:'Status Updated Successfully',
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message:'Error While updating Status',
            err
        })
    }
}

module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentController,
    updateStatusController
}
