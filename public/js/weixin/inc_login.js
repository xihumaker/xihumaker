define(function(require) {

    "use strict";
    require('../../lib/md5');
    var iAlert = require('../../angel/alert');

    // 用户未登录
    $('.notLogin').click(function() {
        $('#loginModal').modal('show');
    });

    // 用户点击登录Modal中的登录按钮
    $('#loginModal #loginBtn').click(function() {
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
            success: function(data) {
                if (data.r === 0) {
                    iAlert('登录成功');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                } else {
                    iAlert(data.msg);
                    return;
                }
            }
        });
    });

});