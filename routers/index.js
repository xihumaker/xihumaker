'use strict';

var UserController = require('../api/controllers/User');
var VipController = require('../api/controllers/vip');

module.exports = function(app) {


    app.post('/v2/api/user', UserController.newUser);
    app.get('/v2/api/user/:id', UserController.findUserById);


    app.post('/v2/api/vip', VipController.createVip);
    app.put('/v2/api/vip', VipController.updateVipById);
    app.get('/v2/api/vip/:id', VipController.findVipById);
    app.delete('/v2/api/vip/:id', VipController.deleteVipById);
    app.get('/v2/api/vip', VipController.findVipsByPage);

};