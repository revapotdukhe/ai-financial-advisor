import React, { useEffect, useState } from "react";

const words = ["Track", "Analyze", "Grow"];

const Welcome = ({ onStart }) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Typing Effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (charIndex < words[wordIndex].length) {
        setText((prev) => prev + words[wordIndex][charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => {
          setText("");
          setCharIndex(0);
          setWordIndex((prev) => (prev + 1) % words.length);
        }, 1000);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [charIndex, wordIndex]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          AI Finance Tracker 💸
        </h1>

        <p style={styles.subtitle}>
          <span style={styles.highlight}>{text}</span> your money smarter.
        </p>

        <p style={styles.subline}>
          AI-powered insights to help you save smarter and spend better.
        </p>

        <button
          onClick={onStart}
          style={styles.button}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Continue as Guest →
        </button>

      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a, #0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },

  card: {
    background: "rgba(30, 41, 59, 0.6)",
    padding: "50px",
    borderRadius: "18px",
    textAlign: "center",
    width: "380px",
    backdropFilter: "blur(12px)",
    boxShadow:
      "0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    animation: "fadeIn 1.5s ease",
  },

  title: {
    color: "#ffffff",
    fontSize: "2.6rem",
    fontWeight: "700",
    marginBottom: "12px",
  },

  subtitle: {
    color: "#f1f5f9",
    fontSize: "1rem",
    marginBottom: "6px",
  },

  highlight: {
    color: "#38bdf8",
    fontWeight: "bold",
  },

  subline: {
    color: "#cbd5f5",
    fontSize: "0.85rem",
    marginBottom: "28px",
  },

  button: {
    padding: "13px",
    background: "linear-gradient(90deg, #2563eb, #06b6d4)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    width: "100%",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.95rem",
    transition: "0.3s",
  },
};

export default Welcome;