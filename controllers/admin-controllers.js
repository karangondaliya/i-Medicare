const { User, Doctor,  OrganDonation, Feedback, MedicalRecord } = require('../models/models');
const getAllUsersController = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).send({
            success: true,
            message: "Users Data",
            data: users
        })
    }catch(err){
        // console.log(err);
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
        // console.log(err);
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
      //console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };
  

  const changeUserAccountStatusController = async (req, res) => {
    try {
        const { email, status } = req.body; // Now we get email from the request body
        const isActive = status === 'active';

        // Find the user by email and update their is_active status
        const user = await User.findOneAndUpdate(
            { email }, // Query to find user by email
            { is_active: isActive }, // Set is_active to true or false
            { new: true } // Return the updated user document
        );

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).send({
            success: true,
            message: `User has been ${isActive ? 'activated' : 'blocked'}`,
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating account status",
            error,
        });
    }
};

  const getAllMedicalHistory = async (req, res) => {
    console.log('Received request for medical history'); // Add this line
    try {
        const records = await MedicalRecord.find();
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        return res.status(200).json({ success: true, records });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getOrganDonationsController = async (req, res) => {
    try {
        // Fetch organ donation records from the database
        const donations = await OrganDonation.find();

        // Return success response with the records
        res.status(200).json({
            success: true,
            donations
        });
    } catch (err) {
        // Handle any errors that occur while fetching data
        res.status(500).json({
            success: false,
            message: 'Error fetching organ donation records',
            error: err.message
        });
    }
};

const submitFeedbackController = async (req, res) => {
    try {
        const { email, feedback, rating } = req.body;


        const newFeedback = new Feedback({ email, feedback, rating });
        await newFeedback.save();


        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message,
        });
    }
};


const getAllFeedbackController = async (req, res) => {
    try {
        const feedback = await Feedback.find(); // Fetch all feedback records
        res.status(200).json({
            success: true,
            feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback records',
            error: error.message,
        });
    }
};


module.exports = {
    getAllUsersController,
    getAllDoctorsController,
    changeAccountStatusController,
    getAllMedicalHistory,
    getOrganDonationsController,
    changeUserAccountStatusController,
    submitFeedbackController,
    getAllFeedbackController
}