'use strict';

var BaseController = require('./Base');
var VipService = require('../services/Vip');

var VipController = BaseController.extend({


    createVip: function(req, res, next) {

    },

    updateVipById: function(req, res, next) {

    },

    findVipById: function(req, res, next) {

    },

    deleteVipById: function(req, res, next) {

    },

    findVipsByPage: function(req, res, next) {
    	var query = req.query;
    	var page = query.page;
    	var pageSize = query.pageSize;

    	
    }

});

module.exports = new VipController();
var self = module.exports;
