const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controllers/authController');

// Sign up route
router.post('/api/signup', signUp);

// Sign in route
router.post('/api/signin', signIn);

// Export the router
module.exports = router;
