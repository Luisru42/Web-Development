// server.js (or node-server.js)
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;
  console.log("received form submission");
  console.log(name, email, message);

  // Implement your email sending logic here using nodemailer or another library.

  res.send('Email sent successfully!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});