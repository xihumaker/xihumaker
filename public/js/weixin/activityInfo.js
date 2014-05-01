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

    // 报名
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



    $likeBtn.click(function(e) {
        iAlert('赞');
    });


});