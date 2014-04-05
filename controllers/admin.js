var config = require('../config');
var ADMIN_ACCOUNT = config.ADMIN_ACCOUNT;
var Util = require('../common/util');
var logger = require('../common/logger');

module.exports = {

    /**
     * @method auth
     * 验证管理员是否已经登录
     */
    auth: function(req, res, next) {
        if (req.session.adminId) {
            logger.info("管理员已经登录");
            next();
        } else {
            logger.info("管理员未登录");
            res.render('admin/login');
        }
    },

    /**
     * @method login
     * 管理员登录操作
     */
    login: function(req, res) {
        var username = req.param('username');
        var password = req.param('password');

        if (username === ADMIN_ACCOUNT.username && password === Util.md5(ADMIN_ACCOUNT.password)) {
            logger.info("登录成功");
            req.session.adminId = username;
            res.json({
                "r": 0,
                "msg": "登录成功",
            });
        } else {
            logger.info("管理员账号或密码错误");
            res.json({
                "r": 1,
                "errcode": 20000,
                "msg": "管理员账号或密码错误"
            });
        }
    },

    /**
     * @method logout
     * 管理员退出操作
     */
    logout: function(req, res) {
        delete req.session.adminId;
        res.redirect('/admin/login');
    }


}