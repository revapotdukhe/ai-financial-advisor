console.log("🔥 THIS SERVER FILE IS RUNNING:", __dirname);
require("dotenv").config();
console.log("SERVER FILE RUNNING ✅");

const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DB
(async () => {
  await connectDB();
})();

// BASIC ROUTES
app.get("/", (req, res) => {
  res.send("HOME WORKING");
});//5000

app.get("/test", (req, res) => {
  res.send("TEST WORKING ✅");
});//local 5050

// 🔥 IMPORTANT: DIRECT TEST ROUTE
app.get("/api/expenses/test", (req, res) => {
  res.send("DIRECT TEST WORKING ✅");
});

// OTHER ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
console.log("✅ /api/expenses route connected");
app.use("/api/ai", require("./routes/aiRoutes"));

// SERVER (ALWAYS LAST)
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});