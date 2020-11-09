const fs = require("fs");
const http = require("http");
const redddit = require("redddit");
const u = require("url");
const cheerio = require("cheerio");
const port = process.env.PORT || 8855;

http.createServer(runServer).listen(port);
console.log("razzmatazz - listening on port " + port);

function runServer(req, res) {
    var url = u.parse(req.url, true);
    var p = url.pathname.split("/").slice(1);
    if (p[0] == "api") {
        
    } else if (p[0] == '') {
        fs.readFile("./web/index.html", function (err, resp) {
            if (!err) {
                var $ = cheerio.load(resp);
                redddit.topPosts("all", function(err, response) {
                    if (err) {

                    } else {
                        var $ = cheerio.load(resp);
                        for (var c in response) {
                            var html = "<a href=" + response[c].data.permalink + "><div class='post'><h2>" + response[c].data.title + "</h2></div></a>";
                            $(".postsList").append(html)
                        }
                        res.writeHead(200, {
                            "Access-Control-Allow-Origin": "*",
                            "Control-Type": "text/html"
                        })
                        res.end($.html());
                    }
                })
               
            } else {
                res.writeHead(500, {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "text/plain"
                })
                res.end(err.code);
            }
        })
    } else if (p[0] == "r" && p[2] == "comments") {

    } else if (p[0] == "r" && !p[2] | p[2] == "") {

    } else {
        fs.readFile("./web" + url.pathname, function(err, resp) {
            if (err) {
                if (err.code == "EISDIR") {
                    if (fs.existsSync("./web" + url.pathname + "index.html")) {
                        fs.readFile("./web" + url.pathname + "index.html", function(err, resp) {
                            if (!err) {
                                res.writeHead(200, {
                                    "Access-Control-Allow-Origin": "*",
                                    "Control-Type": "text/html"
                                })
                                res.end(resp);
                            } else {
                                res.writeHead(500, {
                                    "Access-Control-Allow-Origin": "*",
                                    "Content-Type": "text/plain"
                                })
                                res.end(err.code);
                            }
                        })
                    } else {
                        res.writeHead(500, {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "text/plain"
                        })
                        res.end(err.code);
                    }
                    return;
                } else {
                    res.writeHead(500, {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "text/plain"
                    })
                    res.end(err.code);
                }
            } else {
                var fileType = url.pathname.split(".")[url.pathname.split.length-1];
                if (fileType == "js") {
                    res.writeHead(200, {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/javascript"
                    })
                    res.end(resp);
                } else if (fileType == "css") {
                    res.writeHead(200, {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "text/css"
                    })
                    res.end(resp);
                } else if (fileType == "html") {
                    res.writeHead(200, {
                        "Access-Control-Allow-Origin": "*",
                        "Control-Type": "text/html"
                    })
                    res.end(resp);
                } else {
                    res.writeHead(200, {
                        "Access-Control-Allow-Origin": "*",
                    })
                    res.end(resp);
                }
            }
        })
    }
}