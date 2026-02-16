const express = require("express");
const Procurement = require("../models/Procurement");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", auth, role("Manager"), async (req, res) => {
  const procurement = new Procurement(req.body);
  await procurement.save();
  res.status(201).json(procurement);
});

module.exports = router;
