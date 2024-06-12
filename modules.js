const fs = require("fs");
const mysql = require("mysql");
const formidable = require("formidable");
const sess = require("./session");
const path = require("path");

// Function to establish a connection with the database
exports.connectDB = function() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "admin",
        database: "cookingPapa"
    });
}

// Function to handle user login
exports.loginUser = function(req, res, body, mySess, nav) { 
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if (err) throw err;
        var {useremail, password} = fields;

        var con = exports.connectDB();

        con.connect(function(err) {
            if (err) throw err;

            // Check if user is in users table
            con.query("SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?", [useremail, useremail, password], function(err, result) {
                if (err) throw err;
    
                if (result !== undefined && result.length > 0) {
                    // User is in users table
                    nav(res);
                } else {
                    // User is not in users table
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: "Email/username or password is wrong."})); 
                }
            });
        });
    });
}

// Function to handle user registration
exports.registerUser = function(req, res) {
    var con = exports.connectDB();
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields) {
        if (err) throw err;
        
        var {fname, lname, username, email, password} = fields;

        // Check if email or username already in use
        con.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username], function(err, result) {
            if (err) throw err;

            if (result.length > 0) {
                // User already exists
                res.writeHead(401, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: "User already exists."})); 
            } else {
                // Insert new user into users table
                con.query("INSERT INTO users (fname, lname, username, email, password) VALUES (?, ?, ?, ?, ?)", [fname, lname, username, email, password], function(err, result) {
                    if (err) throw err;
                    res.writeHead(302, { 'Location': '/recipes.html' }); // Redirect to recipes page
                    console.log("User " + username + " registered.")
                    res.end();
                });
            }
        });
    });
}

// Function to serve static files

// Navigation functions
exports.navHome = function(req, res) {
    if (req.url.endsWith('.css')) {
        fs.readFile("style.css", function (err, data) {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/css" });
            res.end(data, "utf-8");
        });
    } else {
        fs.readFile("index.html", function (err, data) {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/html" });
            res.end(data, "utf-8");
        });
    }
};

exports.navLogin = function(req, res) {
    if (req.url.endsWith('.css')) {
        fs.readFile("style.css", function (err, data) {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/css" });
            res.end(data, "utf-8");
        });
    } else {
        fs.readFile("login.html", function (err, data) {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/html" });
            res.end(data, "utf-8");
        });
    }
};

exports.navRecipes = function(req, res) {
    if (req.url.endsWith('.css')) {
        fs.readFile("erm.css", function (err, data) { // change css to actual css filename
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/css" });
            res.end(data, "utf-8");
        });
    } else {
        fs.readFile("recipes.html", function (err, data) {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/html" });
            res.end(data, "utf-8");
        });
    }
};

exports.navSearch = function(req, res) {
    if (req.url.endsWith('.css')) {
        fs.readFile("erm.css", function (err, data) { // change css to actual css filename
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/css" });
            res.end(data, "utf-8");
        });
    } else {
        fs.readFile("search.html", function (err, data) {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': "text/html" });
            res.end(data, "utf-8");
        });
    }
};