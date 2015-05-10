'use strict';

var UserController = require('../api/controllers/User');

module.exports = function(app) {


    app.post('/v2/api/user', UserController.newUser);
    app.get('/v2/api/user/:id', UserController.findUserById);

};
