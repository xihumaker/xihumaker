"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var Project = require('../models/project');
var ProjectConcern = require('../models/project_concern');
var auth = require('../policies/auth');

module.exports = {

    /**
     * @method concernProject
     * 项目 - 关注
     */
    concernProject: function(req, res) {
        var userId = auth.getUserId(req, res);
        var projectId = req.params._id;

        ProjectConcern.findOne({
            belongToProjectId: projectId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10101,
                    "msg": "服务器错误，关注失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 1,
                    "errcode": 10102,
                    "msg": "不能重复关注"
                });
                return;
            } else {
                Project.findByIdAndUpdate({
                    _id: new ObjectId(projectId)
                }, {
                    $inc: {
                        concernNum: 1,
                        rankScore: 5
                    }
                }, function(err, doc) {
                    if (err) {
                        logger.error(err);
                        res.json({
                            "r": 1,
                            "errcode": 10101,
                            "msg": "服务器错误，关注失败"
                        });
                        return;
                    }

                    var projectConcern = new ProjectConcern({
                        belongToProjectId: projectId,
                        belongToUserId: userId,
                        createTime: Date.now()
                    });

                    projectConcern.save(function(err, doc) {
                        if (err) {
                            logger.error(err);
                            res.json({
                                "r": 1,
                                "errcode": 10101,
                                "msg": "服务器错误，关注失败"
                            });
                            return;
                        }

                        res.json({
                            "r": 0,
                            "msg": "关注成功"
                        });
                    });
                });
            }
        });
    },

    /**
     * @method unconcernProject
     * 项目 - 取消关注
     */
    unconcernProject: function(req, res) {
        var userId = auth.getUserId(req, res);
        var projectId = req.params._id;

        ProjectConcern.findOneAndRemove({
            belongToProjectId: projectId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10103,
                    "msg": "服务器错误，取消关注失败"
                });
                return;
            }

            if ( !! doc) {
                Project.findByIdAndUpdate({
                    _id: new ObjectId(projectId)
                }, {
                    $inc: {
                        concernNum: -1,
                        rankScore: -5
                    }
                }, function(err, doc) {
                    if (err) {
                        logger.error(err);
                        res.json({
                            "r": 1,
                            "errcode": 10103,
                            "msg": "服务器错误，取消关注失败"
                        });
                        return;
                    }

                    res.json({
                        "r": 0,
                        "msg": "取消关注成功"
                    });
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10104,
                    "msg": "关注记录不存在或已删除"
                });
                return;
            }
        });
    },

    /**
     * @method findProjectsByUserId
     * 项目 - 查找用户关注的所有项目
     */
    findProjectsByUserId: function(req, res) {
        var userId = req.params._id;

        ProjectConcern.find({
            belongToUserId: userId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10105,
                    "msg": "服务器错误，查找用户关注的所有项目"
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
                        "errcode": 10105,
                        "msg": "服务器错误，查找用户关注的所有项目"
                    });
                    return;
                }

                res.json({
                    "r": 0,
                    "msg": "查找用户关注的所有项目成功",
                    "projects": docs
                });
                return;
            });
        });
    }



};