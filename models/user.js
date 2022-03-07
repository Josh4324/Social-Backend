const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide Your first name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please provide Your last name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
    trim: true,
    select: false,
  },
  phoneNumber: {
    type: String,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  noOfFriends: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await argon2.verify(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
