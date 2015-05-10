'use strict';

var CommonBase = require('../common/Base');

var BaseController = CommonBase.extend({

    init: function() {
        this._super();
        console.log('BaseController init');
    },

    r: function(code, msg, data) {
        return {
            code: code,
            msg: msg,
            data: data
        };
    }

});

module.exports = BaseController;
