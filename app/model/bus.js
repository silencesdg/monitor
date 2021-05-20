module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const busSchema = new Schema({
    time: Date,
    station: String,
    bus_no: String,
    from: String,
    to: String,
    stamp:Number,
    lineID:String,
    roLine:String
  });

  return mongoose.model("Bus", busSchema, "bus");
};
