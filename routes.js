var weixin = require('weixin-apis');
var config = require('./config');
var api = require('./controllers/api');
var user = require('./controllers/user');
var project = require('./controllers/project');
var admin = require('./controllers/admin');

var WEB_SERVER_IP = 'http://' + config.WEB_SERVER_IP;

// dev - 微信接入配置
weixin.configurate({
    token: 'xihumaker',
    appid: 'wxc2d82aa2e44a2faa',
    secret: '9ef7661014dd0dbd098b483fee803d58'
});

// pro - 部署
// weixin.configurate({
//     token: 'xihumaker',
//     appid: 'wx1b77ae9461a7f199',
//     secret: '4f87ca5ca463cff33541909fb88dc5cd'
// });
// weixin.reflashAccessToken();

module.exports = function(app) {

    // 接入验证
    app.get('/verify', function(req, res) {
        if (weixin.checkSignature(req)) {
            res.send(200, req.query.echostr);
        } else {
            res.send(200, 'fail');
        }
    });
    // Start
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

    app.get('/weixin/*', function(req, res, next) {
        res.set({
            'Content-Type': 'text/html',
            'ETag': Date.now()
        });
        next();
    });

    app.get('/weixin/index', function(req, res) {
        res.render('weixin/index');
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
        res.render('weixin/projects');
    });
    // 微信端 - 项目列表页面
    app.get('/weixin/projects', function(req, res) {
        res.render('weixin/projects');
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

    // 用户中心页面
    app.get('/weixin/userCenter', user.userAuth, user.showUserCenter);
    app.get('/weixin/user/:_id/edit', user.userAuth, user.showEditUser);

    app.get('/weixin/events', function(req, res) {
        res.render('weixin/events');
    });

    app.get('/oauthResponse', function(req, res) {
        var _res = res;
        var code = req.param('code');
        var state = req.param('state');

        weixin.getOauth2AccessToken(code, function(err, res, body) {
            var ret = JSON.parse(body);
            console.log(ret);
            var access_token = ret.access_token;
            var openid = ret.openid;
            var refreshToken = ret.refresh_token;

            weixin.getOauth2UserInfo({
                access_token: access_token,
                openid: openid,
                lang: "zh_CN"
            }, function(err, res, body) {
                var ret = JSON.parse(body);
                console.log(ret);
                _res.json(ret);
            });


        });


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
    // 用户注销操作
    app.post('/weixin/logout', user.logout);

    app.get('/api/project/:_id', project.findProjectById);
    app.post('/api/project/:_id', project.findProjectByIdAndUpdate);
    app.post('/api/projects', user.userAuth, project.addProject);
    // 项目详情页
    app.get('/weixin/project/:_id', project.getProjectById);
    // 加入项目
    app.post('/api/project/:_id/join', user.userAuth, project.joinProjectById);
    // 退出项目
    app.post('/api/project/:_id/quit', user.userAuth, project.quitProjectById);

    app.get('/api/projects/search', project.searchProjects);


    // 编辑项目
    app.get('/weixin/project/:_id/edit', user.userAuth, project.editProjectById);

    // 新建项目
    app.get('/weixin/newPro', user.userAuth, function(req, res) {
        res.render('weixin/newPro');
    });

    /**
     * 后台管理相关路由
     * ---------------------------------------------------------
     */


    // 后台管理首页
    app.get('/admin', admin.auth, function(req, res) {
        res.render('admin/index');
    });
    // 后台管理首页
    app.get('/admin/index', admin.auth, function(req, res) {
        res.render('admin/index');
    });
    // 后台管理登录页面
    app.get('/admin/login', function(req, res) {
        if (req.session.adminId) {
            res.render('admin/index');
        } else {
            res.render('admin/login');
        }
    });
    // 用户管理页面
    app.get('/admin/userManagement', admin.auth, function(req, res) {
        res.render('admin/userManagement');
    });
    // 项目管理页面
    app.get('/admin/projectManagement', admin.auth, function(req, res) {
        res.render('admin/projectManagement');
    });
    // 后台管理设置页面
    app.get('/admin/settings', admin.auth, function(req, res) {
        res.render('admin/settings');
    });
    // 后台管理退出操作
    app.get('/admin/logout', admin.logout);

    // 后台管理登录操作
    app.post('/admin/login', admin.login);



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

// 监听关注事件
weixin.on('subscribeEventMsg', function(data) {
    console.log('>>>>>>>>> subscribeEventMsg emit >>>>>>>>>');
    console.log(data);
    api.subscribeHandler(data);
});

// 监听点击菜单拉取消息时的事件推送
weixin.on('clickEventMsg', function(data) {
    console.log('>>>>>>>>> clickEventMsg emit >>>>>>>>>');
    console.log(data);

    // 菜单事件
    if (data.event === 'CLICK') {
        switch (data.eventKey) {
            case 'CHUANG_KE_LAI_LE':
                api.chuangKeLaiLe(data);
                break;
            default:
                break;
        }
    }
});