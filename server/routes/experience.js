const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const uploadExperienceCertificate = require('../middlewares/uploadExperienceCertificate');

router.get('/', experienceController.getAllExperiences);
router.get('/:id', experienceController.getExperienceById);
router.post('/', experienceController.createExperience);
router.put('/:id', experienceController.updateExperience);
router.delete('/:id', experienceController.deleteExperience);

// Upload sertifikat paklaring (multi-file)
router.post('/:id/certificates', uploadExperienceCertificate.array('certificates', 10), experienceController.addCertificates);

module.exports = router;
