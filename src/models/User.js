const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Do not return the password field by default when querying users
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  sessionToken: { 
    type: String,  // Field for session token
  },

  avatar: {
    type: String, // URL to the user's profile picture
    default: 'https://example.com/default-avatar.png',
  },
  bio: {
    type: String,
    maxlength: 500, // Limit bio to 500 characters
  },
  socialLinks: {
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },

  // Array of ObjectId references to posts made by the user
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }
  ],

  // Array of ObjectId references to the users that this user is following
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  // Array of ObjectId references to the users that follow this user
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  // Array of ObjectId references to the showcases created by the user (if the user is an athlete)
  showcases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showcase',
    }
  ],

  // Array of ObjectId references to the achievements of the user (if the user is an athlete)
  achievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
    }
  ],

  // Array of ObjectId references to the notifications for the user
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
    }
  ],

  // Array of ObjectId references to the teams that the user is a part of
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update the `updatedAt` field automatically
userSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
