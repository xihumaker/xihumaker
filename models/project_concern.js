/**
 * 项目关注表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id					默认生成的唯一ID
 * belongToProjectId    关联的项目
 * belongToUserId       关联的用户ID
 * createTime           时间
 */
var ProjectConcernSchema = new Schema({
    belongToProjectId: ObjectId,
    belongToUserId: ObjectId,
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ProjectConcern', ProjectConcernSchema, 'ck_project_concerns');