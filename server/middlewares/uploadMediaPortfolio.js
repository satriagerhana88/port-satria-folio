const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/portfolio/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `portfolio-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|mp4/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .mp4 allowed!'), false);
  }
};

const uploadMediaPortfolio = multer({ storage, fileFilter });
module.exports = uploadMediaPortfolio;
