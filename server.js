var http = require("http");
var fs = require("fs");
var mysql = require("mysql");
var path = require("path");
var formidable = require('formidable');
var cookie = require("cookie");

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days validity login
    httpOnly: true, 
};

// connect to mysql database
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "cookingPapa"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to cookingPapa database.");
});


// serve html page
http.createServer(function (req, res) {

    var filePath = "." + req.url;
    if (filePath == "./") {
        filePath = "./index.html";
    }

    var extname = path.extname(filePath);
    var contentType = "text/html";
    if (extname == ".css") {
        contentType = "text/css";
    }

    if (req.url === "/login") { // if user logs in
        loginUser(req, res);
    } else if (req.url === "/register") { // if user registers
        registerUser(req, res);
    } else if(req.url === "/recipes.html") { // if user is already logged in
        checkLoggedIn(req, res);
    } else {
        fs.readFile(filePath, function(err, data) { // read index.html landing page
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data, "utf-8");
            }
        });
    }
}).listen(8080);


// check login details
function loginUser(req, res) { 
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {

        if (err) throw err;
        var {useremail, password} = fields;

        // check if user is in users table
        con.query("SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?", [useremail, useremail, password], function(err, result) {
            if (err) throw err;

            if (result.length > 0) {
                res.setHeader('Set-Cookie', cookie.serialize('authenticated', 'true', cookieOptions));
                res.writeHead(302, { 'Location': '/recipes.html' }); // redirect to recipes page
                console.log("Logged in as " + useremail)
                res.end();
            } else {
                // user is not in users table
                res.writeHead(401, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: "Email/username or password is wrong."})); 
            }
        });
    });
}

function registerUser(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if (err) throw err;
        
        var {fname, lname, username, email, password} = fields;

        // check if email or username already in use
        con.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username], function(err, result) {
            if (err) throw err;

            if (result.length > 0) {
                // user already exists
                res.writeHead(401, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: "User already exists."})); 
                
            } else {

                con.query("INSERT INTO users (fname, lname, username, email, password) VALUES (?, ?, ?, ?, ?)", [fname, lname, username, email, password], function(err, result) {
                    if (err) throw err;
                    res.writeHead(302, { 'Location': '/recipes.html' }); // redirect to recipes page
                    console.log("User " + username + " registered.")
                    res.end();
                });
            }
        });
    });
}

function isLoggedIn(req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    return cookies.authenticated === 'true';
}

function checkLoggedIn(req, res) {
    if (isLoggedIn(req)) {
        fs.readFile("./recipes.html", function(err, data) {
            if (err) throw err; 
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else {
        res.writeHead(302, { 'Location': '/login.html' }); // redirect to login if not logged in already
        res.end();
    }
}