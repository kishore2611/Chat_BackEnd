const mongoose = require('mongoose');

const chatScheme = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    group_id: {
        type: String,
        require: false
    },
    message: {
        type: String,
        require: true
    },
    is_read: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    is_blocked: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatScheme);
module.exports = Chat;