/*global process,__dirname */

"use strict";
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    config = require('./config'),
    routes = require('./routes'),
    logger = require('./common/logger');

var auth = require('./policies/auth');

// 数据库连接
mongoose.connect('mongodb://' + config.MONGODB_IP + '/' + config.MONGODB_DATABASE_NAME, function(err) {
    if (!err) {
        logger.info('【日志】连接到数据库：' + config.MONGODB_DATABASE_NAME);
    } else {
        logger.error(err);
    }
});

var app = express();
// 修改文件后缀
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
// all environments
app.set('port', process.env.PORT || config.WEB_SERVER_PORT);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('xihumaker'));
app.use(express.session());

// 全局返回用户是否登录
app.use(function(req, res, next) {
    var xihumaker = auth.getSignedCookies(req, res, 'xihumaker');
    if (!!xihumaker) {
        res.locals.hasLogin = true;
        res.locals.userId = xihumaker.userId;
        res.locals.username = xihumaker.username;
    } else {
        res.locals.hasLogin = false;
    }
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// 路由
routes(app);

http.createServer(app).listen(app.get('port'), function() {
    logger.info('Express server listening on port ' + app.get('port'));
});
