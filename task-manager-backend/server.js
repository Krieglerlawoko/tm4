const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.log(err));