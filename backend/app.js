require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const transactionsRoute = require("./routes/transactions");
const orderRoutes = require("./routes/createOrder");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

app.use("/api/transactions", transactionsRoute);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
