// controllers/biodataController.js
const pool = require('../db');

const { format } = require('date-fns');
const { id } = require('date-fns/locale'); // untuk bahasa Indonesia

// Ambil biodata
exports.getBiodata = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM biodata LIMIT 1');
    let biodata = result.rows[0];

    if (biodata && biodata.date_of_birth) {
      // Format ke "04 Maret 1988"
      biodata.date_of_birth = format(new Date(biodata.date_of_birth), 'dd MMMM yyyy', { locale: id });
    }

    res.json(biodata);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Tambah biodata
exports.createBiodata = async (req, res) => {
  const {
    complete_name,
    nationality,
    address,
    phone_number,
    email,
    date_of_birth,
    description,
    photo_url
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO biodata (
        complete_name, nationality, address, phone_number, email,
        date_of_birth, description, photo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        complete_name,
        nationality,
        address,
        phone_number,
        email,
        date_of_birth,
        description,
        photo_url
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Gagal menyimpan biodata' });
  }
};

// Update biodata
exports.updateBiodata = async (req, res) => {
  const id = req.params.id;
  const {
    complete_name,
    job_title,
    location,
    address,
    phone_number,
    email,
    date_of_birth,
    description
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE biodata SET
        complete_name = $1,
        job_title = $2,
        location = $3,
        address = $4,
        phone_number = $5,
        email = $6,
        date_of_birth = $7,
        description = $8
      WHERE id = $9
      RETURNING *`,
      [complete_name, job_title, location, address, phone_number, email, date_of_birth, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal update biodata' });
  }
};

// Upload foto
exports.uploadPhoto = async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const photoUrl = `/uploads/biodata/${file.filename}`;

  try {
    await pool.query(
      'UPDATE biodata SET photo_url = $1 WHERE id = $2',
      [photoUrl, id]
    );
    res.json({ message: 'Photo uploaded', photo_url: photoUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};
