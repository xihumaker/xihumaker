var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MemberSchema = new Schema({
    openid: String,
    createTime: {
        type: Number,
        default: 0
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    },
    precision: {
        type: Number,
        default: 0
    },
    nickname: {
        type: String,
        default: ''
    },
    sex: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    province: {
        type: String,
        default: ''
    },
    country: {
    	type: String,
    	default: ''
    },
    language: {
        type: String,
        default: ''
    },
    headimgurl: {
        type: String,
        default: ''
    },
    subscribeTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Member', MemberSchema, 'ck_members');