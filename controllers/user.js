var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var validator = require('validator');
var Util = require('../common/util');
var logger = require('../common/logger');
var User = require('../models/user');

var UserModule = {

    /**
     * @method hasLogin
     * 判断用户是否已经登录
     * @return {Boolean} 如果已经登录返回true，未登录返回false
     */
    hasLogin: function(req, res) {
        var userId = req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
        return !!userId;
    },

    getUserId: function(req, res) {
        return req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
    },

    /**
     * @method userAuth
     * 用户认证
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
     * @method userWebAuth
     * 用户认证
     */
    userWebAuth: function(req, res, next) {
        var userId = req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
        if (userId) {
            console.log("[ >>> LOG >>> ]：用户已登录");
            console.log('userId = ' + userId);
            next();
        } else {
            console.log("[ >>> LOG >>> ]：用户未登录");
            res.render('login', {
                hasLogin: false
            });
        }
    },

    /**
     * @method getCurrentUserinfo
     * 获得当前登录用户的详细信息
     */
    getCurrentUserinfo: function(req, res) {
        var userId = req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
        var _id = userId;

        // {password: 0}表示不返回password这个属性
        User.findOne({
            _id: new ObjectId(_id)
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
        if (!Util.isPhone(phone)) {
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
                            logger.error(err);
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

    /**
     * @method showUserCenter
     * 微信端 - 显示用户中心页面
     */
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

    /**
     * @method showEditUser
     * 微信端 - 显示用户详情编辑页面
     */
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
                "msg": "查找项目成功",
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

    // 财富榜
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
                "msg": "请求成功",
                "users": docs
            });
        });
    },

    // 根据用户ID获取金币数排名
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


        })
    },

    /**
     * @method showMyActivities
     * 显示我报名的活动页面
     */
    showMyActivities: function(req, res) {
        var userId = UserModule.getUserId(req);

        res.render('weixin/myActivities', {
            userId: userId
        });
    }





};

module.exports = UserModule;