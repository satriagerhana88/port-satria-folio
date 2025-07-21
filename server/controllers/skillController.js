const pool = require('../db');


// ============================
// ==== SKILL SECTION ========
// ============================

// ✅ GET all skill categories and their skills
exports.getAllSkills = async (req, res) => {
  try {
    const categoriesResult = await pool.query('SELECT * FROM skill_categories');
    const categories = categoriesResult.rows;

    const skillData = await Promise.all(
      categories.map(async (cat) => {
        const skills = await pool.query(
          'SELECT id, name FROM skills WHERE category_id = $1',
          [cat.id]
        );
        return {
          category: cat.name,
          skills: skills.rows
        };
      })
    );

    res.json(skillData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data skills' });
  }
};

// ✅ CREATE skill category & skills list
exports.createSkillCategoryWithSkills = async (req, res) => {
  const { category, skills } = req.body;
  if (!category || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'Kategori dan daftar skill dibutuhkan' });
  }

  try {
    const catResult = await pool.query(
      'INSERT INTO skill_categories (name) VALUES ($1) RETURNING *',
      [category]
    );
    const categoryId = catResult.rows[0].id;

    const insertValues = skills.map(skill => `(${categoryId}, '${skill}')`).join(', ');
    await pool.query(`INSERT INTO skills (category_id, name) VALUES ${insertValues}`);

    res.status(201).json({ message: 'Skill berhasil ditambahkan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menambahkan skill' });
  }
};

// ✅ UPDATE skill category name
exports.updateSkillCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  try {
    const result = await pool.query(
      `UPDATE skill_categories SET name = $1 WHERE id = $2 RETURNING *`,
      [category, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update kategori skill' });
  }
};

// ✅ DELETE skill category and its skills
exports.deleteSkillCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM skills WHERE category_id = $1`, [id]);
    const result = await pool.query(
      `DELETE FROM skill_categories WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });

    res.json({ message: 'Kategori dan skill terkait berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kategori skill' });
  }
};

// ✅ UPDATE single skill
exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      `UPDATE skills SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Skill tidak ditemukan' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update skill' });
  }
};

// ✅ DELETE single skill
exports.deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM skills WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Skill tidak ditemukan' });

    res.json({ message: 'Skill berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus skill' });
  }
};


// ============================
// ==== LANGUAGE SECTION =====
// ============================

// ✅ GET all languages
exports.getAllLanguages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM languages');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data bahasa' });
  }
};

// ✅ CREATE language
exports.createLanguage = async (req, res) => {
  const { name, proficiency } = req.body;
  if (!name || !proficiency) {
    return res.status(400).json({ error: 'Nama dan tingkat kemahiran dibutuhkan' });
  }

  try {
    await pool.query(
      'INSERT INTO languages (name, proficiency) VALUES ($1, $2)',
      [name, proficiency]
    );
    res.status(201).json({ message: 'Bahasa berhasil ditambahkan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menambahkan bahasa' });
  }
};

// ✅ UPDATE language
exports.updateLanguage = async (req, res) => {
  const { id } = req.params;
  const { name, proficiency } = req.body;
  try {
    const result = await pool.query(
      `UPDATE languages SET name = $1, proficiency = $2 WHERE id = $3 RETURNING *`,
      [name, proficiency, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Language tidak ditemukan' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update language' });
  }
};

// ✅ DELETE language
exports.deleteLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM languages WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Language tidak ditemukan' });

    res.json({ message: 'Language berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus language' });
  }
};


// ============================
// ==== COMBINED SECTION =====
// ============================

// ✅ GET combined skills + languages
exports.getSkillsAndLanguages = async (req, res) => {
  try {
    const categories = await pool.query(`SELECT * FROM skill_categories ORDER BY category`);

    const result = await Promise.all(
      categories.rows.map(async (cat) => {
        const skills = await pool.query(`SELECT id, name FROM skills WHERE category_id = $1`, [cat.id]);
        return {
          category: cat.category,
          skills: skills.rows
        };
      })
    );

    const languages = await pool.query(`SELECT id, name, proficiency FROM languages ORDER BY id`);

    res.json({
      skills: result,
      languages: languages.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data gabungan' });
  }
};
