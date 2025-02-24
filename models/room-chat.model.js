const mongoose = require('mongoose'); 

const roomChatSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    status: String,
    typeRoom: String,
    theme: String,
    color: String,
    users : [
      {
        user_id: String,
        role: String,
      }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

const Roomchat = new mongoose.model("Roomchat", roomChatSchema, "room-chat");

module.exports = Roomchat;


