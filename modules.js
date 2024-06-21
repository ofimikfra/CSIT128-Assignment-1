const fs = require("fs");
const mysql = require("mysql");
const formidable = require("formidable");
const sess = require("./session");

// creates mysql connection
exports.connectDB = function() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "admin",
        database: "cookingPapa"
    });
}

// serves files
exports.serve = function(res, path, contentType, responseCode = 200) {
    fs.readFile(path, function(err, data) {
        if (err) throw err;
        res.writeHead(responseCode, { "Content-Type": contentType });
        res.end(data);
    });
}

// validates login with users table 
exports.loginUser = function(req, res) { 
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        if (err) throw err;
        var { loguser, logpassword } = fields;

        var con = exports.connectDB();

        con.connect(function(err) {
            if (err) throw err;

            // check if user is in users table
            con.query("SELECT * FROM users WHERE username =? AND password =?", [loguser, logpassword], function(err, result) {
                if (err) throw err;

                if (result && result.length > 0) {
                    // user is in users table
                    sess.setSession(req, result[0].username);// creates session
                    req.session = sess.getSession(req); // sets req.session to current session
                    res.writeHead(302, {
                        "Location": "/recipes.html", // redirects to recipes page
                        "Set-Cookie": `sessionID=${req.sessionID}; HttpOnly; Secure`
                    });
                    res.end();
                } 
                
                else {
                    // user is not in users table
                    res.writeHead(302, {
                        "Location": "/login.html?error=Invalid_login_credentials._Please_try_again." // redirects back to login page with error
                    });
                    res.end();
                }
                con.end(); 
            });
        });
    });
}

// validates registration with users table
exports.registerUser = function(req, res) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields) {
        if (err) throw err;
        
        var { fname, lname, username, email, password } = fields;
        var con = exports.connectDB();

        con.connect(function(err) {
            if (err) throw err;

            // check if email or username already in use
            con.query("SELECT * FROM users WHERE username = ?", [username], function(err, result) {
                if (err) throw err;

                if (result.length > 0) {
                    // user already exists
                    res.writeHead(302, {
                        "Location": "/register.html?error=Username_is_already_taken._Please_try_again." // redirects back to register page with error
                    });
                    res.end();
                } else {
                    con.query("SELECT * FROM users WHERE email = ?", [email], function(err, result) {
                        if (err) throw err;
        
                        if (result.length > 0) {
                            // user already exists
                            res.writeHead(302, {
                                "Location": "/register.html?error=Email_is_already_in_use._Please_try_again." // redirects back to register page with error
                            });
                            res.end();
                        } else {
                            // insert new user into users table
                            con.query("INSERT INTO users (fname, lname, username, email, password) VALUES (?, ?, ?, ?, ?)", [fname, lname, username, email, password], function(err, result) {
                                if (err) throw err;
                                console.log("User " + username + " signed up.");
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: true, message: "Successfully signed up! You can now log in." }));
                                con.end();
                            });
                        }
                    });
                }
            });
        });
    });
}

// returns recipes of user from recipes table based on current session
exports.getRecipes = function(req, s) {
    var username = s.userName;
    var sql = `SELECT * FROM recipes WHERE creator =?`;

    var con = exports.connectDB();

    con.connect(function(err) {
        if (err) throw err;

        con.query(sql, [username], function(err, result) {
            if (err) throw err;
            console.log(result);

            var recipes = JSON.stringify(result);

            fs.writeFile("recipeList.json", recipes, function(err) {
                if (err) throw err;
                console.log("Recipe file updated successfully.");
            });

            con.end();
        });
    });
}

// displays recipes based on search term 
exports.searchRecipe = function(req, res, searchTerm) {

    var sql = "SELECT * FROM recipes WHERE name LIKE '%" + searchTerm + "%' OR ingredients LIKE '%" + searchTerm + "%' OR instructions LIKE '%" + searchTerm + "%' OR category LIKE '%" + searchTerm + "%'";
    var con = exports.connectDB();
  
    con.connect(function(err) {
        if (err) throw err;
        
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(sql);
            console.log(result);
  
            var recipes = JSON.stringify(result);
            
            fs.writeFile("recipeSearch.json", recipes, function(err) {
                if (err) throw err;
                console.log("Recipe search updated successfully.");
                res.end();
            });
          
            con.end();
        });
    });
}

// inserts recipe into recipes table 
exports.uploadRecipe = function(req, res) {
    const form = new formidable.IncomingForm();
  
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
  
      const { name, ingredients, instructions, category } = fields;
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
        const sql = 'INSERT INTO recipes (name, ingredients, instructions, image, creator, category) VALUES (?,?,?,?,?,?)';
        const values = [name, ingredients, instructions, img.originalFilename, username, category];
  
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

exports.deleteRecipe = function(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
      if (err) throw err;
  
      const recipeId = fields.recipeId;
      var con = exports.connectDB();
  
      con.connect(function(err) {
        if (err) throw err;
  
        con.query("DELETE FROM recipes WHERE id =?", [recipeId], function(err, result) {
            if (err) throw err;
            console.log(result.affectedRows);
  
            var s = sess.getSession(req);
            exports.getRecipes(req, s);
            res.writeHead(302, { "Location": "/recipes.html" }); // redirect back to recipes page
            res.end();
        });
      });
    });
}

exports.editRecipe = function(req, res) {
    const form = new formidable.IncomingForm();
  
    form.parse(req, (err, fields) => {
        if (err) throw err;
        
        const { name, ingredients, instructions, recipe, category } = fields;
        const recipeId = parseInt(recipe);
            
        // Insert into MySQL database
        var con = exports.connectDB();
        const sql = 'UPDATE recipes SET name = ?, ingredients = ?, instructions = ?, category = ? WHERE id = ?';
        const values = [name, ingredients, instructions, category, recipeId];
            
        con.connect(function(err) {
          if (err) throw err;
        });
        
        con.query(sql, values, (err) => {
          if (err) throw err; 
          res.writeHead(302, { 'Location': '/recipes.html' }); 
          res.end();
          con.end(); 
        });
    });
}

exports.getCategories = function(req, s) {
    var username = s.userName;
    var sql = `SELECT * FROM categories WHERE creator =?`;

    var con = exports.connectDB();

    con.connect(function(err) {
        if (err) throw err;

        con.query(sql, [username], function(err, result) {
            if (err) throw err;
            console.log(result);

            var recipes = JSON.stringify(result);

            fs.writeFile("categoryList.json", recipes, function(err) {
                if (err) throw err;
                console.log("Category file updated successfully.");
            });

            con.end();
        });
    });
}

exports.addCategory = function(req, res) {
    const form = new formidable.IncomingForm();
  
    form.parse(req, (err, fields) => {
      if (err) throw err;
  
      const { categoryName } = fields;
      req.session = sess.getSession(req); 
      const username = req.session.userName; 

      var con = exports.connectDB();
      con.connect(function(err) {
        if (err) throw err;
      });
  
        // Insert into MySQL database
        
        var sql = 'SELECT name FROM categories WHERE LOWER(name) = LOWER(?)';
        con.query(sql, [categoryName], (err, result) => {
            if (err) throw err; 

            if (result.length > 0) {
                res.writeHead(302, {
                    "Location": "/categories.html?error=This_category_already_exists." // redirects back to register page with error
                });
                res.end();

            } else {
                sql = 'INSERT INTO categories (name, creator) VALUES (?,?)';
                con.query(sql, [categoryName, username], (err, result) => {
                    if (err) throw err; 
                    console.log('New category added.');
                    const newCategoryId = result.insertId; // Get the inserted ID
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: "Category added successfully", newCategoryId: newCategoryId }));
                    res.end();
                    con.end(); 
                });
            }
        });
    });
}

exports.deleteCategory = function(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        if (err) throw err;

        const categoryId = fields.categoryId;
        var con = exports.connectDB();

        con.connect(function(err) {
            if (err) throw err;

            con.query("DELETE FROM categories WHERE id = ?", [categoryId], function(err, result) {
                if (err) throw err;
                console.log(result.affectedRows);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: "Category deleted successfully" }));
            });
        });
    });
}