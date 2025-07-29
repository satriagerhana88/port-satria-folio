const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ==========================
// LOGIN
// ==========================
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (!admin) return res.status(401).json({ error: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Password salah' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      'SECRET_KEY', // ganti dengan .env
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal login' });
  }
};

// ==========================
// UPDATE ADMIN (dengan token)
// ==========================
exports.updateAdmin = async (req, res) => {
  const { username, password } = req.body;
  const adminId = req.user.id; // dari verifyToken middleware

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    if (!username && !hashedPassword) {
      return res.status(400).json({ message: 'Tidak ada data yang diubah' });
    }

    const updates = [];
    const values = [];

    if (username) {
      updates.push(`username = $${updates.length + 1}`);
      values.push(username);
    }

    if (hashedPassword) {
      updates.push(`password = $${updates.length + 1}`);
      values.push(hashedPassword);
    }

    // Tambahkan ID sebagai parameter terakhir
    values.push(adminId);

    const query = `UPDATE admins SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING username`;
    const result = await pool.query(query, values);

    res.json({ message: 'Berhasil diupdate', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal update data admin' });
  }
};

// ==========================
// LOGOUT (opsional, bisa dummy)
// ==========================
exports.logoutAdmin = (req, res) => {
  // Logout cukup hapus token di frontend
  res.json({ message: 'Berhasil logout (hapus token di client)' });
};


// 

exports.resetPasswordManual = async (req, res) => {
  const { resetCode, newPassword } = req.body;

  try {
    if (resetCode !== process.env.RESET_CODE) {
      return res.status(403).json({ message: 'Kode rahasia salah!' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const update = await pool.query('UPDATE admins SET password = $1 WHERE username = $2', [hashed, 'admin']);

    if (update.rowCount === 0) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    res.json({ message: 'Password berhasil direset. Silakan login dengan password baru.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mereset password' });
  }
};
