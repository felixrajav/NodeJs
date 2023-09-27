const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const PORT = 8080;
const DB_URL ="mongodb+srv://felixvictorraj:felix123@cluster0.kbftikb.mongodb.net/?retryWrites=true&w=majority";

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5175'); // Replace with your actual frontend origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

//Connect to MongoDB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));


  // Create a user model
const User = mongoose.model('User', {
    email: String,
    password: String,
    resetToken: String,
    resetTokenExpiration: Date,
  });
  
  // Create a transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

  // Sign up a new user
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({ email, password: hashedPassword });
      await user.save();
  
      res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while registering the user!' });
    }
  });

// Log in a user
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed! User does not exist.' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed! Password does not match.' });
      }
  
      const token = jwt.sign(
        { username: user.email, role: 'user' },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while logging in the user!' });
    }
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
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'user@example.com',
          pass: 'password',
        },
      });
  
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
  
  app.post('/api/reset-password', async (req, res) => {
    const { token, password } = req.body;
  
    try {
      const user = await User.findOne({ resetToken: token });
      if (!user) {
        return res.status(404).json({ error: 'Invalid password reset token' });
      }
  
      if (user.resetTokenExpiration < Date.now()) {
        return res.status(400).json({ error: 'Password reset token has expired' });
      }
  
      user.password = password;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error resetting password' });
    }
  });
  
app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
  }); 