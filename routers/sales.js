const express = require("express");
const Sales = require("../models/Sale");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Cash and credit/deferred sales operations
 */

/**
 * @swagger
 * /sales/cash:
 *   post:
 *     summary: Record a cash sale (Sales Agent only)
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [produceName, tonnage, amountPaid, buyerName, salesAgentName, date, time]
 *             properties:
 *               produceName:
 *                 type: string
 *                 example: Tomatoes
 *               tonnage:
 *                 type: number
 *                 example: 120
 *               amountPaid:
 *                 type: number
 *                 minimum: 10000
 *                 example: 200000
 *               buyerName:
 *                 type: string
 *                 example: Buyer 1
 *               salesAgentName:
 *                 type: string
 *                 example: Agent 1
 *               date:
 *                 type: string
 *                 example: 2026-02-21
 *               time:
 *                 type: string
 *                 example: 14:30
 *     responses:
 *       201:
 *         description: Cash sale recorded
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/cash", auth, role("SalesAgent"), async (req, res) => {
  try {
    const newSale = new Sales({ ...req.body, type: "Cash" });
    await newSale.save();
    return res.status(201).json(newSale);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /sales/credit:
 *   post:
 *     summary: Record a credit/deferred sale (Sales Agent only)
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [buyerName, nin, location, contacts, amountDue, salesAgentName, dueDate, produceName, produceType, tonnage, dispatchDate]
 *             properties:
 *               buyerName:
 *                 type: string
 *                 example: Trusted Buyer
 *               nin:
 *                 type: string
 *                 example: CF1234567890AB
 *               location:
 *                 type: string
 *                 example: Kampala
 *               contacts:
 *                 type: string
 *                 example: "+256700123456"
 *               amountDue:
 *                 type: number
 *                 minimum: 10000
 *                 example: 500000
 *               salesAgentName:
 *                 type: string
 *                 example: Agent 2
 *               dueDate:
 *                 type: string
 *                 example: 2026-03-10
 *               produceName:
 *                 type: string
 *                 example: Maize
 *               produceType:
 *                 type: string
 *                 example: Grain
 *               tonnage:
 *                 type: number
 *                 example: 300
 *               dispatchDate:
 *                 type: string
 *                 example: 2026-02-22
 *     responses:
 *       201:
 *         description: Credit sale recorded
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/credit", auth, role("SalesAgent"), async (req, res) => {
  try {
    const sale = new Sales({ ...req.body, type: "Credit" });
    await sale.save();
    return res.status(201).json(sale);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: List sales
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sales records fetched
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, async (_req, res) => {
  const sales = await Sales.find().sort({ createdAt: -1 });
  return res.status(200).json(sales);
});

module.exports = router;
