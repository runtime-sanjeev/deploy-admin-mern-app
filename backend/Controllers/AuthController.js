const UserModel = require('../Models/User')
const RegistrationModel = require('../Models/Registration')
const EmpData = require('../Models/employees')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const validator = require('validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const upload = require('./upload');

/* Login */

const login = async (req, res) => {
  const errMsg = "Email or Password is not matching, Please try again !";    // console.log(req);
  try {
    // const  { name, email, password, recaptchaToken  } = req.body; 
    const { email, password } = req.body;
    //  console.log(email);
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(403).json({
        message: 'Email is not matching, Please try again !', success: false
      })
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: 'Password is not matching, Please try again !', success: false
      })
    }
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    )
    res.status(201).json({ message: 'login success', success: true, jwtToken, name: user.name, id: user._id });
  } catch (err) {
    res.status(500).json({ message: 'something went wrong', success: false });
  }
}

const signup = async (req, res) => {
  try {
    const { name, email, password, encrypt_pass } = req.body;

    // Check if email format is valid
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format', success: false });
    }

    /// Enforce password strength (min 6 characters, 1 uppercase, 1 number)
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long, contain at least one uppercase letter and one number.',
        success: false
      });
    }
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists.',
        success: false
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({ name, email, password: hashedPassword });
    newUser.encrypt_pass = UserModel.password;
    await newUser.save();
    // Send response
    res.status(201).json({
      message: 'Admin user added on the portal to login.',
      success: true
    });

  } catch (err) {
    console.error('Adding user error:', err);
    res.status(500).json({
      message: 'Admin not added. Please try again later.',
      success: false
    });

  }
}


/* Registration */

const registration = async (req, res) => {
  //  console.log(req.body);
  try {
    const { name, empname, fname, mname, mobile, sid, sex, city, state, dob } = req.body;
    // const file = req.file; 
    const file = req.files?.file ? req.files.file[0] : null;
    // const photo = req.photo; 
    const photo = req.files?.photo ? req.files.photo[0] : null;


    if (!file) {
      return res.status(400).json({ message: 'No file uploaded', success: false });
    }
    if (!photo) {
      return res.status(400).json({ message: 'No Image uploaded', success: false });
    }
    const regnModel = new RegistrationModel({
      empname, fname, mname, mobile, sex, city, state, dob, file: file.filename,
      photo: photo.filename, name, sid
    });
    // console.log(regnModel);      
    await regnModel.save();
    res.status(201).json({ message: 'Employee Record Added', success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add record, Plese try again', success: false });
  }
}


const employee = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of records to skip  
    //   const regnModels = new RegistrationModel();
    //   console.log(regnModels);
    const data = await EmpData.find().skip(skip).limit(Number(limit)); // Fetch with pagination  
    // debugger;
    // If no data found, return an empty array (still 200 OK)
    if (data.length === 0) {
      return res.status(200).json([]);
    }
    res.json(data); // Send the data as the response
    //   console.log('Employee Data:', data);  
  } catch (err) {
    console.error('Error fetching data from Database:', err);
    res.status(500).json({ message: 'Error fetching data from Database', error: err.message });
  }
};
const editemployee = async (req, res) => {
  try {
    const { id } = req.body; // Assuming the employee ID is sent in the request body  
    if (!id) {
      return res.status(400).json({ message: 'ID is required' }); // Check if ID is provided
    }
    // Find the employee by ID
    const data = await EmpData.findById(id);
    if (!data) {
      return res.status(404).json({ message: 'Employee not found' }); // Return a not found message if no data is found
    }
    res.json(data); // Return the found data as a response
    //   console.log('Employee Data:', data); // Log the data for debugging
  } catch (error) {
    console.error('Error fetching data from Database:', error);
    res.status(500).json({ message: 'Error fetching data from Database', error: error.message }); // Fix error handling
  }
};

/* Registration */

const updateemployee = async (req, res) => {
  try {
    const employeeId = req.body.id; // Get employee ID from the request params

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required', success: false });
    }

    const { personalDetails, communicationDetails, educationDetails, professionalDetails } = req.body;

    const photo = req.files['photo'] ? req.files['photo'][0] : null;
    const resume = req.files['resume'] ? req.files['resume'][0] : null;

    // Extract filenames from file paths
    const photoFileName = photo.filename; // Assuming 'filename' contains just the name
    const resumeFileName = resume.filename; // Assuming 'filename' contains just the name

    // Find the employee document
    const existingEmployee = await EmpData.findById(employeeId);
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found', success: false });
    }

    // Build the updated data object
    const updatedData = {
      ...(personalDetails && { personalDetails: JSON.parse(personalDetails) }),
      ...(communicationDetails && { communicationDetails: JSON.parse(communicationDetails) }),
      ...(educationDetails && { educationDetails: JSON.parse(educationDetails) }),
      professionalDetails: {
        ...existingEmployee.professionalDetails,
        ...(professionalDetails && JSON.parse(professionalDetails)),
        ...(photo && { photo: photoFileName }), // Save only the file path
        ...(resume && { resume: resumeFileName }), // Save only the file path
      },
    };

    const updatedEmployee = await EmpData.findByIdAndUpdate(
      employeeId,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      message: 'Employee data updated successfully',
      success: true,
      resdata: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating Employee data', error: error.message });
  }
};





// Form submission endpoint
const employees = async (req, res) => {
  try {
    // Extract form data and files
    const { personalDetails, communicationDetails, educationDetails, professionalDetails } = req.body;
    const photo = req.files?.['photo']?.[0];
    const resume = req.files?.['resume']?.[0];

    // Validate required files
    if (!photo && !resume) {
      return res.status(400).json({ message: 'Photo and Resume are required', success: false });
    }
    if (!photo) {
      return res.status(400).json({ message: 'Photo is required', success: false });
    }
    if (!resume) {
      return res.status(400).json({ message: 'Resume is required', success: false });
    }

    // Parse JSON fields
    let parsedPersonalDetails, parsedCommunicationDetails, parsedEducationDetails, parsedProfessionalDetails;
    try {
      parsedPersonalDetails = JSON.parse(personalDetails);
      parsedCommunicationDetails = JSON.parse(communicationDetails);
      parsedEducationDetails = JSON.parse(educationDetails);
      parsedProfessionalDetails = JSON.parse(professionalDetails);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON format in form data', success: false });
    }

    // Extract filenames from file paths
    const photoFileName = photo.filename; // Assuming 'filename' contains just the name
    const resumeFileName = resume.filename; // Assuming 'filename' contains just the name

    // Create new employee data
    const newFormData = new EmpData({
      personalDetails: parsedPersonalDetails,
      communicationDetails: parsedCommunicationDetails,
      educationDetails: parsedEducationDetails,
      professionalDetails: {
        ...parsedProfessionalDetails,
        photo: photoFileName, // Save only the file name
        resume: resumeFileName, // Save only the file name
      },
    });

    console.log(newFormData);

    // Save to MongoDB
    await newFormData.save();
    res.status(201).json({ message: 'Employee Form submitted successfully', success: true });
  } catch (error) {
    console.error('Error submitting employee data:', error);
    res.status(500).json({ message: 'Error submitting Employee data', error: error.message });
  }
};




// Export the function if needed
// module.exports = employees;

// Attach it to a route
// app.post('/api/forms', upload.fields([{ name: 'photo' }, { name: 'resume' }]), employees);


module.exports = {
  signup,
  login,
  registration,
  employee,
  editemployee,
  updateemployee,
  employees
}