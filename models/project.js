var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * title 项目标题
 * description 项目详细描述
 * industry 项目所属行业
 * group 项目所属组别
 * authorId 项目创始人ID
 * createTime 项目启动日期
 * updateTime 项目最近更新时间
 * members 项目组成员列表（用户ID）
 * progress 项目进度
 * status 项目状态 审核中1 已删除2 进行中3 已结束4
 * coverUrl 项目封面图片地址
 */
var ProjectSchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    industry: {
        type: Number,
        default: -1
    },
    group: {
        type: Number,
        default: -1
    },
    authorId: ObjectId,
    createTime: {
        type: Number,
        default: 0
    },
    updateTime: {
        type: Number,
        default: 0
    },
    members: {
        type: Array,
        default: []
    },
    progress: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 3
    },
    coverUrl: {
        type: String,
        default: ''
    }
});

// 添加实例方法
ProjectSchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// 添加静态方法
ProjectSchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};

//compile schema to model
module.exports = mongoose.model('Project', ProjectSchema, 'ck_projects');