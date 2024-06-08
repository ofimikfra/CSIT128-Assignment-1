var http = require("http");
var fs = require("fs");
var mysql = require("mysql");

http.createServer(function (req, res) {

    fs.readFile("index.html", function(err, data) {
        res.writeHead(200, {"Content-type": "text/html"});
        res.write(data);
    })

    var con = mysql.createConnection ({
        host: "localhost",
        user: "root",
        password: "admin",
        database: "cookingPapa"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to cookingPapa DB.");
    });

}).listen(8080);