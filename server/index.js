// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); // koneksi ke database

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test koneksi DB
app.get('/api/portfolio-satriagerhana', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ connected: false, error: err.message });
}
});

// Routing untuk biodata
const biodataRoutes = require('./routes/biodata');
app.use('/api/biodata', biodataRoutes);
app.use('/uploads', express.static('uploads'));

// Routing untuk portfolio
const portfolioRoutes = require('./routes/portfolio');
app.use('/api/portfolio', portfolioRoutes);

// Routing untuk experience
const experienceRoutes = require('./routes/experience');
app.use('/api/experience', experienceRoutes);


// Routing untuk education
const educationRoutes = require('./routes/education');
app.use('/api/education', educationRoutes);


// Routing untuk course
const courseRoutes = require('./routes/course');
app.use('/api/course', courseRoutes);


// Routing untuk skill
const skillRoutes = require('./routes/skill');
app.use('/api', skillRoutes);









// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
