const UserModel = require('../Models/User')
const RegistrationModel = require('../Models/Registration')
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
        message: 'User already exists. You can log in instead.',
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
    const data = await RegistrationModel.find().skip(skip).limit(Number(limit)); // Fetch with pagination  
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
    const data = await RegistrationModel.findById(id);
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
  const { id, name, empname, fname, mname, mobile, sid, sex, city, state, dob } = req.body.updateInfo;
  // console.log(empname); 
  // Check if all required fields are provided
  if (!id || !empname || !fname || !mname || !mobile || !dob || !sex || !state || !city) {
    return res.status(400).json({
      message: 'All fields are required',
      success: false,
    });
  }
  try {
    // Find and update the user by their _id
    const updatedUser = await RegistrationModel.findByIdAndUpdate(
      id,
      { name, empname, fname, mname, mobile, sid, sex, city, state, dob }, // Fields to update
      { new: true } // This option returns the updated document
    );
    if (!updatedUser) {
      res.status(301).json({ message: 'Employee Record Not Updated', success: false });
    }
    res.status(200).json({ message: 'Employee Record Updated', success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update record, Plese try again', success: false });
  }
}

module.exports = {
  signup,
  login,
  registration,
  employee,
  editemployee,
  updateemployee
}