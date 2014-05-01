var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * 会员秀
 * _id 唯一编号
 * name 会员姓名
 * headimgurl 会员头像
 * title 标题
 * content 正文
 * likeNum 赞个数
 * createTime 会员秀创建时间
 * updateTime 会员秀最近修改时间
 */
var VipSchema = new Schema({
    name: String,
    headimgurl: String,
    title: String,
    content: String,
    likeNum: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Number,
        default: 0
    },
    updateTime: {
        type: Number,
        default: 0
    }
});

//compile schema to model
module.exports = mongoose.model('Vip', VipSchema, 'ck_vips');