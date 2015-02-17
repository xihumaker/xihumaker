"use strict";

var nodemailer = require("nodemailer");

var config = require('../config');
var SITE_ROOT_URL = 'http://' + config.DOMAIN;

// create reusable transport method (打开SMTP连接池)
var smtpTransport = nodemailer.createTransport("SMTP", config.mailOpts);

/**
 * 发送邮件接口函数
 */
var sendMail = function(mailOptions, callback) {
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent successfully");
            callback(response);
        }
        smtpTransport.close();
    });
};


module.exports = {

    /**
     * @method sendActiveMail
     * 发送账号激活邮件
     */
    sendActiveMail: function(to, token, callback) {
        var from = config.mailOpts.auth.user;
        var subject = config.name + "：账号激活";
        var href = SITE_ROOT_URL + '/activeAccount?token=' + token;
        var html = '<div style="width: 600px;box-shadow: 0 0 4px gray;border-radius: 5px;left: 50%;position: relative;margin-left: -300px;">' +
            '<a href="' + SITE_ROOT_URL + '" style="margin: 0;padding: 8px 0;background: #0078D8;text-align: center;color: #fff;font-size: 25px;display: block;text-decoration: none;">微糖</a>' +
            '<div style="padding: 20px;">' +
            '<h4>你好！</h4>' +
            '<p>我们已经收到您在【<a href="' + SITE_ROOT_URL + '">微糖IT社区</a>】的注册信息，请 24 小时内点击下面的按钮激活帐号。若您没有在微糖社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
            '<a href="' + href + '" style="padding: 10px 20px;background: #0078D8;color: #fff;text-decoration: none;display: block;width: 80px;text-align: center;margin: 0 auto;margin-top: 30px;">激活帐号</a>' +
            '</div></div>' +
            '<p style="text-align: center;">© 2013 微糖，这是一封系统邮件，请不要直接回复。</p>';

        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: html
        };
        sendMail(mailOptions, callback);
    },

    /**
     * @method sendResetPassMail
     * 发送重置密码邮件
     */
    sendResetPassMail: function(to, token, callback) {
        var from = config.mailOpts.auth.user;
        var subject = config.name + "：设置新密码";
        var href = SITE_ROOT_URL + '/newPassword?token=' + token;
        var html = '<div style="width: 600px;box-shadow: 0 0 4px gray;border-radius: 5px;left: 50%;position: relative;margin-left: -300px;">' +
            '<a href="' + SITE_ROOT_URL + '" style="margin: 0;padding: 8px 0;background: #0078D8;text-align: center;color: #fff;font-size: 25px;display: block;text-decoration: none;">' + config.name + '</a>' +
            '<div style="padding: 20px;">' +
            '<h4>你好！</h4>' +
            '<p>我们已经收到了你的密码重置请求，请 24 小时内点击下面的按钮重置密码。</p>' +
            '<a href="' + href + '" style="padding: 10px 20px;background: #0078D8;color: #fff;text-decoration: none;display: block;width: 80px;text-align: center;margin: 0 auto;margin-top: 30px;">重置密码</a>' +
            '</div></div>' +
            '<p style="text-align: center;">© 2013 ' + config.name + '，这是一封系统邮件，请不要直接回复。</p>';

        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: html
        };
        sendMail(mailOptions, callback);
    }

};
