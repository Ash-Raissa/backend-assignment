const mongoose = require("mongoose");

const alphaNumericPattern = /^[a-zA-Z0-9 ]+$/;
const alphaPattern = /^[a-zA-Z ]+$/;
const phonePattern = /^\+?\d{10,15}$/;
const ninPattern = /^(?:CF|CM)[A-Z0-9]{12}$/i;

const salesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Cash", "Credit"],
      required: true,
    },

    // Common
    produceName: {
      type: String,
      required: true,
      trim: true,
      match: alphaNumericPattern,
    },
    produceType: {
      type: String,
      trim: true,
      minlength: 2,
      match: alphaPattern,
      required() {
        return this.type === "Credit";
      },
    },
    tonnage: { type: Number, required: true, min: 1 },

    // Cash fields
    amountPaid: {
      type: Number,
      min: 10000,
      required() {
        return this.type === "Cash";
      },
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      match: alphaNumericPattern,
    },
    salesAgentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      match: alphaNumericPattern,
    },
    date: {
      type: String,
      required() {
        return this.type === "Cash";
      },
    },
    time: {
      type: String,
      required() {
        return this.type === "Cash";
      },
    },

    // Credit fields
    nin: {
      type: String,
      trim: true,
      match: ninPattern,
      required() {
        return this.type === "Credit";
      },
    },
    location: {
      type: String,
      trim: true,
      minlength: 2,
      match: alphaNumericPattern,
      required() {
        return this.type === "Credit";
      },
    },
    contacts: {
      type: String,
      trim: true,
      match: phonePattern,
      required() {
        return this.type === "Credit";
      },
    },
    amountDue: {
      type: Number,
      min: 10000,
      required() {
        return this.type === "Credit";
      },
    },
    dueDate: {
      type: String,
      required() {
        return this.type === "Credit";
      },
    },
    dispatchDate: {
      type: String,
      required() {
        return this.type === "Credit";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", salesSchema);
