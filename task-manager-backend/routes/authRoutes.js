const express = require('express');
const { signUp, signIn, uploadProfilePicture } = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Handle file uploads

const router = express.Router();

router.post('/signup', upload.single('profilePicture'), signUp); // Sign up with profile picture
router.post('/signin', signIn);
router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture); // Profile picture upload

module.exports = router;
