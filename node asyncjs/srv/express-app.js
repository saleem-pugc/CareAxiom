/**
 * @module ExpressApp
 */
var express = require('express');

var Routes = require("./routes");

var app = express();

// Global app configuration
app.set('views', 'views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine


// Register Routes
Routes.registerApiRoutes(app);

module.exports = app;
