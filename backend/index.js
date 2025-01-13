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
app.use(cors({
    origin: 'https://deploy-admin-mern-app-frontend.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
})); //// Enable CORS (allow cross-origin requests)
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads
app.use('/auth', AuthRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));
// // Serve files from `/tmp/document` directory
// app.use('/public/document', express.static('/tmp/document'));

// // Serve files from `/tmp/photo` directory
// app.use('/public/photo', express.static('/tmp/photo'));

// Dynamic routes to serve `/tmp` files
app.get('/public/document/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join('/tmp/document', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }
    res.sendFile(filePath);
});

app.get('/public/photo/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join('/tmp/photo', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }
    res.sendFile(filePath);
});
app.listen(PORT, ()=> {
    console.log(`server is runing on ${PORT}`);
})