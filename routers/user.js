const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Create User
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let _user = await User.findOne({ email });
    if (_user) {
      let user = {
        sub: _user._id,
        name: _user.name,
        role: _user.role,
      };
      const isMatch = await bcrypt.compare(password, _user.password);
      if (isMatch) {
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({ token, user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
