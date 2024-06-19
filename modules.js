const fs = require("fs");
const mysql = require("mysql");
const formidable = require("formidable");
const sess = require("./session");
const path = require("path");

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
                    req.session = sess.getSession(req); // Set req.session
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

exports.getRecipes = function(res, s, cb) {
    var username = s.userName; 
    var sql = `SELECT * FROM recipes WHERE creator = ?`;
  
    var con = exports.connectDB();

    con.connect(function(err) {
      if (err) throw err;
  
        con.query(sql, [username], function(err, result) {
            if (err) throw err;
            console.log(result);
            cb(res, result);
        });

    });
}

exports.showRecipes = function(res, user) {
    var recipesHtml = "";
    for (var i = 0; i < user.length; i++) {
      var name = user[i].name;
      var ingreds = user[i].ingredients;
      var instr = user[i].instructions;
      var imgurl = `/uploads/${user[i].image}`;
      recipesHtml += "<div class='recipe-card'><strong>Title:</strong> " + name + "\n<strong>Ingredients:</strong>" + ingreds + "\n<strong>Instructions:</strong>\n" + instr + "\n<strong>Image:</strong> \n <img src='" + imgurl + "'> </div>";
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(recipesHtml); // this thing doesnt work, for me it just returns the recipesHTML thing as a string without the rest of the page??
  }

exports.searchRecipe = function(req, res, searchTerm) {
    const sql = `SELECT * FROM recipes WHERE name LIKE ?`;
    var term = `%${searchTerm}%`;

    var con = exports.connectDB();
    con.connect(function(err) {
      if (err) throw err;
    });

    con.query(sql, [term], function(err, rows) {
      if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ recipes: rows }));
    });
  }

exports.uploadRecipe = function(req, res) {
    const form = new formidable.IncomingForm();
  
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
  
      const { name, ingredients, instructions } = fields;
      req.session = sess.getSession(req); 
      const username = req.session.userName; 
  
      // Move the uploaded image to the uploads directory
      const img = files.recipeImage[0]; 
      var oldpath = img.filepath;
      var newpath = __dirname + "/uploads/" + img.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
  
        // Insert into MySQL database
        var con = exports.connectDB();
        const sql = 'INSERT INTO recipes (name, ingredients, instructions, image, creator) VALUES (?,?,?,?,?)';
        const values = [name, ingredients, instructions, img.originalFilename, username];
  
        con.connect(function(err) {
          if (err) throw err;
        });
  
        con.query(sql, values, (err) => {
          if (err) throw err; 
          console.log('New recipe added.');
          res.writeHead(302, { 'Location': '/recipes.html' }); 
          res.end();
          con.end(); 
        });

      });


    });
  }