/**
 * 后台管理登录页
 */
define(function(require, exports, module) {

    require('/lib/md5');

    var $username = $('#username');
    var $password = $('#password');
    var $login = $('#login');
    var $message = $('.message');

    $login.click(function() {

        var username = $username.val().trim();
        var password = $password.val().trim();

        if (!username) {
            $message.html('<i class="icon attention"></i>用户名不能为空').show();
            return;
        }
        if (!password) {
            $message.html('<i class="icon attention"></i>密码不能为空').show();
            return;
        }

        $login.html('正在登录...');

        $.ajax({
            url: '/admin/login',
            type: 'POST',
            data: {
                username: username,
                password: hex_md5(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                $login.html('登录');
                if (data.r === 0) {
                    if (/admin\/login/.test(window.location.href)) {
                        window.location.href = '/admin/index';
                    } else {
                        window.location.reload();
                    }
                } else {
                    $message.html('<i class="icon attention"></i>' + data.msg).show();
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });




    });

    $('input').focus(function() {
        $message.hide();
    });

    $(window).keypress(function(e) {
        if (e.keyCode === 13) {
            $login.click();
        }
    });

});