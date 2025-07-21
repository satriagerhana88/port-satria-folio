// controllers/courseController.js
const pool = require('../db');

// GET all courses
exports.getAllCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM course ORDER BY start_date DESC');
    const withCerts = await Promise.all(
      result.rows.map(async (course) => {
        const certs = await pool.query(
          'SELECT id, file_url FROM course_certificates WHERE course_id = $1',
          [course.id]
        );
        return { ...course, certificates: certs.rows };
      })
    );
    res.json(withCerts);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil course' });
  }
};

// GET by ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await pool.query('SELECT * FROM course WHERE id = $1', [id]);
    if (course.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    const certs = await pool.query('SELECT id, file_url FROM course_certificates WHERE course_id = $1', [id]);
    res.json({ ...course.rows[0], certificates: certs.rows });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
};

// CREATE
exports.createCourse = async (req, res) => {
  const { title, provider, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO course (title, provider, start_date, end_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, provider, start_date, end_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan course' });
  }
};

// UPDATE
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, provider, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE course SET title = $1, provider = $2, start_date = $3, end_date = $4
       WHERE id = $5 RETURNING *`,
      [title, provider, start_date, end_date, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update course' });
  }
};


// UPDATE
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, provider, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE course SET name = $1, provider = $2, start_date = $3, end_date = $4
       WHERE id = $5 RETURNING *`,
      [name, provider, start_date, end_date, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update course' });
  }
};

// DELETE
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM course_certificates WHERE course_id = $1', [id]);
    const result = await pool.query('DELETE FROM course WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal hapus course' });
  }
};

// ADD certificates
exports.addCertificates = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await pool.query('SELECT * FROM course WHERE id = $1', [id]);
    if (course.rows.length === 0) return res.status(404).json({ error: 'Course tidak ditemukan' });

    const filePaths = req.files.map(file => `/uploads/course/${file.filename}`);
    const insertValues = filePaths.map(path => `(${id}, '${path}')`).join(', ');

    const result = await pool.query(`
      INSERT INTO course_certificates (course_id, file_url)
      VALUES ${insertValues}
      RETURNING *;
    `);

    res.status(201).json(result.rows);
  } catch (err) {
    console.error('Upload Certificate Error:', err);
    res.status(500).json({ error: 'Gagal menambahkan sertifikat course' });
  }
};
