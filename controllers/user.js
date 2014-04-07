var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var validator = require('validator');
var Util = require('../common/util');
var User = require('../models/user');

var UserModule = {

    /**
     * @method userAuth
     * 用户认证
     * session对象中有userId属性，说明用户已经登录，验证通过，否则说明用户未登录
     */
    userAuth: function(req, res, next) {
        var userId = req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
        if (userId) {
            console.log("[ >>> LOG >>> ]：用户已登录");
            console.log('userId = ' + userId);
            next();
        } else {
            console.log("[ >>> LOG >>> ]：用户未登录");
            res.render('weixin/login');
        }
    },

    /**
     * @method login
     * 登录
     */
    login: function(req, res) {
        var email = req.param('email'),
            password = req.param('password');

        if (!email) {
            res.json({
                "r": 1,
                "errcode": 10009,
                "msg": "邮箱不能为空"
            });
            return;
        }
        if (!password) {
            res.json({
                "r": 1,
                "errcode": 10005,
                "msg": "密码不能为空"
            });
            return;
        }

        User.findOne({
            '$or': [{
                'email': email
            }, {
                'phone': email
            }],
            password: Util.md5(password)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10018,
                    "msg": "服务器错误，登录失败"
                });
                return;
            }

            if ( !! doc) {
                //cookie 有效期30天
                res.cookie('xihumaker', {
                    userId: doc._id
                }, {
                    path: '/',
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    signed: true
                });
                res.json({
                    "r": 0,
                    "msg": "登录成功"
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10019,
                    "msg": "邮箱或密码错误"
                });
            }
        });
    },

    /**
     * @method logout
     * 注销账号
     */
    logout: function(req, res) {
        res.clearCookie('xihumaker', {
            path: '/'
        });
        res.json({
            'r': 0,
            'msg': '注销成功'
        });
    },

    /**
     * @method findUserById
     * 根据_id获取用户信息
     */
    findUserById: function(req, res) {
        var _id = req.param('_id') || '';
        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        // {password: 0}表示不返回password这个属性
        User.findOne({
            _id: new ObjectId(_id)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10001,
                    "msg": "服务器错误，调用findUserById方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "请求成功",
                    "user": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10002,
                    "msg": "用户不存在"
                });
                return;
            }
        });
    },

    /**
     * @method addUser
     * 新用户注册
     */
    addUser: function(req, res) {
        var email = req.param('email'),
            phone = req.param('phone'),
            username = req.param('username'),
            password = req.param('password'),
            rePassword = req.param('rePassword');

        if (!email) {
            res.json({
                "r": 1,
                "errcode": 10009,
                "msg": "邮箱不能为空"
            });
            return;
        }
        if (!validator.isEmail(email)) {
            res.json({
                "r": 1,
                "errcode": 10010,
                "msg": "邮箱地址不合法"
            });
            return;
        }
        if (!phone) {
            res.json({
                "r": 1,
                "errcode": 10020,
                "msg": "手机号不能为空"
            });
            return;
        }
        if (!/^(((13[0-9]{1})|159|186|(15[0-9]{1}))+\d{8})$/.test(phone)) {
            res.json({
                "r": 1,
                "errcode": 10021,
                "msg": "手机号不合法"
            });
            return;
        }
        if (!username) {
            res.json({
                "r": 1,
                "errcode": 10003,
                "msg": "真实姓名不能为空"
            });
            return;
        }
        if (!password) {
            res.json({
                "r": 1,
                "errcode": 10005,
                "msg": "密码不能为空"
            });
            return;
        }
        if (!rePassword) {
            res.json({
                "r": 1,
                "errcode": 10007,
                "msg": "确认密码不能为空"
            });
            return;
        }
        if (password !== rePassword) {
            res.json({
                "r": 1,
                "errcode": 10008,
                "msg": "两次输入的密码不一致"
            });
            return;
        }

        User.findOne({
            '$or': [{
                'email': email
            }, {
                'phone': phone
            }]
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10011,
                    "msg": "服务器错误，注册失败"
                });
                return;
            } else {
                if ( !! doc) {
                    if (doc.email === email) {
                        res.json({
                            "r": 1,
                            "errcode": 10023,
                            "msg": "该邮箱已经被注册"
                        });
                        return;
                    } else if (doc.phone === phone) {
                        res.json({
                            "r": 1,
                            "errcode": 10024,
                            "msg": "该手机号已经被注册"
                        });
                        return;
                    }
                } else {
                    var user = new User({
                        email: email,
                        phone: phone,
                        username: username,
                        password: Util.md5(password),
                        createTime: Date.now()
                    });

                    user.save(function(err, doc) {
                        if (err) {
                            res.json({
                                "r": 1,
                                "errcode": 10013,
                                "msg": "服务器错误，注册信息保存失败"
                            });
                            return;
                        } else {
                            //cookie 有效期30天
                            res.cookie('xihumaker', {
                                userId: doc._id
                            }, {
                                path: '/',
                                maxAge: 1000 * 60 * 60 * 24 * 30,
                                signed: true
                            });
                            res.json({
                                "r": 0,
                                "msg": "注册成功"
                            });
                            return;
                        }
                    });
                }
            }
        });
    },

    showUserCenter: function(req, res) {
        var userId = req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
        // {password: 0}表示不返回password这个属性
        User.findOne({
            _id: new ObjectId(userId)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.render('weixin/userCenter', {
                    "r": 1,
                    "errcode": 10001,
                    "msg": "服务器错误，调用findUserById方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.render('weixin/userCenter', {
                    "r": 0,
                    "msg": "请求成功",
                    "user": doc
                });
                return;
            } else {
                res.render('weixin/userCenter', {
                    "r": 1,
                    "errcode": 10002,
                    "msg": "用户不存在"
                });
                return;
            }
        });
    },


    showEditUser: function(req, res) {
        var _id = req.params._id;

        // {password: 0}表示不返回password这个属性
        User.findOne({
            _id: new ObjectId(_id)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.render('weixin/editUser', {
                    "r": 1,
                    "errcode": 10032,
                    "msg": "服务器错误，调用showEditUser方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.render('weixin/editUser', {
                    "r": 0,
                    "msg": "请求成功",
                    "user": doc
                });
                return;
            } else {
                res.render('weixin/editUser', {
                    "r": 1,
                    "errcode": 10002,
                    "msg": "用户不存在"
                });
                return;
            }
        });
    },

    // 修改用户信息
    findUserByIdAndUpdate: function(req, res) {
        var _id = req.params._id;
        var user = req.body;

        console.log(user.interest);

        User.findByIdAndUpdate(_id, {
            $set: {
                username: user.username,
                email: user.email,
                phone: user.phone,
                sex: user.sex,
                birthday: user.birthday,
                qq: user.qq,
                province: user.province,
                city: user.city,
                inAddress: user.inAddress,
                workOrStudy: user.workOrStudy,
                company: user.company,
                job: user.job,
                school: user.school,
                profession: user.profession,
                interest: user.interest,
                headimgurl: user.headimgurl,
                coin: user.coin
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10033,
                    "msg": "服务器错误，调用findUserByIdAndUpdateId方法出错"
                });
                return;
            }

            if ( !! doc) {
                console.log(doc);
                res.json({
                    "r": 0,
                    "msg": "修改成功",
                    "user": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10002,
                    "msg": "用户不存在"
                });
                return;
            }
        });

    }



};

module.exports = UserModule;