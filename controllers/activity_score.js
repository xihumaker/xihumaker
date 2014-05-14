var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
// Modal
var Activity = require('../models/activity');
var ActivityScore = require('../models/activity_score');
var ActivityPeople = require('../models/activity_people');
var User = require('../models/user');

// Controller
var user = require('./user');

module.exports = {

    // 活动 - 评价并签到
    scoreActivity: function(req, res) {
        var activityId = req.params._id,
            userId = user.getUserId(req),
            starNum = Number(req.body.starNum) || 5;

        // err处理函数
        var errFun = function(err) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10111,
                    "msg": "服务器错误，评价并签到失败"
                });
                return;
            }
        };

        // 1.首先判断用户是否报名该活动
        ActivityPeople.findOne({
            belongToActivityId: activityId,
            belongToUserId: userId
        }, function(err, doc) {
            errFun(err);

            // doc不为空，说明用户报名了该活动，可以评价并签到
            if ( !! doc) {
                // 2.判断用户是否已经评价并签到
                ActivityScore.findOne({
                    belongToActivityId: activityId,
                    belongToUserId: userId
                }, function(err, doc) {
                    errFun(err);

                    //  doc不为空，说明用户已经评价并签到
                    if ( !! doc) {
                        res.json({
                            "r": 1,
                            "errcode": 10112,
                            "msg": "已签到"
                        });
                        return;
                    } else { // doc不为空，说明用户未评价并签到
                        Activity.findByIdAndUpdate({
                            _id: new ObjectId(activityId)
                        }, {
                            $inc: {
                                checkInNum: 1,
                                score: starNum
                            }
                        }, function(err, doc) {
                            errFun(err);

                            // 新建一条评分记录
                            var activityScore = new ActivityScore({
                                belongToUserId: userId,
                                belongToActivityId: activityId,
                                starNum: starNum,
                                createTime: Date.now()
                            });

                            // 保存评分签到记录
                            activityScore.save(function(err, doc) {
                                errFun(err);

                                res.json({
                                    "r": 0,
                                    "msg": "签到成功"
                                });
                                return;
                            });
                        });
                    }
                });
            } else { // doc为空，说明用户未报名该活动，不能评价并签到
                res.json({
                    "r": 1,
                    "errcode": 10113,
                    "msg": "未报名该活动，不能进行评价并签到"
                });
                return;
            }
        });
    }







};