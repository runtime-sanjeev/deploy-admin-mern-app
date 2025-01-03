const joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(4).max(10).required().messages({
            'string.base': 'Name must be a string',
            'string.min': 'Name should have a minimum length of 4 characters',
            'string.max': 'Name should have a maximum length of 10 characters',
            'any.required': 'Name is required'
        }),
        email: joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: joi.string().min(5).max(20).required().messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password should have a minimum length of 5 characters',
            'string.max': 'Password should have a maximum length of 20 characters',
            'any.required': 'Password is required'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation Error', error: error });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: joi.string().min(5).max(20).required().messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password should have a minimum length of 5 characters',
            'string.max': 'Password should have a maximum length of 20 characters',
            'any.required': 'Password is required'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        // console.log(error);
        return res.status(400).json({ message: 'Validation Error', error: error });
    }
    next();
};

// const regnValidation = (req, res, next) => {
//     const schema = joi.object({
//         name: joi.string().min(4).max(50).required().messages({
//             'string.base': 'Name must be a string',
//             'string.min': 'Name should have a minimum length of 4 characters',
//             'string.max': 'Name should have a maximum length of 10 characters',
//             'any.required': 'Name is required'
//         }),
//         fname: joi.string().min(5).max(50).required().messages({
//             'string.base': 'Father name must be a string',
//             'string.min': 'Father name should have a minimum length of 5 characters',
//             'string.max': 'Father name should have a maximum length of 20 characters',
//             'any.required': 'Father name is required'
//         }),
//         mname: joi.string().min(5).max(50).required().messages({
//             'string.base': 'Mother name must be a string',
//             'string.min': 'Mother name should have a minimum length of 5 characters',
//             'string.max': 'Mother name should have a maximum length of 20 characters',
//             'any.required': 'Mother name is required'
//         }),
//         mobile: joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
//             'string.base': 'Mobile number must be a string',
//             'string.length': 'Mobile number should have exactly 10 digits',
//             'string.pattern.base': 'Mobile number must only contain digits',
//             'any.required': 'Mobile number is required'
//         }),
//         email: joi.string().email().required().messages({
//             'string.email': 'Please provide a valid email address',
//             'any.required': 'Email is required'
//         }),
//         sid: joi.string().min(3).required().messages({
//             'string.base': 'Sid must be a string',
//             'string.min': 'Sid should have a minimum length of 3 characters',
//             'any.required': 'Sid is required'
//         }),
//         file: joi.string().min(3).max(30).required().messages({
//             'any.required': 'Document is required'
//         }),
//     });
  
//     const { error } = schema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: 'Validation Error', error: error });
//     }
//     next();
// };


module.exports = {
    signupValidation,
    loginValidation
};
