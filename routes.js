var weixin = require('weixin-api');
var config = require('./config');
var api = require('./controllers/api');
var user = require('./controllers/user');
var project = require('./controllers/project');

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

    /**
     * ---------------------------------------------------------
     */
    // Web端 - 网站首页
    app.get('/', function(req, res) {
        res.render('index');
    });
    // 微信端 - 创建项目页面
    app.get('/weixin/createProject', user.userAuth, function(req, res) {
        res.render('weixin/createProject');
    });
    // 微信端 - 创客分布地图
    app.get('/weixin/map', function(req, res) {
        res.render('weixin/baiduMap');
    });
    // 微信端 - 登录页面
    app.get('/weixin/login', function(req, res) {
        res.render('weixin/login');
    });
    // 微信端 - 注册页面
    app.get('/weixin/register', function(req, res) {
        res.render('weixin/register');
    });
    // 微信端
    // article/0 - 什么是创客？
    // article/1 - 西湖创客汇简介&理事会及联系方式
    app.get('/weixin/article/:id', function(req, res) {
        var id = req.param('id');
        res.render('weixin/article/' + id);
    });
    // 微信端 -《西湖创客报》
    app.get('/weixin/papers', function(req, res) {
        res.render('weixin/papers');
    });
    // 微信端 - paper/1 - 《西湖创客报》V1
    // 微信端 - paper/2 - 《西湖创客报》V2
    // 微信端 - paper/3 - 《西湖创客报》V3
    app.get('/weixin/paper/:id', function(req, res) {
        var id = req.param('id');
        res.render('weixin/paper/' + id);
    });
    // 微信端 - 捐助本会
    app.get('/weixin/donation', function(req, res) {
        res.render('weixin/donation');
    });
    // 微信端 - 西湖创客汇章程
    app.get('/weixin/constitution', function(req, res) {
        res.render('weixin/constitution');
    });
    // 微信端 - 改变世界
    app.get('/weixin/gaibianshijie', function(req, res) {
        res.set({
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Expires': 0
        })
        res.render('weixin/projectList');
    });
    // 微信端 - 项目列表页面
    app.get('/weixin/projectList', function(req, res) {
        res.render('weixin/projectList');
    });
    // 微信端 - 推广创客文化
    app.get('/weixin/tuiguang', function(req, res) {
        res.render('weixin/tuiguang');
    });
    // 创客微课程
    app.get('/weixin/weikecheng', function(req, res) {
        res.render('weixin/weikecheng');
    });
    app.get('/weixin/weikecheng/:tag', function(req, res) {
        var tag = req.param('tag');
        if (tag === '开源硬件与传感器') {
            res.render('weixin/weikecheng/openSourceHardwareAndSensors')
        } else {
            res.render('weixin/weikecheng/building');
        }
    });
    app.get('/weixin/weikecheng/:tag/:course', function(req, res) {
        var tag = req.param('tag');
        var course = req.param('course');
        if (tag === '开源硬件与传感器') {
            if (course === '轻松玩转pcDuino') {
                res.render('weixin/weikecheng/openSourceHardwareAndSensors/pcDuino');
            } else if (course === 'Arduino初级课程') {
                res.render('weixin/weikecheng/openSourceHardwareAndSensors/Arduino');
            }
        }
    });


    /**
     * ---------------------------------------------------------
     */
    // 根据_id获取用户信息
    app.get('/api/user/:_id', user.findUserById);
    // 用户登录操作
    app.post('/weixin/login', user.login);
    // 注册新用户
    app.post('/api/users', user.addUser);

    app.get('/api/project/:_id', project.findProjectById);
    app.post('/api/project/:_id', project.findProjectByIdAndUpdate);
    app.post('/api/projects', user.userAuth, project.addProject);
    // 项目详情页
    app.get('/weixin/project/:_id', project.getProjectById);
    // 加入项目
    app.post('/api/project/:_id/join', user.userAuth, project.joinProjectById);

    app.get('/api/projects/search', project.searchProjects);


    // 编辑项目
    app.get('/weixin/project/:_id/edit', user.userAuth, project.editProjectById);

    // 新建项目
    app.get('/weixin/newPro', user.userAuth, function(req, res) {
        res.render('weixin/newPro');
    });


    /**
     * 404 Page
     */
    app.get('*', function(req, res, next) {
        if (/.*\.(gif|jpg|jpeg|png|bmp|js|css|html|eot|svg|ttf|woff|otf|ico|mp3).*$/.test(req.originalUrl)) {
            next();
        } else {
            res.render('404');
        }
    });

}

// config
weixin.token = config.TOKEN;

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

    // 用户关注公众号事件
    if (msg.event === 'subscribe') {
        api.subscribeHandler(msg);
    }

    // 菜单事件
    if (msg.event === 'CLICK') {
        switch (msg.eventKey) {
            case 'CHUANG_KE_LAI_LE':
                api.chuangKeLaiLe(msg);
                break;
            default:
                break;
        }
    }

    if (msg.event === 'LOCATION') {
        console.log(msg);
    }
});