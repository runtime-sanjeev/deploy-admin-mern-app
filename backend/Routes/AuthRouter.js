const { signup, login, registration, employee, editemployee, updateemployee } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const uploadFiles = require('../Controllers/upload'); // Import the upload middleware
const router = require('express').Router();

// Signup route: Validate input and call the signup controller
router.post('/signup', signupValidation, signup);

// Login route: Validate input and call the login controller
router.post('/login', loginValidation, login);

// Registration route: Handle employee registration with file upload
router.post('/registration', uploadFiles, registration);

// Employee route: Get employee data (use GET instead of POST)
router.get('/employee', employee);  // Use GET instead of POST

// Edit Employee route: Post employee data 
router.post('/editemployee', editemployee);  

// Edit Employee route: Post employee data 
router.post('/updateemployee', updateemployee);  

module.exports = router;
