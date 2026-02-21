const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const userRoutes = require("./routers/user");
const procurementRoutes = require("./routers/procurement");
const salesRoutes = require("./routers/sales");
const swaggerSpec = require("./swagger");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "KGL Backend API is running",
    docs: "/api-docs",
  });
});

app.use("/users", userRoutes);
app.use("/procurement", procurementRoutes);
app.use("/sales", salesRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, _req, res, _next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal server error" });
});

const URI = process.env.MONGODB_URI || process.env.DATABASE_URI;
const PORT = process.env.PORT || 3000;

if (!URI) {
  console.error("Missing MongoDB connection string in MONGODB_URI or DATABASE_URI");
  process.exit(1);
}

mongoose
  .connect(URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  });
