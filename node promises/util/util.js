/**
 * @module Util
 * @description Various utility functions used throughout the app with no obvious home.
 */
var Q = require('q');

/**
 * Determine if the input is a numeric type
 *
 * @param n {Object} anything
 * @returns {boolean}
 */
exports.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * Determine if an error is a mongoose validation error
 *
 * @param error {Error} error to evaluate
 * @returns {boolean}
 */
exports.isValidationError = function(error){
    var err;
    if (error == null){
        return false;
    } else {
        if (exports.isUserError(error)){
            err = error.error;
        } else {
            err = error;
        }
        if (err.constructor === Error){
            return (err.name.indexOf('ValidationError') > -1 ||
                err.message.indexOf('ValidationError') > -1 ||
                err.message.indexOf('duplicate key'));
        } else {
            return false;
        }
    }
};

/**
 * Determine if an object is a UserError object
 * @param err {Object} object to evaluate
 * @returns {boolean}
 */
exports.isUserError = function(err){
    if (err != null){
        return (err.constructor.name == "UserError");
    } else {
        return false;
    }
};


/**
 * Simple wrapper of JSON.parse so it can be included in promise chains.
 * @param jsonString
 * @returns {*}
 */
exports.parseJson = function(jsonString){
    return Q.Promise(function(resolve,reject){
        try {
            var json = JSON.parse(jsonString);
            resolve(json);
        } catch (err){
            reject(err);
        }
    });
};

/**
 * Set a toJSON handler for Errors so they can be serialized to JSON
 */
Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
        }, this);

        return alt;
    },
    configurable: true
});