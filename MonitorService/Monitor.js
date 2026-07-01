import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema({
  name: String,
  url: String,
  email:String,
  status: {
  type: String,
  enum: ["UP", "UNHEALTHY", "DOWN", "UNKNOWN"],
  default: "UNKNOWN",
},
statusCode: {
  type: Number,
  default: null,
},

lastEmailSent: {
  type: Date,
  default: null,
},
  responseTime: Number,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const Monitor = mongoose.model(
  "Monitor",
  monitorSchema
);

export default Monitor;