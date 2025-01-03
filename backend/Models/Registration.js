// import { Schema, model } from 'mongoose';
const { number, required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
// Define the schema

const RegnSchema = new Schema({
    empname: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    mname: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    sid: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },

});
// Create the model based on the schema

const RegnModel = mongoose.model('registrations', RegnSchema);

// Export the model for use elsewhere
module.exports = RegnModel;
