var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
// Modal
var Project = require('../models/project');
var ProjectTopic = require('../models/project_topic');
var User = require('../models/user');

// Controller
var user = require('./user');

module.exports = {

    // 添加一条江湖告急
    addOneTopic: function(req, res) {
        var projectId = req.params._id,
            content = req.body.content;

        if (!content) {
            res.json({
                "r": 1,
                "errcode": 10106,
                "msg": "内容不能为空"
            });
            return;
        }

        Project.findOne({
            _id: new ObjectId(projectId)
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10106,
                    "msg": "服务器错误，添加江湖告急失败"
                });
                return;
            }

            var project = doc;

            var projectTopic = new ProjectTopic({
                belongToProjectId: projectId,
                belongToProjectTitle: project.title,
                content: content,
                createTime: Date.now()
            });

            projectTopic.save(function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10106,
                        "msg": "服务器错误，添加江湖告急失败"
                    });
                    return;
                }

                res.json({
                    "r": 0,
                    "msg": "添加江湖告急成功",
                    "topic": doc
                });
                return;
            });
        });
    },

    // 删除一条江湖告急
    removeTopicById: function(req, res) {
        var projectId = req.params._id,
            projectTopicId = req.params.tid;

        ProjectTopic.findOneAndRemove({
            belongToProjectId: projectId,
            _id: new ObjectId(projectTopicId)
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10106,
                    "msg": "服务器错误，删除江湖告急失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "删除成功"
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10106,
                    "msg": "要删除的江湖告急不存在"
                });
                return;
            }
        });
    },

    // 查找某个项目的所有江湖告急
    findProjectTopics: function(req, res) {
        var projectId = req.params._id;

        ProjectTopic.find({
            belongToProjectId: projectId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10106,
                    "msg": "服务器错误，查找江湖告急失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找江湖告急成功",
                "topics": docs
            });
            return;
        });
    },

    // 添加一条江湖告急回复
    addOneTopicComment: function(req, res) {
        var projectId = req.params._id,
            topicId = req.params.topicId,
            content = req.body.content,
            userId = user.getUserId(req);

        User.findOne({
            _id: new ObjectId(userId)
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10116,
                    "msg": "服务器错误，添加江湖告急回复失败"
                });
                return;
            }

            var user = doc;

            var comment = {
                belongToUserId: userId,
                belongToUsername: user.username,
                headimgurl: user.headimgurl,
                content: content,
                createTime: Date.now()
            }

            ProjectTopic.findByIdAndUpdate({
                _id: topicId
            }, {
                $push: {
                    comments: comment
                }
            }, function(err, doc) {
                if (err) {

                }

                res.json({
                    "r": 0,
                    "msg": "回复江湖告急成功",
                    "comment": comment
                });
                return;
            });
        });
    },

    // 江湖救急
    findTopicsByPage: function(req, res) {
        var pageSize = req.body.pageSize || 10,
            pageStart = req.body.pageStart || 0;

        var query = ProjectTopic.find({}).limit(pageSize).skip(pageStart);

        query.exec(function(err, docs) {
            if (err) {

            }

            res.json({
                "r": "0",
                "msg": "江湖救急查找成功",
                "topics": docs
            });

        });
    }


};