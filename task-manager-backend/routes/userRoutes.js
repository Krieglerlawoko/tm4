const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { deleteUser, uploadProfilePicture } = require('../controllers/userController');
const multer = require('multer');

// Set up multer for handling profile picture uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// DELETE route for deleting a user
router.delete('/delete', protect, deleteUser);

// POST route for uploading a profile picture
router.post('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
