var weixin = require('weixin-api');
var config = require('../config');
var WEB_SERVER_IP = 'http://' + config.WEB_SERVER_IP;

module.exports = {

    // 用户关注公众号事件
    subscribeHandler: function(msg) {
        var resMsg = {
            fromUserName: msg.toUserName,
            toUserName: msg.fromUserName,
            msgType: "music",
            title: "西湖创客汇",
            description: "西湖创客汇",
            musicUrl: WEB_SERVER_IP + '/voice/welcome.mp3',
            HQMusicUrl: "",
            funcFlag: 0
        };

        weixin.sendMsg(resMsg);
    },

    // 什么是创客
    whatIsMaker: function(msg) {
        var articles = [];
        articles[0] = {
            title: "一张图了解创客运动",
            description: "什么是创客？创客圈子神秘吗？全球创客运动发展如何？",
            picUrl: WEB_SERVER_IP + '/img/logo_360*200.jpg',
            url: WEB_SERVER_IP + '/whatIsMaker'
        };

        // 返回图文消息
        resMsg = {
            fromUserName: msg.toUserName,
            toUserName: msg.fromUserName,
            msgType: "news",
            articles: articles,
            funcFlag: 0
        }

        weixin.sendMsg(resMsg);
    }


}