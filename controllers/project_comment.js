"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var ProjectComment = require('../models/project_comment');
var User = require('../models/user');
var auth = require('../policies/auth');

module.exports = {

    /**
     * @method addProjectComment
     * 项目 - 发表一个评论
     */
    addProjectComment: function(req, res) {
        var projectId = req.params._id;
        var userId = auth.getUserId(req, res);
        var content = req.body.content;

        User.findOne({
            _id: new ObjectId(userId)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10106,
                    "msg": "服务器错误，评论项目失败"
                });
                return;
            }

            var projectComment = new ProjectComment({
                belongToId: projectId,
                belongToUserId: userId,
                belongToUsername: doc.username,
                headimgurl: doc.headimgurl,
                content: content,
                createTime: Date.now()
            });

            projectComment.save(function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10106,
                        "msg": "服务器错误，评论项目失败"
                    });
                    return;
                }

                res.json({
                    "r": 0,
                    "msg": "评论成功",
                    "comment": doc
                });
                return;
            });
        });
    },

    /**
     * @method findAllCommentsByProjectId
     * 根据项目ID查询所有的评论
     */
    findAllCommentsByProjectId: function(req, res) {
        var projectId = req.params._id;

        ProjectComment.find({
            belongToId: projectId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10107,
                    "msg": "服务器错误，查询所有项目评论失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查询所有项目评论成功",
                "projectComments": docs
            });
        });
    }


};