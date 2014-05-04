/**
 * 项目评论表
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id					默认生成的唯一ID
 * belongToId    		关联项目ID（后面添加关联评论ID，嵌套评论）
 * belongToUserId       关联用户ID
 * belongToUsername     关联用户名
 * headimgurl			关联用户头像
 * content				评论内容
 * createTime           创建时间
 */
var ProjectCommentSchema = new Schema({
    belongToId: ObjectId,
    belongToUserId: ObjectId,
    belongToUsername: String,
    headimgurl: String,
    content: String,
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ProjectComment', ProjectCommentSchema, 'ck_project_comments');