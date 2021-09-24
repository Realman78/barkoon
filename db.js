const mongoose = require('mongoose')
const dburl = "mongodb+srv://admin:admin@taskcluster.mvxfz.mongodb.net/ms_task_manager?retryWrites=true&w=majority"
class Database{
    constructor(){
        this.connect()
    }
    connect() {
        mongoose.connect(dburl, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
        }).then(()=>{
            console.log('Connection to database successful')
        })
        .catch((e)=>{
            console.log(e)
        })
    }
}

module.exports = new Database()