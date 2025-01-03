const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
   
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const imageupload = multer({ storage: storage }).single('photo');
  // alert(imageupload);
  module.exports = imageupload;