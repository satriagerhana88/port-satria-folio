const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const uploadEducationCertificate = require('../middlewares/uploadEducationCertificate');

// GET all education
router.get('/', educationController.getAllEducation);

// GET education by ID
router.get('/:id', educationController.getEducationById);

// CREATE education (tanpa file)
router.post('/', educationController.createEducation);

// UPDATE education
router.put('/:id', educationController.updateEducation);

// DELETE education
router.delete('/:id', educationController.deleteEducation);

// UPLOAD multiple certificates (form-data)
router.post(
  '/:id/certificates',
  uploadEducationCertificate.array('certificates', 10),
  educationController.addCertificates
);

module.exports = router;
