const pool = require('../db');
const { format } = require('date-fns');
const { id: localeId } = require('date-fns/locale');

// GET all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experience ORDER BY start_date DESC');
    const withCertificates = await Promise.all(result.rows.map(async (exp) => {
      const certs = await pool.query(
        'SELECT id, file_url FROM experience_certificates WHERE experience_id = $1',
        [exp.id]
      );
      return {
        ...exp,
        start_date: format(new Date(exp.start_date), 'd MMMM yyyy', { locale: localeId }),
        end_date: exp.end_date ? format(new Date(exp.end_date), 'd MMMM yyyy', { locale: localeId }) : null,
        certificates: certs.rows
      };
    }));
    res.json(withCertificates);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data experience' });
  }
};


// GET by ID
exports.getExperienceById = async (req, res) => {
  const { id } = req.params;
  try {
    const exp = await pool.query('SELECT * FROM experience WHERE id = $1', [id]);
    if (exp.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    const data = exp.rows[0];
    const formatted = {
      ...data,
      start_date: format(new Date(data.start_date), 'd MMMM yyyy', { locale: localeId }),
      end_date: data.end_date ? format(new Date(data.end_date), 'd MMMM yyyy', { locale: localeId }) : null
    };

    const certs = await pool.query(
      'SELECT id, file_url FROM experience_certificates WHERE experience_id = $1',
      [id]
    );

    res.json({ ...formatted, certificates: certs.rows });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil detail experience' });
  }
};


// CREATE
exports.createExperience = async (req, res) => {
  const { position, company, location, start_date, end_date, description } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO experience (position, company, location, start_date, end_date, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [position, company, location, start_date, end_date, description]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menambahkan experience' });
  }
};

// UPDATE
exports.updateExperience = async (req, res) => {
  const { id } = req.params;
  const { position, company, location, start_date, end_date, description } = req.body;
  try {
    const result = await pool.query(`
      UPDATE experience
      SET position = $1, company = $2, location = $3, start_date = $4, end_date = $5, description = $6
      WHERE id = $7
      RETURNING *
    `, [position, company, location, start_date, end_date, description, id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update experience' });
  }
};

// DELETE
exports.deleteExperience = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM experience_certificates WHERE experience_id = $1', [id]);
    const result = await pool.query('DELETE FROM experience WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus experience' });
  }
};

// ADD certificates
exports.addCertificates = async (req, res) => {
  const { id } = req.params;
  try {
    const exp = await pool.query('SELECT * FROM experience WHERE id = $1', [id]);
    if (exp.rows.length === 0) return res.status(404).json({ error: 'Experience tidak ditemukan' });

    const filePaths = req.files.map(file => `/uploads/experience/${file.filename}`);
    const insertValues = filePaths.map(path => `(${id}, '${path}')`).join(', ');

    const result = await pool.query(`
      INSERT INTO experience_certificates (experience_id, file_url)
      VALUES ${insertValues}
      RETURNING *
    `);

    res.status(201).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal upload sertifikat pengalaman' });
  }
};
