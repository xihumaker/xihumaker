"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Activity = require('../models/activity');
var ActivityLike = require('../models/activity_like');
var auth = require('../policies/auth');


module.exports = {

    /**
     * @method likeActivity
     * 活动 - 赞
     */
    likeActivity: function(req, res) {
        var activityId = req.params._id;
        var userId = auth.getUserId(req, res);

        // 判断用户是否已经赞过
        ActivityLike.findOne({
            belongToActivityId: activityId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10088,
                    "msg": "服务器错误，赞失败"
                });
                return;
            }

            // 用户已赞过该活动
            if ( !! doc) {
                res.json({
                    "r": 1,
                    "errcode": 10089,
                    "msg": "不能重复赞"
                });
                return;
            } else {
                // 用户未赞过，赞个数加1
                Activity.findByIdAndUpdate({
                    _id: new ObjectId(activityId)
                }, {
                    $inc: {
                        likeNum: 1
                    }
                }, function(err, doc) {
                    if (err) {
                        res.json({
                            "r": 1,
                            "errcode": 10088,
                            "msg": "服务器错误，赞失败"
                        });
                        return;
                    }

                    // 生成一条赞记录
                    var activityLike = new ActivityLike({
                        belongToActivityId: activityId,
                        belongToUserId: userId,
                        createTime: Date.now()
                    });

                    activityLike.save(function(err, doc) {
                        if (err) {
                            res.json({
                                "r": 1,
                                "errcode": 10088,
                                "msg": "服务器错误，赞失败"
                            });
                            return;
                        }

                        res.json({
                            "r": 0,
                            "msg": "赞成功"
                        });
                        return;
                    });
                });
            }
        });


    }







};