// routes/course.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const uploadCourseCertificate = require('../middlewares/uploadCourseCertificate');

// GET all
router.get('/', courseController.getAllCourses);

// GET by ID
router.get('/:id', courseController.getCourseById);

// CREATE course (tanpa sertifikat)
router.post('/', courseController.createCourse);

// UPDATE course
router.put('/:id', courseController.updateCourse);

// DELETE course
router.delete('/:id', courseController.deleteCourse);

// Upload sertifikat (multi-file)
router.post(
  '/:id/certificates',
  uploadCourseCertificate.array('certificates', 10),
  courseController.addCertificates
);

module.exports = router;
