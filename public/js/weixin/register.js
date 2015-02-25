/* globals hex_md5,validator */
"use strict";

/**
 * 微信客户端注册页面
 */
$(function() {

    var $email = $('#email'),
        $password = $('#password'),
        $rePassword = $('#rePassword'),
        $phone = $('#phone'),
        $username = $('#username'),
        $message = $('.message'),
        $register = $('#register');

    $register.click(function() {
        var email = $email.val().trim();
        var phone = $phone.val().trim();
        var username = $username.val().trim();
        var password = $password.val().trim();
        var rePassword = $rePassword.val().trim();

        if (!email) {
            $message.html('<i class="icon attention"></i>邮箱不能为空').show();
            return;
        }
        if (!validator.isEmail(email)) {
            $message.html('<i class="icon attention"></i>请输入合法的邮箱地址').show();
            return;
        }
        if (!phone) {
            $message.html('<i class="icon attention"></i>手机号不能为空').show();
            return;
        }
        if (!/^(1+\d{10})$/.test(phone)) {
            $message.html('<i class="icon attention"></i>请输入有效的手机号').show();
            return;
        }
        if (!username) {
            $message.html('<i class="icon attention"></i>请输入真实姓名').show();
            return;
        }
        if (!password) {
            $message.html('<i class="icon attention"></i>请输入密码').show();
            return;
        }
        if (!validator.isLength(password, 6, 16)) {
            $message.html('<i class="icon attention"></i>密码长度为6到16位').show();
            return;
        }
        if (!rePassword) {
            $message.html('<i class="icon attention"></i>请输入确认密码').show();
            return;
        }
        if (password !== rePassword) {
            $message.html('<i class="icon attention"></i>两次输入的密码不一致').show();
            return;
        }

        $register.html('正在注册...');

        $.ajax({
            url: '/api/register',
            type: 'POST',
            data: {
                email: email,
                phone: phone,
                username: username,
                password: hex_md5(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                console.log(data);
                if (data.r === 0) {
                    window.location.href = '/weixin/registerSucc?userId=' + data.user._id;
                } else {
                    $register.html('注册');
                    $message.html('<i class="icon attention"></i>' + data.msg).show();
                    return;
                }
            },
            error: function() {

            }
        });

    });

    $('input').focus(function() {
        $message.hide();
    });

});
