var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
// Modal
var Project = require('../models/project');
var ProjectPeople = require('../models/project_people');
var User = require('../models/user');

// Controller
var user = require('./user');

module.exports = {

    /**
     * @method joinProject
     * 加入项目
     */
    joinProject: function(req, res) {
        var projectId = req.params._id;
        var userId = user.getUserId(req);

        // 首先需要判断用户是否已经在该项目中
        ProjectPeople.findOne({
            belongToProjectId: projectId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10091,
                    "msg": "服务器错误，加入项目失败"
                });
                return;
            }

            if ( !! doc) { // 说明了用户已经加入了该项目
                res.json({
                    "r": 1,
                    "errcode": 10092,
                    "msg": "不能重复加入"
                });
                return;
            } else { // 说明用户未加入该项目
                User.findOne({
                    _id: new ObjectId(userId)
                }, {
                    password: 0
                }, function(err, doc) {
                    if (err) {
                        logger.error(err);
                        res.json({
                            "r": 1,
                            "errcode": 10091,
                            "msg": "服务器错误，加入项目失败"
                        });
                        return;
                    }

                    var projectPeople = new ProjectPeople({
                        belongToProjectId: projectId,
                        belongToUserId: userId,
                        belongToUsername: doc.username,
                        headimgurl: doc.headimgurl,
                        createTime: Date.now()
                    });

                    projectPeople.save(function(err, doc) {
                        if (err) {
                            logger.error(err);
                            res.json({
                                "r": 1,
                                "errcode": 10091,
                                "msg": "服务器错误，加入项目失败"
                            });
                            return;
                        }

                        res.json({
                            "r": 0,
                            "msg": "加入项目成功"
                        });
                        return;
                    });
                });
            }

        });
    },

    /**
     * @method quitProject
     * 退出项目
     */
    quitProject: function(req, res) {
        var projectId = req.params._id;
        var userId = user.getUserId(req);

        ProjectPeople.findOneAndRemove({
            belongToProjectId: projectId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10091,
                    "msg": "服务器错误，加入项目失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "退出成功"
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10094,
                    "msg": "项目不存在或已删除"
                });
                return;
            }
        });
    },

    /**
     * @method findAllPeoplesByProjectId
     * 根据项目ID查找所有的项目组成员
     */
    findAllPeoplesByProjectId: function(req, res) {
        var projectId = req.params._id;

        ProjectPeople.find({
            belongToProjectId: new ObjectId(projectId)
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10095,
                    "msg": "服务器错误，查找项目组成员失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找项目组成员成功",
                "projectPeoples": docs
            });
        });
    },

    /**
     * @method findProjectsByUserId
     * 根据用户ID查询加入的所有项目
     */
    findProjectsByUserId: function(req, res) {
        var userId = req.params._id;

        ProjectPeople.find({
            belongToUserId: new ObjectId(userId)
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10095,
                    "msg": "服务器错误，查找用户加入的所有项目失败"
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
                        "errcode": 10095,
                        "msg": "服务器错误，查找用户加入的所有项目失败"
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