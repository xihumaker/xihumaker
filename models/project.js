var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

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
    purpose: {
        type: String,
        default: ''
    },
    solution: {
        type: String,
        default: ''
    },
    teamInfo: {
        type: String,
        default: ''
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
    members: Array
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