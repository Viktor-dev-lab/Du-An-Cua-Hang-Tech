const mongoose = require('mongoose'); 
const generate = require('../helpers/generate.js');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    friendList: [
        {
            user_id: String,
            room_chat_id: String
        }
    ],
    acceptFriends: Array,
    requestFriends: Array,
    status: {
        type: String,
        default: "active"
    },
    statusOnline: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});


const User = new mongoose.model("User", userSchema, "users");

module.exports = User;


