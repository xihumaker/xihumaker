/**
 * 项目组成员表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id					默认生成的唯一ID
 * belongToProjectId    关联的项目
 * belongToUserId       关联的用户ID
 * belongToUsername     关联的用户名
 * status				状态：1审核中，2项目成员
 * createTime           申请加入时间
 */
var ProjectPeopleSchema = new Schema({
    belongToProjectId: ObjectId,
    belongToUserId: ObjectId,
    belongToUsername: String,
    headimgurl: String,
    status: {
        type: Number,
        default: 1
    },
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ProjectPeople', ProjectPeopleSchema, 'ck_project_peoples');