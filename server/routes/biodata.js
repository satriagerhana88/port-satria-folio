const express = require('express');
const router = express.Router();
const biodataController = require('../controllers/biodataController');
const uploadBiodata = require('../middlewares/uploadBiodata');

// Endpoint existing
router.get('/', biodataController.getBiodata);
router.post('/', biodataController.createBiodata);
router.put('/:id', biodataController.updateBiodata);

// ✅ Endpoint baru untuk upload foto
router.post('/:id/photo', uploadBiodata.single('photo'), biodataController.uploadPhoto);

module.exports = router;
