var http = require('http');
var url = require('url');
var cheerio = require('cheerio');
let PORT = process.env.PORT || 3004;
let Paths = [
    "/I/want/title"
];
const requestHandler = async function(req, res) {
    let parsedUrl = url.parse(req.url, true);
    if (Paths.indexOf(parsedUrl.pathname) < 0) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('Invalid Endpoint URL.');
    }
    if (!parsedUrl.query.address) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        return res.end('"address" parameter is required.');
    }
    let addresses = typeof parsedUrl.query.address == 'string' ? [parsedUrl.query.address] : parsedUrl.query.address;
    let addresesToProcess = '';
    recursiveHandler(addresses, function (address, secondCallback) {
        let Path = url.parse(address, true)
        if (!Path.host) {
            addresesToProcess += `<li>${address}  - NO RESPONSE </li>`;
            return secondCallback();
        }
        http.get({ host: Path.host, path: Path.pathname + Path.search }, (response) => {
            let data = '';
            response.on('data', function(chunk) {
                data += chunk;
            });
            response.on('end', function() {
                const $ = cheerio.load(data);
                addresesToProcess += `<li>${address}  - "${$("title").text()}" </li>`;
                return secondCallback();
            });
        }).on("error", (err) => {
            addresesToProcess += `<li>${address}  - NO RESPONSE </li>`;
            return secondCallback();
        })
    }, function () {
        let htmlData = `<html>
                                    <head></head>
                                    <body>
                                        <h1> Titles of the given address(es) are below: </h1>
                                        <ul>
                                            ${addresesToProcess}
                                        </ul>
                                    </body>
                                </html>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlData);
    });
}

// creating server object
const server = http.createServer(requestHandler);

// specifying the port, on which server need to listen
server.listen(PORT, function() {
    console.log(`Server started listening on port: ${PORT}`)
});

// this is the function that will handle all addresses
function recursiveHandler(items, iterator, callback) {
    var counter = 0;
    function report() {
        counter++;
        if (counter === items.length)
            callback();
    }
    for (var i = 0; i < items.length; i++) {
        iterator(items[i], report)
    }
}