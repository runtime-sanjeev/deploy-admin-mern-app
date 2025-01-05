const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'file' ? 'public/document/' : 'public/photo/';
    fs.mkdirSync(dir, { recursive: true }); // Ensure directory exists
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = file.fieldname === 'file'
    ? ['application/pdf', 'application/msword']
    : ['image/jpeg', 'image/png', 'image/gif'];

  if (!allowedFileTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type for ${file.fieldname}`));
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]);

const uploadFiles = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = uploadFiles;
