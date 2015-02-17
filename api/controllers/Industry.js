"use strict";

var Industry = require('../services/Industry');
var ERRCODE = require('../../errcode');

module.exports = {

    getAllIndustries: function(req, res, next) {
        Industry.getAllIndustries(function(err, docs) {
            if (err) {
                return next(err);
            }
            return res.json({
                "r": 0,
                "msg": "查询成功",
                "list": docs,
                "total": docs.length
            });
        });
    },

    createIndustry: function(req, res, next) {
        var data = {
            code: req.body.code,
            name: req.body.name
        };

        Industry.findOneByCodeAndName(data, function(err, doc) {
            if (err) {
                return next(err);
            }
            if (doc) {
                return res.json({
                    "r": 1,
                    "errcode": '10131',
                    "msg": ERRCODE['10131']
                });
            } else {
                Industry.createIndustry(data, function(err, doc) {
                    if (err) {
                        return next(err);
                    }
                    return res.json({
                        "r": 0,
                        "msg": "新建成功",
                        "industry": doc
                    });
                });
            }
        });
    },

    createAllIndustries: function(req, res, next) {
        var INDUSTRY_LIST = {
            '-1': '全部行业',
            '1001': '时尚科技',
            '1002': '艺术设计',
            '1003': '自然环境',
            '1004': '智慧城市',
            '1005': '品质生活',
            '1006': '医疗健康',
            '1007': '运动休闲',
            '1008': '爱心辅助',
            '1009': '表达传播',
            '1010': '社会公益'
        };
        for (var i in INDUSTRY_LIST) {
            (function(i) {
                Industry.findOneByCodeAndName({
                    code: i,
                    name: INDUSTRY_LIST[i]
                }, function(err, doc) {
                    if (err) {
                        return next(err);
                    }
                    if (doc) {
                        console.log('记录已经存在');
                    } else {
                        Industry.createIndustry({
                            code: i,
                            name: INDUSTRY_LIST[i]
                        }, function(err, doc) {
                            if (err) {
                                return next(err);
                            }
                            if (doc) {
                                console.log(doc);
                            }
                        });
                    }
                });
            })(i);
        }
    }

};
