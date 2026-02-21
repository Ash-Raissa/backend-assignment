const mongoose = require("mongoose");

const alphaNumericPattern = /^[a-zA-Z0-9 ]+$/;
const alphaPattern = /^[a-zA-Z ]+$/;
const phonePattern = /^\+?\d{10,15}$/;

const procurementSchema = new mongoose.Schema(
  {
    produceName: {
      type: String,
      required: true,
      trim: true,
      match: alphaNumericPattern,
    },
    produceType: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      match: alphaPattern,
    },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    tonnage: { type: Number, required: true, min: 100 },
    cost: { type: Number, required: true, min: 10000 },
    dealerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      match: alphaNumericPattern,
    },
    branch: { type: String, enum: ["Maganjo", "Matugga"], required: true },
    contact: { type: String, required: true, trim: true, match: phonePattern },
    sellingPrice: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Procurement", procurementSchema);
