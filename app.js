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
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const cookies = parseCookies(req);
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
            mod.serve(res, "./recipes.html", "text/html");
            /* change to this: mod.getRecipes(res, s, mod.showRecipes); 
                i just changed it to serve the recipes page for now bc i was testing the logout function so u can change it
                to test the showing recipes thing */
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
        default:
            return 'text/plain';
    }
}