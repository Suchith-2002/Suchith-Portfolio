// server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, '../public')));

// Handle contact form POST
app.post('/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).send('Missing fields');
    }

    const entry = {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    };

    // Save to file
    const filePath = path.join(__dirname, 'messages.json');
    let messages = [];

    if (fs.existsSync(filePath)) {
        messages = JSON.parse(fs.readFileSync(filePath));
    }

    messages.push(entry);
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    res.send(`<h2>Thanks, ${name}. Your message has been received!</h2>`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});