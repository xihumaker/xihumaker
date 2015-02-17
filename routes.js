"use strict";
var qiniu = require('qiniu');
var weixin = require('weixin-apis');
var config = require('./config');
var api = require('./controllers/api');
var user = require('./controllers/user');
var project = require('./controllers/project');
var projectPeople = require('./controllers/project_people');
var projectLike = require('./controllers/project_like');
var projectConcern = require('./controllers/project_concern');
var projectComment = require('./controllers/project_comment');
var projectTopic = require('./controllers/project_topic');
var vip = require('./controllers/vip');
var vipLike = require('./controllers/vip_like');
var admin = require('./controllers/admin');
var activity = require('./controllers/activity');
var activityPeople = require('./controllers/activity_people');
var activityLike = require('./controllers/activity_like');
var activityComment = require('./controllers/activity_comment');
var activityScore = require('./controllers/activity_score');
var site = require('./controllers/site');
var product = require('./controllers/product');
var productTopic = require('./controllers/product_topic');
var ccap = require('./services/ccap');
var auth = require('./policies/auth');

qiniu.conf.ACCESS_KEY = config.QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.QINIU_SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(config.QINIU_Bucket_Name);

module.exports = function(app) {

    if (config.ENV === 'DEV') {
        // dev - 微信接入配置 iPhone
        weixin.configurate({
            app: app,
            token: 'xihumaker',
            appid: 'wxc2d82aa2e44a2faa',
            secret: '9ef7661014dd0dbd098b483fee803d58'
        });
        // weixin.reflashAccessToken();
    } else if (config.ENV === 'TEST') {
        // test - 测试 魅族
        weixin.configurate({
            app: app,
            token: 'xihumaker',
            appid: 'wx7c9cf10634b7c066',
            secret: 'bb93a8587b9f6cd20911ff0c8c61c6c0'
        });
        weixin.reflashAccessToken();
    } else {
        // pro - 部署 
        weixin.configurate({
            app: app,
            token: 'xihumaker',
            appid: 'wx1b77ae9461a7f199',
            secret: '4f87ca5ca463cff33541909fb88dc5cd'
        });
        weixin.reflashAccessToken();
    }

    // 七牛token
    app.get('/qiniuUptoken', function(req, res) {
        var token = uptoken.token();
        res.header("Cache-Control", "max-age=0, private, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        if (token) {
            res.json({
                uptoken: token
            });
        }
    });

    // 验证码
    app.get('/api/captcha', ccap.newCaptcha);

    /**
     * Web端页面
     * ---------------------------------------------------------
     */
    // Web端 - 网站首页
    app.get('/', site.showIndex);
    // Web端 - 登录
    app.get('/login', site.showLogin);
    // Web端 - 忘记密码
    app.get('/resetPassword', site.showResetPassword);
    // Web端 - 注销
    app.get('/logout', site.logout);
    // Web端 - 项目列表页
    app.get('/projects', site.showProjects);
    // Web端 - 创建项目
    app.get('/createProject', auth.webPageAuth, site.showCreateProject);
    // Web端 - 我的创客汇
    app.get('/myMaker', auth.webPageAuth, site.showMyMaker);
    // Web端 - 搜索项目页
    app.get('/search', site.showSearch);
    // 设置新密码
    app.get('/newPassword', user.showNewPassword);
    // Web端 - 项目详情页面
    app.get('/project/:_id', project.showProjectInfo);

    // Web端 - 项目编辑页面
    app.get('/project/:_id/edit', auth.webPageAuth, project.showEditProject);



    /**
     * 微信端页面
     * ---------------------------------------------------------
     */
    // 防止微信端页面刷新时，页面空白
    app.get('/weixin/*', function(req, res, next) {
        res.set({
            'Content-Type': 'text/html',
            'ETag': Date.now()
        });
        next();
    });
    // 微信端 - 首页
    app.get('/weixin/index', site.showWeixinIndex);
    // 微信端 - 创客分布地图
    app.get('/weixin/map', site.showWeixinMap);
    // 微信端 - 登录页面
    app.get('/weixin/login', site.showWeixinLogin);
    // 微信端 - 注册页面
    app.get('/weixin/register', site.showWeixinRegister);
    // 微信端 - 注册成功页面
    app.get('/weixin/registerSucc', site.showWeixinRegisterSucc);
    // 微信端 - 友言登录
    app.get('/sso/login', site.showWeixinSsoLogin);
    // article/0 - 什么是创客？
    // article/1 - 西湖创客汇简介&理事会及联系方式
    app.get('/weixin/article/:id', site.showWeixinArticle);
    // 微信端 -《西湖创客报》
    app.get('/weixin/papers', site.showWeixinPapers);
    // 微信端 - paper/1 - 《西湖创客报》V1
    // 微信端 - paper/2 - 《西湖创客报》V2
    // 微信端 - paper/3 - 《西湖创客报》V3
    app.get('/weixin/paper/:id', site.showWeixinPaper);
    // 微信端 - 捐助本会
    app.get('/weixin/donation', site.showWeixinDonation);
    // 微信端 - 西湖创客汇章程
    app.get('/weixin/constitution', site.showWeixinConstitution);
    // 微信端 - 改变世界
    app.get('/weixin/gaibianshijie', site.showWeixinProjects);
    // 微信端 - 项目列表页面
    app.get('/weixin/projects', site.showWeixinProjects);
    // 微信端 - 推广创客文化
    app.get('/weixin/tuiguang', site.showWeixinTuiguang);
    // 微信端 - 创客微课程
    app.get('/weixin/weikecheng', site.showWeixinWeikecheng);
    app.get('/weixin/weikecheng/:tag', site.showWeixinWeikechengByTag);
    app.get('/weixin/weikecheng/:tag/:course', site.showWeixinWeikechengByTagAndCourse);
    // 微信端 - 用户中心页面
    app.get('/weixin/userCenter', auth.weixinPageAuth, user.showWeixinUserCenter);
    // 微信端 - 用户信息编辑
    app.get('/weixin/user/:_id/edit', auth.weixinPageAuth, user.showWeixinEditUser);
    // 微信端 - 活动列表页
    app.get('/weixin/activities', site.showWeixinActivities);
    // 微信端 - 我发起的项目
    app.get('/weixin/user/:_id/projects/sponsor', auth.weixinPageAuth, site.showWeixinSponsorProjects);
    // 微信端 - 我参与的项目
    app.get('/weixin/user/:_id/projects/take', auth.weixinPageAuth, site.showWeixinTakeProjects);
    // 微信端 - 我关注的项目
    app.get('/weixin/user/:_id/projects/concern', auth.weixinPageAuth, site.showWeixinConcernProjects);
    // 微信端 - 朋友 - 财富榜
    app.get('/weixin/richList', site.showWeixinRichList);
    // 微信端 - 朋友 - 会员秀
    app.get('/weixin/vipShow', vip.showVipShow);
    // 微信端 - 朋友 - 会员秀 - 会员详情页
    app.get('/weixin/vip/:_id', vip.showVipInfo);
    // 微信端 - 我报名的活动
    app.get('/weixin/myActivities', auth.weixinPageAuth, user.showMyActivities);
    // 微信端 - 绑定微信页面
    app.get('/weixin/bindWeixin', site.showWeixinBindWeixin);
    // 微信端 - 绑定成功提示页面
    app.get('/weixin/bindWeixinSucc', site.showWeixinBindWeixinSucc);
    // 微信端 - 活动详情页
    app.get('/weixin/activity/:_id', activity.showWeixinActivity);


    // 微信端 - 项目详情页
    app.get('/weixin/project/:_id', project.showProject);
    // 江湖告急
    app.get('/weixin/jianghu', function(req, res) {
        res.render('weixin/jianghu');
    });

    // 微信端 - 产品乌托邦 - 列表
    app.get('/weixin/products', product.showProducts);
    // 微信端 - 产品乌托邦 - 详情
    app.get('/weixin/product/:_id', product.showProductInfo);
    // 微信端 - 产品乌托邦 - 新建帖子
    app.get('/weixin/createProductTopic', productTopic.showCreateProductTopic);


    /**
     * API
     * ---------------------------------------------------------
     */
    // 创客分布
    app.get('/api/members/all', api.findAllMembers);
    // 帐号绑定
    app.post('/api/user/bind', user.bindWeixin);
    // 用户搜索
    app.get('/api/users/search', user.searchUsers);
    // 根据_id获取用户信息
    app.get('/api/user/:_id', user.findUserById);
    // 用户登录操作
    app.post('/api/login', user.login);
    // 注册新用户
    app.post('/api/register', user.addUser);
    // 用户注销操作
    app.post('/api/logout', user.logout);
    // 修改用户
    app.post('/api/user/update', auth.userAjaxAuth, user.findUserByIdAndUpdate);
    // 删除用户
    app.delete('/api/user', admin.adminAjaxAuth, user.findUserByIdAndRemove);
    // 获取当前请求用户的详细信息
    app.get('/api/currentUserinfo', auth.userAjaxAuth, user.getCurrentUserinfo);
    // 获取某个用户发起的项目
    app.get('/api/user/:_id/projects', project.findProjectsByUserId);
    // 重置密码
    app.post('/api/password/reset', user.resetPassword);
    app.post('/api/password/new', user.newPassword);
    // 更新用户金币数量
    app.post('/api/coin/update', user.updateCoin);
    // 根据项目ID查找项目信息
    app.get('/api/project/:_id', project.findProjectById);
    // 创建项目
    app.post('/api/projects', auth.userAjaxAuth, project.addProject);
    // 更新项目
    app.put('/api/project/:_id', auth.userAjaxAuth, project.findProjectByIdAndUpdate);
    // 加入项目
    app.post('/api/project/:_id/join', auth.userAjaxAuth, projectPeople.joinProject);
    // 退出项目
    app.post('/api/project/:_id/quit', auth.userAjaxAuth, projectPeople.quitProject);





    // 项目搜索 旧
    app.get('/api/projects/search', project.searchProjects);
    // 项目搜索 新
    app.get('/api/projects/find', project.findProjects);
    // 删除项目
    app.delete('/api/project/:_id', admin.adminAjaxAuth, project.findProjectByIdAndRemove);
    app.get('/api/projects/key', project.searchProjectsByKey);

    // 项目 - 查找某个项目的所有成员
    app.get('/api/project/:_id/peoples', projectPeople.findAllPeoplesByProjectId);
    // 项目 - 查找某个用户参加的所有项目
    app.get('/api/user/:_id/projects/take', projectPeople.findProjectsByUserId);

    // 项目 - 赞
    app.post('/api/project/:_id/like', auth.userAjaxAuth, projectLike.likeProject);
    // 项目 - 取消赞
    app.post('/api/project/:_id/unlike', auth.userAjaxAuth, projectLike.unlikeProject);
    // 项目 - 查询某个用户赞过的所有项目
    app.get('/api/user/:_id/projects/like', projectLike.findProjectsByUserId);

    // 项目 - 关注
    app.post('/api/project/:_id/concern', auth.userAjaxAuth, projectConcern.concernProject);
    // 项目 - 取消关注
    app.post('/api/project/:_id/unconcern', auth.userAjaxAuth, projectConcern.unconcernProject);
    // 项目 - 查找某个用户关注的项目
    app.get('/api/user/:_id/projects/concern', projectConcern.findProjectsByUserId);

    // 项目 - 评论
    app.post('/api/project/:_id/comment', auth.userAjaxAuth, projectComment.addProjectComment);
    // 项目 - 查找该项目所有的评论
    app.get('/api/project/:_id/comments', projectComment.findAllCommentsByProjectId);

    // 项目 - 设置项目级别，1-普通；2-创新；3-精华
    app.post('/api/project/:_id/level', admin.adminAjaxAuth, project.updateProjectLevel);
    // 项目 - 添加一条江湖告急
    app.post('/api/project/:_id/topic', projectTopic.addOneProjectTopic);
    // 项目 - 删除一条江湖告急
    app.delete('/api/project/:_id/topic/:tid', projectTopic.removeTopicById);
    // 查找某个项目的所有江湖告急
    app.get('/api/project/:_id/topics', projectTopic.findProjectTopics);
    // 江湖告急 - 回复
    app.post('/api/project/:_id/topic/:topicId', auth.userAjaxAuth, projectTopic.addOneTopicComment);
    // 江湖救急 - 分页查询
    app.get('/api/topics/find', projectTopic.findTopicsByPage);




    // 财富榜
    app.get('/api/richList/:num', user.richList);
    app.get('/api/user/:_id/coinRank', user.getCoinRankByUserId);

    // 新建会员秀
    app.post('/api/vip/create', admin.adminAjaxAuth, vip.createVip);
    // 编辑会员秀
    app.put('/api/vip/:_id', admin.adminAjaxAuth, vip.updateVipById);
    // 删除会员秀
    app.delete('/api/vip/:_id', admin.adminAjaxAuth, vip.deleteVipById);
    // 查找会员秀列表
    app.get('/api/vips/all', vip.findAllVips);
    // 会员秀 - 对某个会员秀发起赞
    app.post('/api/vip/:_id/like', auth.userAjaxAuth, vipLike.createVipLike);


    // 活动 - 新建活动
    app.post('/api/activity', admin.adminAjaxAuth, activity.createActivity);
    // 活动 - 更新活动
    app.put('/api/activity/:_id', admin.adminAjaxAuth, activity.updateActivityById);
    // 删除活动
    app.delete('/api/activity/:_id', admin.adminAjaxAuth, activity.deleteActivityById);
    // 活动 - 活动查询
    app.get('/api/activity/search', activity.searchActivities);
    // 活动 - 活动报名
    app.post('/api/activity/:_id/join', auth.userAjaxAuth, activityPeople.joinActivity);
    // 查找某个活动所有的报名用户
    app.get('/api/activity/:_id/people', activityPeople.findAllPeoplesById);
    // 查找某个用户报名的所有活动
    app.get('/api/user/:_id/activities', activityPeople.findActivitiesByUserId);
    // 活动 - 赞
    app.post('/api/activity/:_id/like', auth.userAjaxAuth, activityLike.likeActivity);

    // 活动 - 评论
    app.post('/api/activity/:_id/comment', auth.userAjaxAuth, activityComment.commentActivity);
    // 活动 - 查找该活动所有的评论
    app.get('/api/activity/:_id/comments', activityComment.findAllCommentsByActivityId);
    // 活动 - 签到并评分
    app.post('/api/activity/:_id/score', auth.userAjaxAuth, activityScore.scoreActivity);

    // 产品乌托邦 - 新建
    app.post('/api/product/create', admin.adminAjaxAuth, product.createProduct);
    // 产品乌托邦 - 查询
    app.get('/api/products', product.findProductsByPage);
    // 产品乌托邦 - 删除
    app.delete('/api/product/:_id', admin.adminAjaxAuth, product.deleteProductById);
    // 产品乌托邦 - 更新
    app.put('/api/product/:_id', admin.adminAjaxAuth, product.updateProductById);
    // 产品乌托邦 - 新建帖子
    app.post('/api/product/:_id/topic', auth.userAjaxAuth, productTopic.createProductTopic);
    // 产品乌托邦 - 分页查询
    app.get('/api/product/:_id/topics', productTopic.findProductTopicsByPage);
    // 产品乌托邦 - 赞
    app.post('/api/product/topic/:_id/like', auth.userAjaxAuth, productTopic.likeProductTopic);
    // 产品乌托邦 - 评论帖子
    app.post('/api/product/topic/:_id/comment', auth.userAjaxAuth, productTopic.commentProductTopic);
    // 获取产品总个数
    app.get('/api/products/total', product.getTotalProductNum);

    /**
     * 后台管理相关路由
     * ---------------------------------------------------------
     */
    // 后台管理登录页面
    app.get('/admin/login', admin.showLogin);
    // 后台管理退出操作
    app.get('/admin/logout', admin.logout);
    // 后台管理登录操作
    app.post('/admin/login', admin.login);
    // 导出用户信息到Excel
    app.get('/admin/exportToExcel', admin.adminAjaxAuth, admin.exportToExcel);
    /**
     * 下面的请求都要验证用户是否已经登录
     */
    app.get('/admin/*', admin.adminPageAuth);
    // 后台管理首页
    app.get('/admin', admin.adminPageAuth, admin.showIndex);
    // 后台管理首页
    app.get('/admin/index', admin.showIndex);
    // 用户管理页面
    app.get('/admin/userManagement', admin.showUserManagement);
    // 项目管理页面
    app.get('/admin/projectManagement', admin.showProjectManagement);
    // 活动管理页面
    app.get('/admin/activityManagement', admin.showActivityManagement);
    // 会员秀管理页面
    app.get('/admin/vipManagement', admin.showVipManagement);
    // 新建会员秀
    app.get('/admin/createVip', admin.showCreateVip);
    // 编辑会员秀信息
    app.get('/admin/vip/:_id/edit', vip.showEditVip);
    // 显示新建活动页面
    app.get('/admin/createActivity', admin.showCreateActivity);
    // 显示更新活动页面
    app.get('/admin/activity/:_id/edit', activity.showEditActivity);
    // 产品乌托邦 - 管理页面
    app.get('/admin/productManagement', admin.showProductManagement);
    // 产品乌托邦 - 新建产品
    app.get('/admin/createProduct', admin.showCreateProduct);
    // 产品乌托邦 - 更新页面
    app.get('/admin/product/:_id/edit', product.showEditProduct);


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

};

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
            case 'BANGING_ACCOUNT':
                api.bindAccount(data);
                break;
            default:
                break;
        }
    }
});

// 监听地理位置事件
weixin.on('locationEventMsg', function(data) {
    console.log('>>>>>>>>> locationEventMsg emit >>>>>>>>>');
    console.log(data);
    api.locationHandler(data);
    return '';
});