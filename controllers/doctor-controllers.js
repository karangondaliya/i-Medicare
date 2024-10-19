const { Doctor, Appointment, User } = require("../models/models");
const MedicalRecord = require('../models/models').MedicalRecord;

const getDoctorInfoController = async (req,res) => {
    try{
        //console.log(req.body);
        const doctor = await Doctor.findOne({userId: req.body.userId});
        res.status(200).send({
            success: true,
            message: "Doctor Info Fetched Successfully",
            doctor
        })
    }catch(err){
        //console.log(err);
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
        // console.log(err);
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
        // console.log(err);
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
        // console.log(err);
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
        const appointments = await Appointment.findByIdAndUpdate(appointmentId, {status});
        console.log(appointments.user_id);
        const user = await User.findOne({_id: appointments.user_id})
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
        // console.log(err);
        res.status(500).send({
            success: false,
            message:'Error While updating Status',
            err
        })
    }
}


const addMedicalRecordController = async (req, res) => {
    console.log("Request received:", req.body);
    try {
        const { patient_name, patient_email, doctor_name, visit_type, treatment_description, total_bill } = req.body;

        // Validate required fields
        if (!patient_name || !patient_email || !doctor_name || !visit_type || !treatment_description || total_bill == null) {
            console.error("Validation failed: Missing required fields.");
            return res.status(400).send({
                success: false,
                message: "All fields are required."
            });
        }

        // Create a new medical record
        const newRecord = new MedicalRecord({
            patient_name,
            patient_email,
            doctor_name,
            visit_type,
            treatment_description,
            total_bill
        });

        // Attempt to save the record to the database
        await newRecord.save();
        console.log("New record saved:", newRecord); // Log the saved record

        return res.status(201).send({
            success: true,
            message: "Medical record added successfully!",
            data: newRecord
        });
    } catch (err) {
        console.error("Error while adding medical record:", err); // Log the error
        return res.status(500).send({
            success: false,
            message: "Error in adding medical record",
            error: err.message // Send the error message for clarity
        });
    }
};

const checkUserEmailController = async (req, res) => {
    const { email } = req.body; // Get email from request body
    try {
        const user = await User.findOne({ email });
        if (user) {
            // Email exists in the database
            return res.status(200).json({ success: true, message: 'Email exists' });
        } else {
            // Email not found in the database
            return res.status(404).json({ success: false, message: 'Email not found in the database' });
        }
    } catch (err) {
        // Handle errors during the query
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentController,
    updateStatusController,
    addMedicalRecordController,
    checkUserEmailController
}