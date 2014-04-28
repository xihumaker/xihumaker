var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var Like = require('../models/like');
var Project = require('../models/project');

var user = require('./user');

var LikeModule = {

    // 对某个项目发起赞
    create: function(req, res) {
        var _id = req.params['_id'];

        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        if (user.hasLogin(req)) {
            var userId = user.getUserId(req);

            Like.findOne({
                belongToProject: _id,
                belongToUser: userId
            }, function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10043,
                        "msg": "服务器错误，赞失败"
                    });
                    return;
                } else {
                    // 用户已经赞过该项目
                    if ( !! doc) {
                        res.json({
                            "r": 1,
                            "errcode": 10044,
                            "msg": "你已经赞过该项目，不能重复赞"
                        });
                        return;
                    } else { // 用户未赞过该项目
                        Project.findByIdAndUpdate(_id, {
                            $inc: {
                                likeNum: 1
                            }
                        }, function(err, doc) {
                            if (err) {
                                logger.error(err);
                                res.json({
                                    "r": 1,
                                    "errcode": 10043,
                                    "msg": "服务器错误，赞失败"
                                });
                                return;
                            } else {
                                var like = new Like({
                                    belongToProject: _id,
                                    belongToUser: userId,
                                    createTime: Date.now()
                                });
                                like.save(function(err, doc) {
                                    if (err) {
                                        logger.error(err);
                                        res.json({
                                            "r": 1,
                                            "errcode": 10043,
                                            "msg": "服务器错误，赞失败"
                                        });
                                        return;
                                    } else {
                                        res.json({
                                            "r": 0,
                                            "msg": "赞成功"
                                        });
                                        return;
                                    }
                                });
                            }
                        });


                    }
                }
            });
        } else {
            res.json({
                "r": 1,
                "errcode": 10042,
                "msg": "用户未登录，赞失败"
            });
            return;
        }
    },

    // 对某个项目取消赞
    deleteLike: function(req, res) {
        var _id = req.params['_id'];

        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        if (user.hasLogin(req)) {
            var userId = user.getUserId(req);

            Like.findOneAndRemove({
                belongToProject: _id,
                belongToUser: userId
            }, function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10045,
                        "msg": "服务器错误，取消赞赞失败"
                    });
                    return;
                } else {
                    if ( !! doc) {
                        Project.findByIdAndUpdate(_id, {
                            $inc: {
                                likeNum: -1
                            }
                        }, function(err, doc) {
                            if (err) {
                                logger.error(err);
                                res.json({
                                    "r": 1,
                                    "errcode": 10045,
                                    "msg": "服务器错误，取消赞赞失败"
                                });
                                return;
                            } else {
                                res.json({
                                    "r": 0,
                                    "msg": "取消赞成功"
                                });
                                return;
                            }
                        });
                    } else { //要删除的赞记录未找到
                        res.json({
                            "r": 1,
                            "errcode": 10046,
                            "msg": "要删除的赞记录未找到"
                        });
                        return;
                    }
                }
            })
        } else {
            res.json({
                "r": 1,
                "errcode": 10045,
                "msg": "用户未登录，取消赞失败"
            });
            return;
        }
    },


    // 查找某个用户发起的赞
    findLikesByUserId: function(req, res) {
        var userId = req.params['_id'];

        if (userId.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Like.find({
            belongToUser: userId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10047,
                    "msg": "服务器错误，查找某个用户发起的赞失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找赞成功",
                "likes": docs
            });
            return;
        });
    }



};

module.exports = LikeModule;