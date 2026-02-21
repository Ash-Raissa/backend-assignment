const express = require("express");
const Procurement = require("../models/Procurement");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Produce purchase operations
 */

/**
 * @swagger
 * /procurement:
 *   post:
 *     summary: Record produce procurement (Manager only)
 *     tags: [Procurement]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [produceName, produceType, date, time, tonnage, cost, dealerName, branch, contact, sellingPrice]
 *             properties:
 *               produceName:
 *                 type: string
 *                 example: Tomatoes2026
 *               produceType:
 *                 type: string
 *                 example: Vegetables
 *               date:
 *                 type: string
 *                 example: 2026-02-21
 *               time:
 *                 type: string
 *                 example: 08:30
 *               tonnage:
 *                 type: number
 *                 minimum: 100
 *                 example: 500
 *               cost:
 *                 type: number
 *                 minimum: 10000
 *                 example: 300000
 *               dealerName:
 *                 type: string
 *                 example: FarmCo2
 *               branch:
 *                 type: string
 *                 enum: [Maganjo, Matugga]
 *               contact:
 *                 type: string
 *                 example: "+256700123456"
 *               sellingPrice:
 *                 type: number
 *                 example: 420000
 *     responses:
 *       201:
 *         description: Procurement recorded
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", auth, role("Manager"), async (req, res) => {
  try {
    const procurement = new Procurement(req.body);
    await procurement.save();
    return res.status(201).json(procurement);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /procurement:
 *   get:
 *     summary: List procurements
 *     tags: [Procurement]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Procurement records fetched
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, async (_req, res) => {
  const procurements = await Procurement.find().sort({ createdAt: -1 });
  return res.status(200).json(procurements);
});

module.exports = router;
