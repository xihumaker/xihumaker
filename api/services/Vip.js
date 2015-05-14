'use strict';

var BaseService = require('./Base');
var VipModel = require('../../models/vip');

var VipService = BaseService.extend({

    init: function() {
        this._super();
        console.log('VipService init');
    }

    

});

module.exports = new VipService();
