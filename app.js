const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/ai-assistant', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ai-assistant.html'));
});

app.get('/journal', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'journal.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'team.html'));
});

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { message, history } = req.body;
    
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
