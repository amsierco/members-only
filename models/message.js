const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId },
    message: { type: String, required: true, minLength: 5, maxLength: 100 },
    date_posted: { type: Date, required: true }
});

// Message profile URL
// MessageSchema.virtual("url").get(function () {
//     return `/profile/${this._id}`;
// });
  
// Export model
module.exports = mongoose.model("Message", MessageSchema);