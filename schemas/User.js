const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    email: {type: String, trim: true},
    username: {type: String, trim: true},
    password: {type: String, trim: true},
})

const User = mongoose.model("User", userSchema)

module.exports = User