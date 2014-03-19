var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * username 用户真实姓名
 * password 密码
 * email 电子邮箱
 * phone 手机号
 * createTime 帐号创建日期，默认为用户注册时的服务器时间
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