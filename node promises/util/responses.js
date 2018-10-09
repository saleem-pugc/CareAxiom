/**
 * @module Responses
 * @description All HTTP responses should get routed through these functions.
 */

var Util = require('../util/util');

/**
 * HTTP 200
 *
 * @param res
 * @param data {Object} data to include in response
 */
exports.http200 = function(res,data){
    var payload = {
        status: 200,
        success: 1,
    };
    if (data != null){
        payload['data'] = data;
    }
    res.status(200).json(payload);
};


/**
 * HTTP 200
 *
 * @param res
 * @param data {Object} data to include in response
 */
exports.http200Html = function(res,data){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
};

/**
 * HTTP 500
 *
 * @param res
 * @param error {Error} Error to send
 */
exports.http500Html = function (res, error) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(error);
};

/**
 * HTTP 400
 *
 * @param res
 * @param error {Error} Error to send
 */
exports.http400 = function(res,error){
    res.status(extractDesiredStatus(error,400)).json({status: 400,success:0, messages: generateMessageObject(error)});
};

/**
 * HTTP 403
 *
 * @param res
 * @param error {Error} Error to send
 */
exports.http403 = function(res,error){
    res.status(extractDesiredStatus(error,403)).json({status: 403,success:0, messages: generateMessageObject(error)});
};

/**
 * HTTP 404
 *
 * @param res
 * @param error {Error} Error to send
 */
exports.http404 = function(res,error){
    res.status(404).json({status: 404,success:0, messages: generateMessageObject(error)});
};

/**
 * HTTP 409
 *
 * @param res
 * @param error {Error} Error to send
 */
exports.http409 = function(res,error){
    res.status(409).json({status: 409,success:0, messages: generateMessageObject(error)});
};

/**
 * HTTP 500
 *
 * @param res
 * @param error {Error} Error to send
 */
exports.http500 = function(res,error){
    try {
        // detect status code set by error
        console.log("500 error: " + JSON.stringify(error));
        res.status(extractDesiredStatus(error,500)).json({status: 500,success:0, messages: generateMessageObject(error)});
    } catch (err){
        res.status(500).json({status: 500,success:0, messages: {system: err}})
    }

};


var extractDesiredStatus = function(error,defaultStatus){
    //console.log("Extracting desired status: " + JSON.stringify(error));
    if (error == null){
        return defaultStatus;
    } else if (Util.isUserError(error) && error.code != null){
        return error.code;
    } else {
        return defaultStatus;
    }
};

/**
 * Create the error messages object including both user and system errors.
 *
 * @memberof Responses
 * @param error {Error} Error or UserError object
 * @returns {{user: Array, system: Array}}
 */
var generateMessageObject = function(error){
    var system = [];
    var errorString;
    if (error == null) {
        system.push("Unknown error occurred.");
    } else {
        try{
            if (typeof error == Error){
                errorString = JSON.stringify(error);
            } else {
                errorString = error;
            }
            if (Util.isUserError(error)){
                system.push(error.error);
            } else if (Util.isValidationError(error)){
                system.push(errorString);
            } else {
                system.push(errorString);
            }
        } catch(err){
            system.push(err.message);
        }
    }


    return {
        system: system
    };
};
