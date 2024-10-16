const express = require('express'); 
const router = express.Router();
const authMiddleware = require('../middlerwares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/admin-controllers');


//GET Method || Users
router.get('/getAllUsers', authMiddleware ,getAllUsersController);

//GET Method || Doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//POST ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

module.exports = router;