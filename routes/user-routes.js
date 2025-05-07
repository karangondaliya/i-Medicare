const express = require('express');
const { loginController, registerController, authController, 
    applyDoctorController, getAllNotificationController, deleteAllNotificationController, 
    getAllDoctorController, bookAppointmentController, bookingAvailabilityController, 
    userAppointmentController, getUserInfoController, 
    updateProfileController, registerOrganDonationController, getUserMedicalHistory
 } = require('../controllers/user-controllers');
const authMiddleware = require('../middlerwares/authMiddleware');

//router object
const router = express.Router();

//routes
//LOGIN || POST
router.post('/login', loginController);

//Register || POST
router.post('/register', registerController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController)

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController)

router.post("/get-all-notification", authMiddleware, getAllNotificationController)

router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController)

//Get All DOC
router.get('/getAllDoctors', authMiddleware, getAllDoctorController)

//BOOK APPOINTMENT
router.post('/book-appointment', authMiddleware, bookAppointmentController);

//Booking Availabilty
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);

//Appointment List
router.get('/user-appointment', authMiddleware, userAppointmentController)

//GET SINGLE USER INFO
router.post('/getUserInfo', authMiddleware, getUserInfoController);

router.post('/updateUserProfile', authMiddleware, updateProfileController);

router.post('/registerOrganDonation', authMiddleware, registerOrganDonationController);


// Fetch Medical History || POST


router.post('/get-user-medical-history', authMiddleware, getUserMedicalHistory);




module.exports = router;
