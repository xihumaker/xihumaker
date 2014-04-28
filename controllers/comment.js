var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var Comment = require('../models/comment');

var user = require('./user');

var CommentModule = {

    // 围观群众 - 发言
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

        var userId = user.getUserId(req);
        var content = req.body.content;

        var comment = new Comment({
            belongToProject: _id,
            belongToUser: userId,
            content: content,
            createTime: Date.now()
        });
        comment.save(function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10056,
                    "msg": "服务器错误，发言失败"
                });
                return;
            } else {
                res.json({
                    "r": 0,
                    "msg": "发言成功",
                    "comment": doc
                });
                return;
            }
        });
    },

    // 围观群众 - 查找该项目所有的评论
    findCommentsByProjectId: function(req, res) {
        var _id = req.params['_id'];

        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Comment.find({
            belongToProject: _id
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10055,
                    "msg": "服务器错误，查找该项目所有的评论失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找评论成功",
                "comments": docs
            });
            return;
        });
    }



};

module.exports = CommentModule;