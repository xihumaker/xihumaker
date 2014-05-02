var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
// 加载相关模型
var Activity = require('../models/activity');
var ActivityPeople = require('../models/activity_people');

// 加载相关控制器
var user = require('./user');

var ActivityModule = {

    /**
     * @method createActivity
     * 新建活动
     */
    createActivity: function(req, res) {
        var body = req.body,
            activityDate = body.activityDate,
            meetingTime = body.meetingTime,
            topic = body.topic,
            organizer = body.organizer,
            city = body.city,
            location = body.location,
            limit = body.limit,
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
     * 更新活动
     */
    updateActivityById: function(req, res) {
        var _id = req.params._id;

        var body = req.body,
            activityDate = body.activityDate,
            meetingTime = body.meetingTime,
            topic = body.topic,
            organizer = body.organizer,
            city = body.city,
            location = body.location,
            limit = body.limit,
            description = body.description,
            coverUrl = body.coverUrl;

        console.log(body);

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
                topic: body.topic,
                activityDate: body.activityDate,
                meetingTime: body.meetingTime,
                organizer: body.organizer,
                city: body.city,
                location: body.location,
                limit: body.limit,
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
            hasLogin = false,
            hasJoin = false,
            userId = null,
            activityStatus = 1; // 1 报名中,2 报名人数已满, 3 活动结束

        var localFun = function() {
            Activity.findOne({
                _id: new ObjectId(_id)
            }, function(err, doc) {
                if (err) {
                    logger.error(err);
                    res.render('weixin/activityInfo', {
                        "r": 1,
                        "errcode": 10083,
                        "msg": "服务器错误，查找活动详情失败",
                        "hasLogin": hasLogin,
                        "hasJoin": hasJoin,
                        "userId": userId,
                        "activityStatus": activityStatus
                    });
                    return;
                }

                var now = Date.now();
                var time = (new Date(doc.activityDate + ' ' + doc.meetingTime)).getTime();

                // 报名中：     当前时间 < 集合时间 && 已报名人数 < 限额
                // 报名人数已满：当前时间 < 集合时间 && 已报名人数 >= 限额
                // 活动结束：   当前时间 >= 集合时间
                if (now >= time) {
                    activityStatus = 3; // 活动报名结束
                } else {
                    if (doc.limit !== 0) { // 人数有限制
                        if (doc.totalNum < doc.limit) {
                            activityStatus = 1;
                        } else {
                            activityStatus = 2;
                        }
                    } else { // 人数不限
                        activityStatus = 1;
                    }
                }

                res.render('weixin/activityInfo', {
                    "r": 0,
                    "msg": "查找活动成功",
                    "activity": doc,
                    "hasLogin": hasLogin,
                    "hasJoin": hasJoin,
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
                if (err) {
                    logger.error(err);
                    res.render('weixin/activityInfo', {
                        "r": 1,
                        "errcode": 10083,
                        "msg": "服务器错误，查找活动详情失败",
                        "hasLogin": hasLogin,
                        "hasJoin": hasJoin,
                        "userId": userId,
                        "activityStatus": activityStatus
                    });
                    return;
                }
                // 用户已报名
                if ( !! doc) {
                    hasJoin = true;
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
                res.render('weixin/editActivity', {
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