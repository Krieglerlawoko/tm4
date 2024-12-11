const express = require('express');
const router = express.Router();
const { signUp, signIn, deleteUser } = require('../controllers/authController'); // Import deleteUser
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware

// Sign up route
router.post('/api/signup', signUp);

// Sign in route
router.post('/api/signin', signIn);

// Delete account route
router.delete('/api/delete-account', authMiddleware, deleteUser); // Protect the route and attach the handler

// Export the router
module.exports = router;
