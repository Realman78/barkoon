const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    email: {type: String, trim: true},
    username: {type: String, trim: true},
    password: {type: String, trim: true},
    organisations: [{ type: Schema.Types.ObjectId, ref: 'Organisation' }]
})

const User = mongoose.model("User", userSchema)

module.exports = User