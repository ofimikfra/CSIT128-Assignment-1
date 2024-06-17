const express = require('express'); 
const multer = require('multer'); 
const path = require('path'); 

const app = express(); 
const port = 3000; 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('recipeFile'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: 'No file uploaded.' }); 
    }

    res.json({ success: true, message: 'File uploaded successfully.' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
