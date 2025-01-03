// import { Schema, model } from 'mongoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
// Define the schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});

// Create the model based on the schema
const UserModel = mongoose.model('users', UserSchema);

// Export the model for use elsewhere
module.exports = UserModel;
