/**
 * 活动报名表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id
 * belongToActivityId   关联的活动
 * belongToUserId       关联的用户ID
 * belongToUsername     关联的用户名
 * createTime           创建时间
 */
var ActivityPeopleSchema = new Schema({
    belongToActivityId: ObjectId,
    belongToUserId: ObjectId,
    belongToUsername: String,
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ActivityPeople', ActivityPeopleSchema, 'ck_activity_peoples');