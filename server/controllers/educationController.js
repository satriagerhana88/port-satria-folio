const pool = require('../db');

// GET all
exports.getAllEducation = async (req, res) => {
  try {
    const eduResult = await pool.query('SELECT * FROM education ORDER BY start_date DESC');
    const withCertificates = await Promise.all(
      eduResult.rows.map(async (edu) => {
        const certs = await pool.query(
          'SELECT id, file_url FROM education_certificates WHERE education_id = $1',
          [edu.id]
        );
        return { ...edu, certificates: certs.rows };
      })
    );
    res.json(withCertificates);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data education' });
  }
};

// GET by ID
exports.getEducationById = async (req, res) => {
  const { id } = req.params;
  try {
    const edu = await pool.query('SELECT * FROM education WHERE id = $1', [id]);
    if (edu.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    const certs = await pool.query(
      'SELECT id, file_url FROM education_certificates WHERE education_id = $1',
      [id]
    );
    res.json({ ...edu.rows[0], certificates: certs.rows });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
};

// CREATE education
exports.createEducation = async (req, res) => {
  const { institution, degree, field_of_study, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO education (institution, degree, field_of_study, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [institution, degree, field_of_study, start_date, end_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menambahkan education' });
  }
};

// UPDATE education
exports.updateEducation = async (req, res) => {
  const { id } = req.params;
  const { institution, degree, field_of_study, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE education SET institution = $1, degree = $2, field_of_study = $3, start_date = $4, end_date = $5
       WHERE id = $6 RETURNING *`,
      [institution, degree, field_of_study, start_date, end_date, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update education' });
  }
};

// DELETE education + certificates
exports.deleteEducation = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM education_certificates WHERE education_id = $1', [id]);
    const result = await pool.query('DELETE FROM education WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal hapus education' });
  }
};

// ADD certificates (multi-file upload)
exports.addCertificates = async (req, res) => {
  const { id } = req.params;
  try {
    const edu = await pool.query('SELECT * FROM education WHERE id = $1', [id]);
    if (edu.rows.length === 0) return res.status(404).json({ error: 'Education tidak ditemukan' });

    const filePaths = req.files.map(file => `/uploads/education/${file.filename}`);
    const insertValues = filePaths.map(path => `(${id}, '${path}')`).join(', ');

    const result = await pool.query(
      `INSERT INTO education_certificates (education_id, file_url)
       VALUES ${insertValues} RETURNING *`
    );
    res.status(201).json(result.rows);
  } catch (err) {
    console.error('Upload Certificate Error:', err);
    res.status(500).json({ error: 'Gagal menambahkan sertifikat' });
  }
};
