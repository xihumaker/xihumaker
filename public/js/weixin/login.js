/**
 * 微信客户端登录页面
 */
$(function() {

    var $email = $('#email'),
        $password = $('#password'),
        $message = $('.message'),
        $login = $('#login');

    $login.click(function() {
        var email = $email.val().trim();
        var password = $password.val().trim();

        if (!email) {
            $message.html('<i class="icon attention"></i>请输入邮箱').show();
            return;
        }
        if (!password) {
            $message.html('<i class="icon attention"></i>请输入密码').show();
            return;
        }

        $login.html('正在登录...');

        $.ajax({
            url: '/weixin/login',
            type: 'POST',
            data: {
                email: email,
                password: hex_md5(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    var href = window.location.href;
                    if (/returnUrl/.test(href)) { // 说明有指定返回Url
                        var returnUrl = href.split('?')[1].split('=')[1];
                        window.location.href = returnUrl;
                    } else if (/login/.test(window.location.href)) {
                        window.location.href = '/weixin/projectList';
                    } else {
                        window.location.reload();
                    }
                } else {
                    $login.html('登录');
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

});