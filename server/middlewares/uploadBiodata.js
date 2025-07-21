const multer = require('multer');
const path = require('path');

// Set penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/biodata/'); // folder tujuan
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `photo-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Filter tipe file
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
