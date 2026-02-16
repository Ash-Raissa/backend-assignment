const express = require("express");
const userRoutes = require("./routers/user");
const procurementRoutes = require("./routers/procurement");
const salesRoutes = require("./routers/sales");
const mongoose = require("mongoose");


require("dotenv").config();

const URI = process.env.MONGODB_URI;

mongoose.connect(URI);
mongoose.connection
  .once("open", () => {
    console.log("Mongoose connection open!!");
  })
  .on("error", (error) => {
    console.error(`Connection error:${error.message}`);
  });



const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/procurement", procurementRoutes);
app.use("/sales", salesRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
