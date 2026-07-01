import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },

   status: {
  type: String,
  enum: ["UP", "UNHEALTHY", "DOWN", "UNKNOWN"],
}
    ,
    statusCode: {
  type: Number,
  default: null,
},

    responseTime: {
      type: Number,
      required: true,
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },

    error: String,
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logSchema);

export default Log;