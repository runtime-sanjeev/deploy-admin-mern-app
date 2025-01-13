const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'resume' ? '/tmp/document/' : '/tmp/photo/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


// Initialize multer with storage configuration
const upload = multer({ storage: storage }).fields([
  { name: 'resume', maxCount: 1 },  // Document file
  { name: 'photo', maxCount: 1 }  // Profile photo
]);

module.exports = upload;

