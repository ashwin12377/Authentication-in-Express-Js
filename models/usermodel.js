const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/authTestapp`);


const userSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    age: Number
});

module.exports = mongoose.model("user", userSchema);