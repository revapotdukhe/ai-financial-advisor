const axios = require("axios");

async function getFinancialAdvice(data) {
  try {
    // ✅ SAFETY (MOST IMPORTANT)
    const income = data?.income || 0;
    const expenses = data?.expenses || [];

    const categoryMap = {};

    expenses.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([cat, amt]) => `${cat}: ₹${amt}`)
      .join("\n");

    const prompt = `
You are a smart financial advisor.

Income: ₹${income}

Expenses:
${expenses.map(e => `${e.title}: ₹${e.amount}`).join("\n")}

STRICT RULES:
- Give ONLY 3 points
- Each point must be in NEW LINE
- Use bullet style with emoji (👉, 💰, ⚠️)
- Keep each line SHORT (max 8 words)
- Use ₹ numbers
- NO paragraphs
- NO explanations

Example:
👉 Food is high. Reduce ₹30/day = ₹900/month  
💰 Save at least ₹1000/month  
⚠️ Control unnecessary spending  

Now give advice:
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text = response.data.choices[0].message.content;

    // clean output
    text = text.replace(/\*\*/g, "").replace(/\\n/g, "\n");

    return text;

  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);
    return "AI temporarily failed";
  }
}


// ✅ NEW FUNCTION (ONLY ADDITION — NO CHANGE ABOVE)
async function chatReply(data) {
  try {
    const income = data?.income || 0;
    const expenses = data?.expenses || [];
    const question = data?.question || "";

    const prompt = `
You are a financial assistant.

User Question:
"${question}"

User Data:
Income: ₹${income}

Expenses:
${expenses.map(e => `${e.title}: ₹${e.amount}`).join("\n")}

RULES:
- Give short, practical answer
- Max 4 lines
- Use ₹ values if needed
- Be clear and helpful

Answer:
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
       model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text = response.data.choices[0].message.content;

    // clean output
    text = text.replace(/\*\*/g, "").replace(/\\n/g, "\n");

    return text;

  } catch (error) {
    console.log("CHAT AI ERROR:", error.response?.data || error.message);
    return "AI chat failed";
  }
}


// ✅ EXPORT (IMPORTANT)
module.exports = { getFinancialAdvice, chatReply };