require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// ✅ Fix: Allow all origins for now (Later, restrict to specific domains)
app.use(cors({
    origin: "https://www.enged.com.au/",  // Allow all origins (Replace "*" with "https://yourdomain.com" in production)
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Add a simple GET route for debugging
app.get("/", (req, res) => {
    res.send("✅ OpenAI Proxy API is running!");
});

// ✅ Handle Chat Requests
app.post("/api/chat", async (req, res) => {
    try {
        if (!req.body || !req.body.messages || !Array.isArray(req.body.messages)) {
            return res.status(400).json({ error: "Missing required parameter: 'messages'." });
        }

        console.log("✅ Received request:", req.body);

        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: req.body.messages,
            max_tokens: 150
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        console.log("✅ OpenAI API Response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("❌ OpenAI API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "OpenAI API request failed" });
    }
});

// ✅ Fix Port Binding for Render
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
