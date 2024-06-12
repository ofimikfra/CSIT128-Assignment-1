const http = require("http");
const url = require("url");
const path = require("path");
const sess = require("./session");
const mod = require("./modules.js");

// serve html page
http.createServer(function (req, res) {
    const pathname = url.parse(req.url).pathname;
    var s;

    if (req.url === "/login") { // if user logs in
        mod.loginUser(req, res); // Pass req and res to loginUser function
    } 
    else if (req.url === "/register") { // if user registers
        mod.registerUser(req, res); // Pass req and res to registerUser function
    } 
    else if(req.url === "/recipes.html") { // if user is already logged in
        s = sess.getMySession();

        if (s !== undefined) {
            if (s.userName != "" && s.userName !== undefined) {
                // Call function to get user details and navigate to recipes page
                mod.navRecipes(req, res);
            }
        } 
        else {
            mod.navLogin(req, res); // redirect to login page
        }
    } 
    else {
        mod.navHome(req, res); // redirect to homepage
    }
}).listen(8080);
