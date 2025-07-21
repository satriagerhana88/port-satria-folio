const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const uploadMediaPortfolio = require('../middlewares/uploadMediaPortfolio');

// GET semua portfolio
router.get('/', portfolioController.getAllPortfolio);

// GET portfolio by ID
router.get('/:id', portfolioController.getPortfolioById);

// POST buat portfolio baru
router.post('/', portfolioController.createPortfolio);

// POST upload media untuk portfolio tertentu
router.post('/:id/media', uploadMediaPortfolio.array('files', 10), portfolioController.addMediaToPortfolio);

// PATCH update portfolio
router.patch('/:id', portfolioController.updatePortfolio);

// DELETE portfolio
router.delete('/:id', portfolioController.deletePortfolio);

// DELETE media
router.delete('/:portfolioId/media/:mediaId', portfolioController.deleteMedia);


module.exports = router;
