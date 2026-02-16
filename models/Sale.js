const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Cash", "Credit"],
    required: true,
  },

  // Common
  produceName: String,
  produceType: String,
  tonnage: Number,

  // Cash fields
  amountPaid: Number,
  buyerName: String,
  salesAgentName: String,
  date: Date,
  time: String,

  // Credit fields
  nin: String,
  location: String,
  contacts: String,
  amountDue: Number,
  dueDate: Date,
  dispatchDate: Date,
});

module.exports = mongoose.model("Sales", salesSchema);
