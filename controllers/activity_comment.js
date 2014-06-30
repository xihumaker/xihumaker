"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var ActivityComment = require('../models/activity_comment');
var User = require('../models/user');
var auth = require('../policies/auth');

module.exports = {

    /**
     * @method commentActivity
     * 活动 - 发表一个评论
     */
    commentActivity: function(req, res) {
        var activityId = req.params._id,
            userId = auth.getUserId(req, res),
            content = req.body.content;

        User.findOne({
            _id: new ObjectId(userId)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10109,
                    "msg": "服务器错误，评论活动失败"
                });
                return;
            }

            var activityComment = new ActivityComment({
                belongToId: activityId,
                belongToUserId: userId,
                belongToUsername: doc.username,
                headimgurl: doc.headimgurl,
                content: content,
                createTime: Date.now()
            });

            activityComment.save(function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.json({
                        "r": 1,
                        "errcode": 10109,
                        "msg": "服务器错误，评论活动失败"
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
     * @method findAllCommentsByActivityId
     * 活动 - 查找该活动所有的评论
     */
    findAllCommentsByActivityId: function(req, res) {
        var activityId = req.params._id;

        ActivityComment.find({
            belongToId: activityId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10110,
                    "msg": "服务器错误，查询所有活动评论失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查询所有活动评论成功",
                "comments": docs
            });
        });
    }

};