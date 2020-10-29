module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const logSchema = new Schema({
        time: Date,
        // 1-nestciaoh5
        project:Number,
        userName:String,
        userId:Number,
        error:String
    });

    return mongoose.model('log',logSchema,'log')
}