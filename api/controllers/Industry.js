"use strict";

var Industry = require('../services/Industry');

module.exports = {

    getAllIndustries: function(req, res, next) {
        Industry.getAllIndustries(function(err, docs) {
            if (err) {
                return next(err);
            }
            return res.json({
                "r": 0,
                "msg": "查询成功",
                "list": docs
            });
        });
    }

};
