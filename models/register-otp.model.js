const mongoose = require('mongoose'); 

const registerOtpSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 180
        }
    }, 

    {
        timestamps: true
    }
);


const RegisterOtp = new mongoose.model("RegisterOtp", registerOtpSchema, "register-otp");

module.exports = RegisterOtp;


