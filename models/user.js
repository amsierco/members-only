const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 25, minLength: 3 },
    password: { type: String, required: true, minLength: 5 },
    member: { type: Boolean, default: false }
});

// User profile URL
// UserSchema.virtual("url").get(function () {
//     return `/profile/${this._id}`;
// });
  
// Export model
module.exports = mongoose.model("User", UserSchema);