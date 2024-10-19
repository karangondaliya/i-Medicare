const express = require('express'); 
const router = express.Router();
const authMiddleware = require('../middlerwares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, getAllMedicalHistory, getOrganDonationsController } = require('../controllers/admin-controllers');


//GET Method || Users
router.get('/getAllUsers', authMiddleware ,getAllUsersController);

//GET Method || Doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//POST ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

router.get('/get-all-medical-history', authMiddleware, getAllMedicalHistory);

router.get('/get-organ-donations', authMiddleware, getOrganDonationsController);


module.exports = router;