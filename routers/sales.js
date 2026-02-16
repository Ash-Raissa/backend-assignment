const express = require("express");
const Sales = require("../models/Sale");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

// Cash Sale
router.post("/cash", auth, role("SalesAgent"), async (req, res) => {
  try {
    const newSale = new Sales({ ...req.body, type: "Cash" });
    await newSale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Credit Sale
router.post("/credit", auth, role("SalesAgent"), async (req, res) => {
  try {
    const sale = new Sales({ ...req.body, type: "Credit" });
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;