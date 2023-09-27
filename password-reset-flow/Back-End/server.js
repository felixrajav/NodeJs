const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Customer = require("./models/Coustomer");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT;
const DB_URL ="mongodb+srv://felixvictorraj:felix123@cluster0.kbftikb.mongodb.net/?retryWrites=true&w=majority";

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your actual frontend origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


//Connect to MongoDB
mongoose
  .connect(DB_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

  const User = mongoose.model('User', {
    email: String,
    password: String,
    resetToken: String,
    resetTokenExpiration: Date,
  });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const customer = new Customer({ username, password: hashedPassword });

  try {
    await customer.save();
    res.json({ message: "User Registered Successfully!!!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user!" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const customer = await Customer.findOne({ username });

  if (!customer) {
    return res
      .status(401)
      .json({ message: "Authentication Failed! User does not exists." });
  }

  const passwordMatch = await bcrypt.compare(password, customer.password);

  if (!passwordMatch) {  
    return res
      .status(401)
      .json({ message: "Authentication Failed! Password does not match." });
  } 

  const token = jwt.sign(
    { username: customer.username, role: "Mentor" },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

app.get("/api/home", (req, res) => {
  res.json({ message: "Home page accessed successfully!!!" });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Generate a random token and set an expiry time (e.g., 1 hour)
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send an email with the password reset link
  const resetLink = `http://localhost:8080/reset-password/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You have requested to reset your password. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.status(200).json({ message: 'Password reset link sent to your email' });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Error initiating password reset' });
}
});

// API endpoint to verify and reset password
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    // Update the user's password and clear the reset token
  user.password = newPassword;
  user.resetToken = null;
  user.resetTokenExpiration = null;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Error resetting password' });
}
});

app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});  