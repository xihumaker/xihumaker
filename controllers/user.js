"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Util = require('../common/util');
var logger = require('../common/logger');
var User = require('../models/user');
var ccap = require('../services/ccap');
var mail = require('../services/mail');
var uuid = require('node-uuid');
var auth = require('../policies/auth');

function newCookie(req, res, user) {
    //cookie 有效期30天
    res.cookie('xihumaker', {
        userId: user._id,
        username: user.username,
        email: user.email
    }, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true
    });
}

/**
 * 验证邮箱
 */
function checkEmail(req, res, email) {
    if (!email) {
        res.json({
            "r": 1,
            "errcode": 10009,
            "msg": "邮箱不能为空"
        });
        return false;
    }
    if (!Util.isEmail(email)) {
        res.json({
            "r": 1,
            "errcode": 10010,
            "msg": "邮箱地址不合法"
        });
        return false;
    }
    return true;
}

function checkEmailEmpty(req, res, email) {
    if (!email) {
        res.json({
            "r": 1,
            "errcode": 10009,
            "msg": "邮箱不能为空"
        });
        return false;
    }
    return true;
}

/**
 * 验证手机号
 */
function checkPhone(req, res, phone) {
    if (!phone) {
        res.json({
            "r": 1,
            "errcode": 10020,
            "msg": "手机号不能为空"
        });
        return false;
    }
    if (!Util.isPhone(phone)) {
        res.json({
            "r": 1,
            "errcode": 10021,
            "msg": "手机号不合法"
        });
        return false;
    }
    return true;
}

/**
 * 验证真实姓名
 */
function checkUsername(req, res, username) {
    if (!username) {
        res.json({
            "r": 1,
            "errcode": 10003,
            "msg": "真实姓名不能为空"
        });
        return false;
    }
    return true;
}

/**
 * 验证密码
 */
function checkPassword(req, res, password) {
    if (!password) {
        res.json({
            "r": 1,
            "errcode": 10005,
            "msg": "密码不能为空"
        });
        return false;
    }
    return true;
}

/**
 * 验证验证码
 */
function checkCaptcha(req, res, captcha) {
    if (!captcha) {
        res.json({
            "r": 1,
            "errcode": 10117,
            "msg": "验证码不能为空"
        });
        return false;
    }

    var _captcha = ccap.getCaptcha(req, res);
    if (_captcha.toLowerCase() !== captcha.toLowerCase()) {
        res.json({
            "r": 1,
            "errcode": 10118,
            "msg": "验证码不正确"
        });
        return false;
    }
    return true;
}


module.exports = {

    /**
     * @method getCurrentUserinfo
     * 获得当前登录用户的详细信息
     */
    getCurrentUserinfo: function(req, res) {
        var userId = auth.getUserId(req, res);

        // {password: 0}表示不返回password这个属性
        User.findOne({
            _id: new ObjectId(userId)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10036,
                    "msg": "服务器错误，获得当前登录用户的详细信息失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "获得当前登录用户信息成功",
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
     * @method login
     * 登录
     */
    login: function(req, res) {
        var email = req.param('email'),
            password = req.param('password');
        if (!checkEmailEmpty(req, res, email) || !checkPassword(req, res, password)) {
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
                newCookie(req, res, doc);
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
                    "msg": "查找用户信息成功",
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
        var body = req.body;
        var email = body.email;
        var phone = body.phone;
        var username = body.username;
        var password = body.password;

        if (!checkEmail(req, res, email) || !checkPhone(req, res, phone) || !checkUsername(req, res, username) || !checkPassword(req, res, password)) {
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
            }

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
                        logger.error(err);
                        res.json({
                            "r": 1,
                            "errcode": 10013,
                            "msg": "服务器错误，注册信息保存失败"
                        });
                        return;
                    } else {
                        newCookie(req, res, doc);
                        res.json({
                            "r": 0,
                            "msg": "注册成功",
                            "user": doc
                        });
                        return;
                    }
                });
            }
        });
    },

    /**
     * @method showUserCenter
     * 微信端 - 显示用户中心页面
     */
    showWeixinUserCenter: function(req, res) {
        var userId = auth.getUserId(req, res);
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
                    "msg": "服务器错误，显示用户中心页面失败"
                });
                return;
            }

            if ( !! doc) {
                res.render('weixin/userCenter', {
                    "r": 0,
                    "msg": "显示用户中心页面成功",
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

    /**
     * @method showWeixinEditUser
     * 微信端 - 显示用户详情编辑页面
     */
    showWeixinEditUser: function(req, res) {
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
                    "msg": "服务器错误，调用showWeixinEditUser方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.render('weixin/editUser', {
                    "r": 0,
                    "msg": "显示用户详情编辑页面成功",
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

    /**
     * @method findUserByIdAndUpdate
     * 更新用户信息
     */
    findUserByIdAndUpdate: function(req, res) {
        var _id = auth.getUserId(req, res);
        var user = req.body;

        User.findByIdAndUpdate(_id, {
            $set: {
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
                interest: user.interest || [],
                headimgurl: user.headimgurl
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
    },

    /**
     * @method searchUsers
     * 用户高级搜索
     */
    searchUsers: function(req, res) {
        var pageSize = req.query.pageSize;
        var pageStart = req.query.pageStart;
        var key = req.query.key;
        var reg;
        var query;

        if (key) {
            reg = new RegExp(key);
            query = User.find({
                '$or': [{
                    'username': reg
                }, {
                    'email': reg
                }, {
                    'phone': reg
                }]
            }, {
                password: 0
            }, {
                skip: pageStart,
                limit: pageSize
            }).sort('-createTime');
        } else {
            query = User.find({}, {
                password: 0
            }, {
                skip: pageStart,
                limit: pageSize
            }).sort('-createTime');
        }

        query.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10034,
                    "msg": "服务器错误，查找用户失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找用户成功",
                "users": docs
            });
        });
    },

    /**
     * @method findUserByIdAndRemove
     * 根据用户ID删除某个用户
     */
    findUserByIdAndRemove: function(req, res) {
        var _id = req.body._id;

        User.findByIdAndRemove(_id, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10035,
                    "msg": "服务器错误，删除用户失败"
                });
                return;
            }

            if (doc) {
                res.json({
                    "r": 0,
                    "msg": "删除成功",
                    "user": doc
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10002,
                    "msg": "用户不存在"
                });
            }
        });
    },

    /**
     * @method richList
     * 根据金币个数，获取前N个用户
     */
    richList: function(req, res) {
        var num = req.params.num;
        var query = User.find({

        }, {
            password: 0
        }, {
            limit: num
        }).sort('-coin');

        query.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10057,
                    "msg": "服务器错误，查找财富榜失败"
                });
            }
            res.json({
                "r": 0,
                "msg": "根据金币个数，获取前N个用户成功",
                "users": docs
            });
        });
    },

    /**
     * @method getCoinRankByUserId
     * 根据用户ID获取金币数排名
     */
    getCoinRankByUserId: function(req, res) {
        var userId = req.params._id;

        User.findOne({
            _id: new ObjectId(userId)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10058,
                    "msg": "服务器错误，获取用户金币数排名失败"
                });
                return;
            }

            var currentUser = doc;
            var coin = currentUser.coin;
            User.find({
                coin: {
                    $gt: coin
                }
            }, function(err, docs) {
                if (err) {
                    res.json({
                        "r": 1,
                        "errcode": 10058,
                        "msg": "服务器错误，获取用户金币数排名失败"
                    });
                    return;
                }

                var len = docs.length;
                res.json({
                    "r": 0,
                    "msg": "请求成功",
                    "user": currentUser,
                    "coinRank": len + 1
                });
                return;
            });
        });
    },

    /**
     * @method showMyActivities
     * 显示我报名的活动页面
     */
    showMyActivities: function(req, res) {
        res.render('weixin/myActivities');
    },

    /**
     * @method resetPassword
     * 重设密码，成功，发送一份密码重置邮件
     */
    resetPassword: function(req, res) {
        var email = req.body.email;
        var captcha = req.body.captcha;

        if (!checkEmail(req, res, email)) {
            return;
        }
        if (!checkCaptcha(req, res, captcha)) {
            return;
        }

        var resetTicket = Date.now();
        var resetToken = uuid.v1();

        User.findOneAndUpdate({
            email: email
        }, {
            resetTicket: resetTicket,
            resetToken: resetToken
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10119,
                    "msg": "服务器错误，重设密码失败"
                });
                return;
            }

            if ( !! doc) {
                mail.sendResetPassMail(email, resetToken, function(response) {
                    console.log('发送了一份重设密码邮件');
                    console.log(response);
                    res.json({
                        "r": 0,
                        "msg": "发送成功"
                    });
                    return;
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10120,
                    "msg": "该邮箱尚未注册，发送失败"
                });
                return;
            }
        });
    },

    /**
     * @method showNewPassword
     * 显示设置新密码页面
     */
    showNewPassword: function(req, res) {
        var token = req.query.token || '';
        var now = (new Date()).getTime();
        var ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
        var diff = now - ONE_DAY_MILLISECONDS;

        User.findOne({
            resetToken: token,
            resetTicket: {
                $gt: diff
            }
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.render('newPassword', {
                    "r": 1,
                    "errcode": 2007,
                    "msg": "服务器错误，重置密码失败"
                });
                return;
            }

            // 没有找到
            if (!doc) {
                res.render('newPassword', {
                    "r": 1,
                    "errcode": 2008,
                    "msg": "无效的链接地址"
                });
                return;
            } else {
                res.render('newPassword', {
                    "r": 0,
                    "user": doc
                });
            }
        });
    },

    /**
     * @method newPassword
     * 设置新密码
     */
    newPassword: function(req, res) {
        var password = req.param('password');
        var token = req.param('token');

        User.findOneAndUpdate({
            resetToken: token
        }, {
            resetTicket: 0,
            resetToken: '',
            password: Util.md5(password)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10121,
                    "msg": "服务器错误，设置新密码失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "设置新密码成功"
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10122,
                    "msg": "TOKEN已经失效"
                });
            }
        });
    },

    /**
     * @method bindWeixin
     * 绑定微信openid
     */
    bindWeixin: function(req, res) {
        var body = req.body;
        var email = body.email;
        var password = body.password;
        var openId = body.openId;

        User.findOne({
            email: email
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10126,
                    "msg": "服务器错误，绑定失败"
                });
                return;
            }

            if ( !! doc) {
                if (doc.password !== Util.md5(password)) {
                    res.json({
                        "r": 1,
                        "errcode": 10123,
                        "msg": "密码不正确"
                    });
                    return;
                }

                if ( !! doc.openId) {
                    if (doc.openId === openId) {
                        res.json({
                            "r": 1,
                            "errcode": 10124,
                            "msg": "不能重复绑定"
                        });
                        return;
                    } else {
                        res.json({
                            "r": 1,
                            "errcode": 10125,
                            "msg": "您的帐号已经绑定了一个微信号，一个帐号只能绑定一个微信号"
                        });
                        return;
                    }
                } else {
                    doc.openId = openId;

                    doc.save(function(err, doc) {
                        if (err) {
                            res.json({
                                "r": 1,
                                "errcode": 10126,
                                "msg": "服务器错误，绑定失败"
                            });
                            return;
                        }

                        res.json({
                            "r": 0,
                            "msg": "绑定成功"
                        });
                        return;
                    });
                }
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