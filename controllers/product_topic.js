"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var xss = require('xss');
var Product = require('../models/product');
var ProductTopic = require('../models/product_topic');
var auth = require('../policies/auth');

module.exports = {

    // 显示新建帖子页面
    showCreateProductTopic: function(req, res) {
        res.render('weixin/createProductTopic')
    },

    // 新建帖子
    createProductTopic: function(req, res) {
        var xihumaker = auth.getSignedCookies(req, res, 'xihumaker');
        var belongToUserId = xihumaker.userId;
        var belongToUsername = xihumaker.username;
        var belongToUserHeadimgurl = xihumaker.headimgurl;
        var belongToProductId = req.params._id;
        var body = req.body;

        var topic = new ProductTopic({
            belongToUserId: belongToUserId,
            belongToUsername: belongToUsername,
            belongToUserHeadimgurl: belongToUserHeadimgurl,
            belongToProductId: belongToProductId,
            whichWorld: body.whichWorld,
            content: body.content,
            picList: body.picList || []
        });

        topic.save(function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10065,
                    "msg": "服务器错误，新建帖子失败"
                });
                return;
            }

            // 新建帖子时，需要修改相应产品的最新动作时间及产品下帖子的个数
            Product.findByIdAndUpdate({
                _id: doc.belongToProductId
            }, {
                $set: {
                    lastActionTime: Date.now()
                },
                $inc: {
                    topicNum: 1
                }
            }, function(err, product) {
                if (err) {
                    res.json({
                        "r": 1,
                        "errcode": 10065,
                        "msg": "服务器错误，新建帖子失败"
                    });
                    return;
                }
                res.json({
                    "r": 0,
                    "msg": "新建帖子成功"
                });
                return;
            });
        })
    },

    // 分页查询某个产品的帖子
    findProductTopicsByPage: function(req, res) {
        var query = req.query;
        var belongToProductId = req.params._id;
        var pageSize = query.pageSize || 5;
        var pageStart = query.pageStart || 0;
        var whichWorld = query.whichWorld;
        var queryParams = {};

        if ( !! whichWorld) {
            queryParams.whichWorld = whichWorld;
        }
        queryParams.belongToProductId = new ObjectId(belongToProductId);

        // 按最新动作排序
        var q = ProductTopic.find(queryParams).limit(pageSize).skip(pageStart).sort({
            lastActionTime: -1
        });

        q.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10065,
                    "msg": "服务器错误，查询帖子列表失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查询帖子列表成功",
                "topicList": docs
            });
        });
    },

    // 赞
    likeProductTopic: function(req, res) {
        var topicId = req.params._id; // 帖子Id
        var xihumaker = auth.getSignedCookies(req, res, 'xihumaker');
        var userId = xihumaker.userId;

        ProductTopic.find({
            _id: new ObjectId(topicId),
            likeList: userId
        }, function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10065,
                    "msg": "服务器错误，赞失败"
                });
                return;
            }

            if (docs.length !== 0) {
                res.json({
                    "r": 1,
                    "errcode": 10065,
                    "msg": "已赞"
                });
                return;
            } else {
                ProductTopic.findByIdAndUpdate({
                    _id: new ObjectId(topicId)
                }, {
                    $set: {
                        lastActionTime: Date.now()
                    },
                    $inc: {
                        likeNum: 1
                    },
                    $push: {
                        likeList: userId
                    }
                }, function(err, doc) {
                    if (err) {
                        res.json({
                            "r": 1,
                            "errcode": 10065,
                            "msg": "服务器错误，赞失败"
                        });
                        return;
                    }

                    res.json({
                        r: 0,
                        msg: "赞成功"
                    });
                    return
                });
            }
        });
    },

    // 帖子 - 评论
    commentProductTopic: function(req, res) {
        var topicId = req.params._id; // 帖子Id
        var xihumaker = auth.getSignedCookies(req, res, 'xihumaker');
        var userId = xihumaker.userId;
        var username = xihumaker.username;
        var headimgurl = xihumaker.headimgurl;
        var content = req.body.content;

        ProductTopic.findByIdAndUpdate({
            _id: new ObjectId(topicId)
        }, {
            $set: {
                lastActionTime: Date.now()
            },
            $inc: {
                commentNum: 1
            },
            $push: {
                commentList: {
                    belongToUserId: userId,
                    belongToUsername: username,
                    belongToUserHeadimgurl: headimgurl,
                    content: content,
                    createTime: Date.now()
                }
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10065,
                    "msg": "服务器错误，帖子评论失败"
                });
                return;
            }
            Product.findByIdAndUpdate({
                _id: doc.belongToProductId
            }, {
                $inc: {
                    commentNum: 1
                }
            }, function(err, product) {
                if (err) {
                    res.json({
                        "r": 1,
                        "errcode": 10065,
                        "msg": "服务器错误，帖子评论失败"
                    });
                    return;
                }
                res.json({
                    r: 0,
                    msg: "帖子评论成功",
                    comment: doc.commentList[doc.commentList.length - 1]
                });
                return;
            });
        });
    }

};