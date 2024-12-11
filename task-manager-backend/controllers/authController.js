const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Where uploaded images are stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Sign Up
const signUp = async (req, res) => {
  const { username, password } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, profilePicture });

    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      profilePicture: newUser.profilePicture,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({ message: 'User created!', user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Sign In
const signIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture, // Send profile picture in response
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error signing in', error: err.message });
  }
};

// Upload Profile Picture
const uploadProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const filePath = req.file.path;

  try {
    await User.update({ profilePicture: filePath }, { where: { id: userId } });
    res.status(200).json({ message: 'Profile picture uploaded successfully!', filePath });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading profile picture', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Retrieve user ID from the token
    await User.destroy({ where: { id: userId } }); // Delete the user from DB
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};

module.exports = { signUp, signIn, uploadProfilePicture, deleteUser };
