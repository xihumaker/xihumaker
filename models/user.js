var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * username 用户真实姓名
 * password 密码
 * email 电子邮箱
 * phone 手机号
 * createTime 帐号创建日期，默认为用户注册时的服务器时间
 * sex 性别 1男 2女 0未知
 * birthday 生日
 * province 用户个人资料填写的省份
 * city 普通用户个人资料填写的城市
 * country 国家，如中国为CN
 * inAddress 收件地址
 * workOrStudy 0未知 1工作 2学习
 * company 公司
 * job 岗位
 * school 学校
 * profession 大学专业
 * interest 个人感兴趣的行业方向
 * headimgurl 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空
 * coin 金币数 默认0
 */
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        default: ''
    },
    createTime: {
        type: Number,
        default: 0
    },
    sex: {
        type: Number,
        default: 0
    },
    birthday: {
        type: Number,
        default: 0
    },
    qq: {
        type: String,
        default: ''
    },
    province: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    inAddress: {
        type: String,
        default: ''
    },
    workOrStudy: {
        type: Number,
        default: 0
    },
    company: {
        type: String,
        default: ''
    },
    job: {
        type: String,
        default: ''
    },
    school: {
        type: String,
        default: ''
    },
    profession: {
        type: String,
        default: ''
    },
    interest: {
        type: Array,
        default: []
    },
    headimgurl: {
        type: String,
        default: ''
    },
    coin: {
        type: Number,
        default: 0
    }
});

// 添加实例方法
UserSchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// 添加静态方法
UserSchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};

//compile schema to model
module.exports = mongoose.model('User', UserSchema, 'ck_users');