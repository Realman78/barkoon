const mongoose = require('mongoose')


const organisationSchema = mongoose.Schema({
    name: {type: String, trim: true},
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

const Organisation = mongoose.model("Organisation", organisationSchema)

module.exports = Organisation