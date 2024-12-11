const express = require('express');
const { signUp, signIn, uploadProfilePicture, deleteUser } = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', upload.single('profilePicture'), signUp);
router.post('/signin', signIn);
router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture);
router.delete('/delete-account', authMiddleware, deleteUser);

module.exports = router;
