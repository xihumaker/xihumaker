var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
// 加载相关模型
var Activity = require('../models/activity');
var ActivityPeople = require('../models/activity_people');
var ActivityScore = require('../models/activity_score');

// 加载相关控制器
var user = require('./user');

var ActivityModule = {

    /**
     * @method createActivity
     * 活动 - 新建活动
     */
    createActivity: function(req, res) {
        var body = req.body,
            activityDate = body.activityDate,
            meetingTime = body.meetingTime,
            startTime = body.startTime,
            endTime = body.endTime,
            topic = body.topic,
            organizer = body.organizer,
            city = body.city,
            location = body.location,
            limit = Number(body.limit) || 0, // 如果Number(body.limit)值为NoN，则名额使用默认值不限
            description = body.description,
            coverUrl = body.coverUrl;

        if (!topic) {
            res.json({
                "r": 1,
                "errcode": 10073,
                "msg": "活动主题不能为空"
            });
            return;
        }
        if (!activityDate) {
            res.json({
                "r": 1,
                "errcode": 10072,
                "msg": "活动日期不能为空"
            });
            return;
        }
        if (!meetingTime) {
            res.json({
                "r": 1,
                "errcode": 10074,
                "msg": "集合时间不能为空"
            });
            return;
        }
        if (!startTime) {
            res.json({
                "r": 1,
                "errcode": 10114,
                "msg": "开始时间不能为空"
            });
            return;
        }
        if (!endTime) {
            res.json({
                "r": 1,
                "errcode": 10115,
                "msg": "结束时间不能为空"
            });
            return;
        }
        if (!organizer) {
            res.json({
                "r": 1,
                "errcode": 10075,
                "msg": "发起人不能为空"
            });
            return;
        }
        if (!city) {
            res.json({
                "r": 1,
                "errcode": 10076,
                "msg": "活动城市不能为空"
            });
            return;
        }
        if (!location) {
            res.json({
                "r": 1,
                "errcode": 10077,
                "msg": "活动地点不能为空"
            });
            return;
        }

        var activity = new Activity({
            activityDate: activityDate,
            meetingTime: meetingTime,
            startTime: startTime,
            endTime: endTime,
            topic: topic,
            organizer: organizer,
            city: city,
            location: location,
            limit: limit,
            description: description,
            coverUrl: coverUrl,
            createTime: Date.now(),
            updateTime: Date.now()
        });

        activity.save(function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10078,
                    "msg": "服务器错误，新建活动失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "新建活动成功"
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

        var body = req.body,
            activityDate = body.activityDate,
            meetingTime = body.meetingTime,
            startTime = body.startTime,
            endTime = body.endTime,
            topic = body.topic,
            organizer = body.organizer,
            city = body.city,
            location = body.location,
            limit = Number(body.limit) || 0, // 如果Number(body.limit)值为NoN，则名额使用默认值不限
            description = body.description,
            coverUrl = body.coverUrl;

        if (!topic) {
            res.json({
                "r": 1,
                "errcode": 10073,
                "msg": "活动主题不能为空"
            });
            return;
        }
        if (!activityDate) {
            res.json({
                "r": 1,
                "errcode": 10072,
                "msg": "活动日期不能为空"
            });
            return;
        }
        if (!meetingTime) {
            res.json({
                "r": 1,
                "errcode": 10074,
                "msg": "集合时间不能为空"
            });
            return;
        }
        if (!startTime) {
            res.json({
                "r": 1,
                "errcode": 10114,
                "msg": "开始时间不能为空"
            });
            return;
        }
        if (!endTime) {
            res.json({
                "r": 1,
                "errcode": 10115,
                "msg": "结束时间不能为空"
            });
            return;
        }
        if (!organizer) {
            res.json({
                "r": 1,
                "errcode": 10075,
                "msg": "发起人不能为空"
            });
            return;
        }
        if (!city) {
            res.json({
                "r": 1,
                "errcode": 10076,
                "msg": "活动城市不能为空"
            });
            return;
        }
        if (!location) {
            res.json({
                "r": 1,
                "errcode": 10077,
                "msg": "活动地点不能为空"
            });
            return;
        }

        Activity.findByIdAndUpdate(_id, {
            $set: {
                topic: topic,
                activityDate: activityDate,
                meetingTime: meetingTime,
                startTime: startTime,
                endTime: endTime,
                organizer: organizer,
                city: city,
                location: location,
                limit: limit,
                description: description,
                coverUrl: coverUrl,
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

            if ( !! doc) {
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
        // TODO
    },

    /**
     * @method searchActivities
     * 活动查询
     */
    searchActivities: function(req, res) {
        var pageSize = Number(req.query.pageSize) || 10,
            pageStart = Number(req.query.pageStart) || 0,
            city = Number(req.query.city) || 0;

        var queryParams = {};
        if (city !== 0) {
            queryParams.city = city;
        }
        var query = Activity.find(queryParams).sort('-createTime').limit(pageSize).skip(pageStart);

        query.exec(function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10082,
                    "msg": "服务器错误，查询活动失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "分页查询活动成功",
                "activities": docs
            });
        });
    },

    /**
     * @method showActivity
     * 微信端 - 活动详情页
     */
    showActivity: function(req, res) {
        var _id = req.params._id,
            hasLogin = false, // 是否登录
            hasJoin = false, // 是否报名活动
            hasCheckIn = false, // 是否已评分并签到
            userId = null, // 用户Id
            activityStatus = 1; // 1 报名中,2 报名人数已满, 3 活动结束, 4 签到中, 5 进行中

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
        if (user.hasLogin(req)) {
            hasLogin = true;
            userId = user.getUserId(req);
            // 判断用户是否已经报名该活动
            ActivityPeople.findOne({
                belongToActivityId: _id,
                belongToUserId: userId
            }, function(err, doc) {
                errFun(err);

                // doc不为空，说明用户已报名该活动
                if ( !! doc) {
                    hasJoin = true;
                    // 判断用户是否已评分并签到
                    ActivityScore.findOne({
                        belongToUserId: userId,
                        belongToActivityId: _id
                    }, function(err, doc) {
                        errFun(err);

                        // doc不为空，说明用户已评分并签到
                        if ( !! doc) {
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
     * @method editActivity
     * 显示更新活动页面
     */
    editActivity: function(req, res) {
        var activityId = req.params._id;

        Activity.findOne({
            _id: new ObjectId(activityId)
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.render('admin/editActivity', {
                    "r": 1,
                    "errcode": 10083,
                    "msg": "服务器错误，查找活动详情失败"
                });
                return;
            }

            if ( !! doc) {
                res.render('admin/editActivity', {
                    "r": 0,
                    "msg": "请求成功",
                    "activity": doc
                });
                return;
            } else {
                res.render('admin/editActivity', {
                    "r": 1,
                    "errcode": 10090,
                    "msg": "活动不存在"
                });
            }
        });
    }






};

module.exports = ActivityModule;