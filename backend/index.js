const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');

require('dotenv').config();
require('./Models/db');




const PORT = process.env.PORT || 8080; 
app.get('/ping', (req, res)=>{
    res.send('True');
})

app.use(bodyParser.json());
app.use(cors()); //// Enable CORS (allow cross-origin requests)
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads
app.use('/auth', AuthRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.listen(PORT, ()=> {
    console.log(`server is runing on ${PORT}`);
})