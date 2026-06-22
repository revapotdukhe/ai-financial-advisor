import React, { useState, useEffect } from "react";
import "./App.css";
import ExpenseChart from "./ExpenseChart";
import AIChat from "./components/AIChat";
import Welcome from "./Welcome";

function App() {
  const [start, setStart] = useState(false);
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([{ title: "", amount: "" }]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  // ✅ NEW: store user question
  const [userQuestion, setUserQuestion] = useState("");

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
     const res = await fetch("https://ai-financial-advisor-backend-0my1.onrender.com/api/ai/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
   const res = await fetch("https://ai-financial-advisor-backend-0my1.onrender.com/api/ai/advice", {
      method: "DELETE",
    });
    getHistory();
  };

  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addExpense = () => {
    setExpenses([...expenses, { title: "", amount: "" }]);
  };
  const removeExpense = (index) => {
  setExpenses(expenses.filter((_, i) => i !== index));
};

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = income - totalExpense;

  const savingsPercent =
    income > 0 ? ((income - totalExpense) / income) * 100 : 0;

  const numericIncome = Number(income);

  if (numericIncome < 0) {
    alert("Income cannot be negative");
    setIncome("");
    return;
  }

  for (let exp of expenses) {
    if (Number(exp.amount) < 0) {
      alert("Expense cannot be negative");
      setExpenses([{ title: "", amount: "" }]);
      return;
    }
  }

  // ✅ FIXED cleanText
  const cleanText = (text) => {
    if (!text) return "";

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const unique = [];
    const seen = new Set();

    for (let line of lines) {
      const lower = line.toLowerCase();
      if (!seen.has(lower)) {
        unique.push(line);
        seen.add(lower);
      }
    }

    return unique.join("\n");
  };

  // ✅ FIXED getAdvice (now uses userQuestion)
  const getAdvice = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://ai-financial-advisor-backend-0my1.onrender.comapi/ai/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          income,
          expenses,
          question: userQuestion || "General analysis",
        }),
      });

      const data = await res.json();

      setAdvice(cleanText(data.advice));
      setSelectedHistory(null);
      getHistory();
    } catch (err) {
      console.error(err);
      setAdvice("Error getting AI advice");
    }

    setLoading(false);
  };

  const groupedHistory = history.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) acc[month] = [];
    acc[month].push(item);

    return acc;
  }, {});

  if (!start) {
    return <Welcome onStart={() => setStart(true)} />;
  }

  return (
    <div className="container">
      <div className="app">
        <div className="app-content">
          <h2>Expense Tracker</h2>
          

          <div className="top">
            <input
              type="number"
              placeholder="Enter Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            {expenses.map((exp, index) => (
              <div key={index} className="expense-row">
                  <select
               value={exp.title}
               onChange={(e) =>
               handleExpenseChange(index, "title", e.target.value)
                }
                >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
           <option value="Bills">Bills</option>
          <option value="Others">Others</option>
          </select>
                   <input
                type="number"
                 placeholder="Amount"
                value={exp.amount}
                  onChange={(e) =>
                 handleExpenseChange(index, "amount", e.target.value)
                 }
                />

                 <button
               className="delete-btn"
               onClick={() => removeExpense(index)}
               >
               ❌
              </button>
              </div>
            ))}

            <div className="btn-group">
              <button onClick={addExpense}>+ Add</button>
              <button onClick={getAdvice}>
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>

          <div className="middle">
            <div className="left">
              <ExpenseChart expenses={expenses} />
            </div>

            <div className="right">
              <div className="summary">
                <h3>Total: ₹{totalExpense}</h3>
                <h3 style={{ color: balance < 0 ? "#ff6b6b" : "#90ee90" }}>
                  Balance: ₹{balance}
                </h3>
                <h3>Savings: {savingsPercent.toFixed(1)}%</h3>
              </div>

              <div className="advice-box">
                <h3 className="ai-title">
                 🤖 AI Financial Advisor
                  </h3>

                {/* ✅ Chat sends question */}
                <AIChat
                  income={income}
                  expenses={expenses}
                  onAsk={setUserQuestion}
                />

                {/* ✅ SHOW QUESTION */}
                {userQuestion && (
                  <p style={{ color: "#ccc" }}>
                    <b>Question:</b> {userQuestion}
                  </p>
                )}

                {/* ✅ SINGLE ADVICE DISPLAY */}
                <div className="advice-content">
                  {loading ? (
                    <p>⏳ Getting AI advice...</p>
                  ) : (
                    (selectedHistory
                      ? cleanText(selectedHistory.advice)
                      : advice
                    )
                      ?.split("\n")
                      .map((line, i) => <p key={i}>{line}</p>)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>History</h3>

        {Object.keys(groupedHistory).length === 0 ? (
          <p>No history yet</p>
        ) : (
          Object.keys(groupedHistory).map((month, i) => (
            <div key={i}>
              <h4>{month}</h4>

              {groupedHistory[month].map((item) => (
                <div
                  key={item._id}
                  className="history-item"
                  onClick={() => {
                    setIncome(item.income || 0);

                    const cleaned = (item.expenses || [])
                      .filter((e) => e && Number(e.amount) > 0)
                      .map((e) => ({
                        title: e.title || e.name || "Misc",
                        amount: Number(e.amount),
                      }));

                    setExpenses(cleaned);
                    setAdvice(cleanText(item.advice));
                    setSelectedHistory(item);
                    setUserQuestion(item.question); // ✅ show question from history
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item._id);
                    }}
                  >
                    🗑️
                  </button>

                  <p>
                    <b>₹{item.totalExpense || 0}</b>
                  </p>
                  <p>Income: ₹{item.income || 0}</p>
                  <small>{new Date(item.date).toLocaleString()}</small>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => {
          setStart(false);
          setIncome("");
          setExpenses([{ title: "", amount: "" }]);
          setAdvice("");
          setSelectedHistory(null);
          setUserQuestion("");
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 16px",
          borderRadius: "50px",
          border: "none",
          backgroundColor: "#4a90e2",
          color: "white",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>
    </div>
  );
}

export default App;