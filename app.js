const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const sess = require("./session");
const mod = require("./modules.js");

// serve html page
http.createServer(function (req, res) {
    const pathname = url.parse(req.url).pathname;
    var s;


    switch (req.url) {

        case "/authlogin":
            if (req.method === 'POST' && req.url === '/authlogin') {
                if (validateLogin(req)) {
                    mod.loginUser(req, res); // check login details
                }
            }
            break;
        
        case "/authregister":
            mod.registerUser(req, res); // check if user already exists
            break;

        case "/recipes.html":
            s = sess.getSession(req);

            if (s !== undefined) {
                if (s.userName != "" && s.userName !== undefined) { // if user session is valid, redirect to recipes
                    mod.navRecipes(req, res);
                }
            } 
            else {
                mod.navLogin(req, res); // redirect to login page
            }
            break;

        case "/login.html":
            mod.navLogin(req, res); // redirect to login page

        default:
            mod.navHome(req, res); // redirect to homepage

    }
}).listen(8080);
