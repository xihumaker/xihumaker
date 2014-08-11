"use strict";
var Member = require('../models/member');
var weixin = require('weixin-apis');
var config = require('../config');
var WEB_SERVER_IP = 'http://' + config.WEB_SERVER_IP;

module.exports = {

    // 用户关注公众号事件
    subscribeHandler: function(data) {
        var resMsg = {
            toUserName: data.fromUserName,
            fromUserName: data.toUserName,
            msgType: 'text',
            content: '谢谢你关注西湖创客汇，进步源于创造，欢迎参加创客活动，DIY美好生活。'
        };
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
    },

    // 朋友~ - 绑定帐号
    bindAccount: function(data) {
        var articles = [];
        articles[0] = {
            title: "绑定帐号",
            description: "点击卡片进行【西湖创客汇】帐号的绑定，绑定帐号后，可获得10金币的奖励哦~",
            picUrl: WEB_SERVER_IP + '/img/logo_360_200.jpg',
            url: WEB_SERVER_IP + '/weixin/bindWeixin?openId=' + data.fromUserName
        };
        var resMsg = {
            toUserName: data.fromUserName,
            fromUserName: data.toUserName,
            msgType: 'news',
            articles: articles
        };
        weixin.sendMsg(resMsg);
    },

    // 如果该用户在数据库中没有记录，则添加，否则更新记录
    locationHandler: function(data) {
        var fromUserName = data.fromUserName;
        var createTime = data.createTime;
        var latitude = data.latitude;
        var longitude = data.longitude;
        var precision = data.precision;

        Member.findOne({
            openid: fromUserName
        }, function(err, doc) {
            if (err) {
                console.log(err);
            }

            if (!doc) { // 数据库没有该记录，新增一条记录
                weixin.getUserInfo({
                    openid: fromUserName
                }, function(data) {
                    console.log(data);
                    var member = new Member({
                        openid: fromUserName,
                        createTime: createTime,
                        latitude: latitude,
                        longitude: longitude,
                        precision: precision,
                        nickname: data.nickname,
                        sex: data.sex,
                        city: data.city,
                        province: data.province,
                        country: data.country,
                        language: data.language,
                        headimgurl: data.headimgurl,
                        subscribeTime: data.subscribe_time
                    });

                    member.save(function(err, doc) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(doc);
                        console.log('新增一条记录成功');
                    });
                });
            } else {
                Member.findOneAndUpdate({
                    openid: fromUserName
                }, {
                    $set: {
                        createTime: createTime,
                        latitude: latitude,
                        longitude: longitude,
                        precision: precision
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('更新坐标成功');
                })
            }
        });
    },

    findAllMembers: function(req, res) {
        Member.find({}, function(err, docs) {
            if (err) {
                res.json({
                    r: 1,
                    msg: "服务器错误，查找失败"
                })
                return;
            }

            res.json({
                r: 0,
                msg: "查找成功",
                members: docs
            });
        })
    }




};