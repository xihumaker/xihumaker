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
 * lastActionTime   最新动作时间（包括：创建产品、新建帖子）
 * topicNum         该产品下的帖子个数（包括现实世界帖子和完美世界帖子）
 * commentNum       该产品下的评论个数
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