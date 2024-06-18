const http = require("http");
const url = require("url");
const fs = require("fs");
const formidable = require("formidable");
const session = require("./session");
const mod = require("./modules");
const port = 8080;

// Helper function to parse cookies
function parseCookies(request) {
    const list = {};
    const rc = request.headers.cookie;
    rc && rc.split(';').forEach(function(cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
    return list;
}

// Create HTTP server
http.createServer(function(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const cookies = parseCookies(req);
    req.sessionID = cookies.sessionID;

    // Handle login route
    if (pathname === "/authlogin" && req.method === "POST") {
        mod.loginUser(req, res);
    
    // Handle register route
    } else if (pathname === "/authregister" && req.method === "POST") {
        mod.registerUser(req, res);
    
    // Handle recipes route
    } else if (pathname === "/recipes.html") {
        let s = session.getSession(req);
        if (s && s.userName) {
            mod.serve(res, "./recipes.html", "text/html");
        } else {
            mod.serve(res, "./login.html", "text/html");
        }
    
    // Handle recipe search route
    } else if (pathname === "/api/search" && req.method === "GET") {
        const searchTerm = parsedUrl.query.q;
        mod.searchRecipe(req, res, searchTerm);

    // Handle recipe upload route
    } else if (pathname === "/api/upload" && req.method === "POST") {
        recipesModule.uploadRecipe(req, res); // Implement uploadRecipe function

    // Serve static files
    } else if (pathname === "/search.html" || pathname === "/login.html" || pathname === "/style.css" || pathname === "/loginscript.js" || pathname === "/redirect.html") {
        mod.serve(res, `.${pathname}`, getContentType(pathname));

    // Serve individual recipe details
    } else if (pathname.startsWith('/recipe/') && req.method === 'GET') {
        mod.getRecipe(req, res); // Adjust based on how getRecipe is implemented

    // Default route
    } else {
        mod.serve(res, "./index.html", "text/html");
    }
}).listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

// Function to determine content type based on file extension
function getContentType(pathname) {
    const extension = pathname.split('.').pop();
    switch (extension) {
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
        default:
            return 'text/plain';
    }
}
