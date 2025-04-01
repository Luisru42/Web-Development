// server.js (or node-server.js)

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Use cors middleware first
app.use(cors());

// Use Express's built-in body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/send-email', (req, res) => {
    console.log("Received POST request to /send-email");
    console.log("Request Body:", req.body);

    const { name, email, message } = req.body;

    // Implement your email sending logic here using nodemailer or another library.

    res.send('Email sent successfully!');
});

// Temporary test route
app.post('/test-route', (req, res) => {
    res.send('Test route hit!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});