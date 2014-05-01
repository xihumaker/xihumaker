var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * belongToVipId 关联的会员秀ID
 * belongToUserId 关联的网站用户ID
 * createTime 赞发起时间
 */
var VipLikeSchema = new Schema({
    belongToVipId: ObjectId,
    belongToUserId: ObjectId,
    createTime: {
        type: Number,
        default: 0
    }
});

//compile schema to model
module.exports = mongoose.model('VipLike', VipLikeSchema, 'ck_vip_likes');