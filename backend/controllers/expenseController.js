const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 MUST ADD

    const { income, expenses, totalExpense, remaining } = req.body;

    const newExpense = new Expense({
      income,
      expenses,
      totalExpense,
      remaining,
    });

    await newExpense.save();

    res.json({ message: "Saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addExpense };