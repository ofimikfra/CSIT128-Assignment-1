var session = require('express-session');

exports.setSession = function (req, username) {
    req.session.userName = username;
    console.log("Session Created.");
};

exports.getSession = function(req) {
    return req.session;
};

exports.deleteSession = function (req) {
    req.session.destroy(function(err) {
        if (err) throw err;
        console.log("Session Deleted.");
    });
};

exports.preAuth = function (res, req, id, body) { // called before logging in
    if (id != -1 && id != "" && id !== undefined) { // check if id is valid
        exports.setSession(req, body.username); // set session
        const s = exports.getSession(req);
        if (s.userName != "" && s.userName !== undefined) { // check if session is valid
            fs.readFile("/recipes.html", function(err, data) {
                if (err) throw err; 
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            });
        } else {
            fs.readFile("/index.html", function(err, data) {
                if (err) throw err; 
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            });
        }
    }
};
