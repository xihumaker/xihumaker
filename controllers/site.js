"use strict";

module.exports = {

    /**
     * Web端页面
     * ---------------------------------------------------------
     */
    showIndex: function(req, res) {
        res.render('index');
    },

    showLogin: function(req, res) {
        res.render('login');
    },

    showResetPassword: function(req, res) {
        res.render('resetPassword');
    },

    logout: function(req, res) {
        res.clearCookie('xihumaker', {
            path: '/'
        });
        res.redirect('/');
    },

    showProjects: function(req, res) {
        res.render('projects');
    },

    showCreateProject: function(req, res) {
        res.render('createProject');
    },

    showMyMaker: function(req, res) {
        res.render('myMaker');
    },

    showSearch: function(req, res) {
        res.render('search');
    },


    /**
     * 微信端页面
     * ---------------------------------------------------------
     */
    showWeixinIndex: function(req, res) {
        res.render('weixin/index');
    },

    showWeixinMap: function(req, res) {
        res.render('weixin/baiduMap');
    },

    showWeixinLogin: function(req, res) {
        res.render('weixin/login');
    },

    showWeixinRegister: function(req, res) {
        res.render('weixin/register');
    },

    showWeixinRegisterSucc: function(req, res) {
        res.render('weixin/registerSucc');
    },

    showWeixinSsoLogin: function(req, res) {
        res.render('weixin/sso_login');
    },

    showWeixinArticle: function(req, res) {
        var id = req.params.id;
        res.render('weixin/article/' + id);
    },

    showWeixinPapers: function(req, res) {
        res.render('weixin/papers');
    },

    showWeixinPaper: function(req, res) {
        var id = req.params.id;
        res.render('weixin/paper/' + id);
    },

    showWeixinDonation: function(req, res) {
        res.render('weixin/donation');
    },

    showWeixinConstitution: function(req, res) {
        res.render('weixin/constitution');
    },

    showWeixinProjects: function(req, res) {
        res.render('weixin/projects');
    },

    showWeixinTuiguang: function(req, res) {
        res.render('weixin/tuiguang');
    },

    showWeixinWeikecheng: function(req, res) {
        res.render('weixin/weikecheng');
    },

    showWeixinWeikechengByTag: function(req, res) {
        var tag = req.param('tag');
        if (tag === '开源硬件与传感器') {
            res.render('weixin/weikecheng/openSourceHardwareAndSensors');
        } else if (tag === '创客文化') {
            res.render('weixin/weikecheng/makerCulture');
        } else {
            res.render('weixin/weikecheng/building');
        }
    },

    showWeixinWeikechengByTagAndCourse: function(req, res) {
        var tag = req.param('tag');
        var course = req.param('course');
        if (tag === '开源硬件与传感器') {
            if (course === '轻松玩转pcDuino') {
                res.render('weixin/weikecheng/openSourceHardwareAndSensors/pcDuino');
            } else if (course === 'Arduino初级课程') {
                res.render('weixin/weikecheng/openSourceHardwareAndSensors/Arduino');
            } else if (course === '毕业设计项目模块选型及采购') {
                res.render('weixin/weikecheng/openSourceHardwareAndSensors/biYeSheJi');
            }
        } else if (tag === '创客文化') {
            if (course === '会员秀') {
                res.render('weixin/weikecheng/makerCulture/xihumaker');
            }
        }
    },

    showWeixinActivities: function(req, res) {
        res.render('weixin/activities');
    },

    showWeixinSponsorProjects: function(req, res) {
        res.render('weixin/sponsorProjects');
    },

    showWeixinTakeProjects: function(req, res) {
        res.render('weixin/takeProjects');
    },

    showWeixinConcernProjects: function(req, res) {
        res.render('weixin/concernProjects');
    },

    showWeixinRichList: function(req, res) {
        res.render('weixin/richList');
    },

    showWeixinBindWeixin: function(req, res) {
        var openId = req.query.openId;
        res.render('weixin/bindWeixin', {
            openId: openId
        });
    },

    showWeixinBindWeixinSucc: function(req, res) {
        res.render('weixin/bindWeixinSucc');
    }

};