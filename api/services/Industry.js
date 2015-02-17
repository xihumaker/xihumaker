"use strict";

var Industry = require('../models/Industry');

module.exports = {

    getAllIndustries: function(callback) {
        Industry.find({

        }, callback);
    }

};
