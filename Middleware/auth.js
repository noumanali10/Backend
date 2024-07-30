// auth.js
const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied. No token provided.');

  try {
    console.log('Token:', token);
    console.log("tokken not problem");
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid Token');
  }
};


module.exports = { isAuthenticated };
