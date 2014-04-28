var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * 项目评论表
 * belongTo	        评论属于哪个项目
 * belongToUser		哪个用户发起的评论
 * content          评论内容（文本）
 * createTime		评论创建时间
 */
var CommentSchema = new Schema({
    belongToProject: ObjectId,
    belongToUser: ObjectId,
    content: String,
    createTime: {
        type: Number,
        default: 0
    }
});

// 添加实例方法
CommentSchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// 添加静态方法
CommentSchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};

//compile schema to model
module.exports = mongoose.model('Comment', CommentSchema, 'ck_comments');