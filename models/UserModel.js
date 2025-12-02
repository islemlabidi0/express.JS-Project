const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  login: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },
  
  role: {
    type: String,
    enum: ['user','manager'],
    required: true
  },

 
isActive: { type: Boolean, default: false },

  activationToken: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.createActivationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.activationToken = token;
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
