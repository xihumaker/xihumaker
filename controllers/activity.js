"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var Activity = require('../models/activity');
var ActivityPeople = require('../models/activity_people');
var ActivityScore = require('../models/activity_score');
var auth = require('../policies/auth');


/**
 * 检测活动属性
 */
function checkActivity(req, res, activity) {
    if (!activity.topic) {
        res.json({
            "r": 1,
            "errcode": 10073,
            "msg": "活动主题不能为空"
        });
        return false;
    }
    if (!activity.activityDate) {
        res.json({
            "r": 1,
            "errcode": 10072,
            "msg": "活动日期不能为空"
        });
        return false;
    }
    if (!activity.meetingTime) {
        res.json({
            "r": 1,
            "errcode": 10074,
            "msg": "集合时间不能为空"
        });
        return false;
    }
    if (!activity.startTime) {
        res.json({
            "r": 1,
            "errcode": 10114,
            "msg": "开始时间不能为空"
        });
        return false;
    }
    if (!activity.endTime) {
        res.json({
            "r": 1,
            "errcode": 10115,
            "msg": "结束时间不能为空"
        });
        return false;
    }
    if (!activity.organizer) {
        res.json({
            "r": 1,
            "errcode": 10075,
            "msg": "发起人不能为空"
        });
        return false;
    }
    if (!activity.city) {
        res.json({
            "r": 1,
            "errcode": 10076,
            "msg": "活动城市不能为空"
        });
        return false;
    }
    if (!activity.location) {
        res.json({
            "r": 1,
            "errcode": 10077,
            "msg": "活动地点不能为空"
        });
        return false;
    }
    return true;
}

module.exports = {

    /**
     * @method createActivity
     * 活动 - 新建活动
     */
    createActivity: function(req, res) {
        var body = req.body;

        if (!checkActivity(req, res, body)) {
            return;
        }

        var activity = new Activity({
            activityDate: body.activityDate,
            meetingTime: body.meetingTime,
            startTime: body.startTime,
            endTime: body.endTime,
            topic: body.topic,
            organizer: body.organizer,
            city: body.city,
            location: body.location,
            limit: Number(body.limit) || 0, // 如果Number(body.limit)值为NaN，则名额使用默认值不限
            description: body.description,
            coverUrl: body.coverUrl,
            createTime: Date.now(),
            updateTime: Date.now()
        });

        activity.save(function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10078,
                    "msg": "服务器错误，新建活动失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "新建活动成功",
                "activity": doc
            });
            return;
        });
    },

    /**
     * @method updateActivityById
     * 活动 - 更新活动
     */
    updateActivityById: function(req, res) {
        var _id = req.params._id;
        var body = req.body;

        if (!checkActivity(req, res, body)) {
            return;
        }

        Activity.findByIdAndUpdate(_id, {
            $set: {
                topic: body.topic,
                activityDate: body.activityDate,
                meetingTime: body.meetingTime,
                startTime: body.startTime,
                endTime: body.endTime,
                organizer: body.organizer,
                city: body.city,
                location: body.location,
                limit: Number(body.limit) || 0,
                description: body.description,
                coverUrl: body.coverUrl,
                updateTime: Date.now()
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10080,
                    "msg": "服务器错误，更新活动失败"
                });
                return;
            }

            if (!!doc) {
                res.json({
                    "r": 0,
                    "msg": "修改成功"
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10081,
                    "msg": "更新活动失败"
                });
                return;
            }
        });
    },

    /**
     * @method deleteActivityById
     * 删除活动
     */
    deleteActivityById: function(req, res) {
        var _id = req.params._id;

        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Activity.findOneAndRemove({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10127,
                    "msg": "服务器错误，删除活动失败"
                });
                return;
            }

            if (!!doc) {
                res.json({
                    "r": 0,
                    "msg": "删除成功"
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10128,
                    "msg": "要删除的活动记录未找到"
                });
                return;
            }
        });
    },

    /**
     * @method searchActivities
     * 活动查询
     */
    searchActivities: function(req, res) {
        var query = req.query;
        var pageSize = Number(query.pageSize) || 10;
        var pageStart = Number(query.pageStart) || 0;
        var city = Number(query.city) || 0;

        var queryParams = {};
        if (city !== 0) {
            queryParams.city = city;
        }
        var q = Activity.find(queryParams).sort('-createTime').limit(pageSize).skip(pageStart);

        q.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10082,
                    "msg": "服务器错误，查询活动失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查询活动成功",
                "activities": docs
            });
        });
    },

    /**
     * @method showWeixinActivity
     * 微信端 - 活动详情页
     */
    showWeixinActivity: function(req, res) {
        var _id = req.params._id;
        var hasLogin = auth.userAuth(req, res); // 是否登录
        var hasJoin = false; // 是否报名活动
        var hasCheckIn = false; // 是否已评分并签到
        var userId = null; // 用户Id
        var activityStatus = 1; // 1 报名中,2 报名人数已满, 3 活动结束, 4 签到中, 5 进行中

        var errFun = function(err) {
            if (err) {
                logger.error(err);
                res.render('weixin/activityInfo', {
                    "r": 1,
                    "errcode": 10083,
                    "msg": "服务器错误，查找活动详情失败",
                    "hasLogin": hasLogin,
                    "hasJoin": hasJoin,
                    "hasCheckIn": hasCheckIn,
                    "userId": userId,
                    "activityStatus": activityStatus
                });
                return;
            }
        };

        var localFun = function() {
            Activity.findOne({
                _id: new ObjectId(_id)
            }, function(err, doc) {
                errFun(err);

                var nowPoint = Date.now();
                var startTimePoint = (new Date(doc.activityDate + ' ' + doc.startTime)).getTime(); // 开始时间点
                var endTimePoint = (new Date(doc.activityDate + ' ' + doc.endTime)).getTime(); // 结束时间点
                var meetingTimePoint = (new Date(doc.activityDate + ' ' + doc.meetingTime)).getTime(); // 集合时间点

                if (nowPoint > endTimePoint) {
                    activityStatus = 3; // 活动结束
                } else if (nowPoint > startTimePoint && nowPoint <= endTimePoint) {
                    activityStatus = 5; // 进行中
                } else if (nowPoint > meetingTimePoint && nowPoint <= startTimePoint) {
                    activityStatus = 4; // 签到中
                } else {
                    if (doc.limit !== 0) { // 人数有限制
                        if (doc.totalNum < doc.limit) {
                            activityStatus = 1; // 报名中
                        } else {
                            activityStatus = 2; // 报名人数已满
                        }
                    } else { // 人数不限
                        activityStatus = 1; // 报名中
                    }
                }

                res.render('weixin/activityInfo', {
                    "r": 0,
                    "msg": "查找活动成功",
                    "activity": doc,
                    "hasLogin": hasLogin,
                    "hasJoin": hasJoin,
                    "hasCheckIn": hasCheckIn,
                    "userId": userId,
                    "activityStatus": activityStatus
                });
            });
        };

        // 用户已经登录
        if (hasLogin) {
            userId = auth.getUserId(req, res);
            // 判断用户是否已经报名该活动
            ActivityPeople.findOne({
                belongToActivityId: _id,
                belongToUserId: userId
            }, function(err, doc) {
                errFun(err);

                // doc不为空，说明用户已报名该活动
                if (!!doc) {
                    hasJoin = true;
                    // 判断用户是否已评分并签到
                    ActivityScore.findOne({
                        belongToUserId: userId,
                        belongToActivityId: _id
                    }, function(err, doc) {
                        errFun(err);

                        // doc不为空，说明用户已评分并签到
                        if (!!doc) {
                            hasCheckIn = true;
                        }
                    });
                }

                localFun();
            });
        } else { // 用户未登录
            localFun();
        }
    },

    /**
     * @method showEditActivity
     * 显示更新活动页面
     */
    showEditActivity: function(req, res) {
        var activityId = req.params._id;

        Activity.findOne({
            _id: new ObjectId(activityId)
        }, function(err, doc) {
            if (err) {
                res.render('admin/editActivity', {
                    "r": 1,
                    "errcode": 10083,
                    "msg": "服务器错误，查找活动详情失败"
                });
                return;
            }

            if (!!doc) {
                res.render('admin/editActivity', {
                    "r": 0,
                    "msg": "显示更新活动页面成功",
                    "activity": doc
                });
                return;
            } else {
                res.render('admin/editActivity', {
                    "r": 1,
                    "errcode": 10090,
                    "msg": "要更新的活动记录不存在"
                });
            }
        });
    }

};
