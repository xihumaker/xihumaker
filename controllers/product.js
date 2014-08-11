"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var xss = require('xss');
var Product = require('../models/product');
var ProductTopic = require('../models/product_topic');

module.exports = {

    // 页面请求
    // ============================================

    // 微信端 - 产品列表页
    showProducts: function(req, res) {
        res.render('weixin/products');
    },

    // 显示产品更新页面
    showEditProduct: function(req, res) {
        var _id = req.params._id;

        Product.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.render('admin/editProduct', {
                    "r": 1,
                    "errcode": 10069,
                    "msg": "服务器错误，显示产品编辑页失败"
                });
                return;
            }

            if (!!doc) {
                res.render('admin/editProduct', {
                    "r": 0,
                    "msg": "请求成功",
                    "product": doc
                });
                return;
            } else {
                res.render('admin/editProduct', {
                    "r": 1,
                    "errcode": 10070,
                    "msg": "产品不存在"
                });
                return;
            }
        });
    },

    // 显示产品详情页面
    showProductInfo: function(req, res) {
        var _id = req.params._id;
        var whichWorld = Number(req.query.world) || 0;

        Product.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.render('weixin/productInfo', {
                    "r": 1,
                    "errcode": 10071,
                    "msg": "服务器错误，显示产品详情页失败"
                });
                return;
            }

            res.render('weixin/productInfo', {
                "r": 0,
                "msg": "查找产品详情成功",
                "product": doc,
                "whichWorld": whichWorld
            });
        });
    },

    // Ajax 请求
    // ============================================

    // 新建产品
    createProduct: function(req, res) {
        var body = req.body;
        var name = xss(body.name);
        var industry = body.industry;

        Product.findOne({
            name: name
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10059,
                    "msg": "服务器错误，新建产品失败"
                });
                return;
            }

            if (!!doc) {
                res.json({
                    "r": 1,
                    "errcode": 10059,
                    "msg": "产品已存在"
                });
                return;
            } else {
                var product = new Product({
                    name: name,
                    industry: industry
                });

                product.save(function(err, doc) {
                    if (err) {
                        res.json({
                            "r": 1,
                            "errcode": 10059,
                            "msg": "服务器错误，新建产品失败"
                        });
                        return;
                    }

                    res.json({
                        "r": 0,
                        "msg": "新建产品成功"
                    });
                    return;
                });
            }
        });
    },

    // 分页查询产品
    findProductsByPage: function(req, res) {
        var query = req.query;
        var pageSize = query.pageSize || 10;
        var pageStart = query.pageStart || 0;
        var key = query.key;
        var industry = query.industry;
        var params = {};

        if (!!key) {
            params.name = new RegExp(key);
        }
        if (!!industry) {
            params.industry = industry;
        }

        var q = Product.find(params).limit(pageSize).skip(pageStart).sort({
            lastActionTime: -1
        });

        Product.count(params, function(err, count) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10063,
                    "msg": "服务器错误，查找产品列表失败"
                });
                return;
            }

            q.exec(function(err, docs) {
                if (err) {
                    res.json({
                        "r": 1,
                        "errcode": 10063,
                        "msg": "服务器错误，查找产品列表失败"
                    });
                    return;
                }

                res.json({
                    "r": 0,
                    "msg": "查找产品列表成功",
                    "products": docs,
                    "count": count
                });
            });
        });


    },

    // 根据产品ID删除某个产品
    deleteProductById: function(req, res) {
        var _id = req.params._id;

        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Product.findOneAndRemove({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10067,
                    "msg": "服务器错误，删除产品失败"
                });
                return;
            }

            // 删除产品时也删除该产品下的所有帖子
            ProductTopic.remove({
                belongToProductId: new ObjectId(_id)
            }, function(err) {
                if (err) {
                    res.json({
                        "r": 1,
                        "errcode": 10067,
                        "msg": "服务器错误，删除产品失败"
                    });
                    return;
                }

                res.json({
                    "r": 0,
                    "msg": "删除成功"
                });
                return;
            });
        });
    },

    // 根据产品ID修改某个产品
    updateProductById: function(req, res) {
        var _id = req.params._id;
        var product = req.body;

        Product.findOne({
            name: product.name
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10071,
                    "msg": "服务器错误，编辑产品失败"
                });
                return;
            }

            if (!!doc && String(doc._id) !== _id) {
                res.json({
                    "r": 1,
                    "errcode": 10059,
                    "msg": "产品已存在"
                });
                return;
            } else {
                Product.findByIdAndUpdate(_id, {
                    $set: {
                        name: xss(product.name),
                        industry: product.industry,
                        updateTime: Date.now()
                    }
                }, function(err, doc) {
                    if (err) {
                        res.json({
                            "r": 1,
                            "errcode": 10071,
                            "msg": "服务器错误，编辑产品失败"
                        });
                        return;
                    }

                    if (!!doc) {
                        res.json({
                            "r": 0,
                            "msg": "修改成功",
                            "vip": doc
                        });
                        return;
                    } else {
                        res.json({
                            "r": 1,
                            "errcode": 10070,
                            "msg": "产品不存在"
                        });
                        return;
                    }
                });
            }
        });
    },

    // 获取产品总个数
    getTotalProductNum: function(req, res, next) {
        Product.count({}, function(err, count) {
            if (err) {
                return next(err);
            }
            res.json({
                r: 0,
                msg: '获取产品总个数成功',
                count: count
            });
        });
    }




};