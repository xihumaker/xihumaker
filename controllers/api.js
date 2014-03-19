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

    // 创客？ - 创客来了
    chuangKeLaiLe: function(msg) {
        var articles = [];
        articles[0] = {
            title: "什么是创客？",
            description: "",
            picUrl: WEB_SERVER_IP + '/img/logo_360*200.jpg',
            url: WEB_SERVER_IP + '/weixin/article/0'
        };
        articles[1] = {
            title: "西湖创客汇简介&理事会及联系方式",
            description: "",
            picUrl: WEB_SERVER_IP + '/img/logo_360*200.jpg',
            url: WEB_SERVER_IP + '/weixin/article/1'
        };
        articles[2] = {
            title: "《西湖创客报》",
            description: "",
            picUrl: WEB_SERVER_IP + '/img/logo_360*200.jpg',
            url: WEB_SERVER_IP + '/weixin/papers'
        };
        articles[3] = {
            title: "捐助本会",
            description: "",
            picUrl: WEB_SERVER_IP + '/img/logo_360*200.jpg',
            url: WEB_SERVER_IP + '/weixin/donation'
        };
        articles[4] = {
            title: "西湖创客汇章程",
            description: "",
            picUrl: WEB_SERVER_IP + '/img/logo_360*200.jpg',
            url: WEB_SERVER_IP + '/weixin/constitution'
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