const fs = require('fs');
const path = require('path');
const pool = require('../db');

// GET semua portfolio + media
exports.getAllPortfolio = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
        COALESCE(json_agg(pm.media_url) FILTER (WHERE pm.id IS NOT NULL), '[]') AS media
      FROM portfolio p
      LEFT JOIN portfolio_media pm ON p.id = pm.portfolio_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('GET Error:', err.message);
    res.status(500).json({ error: 'Gagal mengambil data portfolio' });
  }
};

// Ambil portfolio berdasarkan ID
exports.getPortfolioById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT p.*, 
        COALESCE(json_agg(pm.media_url) FILTER (WHERE pm.id IS NOT NULL), '[]') AS media
      FROM portfolio p
      LEFT JOIN portfolio_media pm ON p.id = pm.portfolio_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Gagal mengambil data portfolio' });
  }
};


// POST buat portfolio baru
exports.createPortfolio = async (req, res) => {
  const {
    thumbnail,
    title,
    description,
    type,
    role,
    url,
    start_date,
    end_date
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO portfolio 
        (thumbnail, title, description, type, role, url, start_date, end_date)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [thumbnail, title, description, type, role, url, start_date, end_date]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Gagal membuat portfolio' });
  }
};

// POST media ke portfolio tertentu
exports.addMediaToPortfolio = async (req, res) => {
  const { id } = req.params;
  const filePaths = req.files.map(file => `/uploads/portfolio/${file.filename}`);

  try {
    const values = filePaths.map(url => `(${id}, '${url}')`).join(', ');
    const result = await pool.query(`
      INSERT INTO portfolio_media (portfolio_id, media_url)
      VALUES ${values}
      RETURNING *
    `);
    res.status(201).json(result.rows);
  } catch (err) {
    console.error('Media Error:', err.message);
    res.status(500).json({ error: 'Gagal menambahkan media' });
  }
};


// ✅ PATCH update portfolio tertentu (hanya field yang dikirim)
exports.updatePortfolio = async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID tidak ditemukan' });
  }

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return res.status(400).json({ error: 'Tidak ada data untuk diupdate' });
  }

  try {
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(fields);

    const result = await pool.query(
      `UPDATE portfolio SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Portfolio tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ error: 'Gagal update portfolio' });
  }
};


// ✅ DELETE portfolio dan semua medianya
exports.deletePortfolio = async (req, res) => {
  const { id } = req.params;

  try {
    // Hapus media terkait dulu
    await pool.query(`DELETE FROM portfolio_media WHERE portfolio_id = $1`, [id]);

    // Lalu hapus portfolio-nya
    const result = await pool.query(`DELETE FROM portfolio WHERE id = $1 RETURNING *`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Portfolio tidak ditemukan' });
    }

    res.json({ message: 'Portfolio berhasil dihapus', deleted: result.rows[0] });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ error: 'Gagal menghapus portfolio' });
  }
};


// ✅ DELETE media
exports.deleteMedia = async (req, res) => {
  const { portfolioId, mediaId } = req.params;

  try {
    // 1. Ambil media_url dari DB
    const mediaRes = await pool.query(
      'SELECT media_url FROM portfolio_media WHERE id = $1 AND portfolio_id = $2',
      [mediaId, portfolioId]
    );

    if (mediaRes.rows.length === 0) {
      return res.status(404).json({ error: 'Media tidak ditemukan' });
    }

    const mediaUrl = mediaRes.rows[0].media_url;
    const filePath = path.join(__dirname, '..', mediaUrl);

    // 2. Hapus dari filesystem (jika file ada)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 3. Hapus dari DB
    await pool.query('DELETE FROM portfolio_media WHERE id = $1', [mediaId]);

    res.json({ success: true, message: 'Media berhasil dihapus' });
  } catch (err) {
    console.error('Delete media error:', err);
    res.status(500).json({ error: 'Gagal menghapus media' });
  }
};
