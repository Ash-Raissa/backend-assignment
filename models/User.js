const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
    match: /^[a-zA-Z0-9 ]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Manager", "SalesAgent"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
