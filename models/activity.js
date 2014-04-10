var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * 活动
 * title        活动标题
 * createTime   活动创建日期
 * startTime    活动开始时间
 * endTime      活动结束时间
 * deadline     报名截止时间
 * organizers   主办方
 * unionOrganizers 联合主办方
 * limits       人数限制
 * city         城市
 * location     地点
 * links        相关链接
 * details      活动详情
 * thumbnail    活动封面图片
 * status
 * 活动状态：0准备中，1报名中，2报名截止，3进行中，4活动结束
 * 准备中（只有活动发布者能够看到）--> 活动发布者选择发布
 * participants 活动报名者
 * hasCheckin   活动已经签到者
 */
var ActivitySchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    createTime: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Number,
        default: 0
    },
    endTime: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Number,
        default: 0
    },
    organizers: {
        type: Array,
        default: []
    },
    unionOrganizers: {
        type: Array,
        default: []
    },
    limits: {
        type: Number,
        default: 0
    },
    city: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    links: {
        type: Array,
        default: []
    },
    details: {
        type: String,
        default: ''
    },
    thumbnail: {
        type: String,
        default: ''
    },
    participants: {
        type: Array,
        default: []
    },
    hasCheckin: {
        type: Array,
        default: []
    },
    status: {
        type: Number,
        default: 0
    }
});

// 添加实例方法
ActivitySchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// 添加静态方法
ActivitySchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};

//compile schema to model
module.exports = mongoose.model('Activity', ActivitySchema, 'ck_activities');