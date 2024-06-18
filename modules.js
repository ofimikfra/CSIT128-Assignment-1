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

exports.loginUser = function(req, res) { 
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if (err) throw err;
        var { loguser, logpassword } = fields;

        var con = exports.connectDB();

        con.connect(function(err) {
            if (err) throw err;

            // Check if user is in users table
            con.query("SELECT * FROM users WHERE username =? AND password =?", [loguser, logpassword], function(err, result) {
                if (err) throw err;

                if (result && result.length > 0) {
                    // User is in users table
                    sess.setSession(req, result[0].username); // Create session
                    res.writeHead(302, {
                        "Location": "/recipes.html",
                        "Set-Cookie": `sessionID=${req.sessionID}; HttpOnly; Secure`
                    });
                    res.end();
                } else {
                    // User is not in users table
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Username/email or password is incorrect." }));
                }
                con.end(); // Close the connection
            });
        });
    });
}

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
                    res.end(JSON.stringify({ success: false, message: "Username is already taken." }));
                } else {
                    con.query("SELECT * FROM users WHERE email = ?", [email], function(err, result) {
                        if (err) throw err;
        
                        if (result.length > 0) {
                            // User already exists
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ success: false, message: "Email is already being used." }));
                        } else {
                            // Insert new user into users table
                            con.query("INSERT INTO users (fname, lname, username, email, password) VALUES (?, ?, ?, ?, ?)", [fname, lname, username, email, password], function(err, result) {
                            if (err) throw err;
                            console.log("User " + username + " signed up.");
                        
                            // Send a JSON response with a success message
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, message: "Successfully signed up! Please log in." }));
                        
                            con.end(); // Close the connection
                            });
                        }
                    });
                }
            });
        });
    });
}

exports.getRecipes = function(req, res) {
    const username = sess.getSession(req).userName; // Retrieve username from session
    const sql = `SELECT * FROM recipes WHERE creator = ?`;

    var con = exports.connectDB();
    con.connect(function(err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Database connection error." }));
            return;
        }

        con.query(sql, [username], function(err, rows) {
            con.end(); // Close the connection
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ recipes: rows }));
            }
        });
    });
}


// Function to search for recipes
exports.searchRecipe = function(req, res, searchTerm) {
    const con = exports.connectDB();
    const sql = `SELECT * FROM recipes WHERE name LIKE ? OR ingredients LIKE ?`;
    const queryTerm = `%${searchTerm}%`;

    con.connect(function(err) {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Database connection error.' }));
            return;
        }

        con.query(sql, [queryTerm, queryTerm], function(err, rows) {
            con.end(); // Close the connection
            if (err) {
                console.error('Error searching recipes:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ recipes: rows }));
            }
        });
    });
}

// Function to handle recipe upload
exports.uploadRecipe = function(req, res) {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/uploads');
    form.keepExtensions = true;

    form.parse(req, (err, fields) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Failed to upload recipe' }));
            return;
        }

        const { name, ingredients, instructions } = fields;
        // Assuming imageUrl is not handled here and handled elsewhere

        // Insert into MySQL database
        const con = connectDB();
        const sql = 'INSERT INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?)';
        const values = [name, ingredients, instructions];

        con.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Failed to upload recipe' }));
                return;
            }

            con.query(sql, values, (err) => {
                con.end(); // Close the connection
                if (err) {
                    console.error('Error inserting recipe into MySQL:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Failed to upload recipe' }));
                } else {
                    console.log('Recipe inserted into MySQL');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Recipe uploaded successfully' }));
                }
            });
        });
    });
}