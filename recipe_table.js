const mysql = require('mysql');
const multer = require('multer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS cookingpapa", function (err, result) {
        if (err) throw err;
        console.log("Database 'cookingpapa' created or already exists");
    });

    con.query("USE cookingpapa", function (err, result) {
        if (err) throw err;
        console.log("Using database 'cookingpapa'");
    });

    var tablesql = "CREATE TABLE IF NOT EXISTS recipes (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), ingredients VARCHAR(255), instructions VARCHAR(1000), imageurl VARCHAR(255))";
    con.query(tablesql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname)); // current directory

app.post('/upload', upload.single('recipeImage'), (req, res) => {
    const { name, ingredients, instructions } = req.body;
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

    // Insert into MySQL database
    const sql = 'INSERT INTO recipes (name, ingredients, instructions, imageurl) VALUES (?, ?, ?, ?)';
    const values = [name, ingredients, instructions, imageurl];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting recipe into MySQL:', err);
            res.json({ success: false, message: 'Failed to upload recipe' });
        } else {
            console.log('Recipe inserted into MySQL');
            res.json({ success: true, message: 'Recipe uploaded successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });