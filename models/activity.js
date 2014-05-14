/**
 * 活动表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * activityDate     活动日期
 * meetingTime      集合时间
 * startTime        开始时间
 * endTime          结束时间
 * topic            活动主题
 * organizer        发起人
 * city             城市
 * location         地点
 * limit            名额 —— 数字或者写不限制。若有限制，满额后就不能再接受报名了
 * description      详情 —— 图片+纯文本
 * likeNum          活动被赞的个数
 * totalNum         报名者人数
 * checkInNum       签到者人数
 * score            参与者评分（总分）
 * coverUrl         活动封面图片地址
 * createTime       活动创建时间
 * updateTime       活动最后更新时间
 */
var ActivitySchema = new Schema({
    activityDate: String,
    meetingTime: String,
    startTime: String,
    endTime: String,
    topic: String,
    organizer: String,
    city: String,
    location: String,
    limit: {
        type: Number,
        default: 0
    },
    description: String,
    likeNum: {
        type: Number,
        default: 0
    },
    totalNum: {
        type: Number,
        default: 0
    },
    checkInNum: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    coverUrl: String,
    createTime: {
        type: Number,
        default: 0
    },
    updateTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Activity', ActivitySchema, 'ck_activities');