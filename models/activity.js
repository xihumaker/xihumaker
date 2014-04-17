var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * activityDate     活动日期
 * meetingTime      集合时间
 * topic            活动主题
 * organizer        发起人
 * city             城市
 * location         地点
 * limit            名额 —— 数字或者写不限制。若有限制，满额后就不能再接受报名了
 * description      详情 —— 图片+纯文本
 * note             注意事项 —— 纯文本
 * likeNum          活动被赞的个数
 * participants     报名者列表（用户ID）
 * score            参与者评分
 *                  评论—— 图片和纯文本
 */
var ActivitySchema = new Schema({
    activityDate: {

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