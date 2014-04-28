var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var Concern = require('../models/concern');
var Project = require('../models/project');

var user = require('./user');

var ConcernModule = {

    // 关注
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

            Concern.findOne({
                belongToProject: _id,
                belongToUser: userId
            }, function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10048,
                        "msg": "服务器错误，关注失败"
                    });
                    return;
                } else {
                    // 用户已经关注该项目
                    if ( !! doc) {
                        res.json({
                            "r": 1,
                            "errcode": 10049,
                            "msg": "你已经关注该项目，不能重复关注"
                        });
                        return;
                    } else { // 用户未赞过该项目
                        Project.findByIdAndUpdate(_id, {
                            $inc: {
                                concernNum: 1
                            }
                        }, function(err, doc) {
                            if (err) {
                                logger.error(err);
                                res.json({
                                    "r": 1,
                                    "errcode": 10048,
                                    "msg": "服务器错误，关注失败"
                                });
                                return;
                            } else {
                                var concern = new Concern({
                                    belongToProject: _id,
                                    belongToUser: userId,
                                    createTime: Date.now()
                                });
                                concern.save(function(err, doc) {
                                    if (err) {
                                        logger.error(err);
                                        res.json({
                                            "r": 1,
                                            "errcode": 10048,
                                            "msg": "服务器错误，关注失败"
                                        });
                                        return;
                                    } else {
                                        res.json({
                                            "r": 0,
                                            "msg": "关注成功"
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
                "errcode": 10050,
                "msg": "用户未登录，关注失败"
            });
            return;
        }
    },

    // 取消关注
    deleteConcern: function(req, res) {
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

            Concern.findOneAndRemove({
                belongToProject: _id,
                belongToUser: userId
            }, function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10051,
                        "msg": "服务器错误，取消关注失败"
                    });
                    return;
                } else {
                    if ( !! doc) {
                        Project.findByIdAndUpdate(_id, {
                            $inc: {
                                concernNum: -1
                            }
                        }, function(err, doc) {
                            if (err) {
                                logger.error(err);
                                res.json({
                                    "r": 1,
                                    "errcode": 10051,
                                    "msg": "服务器错误，取消关注失败"
                                });
                                return;
                            } else {
                                res.json({
                                    "r": 0,
                                    "msg": "取消关注成功"
                                });
                                return;
                            }
                        });
                    } else { //要删除的关注记录未找到
                        res.json({
                            "r": 1,
                            "errcode": 10052,
                            "msg": "要删除的关注记录未找到"
                        });
                        return;
                    }
                }
            })
        } else {
            res.json({
                "r": 1,
                "errcode": 10053,
                "msg": "用户未登录，取消关注失败"
            });
            return;
        }
    },

    findConcernsByUserId: function(req, res) {
        var userId = req.params['_id'];

        if (userId.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Concern.find({
            belongToUser: userId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10054,
                    "msg": "服务器错误，查找某个用户关注的项目失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找成功",
                "concerns": docs
            });
            return;
        });
    }

};


module.exports = ConcernModule;