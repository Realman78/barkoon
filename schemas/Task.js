const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = mongoose.Schema({
    description: {type: String, trim: true},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    stage: { type: Schema.Types.Number}
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task