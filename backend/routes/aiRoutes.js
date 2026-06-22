const express = require("express");
const router = express.Router();

const aiService = require("../services/aiService");
const Advice = require("../models/Advice");

// ✅ POST: GET ADVICE + SAVE (FINAL CLEAN VERSION)
router.post("/advice", async (req, res) => {
  try {
    const { income, expenses, question } = req.body;

    // ✅ Clean expenses
    const safeExpenses = (expenses || []).map(e => ({
      title: e.title && e.title.trim() !== "" ? e.title : "Misc",
      amount: Number(e.amount || 0)
    }));

    // ✅ Calculate total
    const totalExpense = safeExpenses.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0
    );

    // ✅ Generate AI advice
    let rawAdvice = await aiService.getFinancialAdvice({
      income,
      expenses: safeExpenses,
      totalExpense
    });

    // 🔥 FINAL CLEAN LOGIC (ONLY ONE)
    const lines = (rawAdvice || "")
      .split("\n")
      .map(l => l.trim())
      .filter(l => l !== "");

    // 👉 First line = paragraph
    const paragraph = lines[0] || "";

    // 👉 Remaining = points
    const rest = lines.slice(1);

    // 👉 Remove duplicates
    // 👉 Remove duplicates (STRONG FIX)
const uniquePoints = [];
const seen = new Set();

for (let line of rest) {
  const lower = line.toLowerCase();

  if (!seen.has(lower)) {
    uniquePoints.push(line);
    seen.add(lower);
  }
}

    // 👉 Final output: paragraph + 3 points
    const finalAdvice = [paragraph, ...uniquePoints.slice(0, 3)].join("\n");

    // fallback
    const safeAdvice = finalAdvice || "Unable to generate advice.";

    // ✅ Save CLEAN data
    await new Advice({
      advice: safeAdvice,
      income: Number(income),
      expenses: safeExpenses,
      totalExpense,
      question: question || "General analysis"
    }).save();

    res.json({ advice: safeAdvice });

  } catch (error) {
    console.log("ROUTE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ GET HISTORY
router.get("/history", async (req, res) => {
  try {
    const data = await Advice.find().sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ DELETE HISTORY
router.delete("/history/:id", async (req, res) => {
  try {
    await Advice.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ CHAT (NO SAVE HERE)
router.post("/chat", async (req, res) => {
  try {
    const reply = await aiService.chatReply(req.body);
    res.json({ reply });
  } catch (error) {
    console.log("CHAT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/reset", async (req, res) => {
  try {
    await Advice.deleteMany({});
    res.send("All history deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;