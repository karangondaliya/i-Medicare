const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/models');
const authMiddleware = require('../middlerwares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentController, updateStatusController, addMedicalRecordController, checkUserEmailController } = require('../controllers/doctor-controllers');

//GET SINGLE DOC INFO
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

router.post('/updateProfile', authMiddleware, updateProfileController);

//POST GET SINGLE DOC INFO
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

//GET Appoinments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentController)

//POST Update Status
router.post('/update-status', authMiddleware, updateStatusController)



router.post('/add-record', authMiddleware, addMedicalRecordController);

router.post('/check-email', authMiddleware, checkUserEmailController);


module.exports = router;
