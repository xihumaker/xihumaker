'use strict';

var CommonBase = require('../common/Base');

var BaseService = CommonBase.extend({

    init: function() {
        this._super();
        console.log('BaseService init');
    }

});

module.exports = BaseService;
