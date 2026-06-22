const mongoose = require("mongoose");

const adviceSchema = new mongoose.Schema({
  advice: String,

  income: {
    type: Number,
    default: 0,
  },

  expenses: [
    {
      title: String,
      amount: Number,
    },
  ],

  totalExpense: {
    type: Number,
    default: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  question: {
  type: String
},
});

module.exports = mongoose.model("Advice", adviceSchema);