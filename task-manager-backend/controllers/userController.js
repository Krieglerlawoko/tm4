const User = require('../models/userModel');
const path = require('path');

// Controller to delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller to handle profile picture upload
const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle file upload if a file is received
    if (req.file) {
      // Store the file path in the user model (you may need to adjust this depending on your setup)
      user.profilePicture = path.join('uploads', req.file.filename);
      await user.save();
    }

    return res.status(200).json({ message: 'Profile picture updated', profilePicture: user.profilePicture });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { deleteUser, uploadProfilePicture };
