var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var Activity = require('../models/activity');
var ActivityPeople = require('../models/activity_people');
var User = require('../models/user');

var user = require('./user');

module.exports = {

    /**
     * @method joinActivity
     * 活动报名
     */
    joinActivity: function(req, res) {
        var activityId = req.params._id;
        var userId = user.getUserId(req);

        // 判断用户是否已报名该活动
        ActivityPeople.findOne({
            belongToActivityId: activityId,
            belongToUserId: userId
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10084,
                    "msg": "服务器错误，活动报名失败"
                });
                return;
            }

            // doc不为空，说明用户已报名了该活动
            if ( !! doc) {
                res.json({
                    "r": 1,
                    "errcode": 10085,
                    "msg": "你已经报名该活动，不能重复报名"
                });
                return;
            } else { // doc为空，说明用户还未报名该活动
                // 活动表报名人数totalNum加1
                Activity.findByIdAndUpdate({
                    _id: new ObjectId(activityId)
                }, {
                    $inc: {
                        totalNum: 1
                    }
                }, function(err, doc) {
                    if (err) {
                        logger.error(err);
                        res.json({
                            "r": 1,
                            "errcode": 10084,
                            "msg": "服务器错误，活动报名失败"
                        });
                        return;
                    }

                    User.findOne({
                        _id: new ObjectId(userId)
                    }, {
                        password: 0
                    }, function(err, doc) {
                        if (err) {
                            logger.error(err);
                            res.json({
                                "r": 1,
                                "errcode": 10084,
                                "msg": "服务器错误，活动报名失败"
                            });
                            return;
                        }

                        var activityPeople = new ActivityPeople({
                            belongToActivityId: activityId,
                            belongToUserId: userId,
                            belongToUsername: doc.username,
                            createTime: Date.now()
                        });

                        activityPeople.save(function(err, doc) {
                            if (err) {
                                logger.error(err);
                                res.json({
                                    "r": 1,
                                    "errcode": 10084,
                                    "msg": "服务器错误，活动报名失败"
                                });
                                return;
                            }

                            res.json({
                                "r": 0,
                                "msg": "活动报名成功"
                            });
                            return;
                        });
                    });
                });
            }
        });
    },

    /**
     * @method findAllPeoplesById
     * 查找某个活动所有的报名用户
     */
    findAllPeoplesById: function(req, res) {
        var activityId = req.params._id;

        ActivityPeople.find({
            belongToActivityId: new ObjectId(activityId)
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10086,
                    "msg": "服务器错误，查找某个活动所有的报名用户失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找报名用户列表成功",
                "activityPeoples": docs
            });
            return;
        });
    },

    /**
     * @method findActivitiesByUserId
     * 根据用户ID查询报名的所有活动
     */
    findActivitiesByUserId: function(req, res) {
        var userId = req.params._id;

        ActivityPeople.find({
            belongToUserId: userId
        }, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10087,
                    "msg": "服务器错误，根据用户ID查询报名的所有活动失败"
                });
                return;
            }

            var activityIdList = []; // 保存所有报名的活动ID
            for (var i = 0; i < docs.length; i++) {
                activityIdList.push(docs[i].belongToActivityId);
            }

            Activity.find({
                "_id": {
                    $in: activityIdList
                }
            }, function(err, docs) {
                res.json({
                    'r': 0,
                    'msg': '请求成功',
                    'activities': docs
                });
            });
        });
    }








};