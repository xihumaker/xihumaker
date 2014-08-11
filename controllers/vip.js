"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var Vip = require('../models/vip');
var VipLike = require('../models/vip_like');
var auth = require('../policies/auth');

function checkVip(req, res, vip) {
    if (!vip.name) {
        res.json({
            "r": 1,
            "errcode": 10060,
            "msg": "会员姓名不能为空"
        });
        return false;
    }
    if (!vip.title) {
        res.json({
            "r": 1,
            "errcode": 10061,
            "msg": "会员秀标题不能为空"
        });
        return false;
    }
    if (!vip.headimgurl) {
        res.json({
            "r": 1,
            "errcode": 10062,
            "msg": "会员秀头像不能为空"
        });
        return false;
    }
    return true;
}

module.exports = {

    // 页面请求
    // ============================================

    showVipShow: function(req, res) {
        res.render('weixin/vipShow');
    },

    /**
     * @method showVipInfo
     * 微信端 - 朋友 - 会员秀 - 会员秀详情页
     */
    showVipInfo: function(req, res) {
        var vipId = req.params._id;

        Vip.findOne({
            _id: new ObjectId(vipId)
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.render('weixin/vipInfo', {
                    "r": 1,
                    "errcode": 10064,
                    "msg": "服务器错误，查找会员秀详情失败"
                });
                return;
            }

            res.render('weixin/vipInfo', {
                "r": 0,
                "msg": "查找会员秀成功",
                "vip": doc
            });
            return;
        });
    },

    // 显示编辑会员秀页面
    showEditVip: function(req, res) {
        var vipId = req.params._id;

        Vip.findOne({
            _id: new ObjectId(vipId)
        }, function(err, doc) {
            if (err) {
                res.render('admin/editVip', {
                    "r": 1,
                    "errcode": 10069,
                    "msg": "服务器错误，显示会员秀编辑页失败"
                });
                return;
            }

            if (!!doc) {
                res.render('admin/editVip', {
                    "r": 0,
                    "msg": "请求成功",
                    "vip": doc
                });
                return;
            } else {
                res.render('admin/editVip', {
                    "r": 1,
                    "errcode": 10070,
                    "msg": "会员秀不存在"
                });
                return;
            }
        });
    },

    // Ajax 请求
    // ============================================

    /**
     * @method createVip
     * 新建会员秀
     */
    createVip: function(req, res) {
        var body = req.body;
        if (!checkVip(req, res, body)) {
            return;
        }

        var vip = new Vip({
            name: body.name,
            headimgurl: body.headimgurl,
            title: body.title,
            content: body.content
        });

        vip.save(function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10059,
                    "msg": "服务器错误，新建会员秀失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "新建会员秀成功"
            });
            return;
        });
    },

    // 分页查询会员秀列表
    findVipsByPage: function(req, res) {
        var query = req.query;
        var pageSize = query.pageSize;
        var pageStart = query.pageStart;
        var q = Vip.find({}).limit(pageSize).skip(pageStart).sort('-likeNum');

        q.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10063,
                    "msg": "服务器错误，查找会员秀列表失败"
                });
                return;
            }

            res.json({
                r: 0,
                msg: "查找会员秀列表成功",
                vips: docs
            });
        });
    },

    /**
     * @method findAllVips
     * 查找所有会员秀列表，按赞数量倒序排序
     */
    findAllVips: function(req, res) {
        var query = Vip.find({}).sort('-likeNum'); // 按会员秀赞数量倒序排序

        query.exec(function(err, docs) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10063,
                    "msg": "服务器错误，查找会员秀列表失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找会员秀列表成功",
                "vips": docs
            });
            return;
        });
    },

    /**
     * @method deleteVipById
     * 根据会员秀ID删除某个会员秀
     */
    deleteVipById: function(req, res) {
        var vipId = req.params._id;

        if (vipId.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Vip.findOneAndRemove({
            _id: new ObjectId(vipId)
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10067,
                    "msg": "服务器错误，删除会员秀失败"
                });
                return;
            }

            if (!!doc) {
                // 删除会员秀时也要删除相应的赞记录
                VipLike.remove({
                    belongToVipId: new ObjectId(vipId)
                }, function(err, docs) {
                    if (err) {
                        logger.error(err);
                        res.json({
                            "r": 1,
                            "errcode": 10067,
                            "msg": "服务器错误，删除会员秀失败"
                        });
                        return;
                    }

                    res.json({
                        "r": 0,
                        "msg": "删除成功"
                    });
                    return;
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10068,
                    "msg": "要删除的会员秀记录未找到"
                });
                return;
            }
        });
    },

    // 更新会员秀
    updateVipById: function(req, res) {
        var _id = req.params._id;
        var vip = req.body;

        if (!checkVip(req, res, vip)) {
            return;
        }

        Vip.findByIdAndUpdate(_id, {
            $set: {
                name: vip.name,
                content: vip.content,
                headimgurl: vip.headimgurl,
                title: vip.title,
                updateTime: Date.now()
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10071,
                    "msg": "服务器错误，编辑会员秀失败"
                });
                return;
            }

            if (!!doc) {
                res.json({
                    "r": 0,
                    "msg": "修改成功",
                    "vip": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10070,
                    "msg": "会员秀不存在"
                });
                return;
            }
        });
    }



};