/**
 * 产品乌托邦 - 帖子
 */
"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id	             默认生成的唯一ID
 * belongToUserId    发表该帖子的用户ID
 * belongToUsername  发表该帖子的用户姓名
 * belongToProductId 哪个产品的帖子
 * whichWrold        哪个世界的 0 现实世界 1 - 完美世界
 * lastActionTime    最新动作时间（包括创建帖子、点赞、评论）
 */
var ProductTopicSchema = new Schema({
    belongToUserId: ObjectId,
    belongToUsername: String,
    belongToUserHeadimgurl: String,
    belongToProductId: ObjectId,
    whichWorld: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: ''
    },
    picList: {
        type: Array,
        default: []
    },
    commentList: {
        type: Array,
        default: []
    },
    commentNum: {
        type: Number,
        default: 0
    },
    likeList: {
        type: Array,
        default: []
    },
    likeNum: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Number,
        default: Date.now
    },
    lastActionTime: {
        type: Number,
        default: Date.now
    },
    updateTime: {
        type: Number,
        default: Date.now
    }
});

module.exports = mongoose.model('ProductTopic', ProductTopicSchema, 'ck_product_topics');