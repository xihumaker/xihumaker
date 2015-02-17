/*global exports */

"use strict";

function getSignedCookies(req, res, name) {
    return req.signedCookies && req.signedCookies[name];
}

// true 用户已登录 false 用户未登录
function userAuth(req, res) {
    var xihumaker = getSignedCookies(req, res, 'xihumaker');
    return !!xihumaker;
}

/**
 * 微信端页面请求认证
 */
function weixinPageAuth(req, res, next) {
    if (userAuth(req, res)) {
        console.log("[ >>> LOG >>> ]：用户已登录");
        next();
    } else {
        console.log("[ >>> LOG >>> ]：用户未登录");
        res.render('weixin/login');
    }
}

/**
 * Web端页面请求认证
 */
function webPageAuth(req, res, next) {
    if (userAuth(req, res)) {
        console.log("[ >>> LOG >>> ]：用户已登录");
        next();
    } else {
        console.log("[ >>> LOG >>> ]：用户未登录");
        res.render('login');
    }
}

/**
 * Ajax请求认证
 */
function userAjaxAuth(req, res, next) {
    if (userAuth(req, res)) {
        console.log("[ >>> LOG >>> ]：用户已登录");
        next();
    } else {
        console.log("[ >>> LOG >>> ]：用户未登录");
        res.json({
            "r": 1,
            "errcode": 10093,
            "msg": "用户未登录"
        });
    }
}

function getUserId(req, res) {
    var xihumaker = getSignedCookies(req, res, 'xihumaker');
    return xihumaker.userId;
}

exports.getSignedCookies = getSignedCookies;
exports.userAuth = userAuth;
exports.weixinPageAuth = weixinPageAuth;
exports.webPageAuth = webPageAuth;
exports.userAjaxAuth = userAjaxAuth;
exports.getUserId = getUserId;
