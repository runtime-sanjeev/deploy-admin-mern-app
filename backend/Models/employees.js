const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const formSchema = new Schema({
    personalDetails: {
        name: String,
        fatherName: String,
        motherName: String,
        age: Number,
        gender: String,
    },
    communicationDetails: {
        address: String,
        state: String,
        city: String,
        pincode: String,
        mobile: String,
    },
    educationDetails: {
        secondary: String,
        intermediate: String,
        graduation: String,
        postGraduation: String,
    },
    professionalDetails: {
        currentJob: String,
        photo: String, // Store file path
        resume: String, // Store file path
    },
    createAt: { type: Date, default: Date.now },
});

// Model
const EmpFormData = mongoose.model('employees', formSchema);
module.exports = EmpFormData;