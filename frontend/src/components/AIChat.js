import React, { useState } from "react";

const AIChat = ({ income, expenses, onAsk }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userText = question;

    // show user message
    setMessages((prev) => [
      ...prev,
      { type: "user", text: userText }
    ]);

    // ✅ send question to App
    if (onAsk) onAsk(userText);

    setLoading(true);

    try {
      const res = await fetch("https://ai-financial-advisor-backend-0my1.onrender.com/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userText,
          income,
          expenses,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: data.reply || "No response from AI" }
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "⚠️ Failed to connect to server" }
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>💬 Ask AI</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your finances..."
          style={{
            padding: "10px",
            width: "70%",
            marginRight: "10px"
          }}
        />

        <button
          onClick={sendMessage}
          style={{ padding: "10px" }}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.type === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIChat;