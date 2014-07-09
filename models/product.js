/**
 * 产品乌托邦
 */
"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id	            默认生成的唯一ID
 * name             产品名
 * industry         产品所属行业
 * topicNum         产品下面帖子的个数
 * lastActionTime   最新动作时间（包括创建产品、产品下新建了一个帖子）
 * commentNum       产品评论个数
 * createTime       产品创建日期
 * updateTime       产品最后更新日期
 */
var ProductSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    industry: {
        type: Number,
        default: -1
    },
    lastActionTime: {
        type: Number,
        default: Date.now
    },
    topicNum: {
        type: Number,
        default: 0
    },
    commentNum: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Number,
        default: Date.now
    },
    updateTime: {
        type: Number,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema, 'ck_products');