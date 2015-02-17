"use strict";

var Industry = require('../models/Industry');

module.exports = {

    getAllIndustries: function(callback) {
        Industry.find({

        }, {
            code: 1,
            name: 1,
            _id: 0
        }, callback);
    },

    createIndustry: function(data, callback) {
        var industry = new Industry({
            code: data.code,
            name: data.name
        });

        industry.save(callback);
    },

    findOneByCodeAndName: function(data, callback) {
        Industry.findOne({
            code: data.code,
            name: data.name
        }, callback);
    }

};
