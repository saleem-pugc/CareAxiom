/**
 * @module Routes
 * @description Define the routes in the HTTP server application
 */
var express = require('express');

var Controller = require('./../controllers/index');

/**
 * registerApiRoutes
 */
exports.registerApiRoutes = function(app){

  /**
   * Express Router object
   */
  var apiRouter = express.Router();

  /**
   * Defining routes for the reviews
   */
  apiRouter.route('/I/want/title')
  .get(Controller.get);
  
  app.use('/', apiRouter);

  app.get('*', function(req, res){
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('Invalid Endpoint URL.');
  });
};