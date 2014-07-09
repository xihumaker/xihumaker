"use strict";
var config = require('../config');
var ADMIN_ACCOUNT = config.ADMIN_ACCOUNT;
var Util = require('../common/util');
var logger = require('../common/logger');
var nodeExcel = require('excel-export');
var User = require('../models/user');


function getSignedCookies(req, res, name) {
    return req.signedCookies && req.signedCookies[name];
}

// true 用户已登录 false 用户未登录
function adminAuth(req, res) {
    var admin = getSignedCookies(req, res, 'admin');
    return !!admin;
}

/**
 * 页面请求认证
 */
function adminPageAuth(req, res, next) {
    if (adminAuth(req, res)) {
        console.log("[ >>> LOG >>> ]：管理员已登录");
        next();
    } else {
        console.log("[ >>> LOG >>> ]：管理员未登录");
        res.render('admin/login');
    }
}

/**
 * Ajax请求认证
 */
function adminAjaxAuth(req, res, next) {
    if (adminAuth(req, res)) {
        console.log("[ >>> LOG >>> ]：管理员已登录");
        next();
    } else {
        console.log("[ >>> LOG >>> ]：管理员未登录");
        res.json({
            "r": 1,
            "errcode": "20001",
            "msg": "管理员未登录"
        });
    }
}


module.exports = {

    getSignedCookies: getSignedCookies,
    adminAuth: adminAuth,
    adminPageAuth: adminPageAuth,
    adminAjaxAuth: adminAjaxAuth,

    /**
     * @method login
     * 管理员登录操作
     */
    login: function(req, res) {
        var username = req.param('username');
        var password = req.param('password');

        if (username === ADMIN_ACCOUNT.username && password === Util.md5(ADMIN_ACCOUNT.password)) {
            logger.info("登录成功");

            //cookie 有效期1天
            res.cookie('admin', {
                adminId: username
            }, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 1,
                signed: true
            });
            res.json({
                "r": 0,
                "msg": "登录成功",
            });
        } else {
            logger.info("管理员账号或密码错误");
            res.json({
                "r": 1,
                "errcode": 20000,
                "msg": "管理员账号或密码错误"
            });
        }
    },

    /**
     * @method logout
     * 管理员退出操作
     */
    logout: function(req, res) {
        res.clearCookie('admin', {
            path: '/'
        });
        res.redirect('/admin/login');
    },

    exportToExcel: function(req, res) {
        var conf = {};
        conf.stylesXmlFile = "./controllers/styles.xml";
        conf.cols = [{
            caption: '姓名',
            type: 'string'
        }, {
            caption: '邮箱',
            type: 'string',
            width: 20
        }, {
            caption: '手机号',
            type: 'string',
            width: 15
        }, {
            caption: 'QQ',
            type: 'string',
            width: 15
        }, {
            caption: '金币',
            type: 'number'
        }, {
            caption: '省份',
            type: 'string'
        }, {
            caption: '城市',
            type: 'string'
        }, {
            caption: '加入时间',
            type: 'string',
            width: 20
        }, {
            caption: '性别',
            type: 'string'
        }, {
            caption: '生日',
            type: 'string'
        }, {
            caption: '收货地址',
            type: 'string'
        }, {
            caption: '已工作/在读学生',
            type: 'string'
        }, {
            caption: '公司',
            type: 'string'
        }, {
            caption: '岗位',
            type: 'string'
        }, {
            caption: '学校',
            type: 'string'
        }, {
            caption: '专业',
            type: 'string'
        }, {
            caption: '感兴趣的行业',
            type: 'string'
        }];
        conf.rows = [];

        User.find({}, function(err, docs) {
            if (err) {
                logger.error(err);
            }
            var user;
            var localCreateTime;
            var localSex;
            var localBirthday;
            var localWorkOrStudy;
            for (var i = 0; i < docs.length; i++) {
                user = docs[i];
                console.log(new Date(user.createTime));
                localCreateTime = (new Date(user.createTime)).toLocaleString('zh_CN');
                if (user.sex == 1) {
                    localSex = "男";
                } else if (user.sex == 2) {
                    localSex = "女";
                } else {
                    localSex = "";
                }
                localBirthday = (new Date(user.birthday)).toLocaleString('zh_CN');
                if (user.workOrStudy == 1) {
                    localWorkOrStudy = "已工作";
                } else if (user.workOrStudy == 2) {
                    localWorkOrStudy = "在读学生";
                } else {
                    localWorkOrStudy = "未知";
                }


                conf.rows[i] = [
                    user.username,
                    user.email,
                    user.phone,
                    user.qq,
                    user.coin,
                    user.province,
                    user.city,
                    localCreateTime,
                    localSex,
                    localBirthday,
                    user.inAddress,
                    localWorkOrStudy,
                    user.company,
                    user.job,
                    user.school,
                    user.profession,
                    user.interest
                ];
            }

            var result = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + "xihumaker.xlsx");
            res.end(result, 'binary');
        });
    },


    showIndex: function(req, res) {
        res.render('admin/index');
    },

    showLogin: function(req, res) {
        res.render('admin/login');
    },

    showUserManagement: function(req, res) {
        res.render('admin/userManagement');
    },

    showProjectManagement: function(req, res) {
        res.render('admin/projectManagement');
    },

    showActivityManagement: function(req, res) {
        res.render('admin/activityManagement');
    },

    showVipManagement: function(req, res) {
        res.render('admin/vipManagement');
    },

    showCreateVip: function(req, res) {
        res.render('admin/createVip');
    },

    showCreateActivity: function(req, res) {
        res.render('admin/createActivity');
    },

    showProductManagement: function(req, res) {
        res.render('admin/productManagement');
    },

    showCreateProduct: function(req, res) {
        res.render('admin/createProduct');
    }




};