/**
 * 项目江湖告急表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id					默认生成的唯一ID
 * belongToProjectId    关联项目ID
 * belongToProjectTitle 关联项目标题
 * content				江湖告急问题
 * comments             江湖告急评论数组
 * [
 *     {
 *         belongToUserId: ObjectId,
 *         belongToUsername: String,
 *         headimgurl: String,
 *         content: String,
 *         createTime: {
 *             type: Number,
 *             default: 0
 *             }
 *     },
 *     ....
 * ]
 * createTime           创建时间
 */
var ProjectTopicSchema = new Schema({
    belongToProjectId: ObjectId,
    belongToProjectTitle: String,
    content: String,
    comments: {
        type: Array,
        default: []
    },
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ProjectTopic', ProjectTopicSchema, 'ck_project_topics');