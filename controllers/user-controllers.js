const { User } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        console.log(error);
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
        console.log(error);
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
        console.log(err);
        res.status(500).send({
            message: `Auth Error`,
            success: false,
            err
        })
    }
};

module.exports = {
    loginController,
    registerController,
    authController
};
