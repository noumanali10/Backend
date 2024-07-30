const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

schema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id.toString(), name: this.name }, process.env.JWT_SECRET);
  // console.log(token); // Logging the token here for debugging purposes
  return token;
};

const Users = mongoose.model("User", schema);

module.exports = Users;
