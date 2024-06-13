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

exports.serve = function(res, path, contentType, responseCode = 200) {
    fs.readFile(path, function(err, data) {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("500 - Internal Error");
        } else {
            res.writeHead(responseCode, { "Content-Type": contentType });
            res.end(data);
        }
    });
}

// Function to handle user login
exports.loginUser = function(req, res) { 
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if (err) throw err;
        var { loguser, logpassword } = fields;

        var con = exports.connectDB();

        con.connect(function(err) {
            if (err) throw err;

            // Check if user is in users table
            con.query("SELECT * FROM users WHERE username = ? AND password = ?", [loguser, logpassword], function(err, result) {
                if (err) throw err;

                if (result && result.length > 0) {
                    // User is in users table
                    sess.setSession(req, result[0].username); // Create session
                    res.writeHead(302, {"Location": "/recipes.html"});
                    res.end();
                } else {
                    // User is not in users table
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "ⓘ Username/email or password is incorrect." }));
                }
                con.end(); // Close the connection
            });
        });
    });
}

// Function to handle user registration
exports.registerUser = function(req, res) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields) {
        if (err) throw err;
        
        var { fname, lname, username, email, password } = fields;
        var con = exports.connectDB();

        con.connect(function(err) {
            if (err) throw err;

            // Check if email or username already in use
            con.query("SELECT * FROM users WHERE username = ?", [username], function(err, result) {
                if (err) throw err;

                if (result.length > 0) {
                    // User already exists
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "ⓘ Username is already taken." }));
                } else {
                    con.query("SELECT * FROM users WHERE email = ?", [email], function(err, result) {
                        if (err) throw err;
        
                        if (result.length > 0) {
                            // User already exists
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ success: false, message: "ⓘ Email is already being used." }));
                        } else {
                            // Insert new user into users table
                            con.query("INSERT INTO users (fname, lname, username, email, password) VALUES (?, ?, ?, ?, ?)", [fname, lname, username, email, password], function(err, result) {
                                if (err) throw err;
                                console.log("User " + username + " successfully registered.")
                                res.writeHead(302, {"Location": "/recipes.html"});
                                sess.setSession(req, username); // Create session
                                res.end();
                                con.end(); // Close the connection
                            });
                        }
                    });
                }
            });
        });
    });
}