const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user name required'],
  },
  email: {
    type: String,
    required: [true, 'user email required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          'Password must contain at least one letter and one number',
        );
      }
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This will onlyt work on create and save
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // only runs if password was modified
  if (!this.isModified('password')) return next();
  // hash the password with cost 12 (computer power intensiveness)
  this.password = await bcrypt.hash(this.password, 12);

  // delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(changedTimestamp, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
