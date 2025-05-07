const express = require('express'); 
const router = express.Router();
const authMiddleware = require('../middlerwares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, getAllMedicalHistory, getOrganDonationsController, changeUserAccountStatusController, submitFeedbackController, getAllFeedbackController } = require('../controllers/admin-controllers');


//GET Method || Users
router.get('/getAllUsers', authMiddleware ,getAllUsersController);

//GET Method || Doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//POST ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

// Add the block user endpoint
router.post('/changeUserAccountStatus', authMiddleware, changeUserAccountStatusController);

router.get('/get-all-medical-history', authMiddleware, getAllMedicalHistory);

router.get('/get-organ-donations', authMiddleware, getOrganDonationsController);

router.post('/submit-feedback', authMiddleware, submitFeedbackController); 

router.get('/feedback-list', authMiddleware, getAllFeedbackController);


module.exports = router;