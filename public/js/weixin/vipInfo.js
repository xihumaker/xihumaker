define(function(require, exports, module) {

    // 加载HTML decode库
    require('../../lib/he');
    require('../../lib/md5');

    var Util = window.Util = require('../../angel/util');

    var iAlert = require('../../angel/alert');

    // 将项目详细描述添加进DOM树中
    $('#content').append(he.decode(vip.content));
    $('#createTime').html(Util.convertDate(vip.updateTime));

    // 用户未登录
    $('#notLogin').click(function() {
        $('#loginModal').modal('show');
    });

    var $alertWarning = $('#alertWarning');

    // 用户点击登录Modal中的登录按钮
    $('#login').click(function() {

        var username = $('#username').val().trim();
        var password = $('#password').val().trim();

        if (!username) {
            $alertWarning.html('用户名不能为空').removeClass('hide');
            return;
        }
        if (!password) {
            $alertWarning.html('密码不能为空').removeClass('hide');
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
                    $alertWarning.html(data.msg).removeClass('hide');
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });
    $('#loginModal input').focus(function() {
        $alertWarning.addClass('hide');
    });

    // 赞
    $('#likeBtn').click(function() {
        $.ajax({
            url: '/api/vip/' + vip._id + '/like',
            type: 'POST',
            data: {
                userId: userId
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('赞成功');
                    $('#likeNum').html(++vip.likeNum);
                } else {
                    iAlert('不能重复赞');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });









});