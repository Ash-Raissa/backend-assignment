const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Manager
 *               email:
 *                 type: string
 *                 example: jane@kgl.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [Manager, SalesAgent]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    await user.save();
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login using username/email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: jane@kgl.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: User not found or invalid credentials
 *       400:
 *         description: Missing credentials
 */
router.post("/login", async (req, res) => {
  try {
    const { identifier, email, password } = req.body || {};
    const loginIdentifier = (identifier || email || "").trim();
    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    let _user = await User.findOne({
      $or: [{ email: loginIdentifier.toLowerCase() }, { name: loginIdentifier }],
    });
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
        return res.status(200).json({ token, user });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users (Manager only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", auth, role("Manager"), async (_req, res) => {
  const users = await User.find().select("-password");
  return res.status(200).json(users);
});

module.exports = router;
