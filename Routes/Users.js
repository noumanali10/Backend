const express = require("express");
const router = express.Router();

const User = require("../Models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Create a new user
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, Password } = req.body;
    console.log(Password);
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Create a new user object
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Save the new user to the database
      await newUser.save();

      // Send the saved user object as a response
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    } else {
      // Check if the password is correct
      const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      } else {
        // Create a JWT token
        const token = jwt.sign(
          { email: existingUser.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Send the token as a response
        res.status(200).json({ token });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
