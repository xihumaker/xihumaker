/**
 * 活动赞表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * belongToUserId		谁赞的
 * belongToActivityId	赞哪个活动
 * createTime			赞时间
 */
var ActivityLikeSchema = new Schema({
    belongToUserId: ObjectId,
    belongToActivityId: ObjectId,
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ActivityLike', ActivityLikeSchema, 'ck_activitity_likes');