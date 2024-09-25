const { User, Doctor } = require('../models/models');

const getAllUsersController = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).send({
            success: true,
            message: "Users Data",
            data: users
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error While Fetching All Users",
            success: false,
            err
        });
    }
}

const getAllDoctorsController = async (req, res) => {
    try{
        const doctors = await Doctor.find();
        res.status(200).send({
            success: true,
            message: "Doctors Data",
            data: doctors
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error While Fetching All Doctors",
            success: false,
            err
        });
    }
}

//Doctor Account Status
const changeAccountStatusController = async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });
      const user = await User.findOne({ _id: doctor.userId });
      const notification = user.notification;
      notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request Has ${status} `,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };
  


module.exports = {
    getAllUsersController,
    getAllDoctorsController,
    changeAccountStatusController
}
