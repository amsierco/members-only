const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 25, minLength: 3 },
    password: { type: String, required: true, minLength: 5 },
    member: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
});
  
// Export model
module.exports = mongoose.model("User", UserSchema);