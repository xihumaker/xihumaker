'use strict';

var BaseService = require('./Base');
var UserModel = require('../../models/user');
var Utils = require('../lib/utils');


var UserService = BaseService.extend({

    init: function() {
        this._super();
        console.log('UserService init');
    },

    newUser: function(email, phone, username, password, callback) {
        var user = new UserModel({
            email: email,
            phone: phone,
            username: username,
            password: Utils.md5(password),
            createTime: Date.now()
        });
        user.save(callback);
    },

    findUserById: function(id, callback) {
        UserModel.findById(id, callback);
    }

});

module.exports = new UserService();
