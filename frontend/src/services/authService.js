const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controllers/authController'); // Import controller functions

// Sign up route
router.post('/api/signup', signUp); // Ensure the route includes '/api'

// Sign in route
router.post('/api/signin', signIn); // Ensure the route includes '/api'

// Export the router
module.exports = router;
