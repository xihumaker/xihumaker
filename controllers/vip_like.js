"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var EventProxy = require('eventproxy');
var logger = require('../common/logger');
var VipLike = require('../models/vip_like');
var Vip = require('../models/vip');
var auth = require('../policies/auth');

module.exports = {

    /**
     * @method createVipLike
     * 会员秀 - 赞
     */
    createVipLike: function(req, res) {
        var vipId = req.params._id;
        var userId = auth.getUserId(req, res);

        VipLike.findOne({
            belongToVipId: new ObjectId(vipId),
            belongToUserId: new ObjectId(userId)
        }, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json({
                    "r": 1,
                    "errcode": 10065,
                    "msg": "服务器错误，会员秀赞失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 1,
                    "errcode": 10066,
                    "msg": "你已经赞过该会员秀，不能重复赞"
                });
                return;
            } else {

                var ep = EventProxy.create("update", "new", function(updateVip, newVipLike) {
                    if (updateVip && newVipLike) {
                        res.json({
                            "r": 0,
                            "msg": "会员秀赞成功"
                        });
                    } else {
                        res.json({
                            "r": 1,
                            "errcode": 10065,
                            "msg": "服务器错误，会员秀赞失败"
                        });
                    }
                });

                Vip.findByIdAndUpdate(vipId, {
                    $inc: {
                        likeNum: 1
                    }
                }, function(err, doc) {
                    if (err) {
                        ep.emit('update', false);
                    }
                    ep.emit('update', true);
                });

                var vipLike = new VipLike({
                    belongToVipId: vipId,
                    belongToUserId: userId,
                    createTime: Date.now()
                });

                vipLike.save(function(err, doc) {
                    if (err) {
                        ep.emit('new', false);
                    }
                    ep.emit('new', true);
                });

            }
        });
    }

};