/**
 * 活动评分表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * belongToUserId		谁评的
 * belongToActivityId	评哪个活动
 * starNum				几星（1，2，3，4，5）
 * createTime			评时间
 */
var ActivityScoreSchema = new Schema({
    belongToUserId: ObjectId,
    belongToActivityId: ObjectId,
    starNum: {
        type: Number,
        default: 0
    }
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ActivityScore', ActivityScoreSchema, 'ck_activitity_scores');