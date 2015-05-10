'use strict';

var BaseController = require('./Base');
var UserService = require('../services/User');

var UserController = BaseController.extend({

    init: function() {
        this._super();
        console.log('UserController init');

    },

    newUser: function(req, res, next) {
        var body = req.body;
        var email = body.email;
        var phone = body.phone;
        var username = body.username;
        var password = body.password;

        UserService.newUser(email, phone, username, password, function(err, user) {
            if (err) {
                return next(err);
            }

            var ret = self.r(0, '注册成功', {
                user: {
                    id: user._id,
                    email: user.email,
                    phone: user.phone,
                    username: user.username
                }
            });
            res.json(ret);
        });
    },

    findUserById: function(req, res, next) {
        var id = req.params.id;
        console.log(id);

        UserService.findUserById(id, function(err, user) {
            if (err) {
                return next(err);
            }
            var ret;
            if (user) {
                ret = self.r(0, 'OK', {
                    user: user
                });
            } else {
                ret = self.r(10000, '用户不存在', {});
            }
            res.json(ret);
        });
    }

});

module.exports = new UserController();
var self = module.exports;
