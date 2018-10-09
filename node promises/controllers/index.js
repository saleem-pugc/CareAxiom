/**
 * @module Controller
 *
 */

let Q = require('q');
let Responses = require('../util/responses');
var http = require('http');
var url = require('url');
var cheerio = require('cheerio');

module.exports.get = function (req, res) {
    if (req.query.address) {
        let addresses = typeof req.query.address == 'string' ? [req.query.address] : req.query.address;
        let addresesToProcess = '';
        let addressPromises = [];
        addresses.forEach(function (singleAddress) {
            addressPromises.push(getTitleOfTheAddress(singleAddress));
        });
        let allResponses = Q.all(addressPromises);
        allResponses.then(data => {
            data.forEach(function (title, i) {
                addresesToProcess += `<li>${addresses[i]}  - ${title} </li>`;
            });
            // prepare html and render on front
            let htmlData = `<html>
                                        <head></head>
                                        <body>
                                            <h1> Titles of the given address(es) are below: </h1>
                                            <ul>
                                                ${addresesToProcess}
                                            </ul>
                                        </body>
                                    </html>`;
            Responses.http200Html(res, htmlData);
        }).catch(function (reason) {
            Responses.http500Html(res, reason);
         });
    } else {
        Responses.http500Html(res, "No address found!");
    }
};


function getTitleOfTheAddress(address) {
    var defered = Q.defer();
    let thisPath = url.parse(address, true)
    if (!thisPath.host) {
        defered.resolve('NO RESPONSE');
    }
    http.get({ host: thisPath.host, path: thisPath.pathname + thisPath.search }, function(response) {
        let data = '';
        response.on('data', function(chunk){
            data += chunk;
        });
        response.on('end', function() {
            const $ = cheerio.load(data);
            defered.resolve(`"${$("title").text()}"`);
        });

    }).on("error", (err) => {
        defered.resolve('NO RESPONSE');
    })
    return defered.promise;
};