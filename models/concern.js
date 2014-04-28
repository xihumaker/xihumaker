var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * 关注表
 * belongToProject	赞属于哪个项目
 * belongToUser		哪个用户发起的赞
 * createTime		赞创建时间
 */
var ConcernSchema = new Schema({
    belongToProject: ObjectId,
    belongToUser: ObjectId,
    createTime: {
        type: Number,
        default: 0
    }
});

// 添加实例方法
ConcernSchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// 添加静态方法
ConcernSchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};

//compile schema to model
module.exports = mongoose.model('Concern', ConcernSchema, 'ck_concerns');