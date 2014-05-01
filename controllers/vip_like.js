var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var logger = require('../common/logger');
var VipLike = require('../models/vip_like');
var Vip = require('../models/vip');


var VipLikeModule = {

    // 会员秀 - 对某个会员秀发起赞
    create: function(req, res) {
        var vipId = req.params._id;
        var userId = req.body.userId;

        VipLike.findOne({
            belongToVipId: vipId,
            belongToUserId: userId
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
                Vip.findByIdAndUpdate(vipId, {
                    $inc: {
                        likeNum: 1
                    }
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

                    var vipLike = new VipLike({
                        belongToVipId: vipId,
                        belongToUserId: userId,
                        createTime: Date.now()
                    });

                    vipLike.save(function(err, doc) {
                        if (err) {
                            logger.error(err);
                            res.json({
                                "r": 1,
                                "errcode": 10065,
                                "msg": "服务器错误，会员秀赞失败"
                            });
                            return;
                        } else {
                            res.json({
                                "r": 0,
                                "msg": "会员秀赞成功"
                            });
                            return;
                        }
                    });
                });
            }
        });

    }



};

module.exports = VipLikeModule;