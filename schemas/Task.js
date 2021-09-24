const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = mongoose.Schema({
    description: {type: String, trim: true},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    completed: { type: Schema.Types.Boolean}
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task