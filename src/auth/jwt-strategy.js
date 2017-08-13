/**
 * # ErrorAlert.js
 *
 * This class uses a component which displays the appropriate alert
 * depending on the platform
 *
 * The main purpose here is to determine if there is an error and then
 * plucking off the message depending on the shape of the error object.
 */
'use strict';
/**
* ## Imports
*
*/
var  Config = require('../config'),
    internals = {},
    //the authentication package
    Jwt = require('jsonwebtoken'),
    //mongoose user object
    User = require('../database/models/User.js');

// private key for signing
internals.privateKey = Config.crypto.privateKey;

/**
 *
 * ## validate
 *
 *  When a route is configured w/ 'auth', this validate function is
 * invoked
 * 
 * If the token wasn't invalidated w/ logout, then validate
 * its for a user
 *
 */
internals.validate = function (request, decodedToken, callback) {
  
  var credentials = {};

  //credentials have 'Bearer dfadfsdf'
  var headers = request.headers.authorization.split(' ');

  if (headers.length === 2) {
    // ok - valid token, do we have a user?
    // note we're only using 'id' - that's because
    // the user can change their email and username
    User.findById(decodedToken.id, function (err, user) {
      
      if (err) {
        return callback(err, false, credentials);		
      } else {
        credentials = user;

        return callback(err, true, credentials);
      }
    });
  }
};

// create token
internals.createToken = function (obj) {
  return Jwt.sign(obj, internals.privateKey);
};

// set jwt auth strategy
internals.setJwtStrategy = function (server) {
  server.auth.strategy('token', 'jwt', {
    key: internals.privateKey,
    validateFunc: internals.validate
  });
};

module.exports = {
  setStrategy: internals.setJwtStrategy,
  createToken: internals.createToken
};
