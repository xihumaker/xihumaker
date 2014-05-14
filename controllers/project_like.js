var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
// Modal
var Project = require('../models/project');
var ProjectLike = require('../models/project_like');
var User = require('../models/user');

// Controller
var user = require('./user');

module.exports = {

    /**
     * @method likeProject
     * 项目 - 赞
     */
    likeProject: function(req, res) {
        var projectId = req.params._id,
            userId = user.getUserId(req);

        ProjectLike.findOne({
            belongToProjectId: projectId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10043,
                    "msg": "服务器错误，赞失败"
                });
                return;
            }

            if ( !! doc) { // 说明用户已经赞过该项目
                res.json({
                    "r": 1,
                    "errcode": 10044,
                    "msg": "你已经赞过该项目，不能重复赞"
                });
                return;
            } else { // 说明用户没有赞过该项目
                Project.findByIdAndUpdate({
                    _id: new ObjectId(projectId)
                }, {
                    $inc: {
                        likeNum: 1,
                        rankScore: 1
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
                    }

                    var projectLike = new ProjectLike({
                        belongToProjectId: projectId,
                        belongToUserId: userId,
                        createTime: Date.now()
                    });

                    projectLike.save(function(err, doc) {
                        if (err) {
                            logger.error(err);
                            res.json({
                                "r": 1,
                                "errcode": 10043,
                                "msg": "服务器错误，赞失败"
                            });
                            return;
                        }

                        res.json({
                            "r": 0,
                            "msg": "赞成功"
                        });
                    });
                });
            }
        });
    },

    /**
     * @method unlikeProject
     * 项目 - 取消赞
     */
    unlikeProject: function(req, res) {
        var projectId = req.params._id,
            userId = user.getUserId(req);

        ProjectLike.findOneAndRemove({
            belongToProjectId: projectId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10098,
                    "msg": "服务器错误，取消赞失败"
                });
                return;
            }

            if ( !! doc) {
                Project.findByIdAndUpdate({
                    _id: new ObjectId(projectId)
                }, {
                    $inc: {
                        likeNum: -1,
                        rankScore: -1
                    }
                }, function(err, doc) {
                    if (err) {
                        logger.error(err);
                        res.json({
                            "r": 1,
                            "errcode": 10098,
                            "msg": "服务器错误，取消赞失败"
                        });
                        return;
                    }

                    res.json({
                        "r": 0,
                        "msg": "取消赞成功"
                    });
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10099,
                    "msg": "赞记录不存在或已删除"
                });
                return;
            }
        });
    },

    /**
     * @method findProjectsByUserId
     * 查询某个用户赞过的所有项目
     */
    findProjectsByUserId: function(req, res) {
        var userId = req.params._id;

        ProjectLike.find({
            belongToUserId: userId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10100,
                    "msg": "服务器错误，查询用户赞过的所有项目失败"
                });
                return;
            }

            var projectIdList = [];
            for (var i = 0; i < docs.length; i++) {
                projectIdList.push(docs[i].belongToProjectId);
            }

            Project.find({
                "_id": {
                    $in: projectIdList
                }
            }, function(err, docs) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10100,
                        "msg": "服务器错误，查询用户赞过的所有项目失败"
                    });
                    return;
                }

                res.json({
                    "r": 0,
                    "msg": "请求成功",
                    "projects": docs
                });
                return;
            });
        });
    }

};