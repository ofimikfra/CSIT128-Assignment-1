const http = require("http");
const url = require("url");
const session = require("./session");
const mod = require("./modules");
const port = 8080;

// honestly idk what this is for i just know it makes the session stuff work
function parseCookies(request) {
    const list = {};
    const rc = request.headers.cookie;
    rc && rc.split(';').forEach(function(cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
    return list;
}

// creates server
http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    var q = parsedUrl.query;
    var cookies = parseCookies(req);
    req.sessionID = cookies.sessionID;

    // when user logs in
    if (pathname === "/authlogin" && req.method === "POST") {
        mod.loginUser(req, res);
    } 
    
    // when user registers
    else if (pathname === "/authregister" && req.method === "POST") {
        mod.registerUser(req, res);
    } 
    
    // when user goes to recipes page
    else if (pathname === "/recipes.html") {
        let s = session.getSession(req); 

        if (s && s.userName) { // if there is a session (user is logged in)
            mod.getRecipes(req, s);
            mod.serve(res, "./recipes.html", "text/html"); 
        } 
        
        else { // if there is no session (user is not logged in)
            res.writeHead(302, { "Location": "/login.html" }); // redirect to login page
            res.end();
        }
    } 
    
    // when user uploads a recipe
    else if (pathname === "/upload" && req.method === "POST") {
        mod.uploadRecipe(req, res); 
    } 

    // when user logs out
    else if (pathname === "/logout" && req.method === "GET") {
        const deleted = session.deleteSession(req);
        if (deleted) {
            res.writeHead(302, { "Location": "/login.html" }); // redirect to login page
            res.end();
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Session not found");
        }
    }

    else if (pathname === "/deleteRecipe.html") {
        let s = session.getSession(req);
        if (s && s.userName) {
            mod.getRecipes(req, s);
            mod.serve(res, "./deleteRecipe.html", "text/html");
        } else {
            res.writeHead(302, { "Location": "/login.html" }); // redirect to login page
            res.end();
        }
    }

    else if (pathname === "/delete") {
        mod.deleteRecipe(req, res);
    }

    else if (pathname === "/search") {
        var search = q.searchTerm;
        mod.searchRecipe(req, res, search);
        mod.serve(res, "./search.html", "text/html");
    }

    else if (pathname === "/recipeList.json") {
        mod.serve(res, "./recipeList.json", "application/json");
    }

    else if (pathname === "/recipeSearch.json") {
        mod.serve(res, "./recipeSearch.json", "application/json");
    }

    // serve all other files
    else if (pathname === "/search.html" || pathname === "/login.html" || pathname === "/style.css" || pathname === "/loginscript.js" || pathname === "/uploadscript.js" || pathname === "/searchscript.js") {
        mod.serve(res, `.${pathname}`, getContentType(pathname));
    }
    
    // default route goes to home page
    else {
        mod.serve(res, "./index.html", "text/html");
    }

}).listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

// determines content type based on file extension
function getContentType(pathname) {
    const extension = pathname.split('.').pop();
    switch (extension) {
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
        case 'json' :
            return 'application/json';
        default:
            return 'text/plain';
    }
}