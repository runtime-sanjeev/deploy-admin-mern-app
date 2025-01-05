const multer = require('multer');
const fs = require('fs');
const path = require('path');

 
const storage = multer.diskStorage(
  {
  
  destination: (req, file, cb) => {
    // console.log(file);
    if(file.fieldname == 'file'){
      cb(null, 'https://github.com/runtime-sanjeev/deploy-admin-mern-app/tree/18b75708e3faa8a684b56be4f26d9506821a05be/backend/public/document/');  // Path where files are stored
    }else{
      cb(null, 'https://github.com/runtime-sanjeev/deploy-admin-mern-app/tree/18b75708e3faa8a684b56be4f26d9506821a05be/backend/public/photo/');  // Path where files are stored
    }
    
  },
  filename: (req, file, cb) => {
    // console.log(file);
    if(file.fieldname == 'file'){
      cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }else{
      cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }
    
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage }).fields([
  { name: 'file', maxCount: 1 },  // Document file
  { name: 'photo', maxCount: 1 }  // Profile photo
]);

module.exports = upload;
