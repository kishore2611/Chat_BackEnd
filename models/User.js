const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    user_name: {
        type: String,
        require: false
    },
    user_email: {
        type: String,
        require: false
    },
    user_image: {
        type: String,
        require: false
    },
    is_blocked: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    }
}, { timestamps: true });

const User = mongoose.model('User', userScheme);
module.exports = User;