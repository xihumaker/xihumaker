"use strict";
var weixin = require('weixin-apis');
var config = require('../config');
var WEB_SERVER_IP = 'http://' + config.WEB_SERVER_IP;

module.exports = {

    // 用户关注公众号事件
    subscribeHandler: function(data) {
        var resMsg = {
            toUserName: data.fromUserName,
            fromUserName: data.toUserName,
            msgType: 'text',
            content: '谢谢你关注西湖创客汇，进步源于创造，欢迎参加创客活动，DIY美好生活。'
        };
        weixin.sendMsg(resMsg);
    },

    // 创客？ - 创客来了
    chuangKeLaiLe: function(data) {
        var articles = [];
        articles[0] = {
            title: "什么是创客？",
            description: "",
            picUrl: WEB_SERVER_IP + '/img/logo_360_200.jpg',
            url: WEB_SERVER_IP + '/weixin/article/0'
        };
        articles[1] = {
            title: "西湖创客汇简介&理事会及联系方式",
            description: "",
            picUrl: '',
            url: WEB_SERVER_IP + '/weixin/article/1'
        };
        articles[2] = {
            title: "《西湖创客报》",
            description: "",
            picUrl: '',
            url: WEB_SERVER_IP + '/weixin/papers'
        };
        articles[3] = {
            title: "捐助本会",
            description: "",
            picUrl: '',
            url: WEB_SERVER_IP + '/weixin/donation'
        };
        articles[4] = {
            title: "西湖创客汇章程",
            description: "",
            picUrl: '',
            url: WEB_SERVER_IP + '/weixin/constitution'
        };
        var resMsg = {
            toUserName: data.fromUserName,
            fromUserName: data.toUserName,
            msgType: 'news',
            articles: articles
        };

        weixin.sendMsg(resMsg);
    },

    // 朋友~ - 绑定帐号
    bindAccount: function(data) {
        var articles = [];
        articles[0] = {
            title: "绑定帐号",
            description: "点击卡片进行【西湖创客汇】帐号的绑定，绑定帐号后，可获得10金币的奖励哦~",
            picUrl: WEB_SERVER_IP + '/img/logo_360_200.jpg',
            url: WEB_SERVER_IP + '/weixin/bindWeixin?openId=' + data.fromUserName
        };
        var resMsg = {
            toUserName: data.fromUserName,
            fromUserName: data.toUserName,
            msgType: 'news',
            articles: articles
        };
        weixin.sendMsg(resMsg);
    }


};