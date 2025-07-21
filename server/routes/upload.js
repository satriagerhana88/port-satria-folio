// const express = require('express');
// const router = express.Router();

// const uploadBiodata = require('../middlewares/uploadBiodata');
// const uploadMediaPortfolio = require('../middlewares/uploadMediaPortfolio');

// // Upload foto untuk biodata (single)
// router.post('/biodata', uploadBiodata.single('file'), (req, res) => {
//   res.json({ filePath: `/uploads/biodata/${req.file.filename}` });
// });

// // Upload media portfolio (multiple)
// router.post('/portfolio/media', uploadMediaPortfolio.array('files', 10), (req, res) => {
//   const filePaths = req.files.map(file => `/uploads/portfolio/${file.filename}`);
//   res.json({ filePaths });
// });

// module.exports = router;
