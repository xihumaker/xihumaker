var weixin = require('weixin-api');
var config = require('./config');
var api = require('./controllers/api');

var WEB_SERVER_IP = 'http://' + config.WEB_SERVER_IP;

module.exports = function(app) {

    // 接入验证
    app.get('/verify', function(req, res) {
        // 签名成功
        if (weixin.checkSignature(req)) {
            res.send(200, req.query.echostr);
        } else {
            res.send(200, 'fail');
        }
    });

    app.post('/verify', function(req, res) {
        weixin.loop(req, res);
    });

    app.get('/', function(req, res) {
        res.render('index', {
            title: "NodeJS项目模板"
        });
    });

    // 微信端登录页面
    app.get('/m/login', function(req, res) {
        res.render('mobile/login');
    });

    // 微信端注册页面
    app.get('/m/register', function(req, res) {
        res.render('mobile/register');
    });



}

// config
weixin.token = 'xihumaker';

// 监听文本消息
weixin.textMsg(function(msg) {
    console.log("textMsg received");
    console.log(JSON.stringify(msg));

    var resMsg = {};

    switch (msg.content) {
        case "文本":
            // 返回文本消息
            resMsg = {
                fromUserName: msg.toUserName,
                toUserName: msg.fromUserName,
                msgType: "text",
                content: "这是文本回复",
                funcFlag: 0
            };
            break;

        case "音乐":
            // 返回音乐消息
            resMsg = {
                fromUserName: msg.toUserName,
                toUserName: msg.fromUserName,
                msgType: "music",
                title: "音乐标题",
                description: "音乐描述",
                musicUrl: "音乐url",
                HQMusicUrl: "高质量音乐url",
                funcFlag: 0
            };
            break;

        case "图文":

            var articles = [];
            articles[0] = {
                title: "PHP依赖管理工具Composer入门",
                description: "PHP依赖管理工具Composer入门",
                picUrl: "http://weizhifeng.net/images/tech/composer.png",
                url: "http://weizhifeng.net/manage-php-dependency-with-composer.html"
            };

            articles[1] = {
                title: "八月西湖",
                description: "八月西湖",
                picUrl: "http://weizhifeng.net/images/poem/bayuexihu.jpg",
                url: "http://weizhifeng.net/bayuexihu.html"
            };

            articles[2] = {
                title: "「翻译」Redis协议",
                description: "「翻译」Redis协议",
                picUrl: "http://weizhifeng.net/images/tech/redis.png",
                url: "http://weizhifeng.net/redis-protocol.html"
            };

            // 返回图文消息
            resMsg = {
                fromUserName: msg.toUserName,
                toUserName: msg.fromUserName,
                msgType: "news",
                articles: articles,
                funcFlag: 0
            }
    }

    weixin.sendMsg(resMsg);
});

// 监听图片消息
weixin.imageMsg(function(msg) {
    console.log("imageMsg received");
    console.log(JSON.stringify(msg));
});

// 监听位置消息
weixin.locationMsg(function(msg) {
    console.log("locationMsg received");
    console.log(JSON.stringify(msg));
});

// 监听链接消息
weixin.urlMsg(function(msg) {
    console.log("urlMsg received");
    console.log(JSON.stringify(msg));
});

// 监听事件消息
weixin.eventMsg(function(msg) {
    console.log("eventMsg received");
    console.log(JSON.stringify(msg));

    // 用户关注公众号事件
    if (msg.event === 'subscribe') {
        api.subscribeHandler(msg);
    }

    // 菜单事件
    if (msg.event === 'CLICK') {
        switch (msg.eventKey) {
            case 'WHAT_IS_MAKER':
                api.whatIsMaker(msg);
                break;

            default:
                break;
        }
    }
});