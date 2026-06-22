const express = require("express");
const app = express();

app.use(express.json());

// TEST ROUTE
app.get("/api/expenses/test", (req, res) => {
  res.send("WORKING NOW ✅");
});

// ADD ROUTE
app.post("/api/expenses/add", (req, res) => {
  console.log(req.body);
  res.send("POST WORKING ✅");
});

app.listen(5050, () => {
  console.log("🚀 QUICK SERVER RUNNING");
});