const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// === SKILLS ===

// GET all skills by category
router.get('/skills', skillController.getAllSkills);

// POST new category with list of skills
router.post('/skills', skillController.createSkillCategoryWithSkills);

// UPDATE skill category name
router.put('/skill-categories/:id', skillController.updateSkillCategory);

// DELETE skill category and all its skills
router.delete('/skill-categories/:id', skillController.deleteSkillCategory);

// UPDATE individual skill
router.put('/skills/:id', skillController.updateSkill);

// DELETE individual skill
router.delete('/skills/:id', skillController.deleteSkill);


// === LANGUAGES ===

// GET all languages
router.get('/languages', skillController.getAllLanguages);

// POST new language
router.post('/languages', skillController.createLanguage);

// UPDATE language
router.put('/languages/:id', skillController.updateLanguage);

// DELETE language
router.delete('/languages/:id', skillController.deleteLanguage);


// === COMBINED ===

// GET combined skills and languages
router.get('/skills-languages', skillController.getSkillsAndLanguages);

module.exports = router;
