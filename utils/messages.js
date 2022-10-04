const Chat = require('../models/Chat');
const User = require('../models/User');

const get_messages = async(object, callback) => {
    Chat.find({
            $or: [
                { $and: [{ sender_id: object.sender_id }, { receiver_id: object.receiver_id }] },
                { $and: [{ sender_id: object.receiver_id }, { receiver_id: object.sender_id }] },
            ]
        }, async(err, results) => {
            if (err) {
                callback(err);
            } else {
                callback(results);
            }
        })
        .populate({ path: "sender_id", model: "User", select: "user_name , user_image" })
        .populate({ path: "receiver_id", model: "User", select: "user_name , user_image" })
}
const send_message = async(object, callback) => {
    var documents_chat = new Chat({ sender_id: object.sender_id, receiver_id: object.receiver_id, message: object.message });
    documents_chat.save(async(err, results) => {
        if (err) {
            callback(err);
        } else {
            Chat.find({ _id: results._id }, async(err, results_query) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(results_query);
                    }
                })
                .populate({ path: "sender_id", model: "User", select: "user_name , user_image" })
                .populate({ path: "receiver_id", model: "User", select: "user_name , user_image" })
        }
    });
}
module.exports = {
    get_messages,
    send_message
}