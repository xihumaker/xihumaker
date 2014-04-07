var weixin = require('weixin-apis');
var config = require('../config');
var WEB_SERVER_IP = 'http://' + config.WEB_SERVER_IP;

module.exports = {

    // 用户关注公众号事件
    subscribeHandler: function(data) {
        var resMsg = {
            toUserName: data.fromUserName,
            fromUserName: data.toUserName,
            msgType: 'music',
            title: "西湖创客汇",
            description: "西湖创客汇是浙江地区的创客空间，我们的主旨是 青年 | 创新 | 科技",
            musicUrl: WEB_SERVER_IP + '/voice/welcome.mp3',
            thumbMediaId: ''
        };
        console.log(resMsg);
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
    }


}