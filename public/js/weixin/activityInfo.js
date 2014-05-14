/**
 * 微信端 - 活动详情页
 */
define(function(require, exports, module) {

    // 加载HTML decode库
    require('../../lib/he');

    var Util = require('../../angel/util');
    var iAlert = require('../../angel/alert');
    var CITY_LIST = require('../const').CITY_LIST;

    var $createTime = $('#createTime');
    var $city = $('#city');
    var $description = $('#description');
    var $likeBtn = $('#likeBtn'); // 赞按钮
    var $signupBtn = $('#signupBtn'); // 报名按钮

    $createTime.html(Util.convertDate(activity.createTime));
    $city.html(CITY_LIST[activity.city]);
    $description.append(he.decode(activity.description));

    // 用户未登录
    $('.notLogin').click(function() {
        $('#loginModal').modal('show');
    });
    // 用户点击登录Modal中的登录按钮
    $('#login').click(function() {
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();

        if (!username) {
            iAlert('用户名不能为空');
            return;
        }
        if (!password) {
            iAlert('密码不能为空');
            return;
        }
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: {
                email: username,
                password: hex_md5(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    window.location.reload();
                } else {
                    iAlert(data.msg);
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // 查找该活动报名用户列表
    $.ajax({
        url: '/api/activity/' + activity._id + '/people',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var activityPeoples = data.activityPeoples,
                    len = activityPeoples.length,
                    temp;

                for (var i = 0; i < len; i++) {
                    temp = '<span>' + activityPeoples[i].belongToUsername + '</span>';
                    $('#activityPeoples').append($(temp));
                }
            } else {

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

    // 活动 - 报名
    $signupBtn.click(function(e) {
        $.ajax({
            url: '/api/activity/' + activity._id + '/join',
            type: 'POST',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('报名成功');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                } else {
                    if (data.errcode === 10085) {
                        iAlert('已报名');
                    } else {
                        iAlert(data.msg);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // 活动 - 赞
    $likeBtn.click(function(e) {
        $.ajax({
            url: '/api/activity/' + activity._id + '/like',
            type: 'POST',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('赞成功');
                    $('#likeNum').html(++activity.likeNum);
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // 评论 - 查找该活动所有的评论
    $.ajax({
        url: '/api/activity/' + activity._id + '/comments',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var comments = data.comments,
                    len = comments.length,
                    temp,
                    comment;

                for (var i = 0; i < len; i++) {
                    comment = comments[i];

                    temp = '<p>' +
                        '<img class="media-object img-rounded" width="20" style="float:left;margin-right:5px;" src="/img/default_avatar.png">' +
                        '<span style="float: left;">' + comment.belongToUsername + '</span>：' +
                        '<span>' + comment.content + '</span>' +
                        '</p>';
                    $('#commentList').append($(temp));
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

    // 活动 - 发言
    var $content = $('#content');
    $('body').on('click', '#addComment', function() {
        var content = $content.val().trim();
        if (!content) {
            iAlert('评论不能为空');
            return;
        }

        $.ajax({
            url: '/api/activity/' + activity._id + '/comment',
            type: 'POST',
            timeout: 15000,
            data: {
                content: content
            },
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    var comment = data.comment;

                    if (comment.headimgurl === '') {
                        comment.headimgurl = '/img/default_avatar.png';
                    }

                    var temp = '<p>' +
                        '<img class="media-object img-rounded" width="20" style="float:left;margin-right:5px;" src="' + comment.headimgurl + '">' +
                        '<span style="float: left;">' + comment.belongToUsername + '</span>：' +
                        '<span>' + comment.content + '</span>' +
                        '</p>';
                    $('#commentList').append($(temp));
                    $content.val('');
                    iAlert('发言成功');
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });


    // 五星评分
    function Score(options) {
        this.config = {
            selector: '.star', // 评分容器
            renderCallback: null, // 渲染页面后回调
            callback: null // 点击评分回调                         
        };

        this.cache = {
            iStar: 0,
            iScore: 0
        };

        this.init(options);
    }

    Score.prototype = {
        constructor: Score,

        init: function(options) {
            this.config = $.extend(this.config, options || {});
            var self = this,
                _config = self.config,
                _cache = self.cache;

            self._renderHTML();
        },
        _renderHTML: function() {
            var self = this,
                _config = self.config;

            $(_config.selector).each(function(index, item) {
                $(item).wrap($('<div class="parentCls" style="position:relative"></div>'));
                var parentCls = $(item).closest('.parentCls');
                self._bindEnv(parentCls);
                _config.renderCallback && $.isFunction(_config.renderCallback) && _config.renderCallback();
            });

        },
        _bindEnv: function(parentCls) {
            var self = this,
                _config = self.config,
                _cache = self.cache;

            $(_config.selector + ' li', parentCls).each(function(index, item) {
                // 鼠标点击
                $(item).click(function(e) {
                    ismax(index + 1);
                    _config.callback && $.isFunction(_config.callback) && _config.callback({
                        starAmount: index + 1
                    });
                });
            });

            function ismax(iArg) {
                _cache.iScore = iArg || _cache.iStar;
                var lis = $(_config.selector + ' li', parentCls);

                for (var i = 0; i < lis.length; i++) {
                    lis[i].className = i < _cache.iScore ? "on" : "";
                }
            }
        }
    };

    var score = new Score({
        callback: function(cfg) {
            console.log(cfg);
            starNum = cfg.starAmount;
        }
    });

    // end 五星评分

    var starNum = 0;

    // 活动 - 评分并签到
    $('#commentAndCheckIn').click(function(e) {
        if (starNum === 0) {
            iAlert('签到前请先评分');
            return;
        } else {
            $.ajax({
                url: '/api/activity/' + activity._id + '/score',
                type: 'POST',
                data: {
                    starNum: starNum
                },
                timeout: 15000,
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.r === 0) {
                        iAlert('签到成功');
                        $('#commentAndCheckIn').html('已签到').removeAttr('id');
                    } else {
                        iAlert(data.msg);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });
        }
    });

    // 活动结束时 - 点击“评价并签到”按钮
    $('.hasEnd').click(function(e) {
        iAlert('活动已结束，不能评分并签到');
        return;
    });

    // 活动未开始时 - 点击“评价并签到”按钮
    $('.notStart').click(function(e) {
        iAlert('活动未开始，不能评分并签到');
        return;
    });

});