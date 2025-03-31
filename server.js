const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const port = process.env.PORT || 3000;

// Use cors middleware first
app.use(cors());

// Use Express's built-in body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
    // Process the email sending logic here
    console.log("received form submission");
    console.log(name, email, message);

    //send response
    res.send('Email sent successfully!'); // Or handle errors
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});