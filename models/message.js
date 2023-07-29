const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId },
    message: { type: String, required: true, minLength: 1, maxLength: 246 },
    date_posted: { type: Date, required: true }
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);