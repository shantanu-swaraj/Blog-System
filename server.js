const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "en",
      target: "hi",
      format: "text",
    }, {
      headers: { "Content-Type": "application/json" }
    });

    res.json({ translatedText: response.data.translatedText });
  } catch (error) {
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));