$(function() {

    "use strict";
    var $email = $('#email');
    var $password = $('#password');
    var $message = $('.message');
    var $bindBtn = $('#bindBtn');

    $bindBtn.click(function() {
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

        $bindBtn.html('绑定中...');

        $.ajax({
            url: '/api/user/bind',
            type: 'POST',
            data: {
                email: email,
                password: hex_md5(password),
                openId: openId
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                if (data.r === 0) {
                    window.location.href = "/weixin/bindWeixinSucc";
                } else {
                    $bindBtn.html('立即绑定');
                    $message.html('<i class="icon attention"></i>' + data.msg).show();
                    return;
                }
            }
        });


    });


    $('input').focus(function() {
        $message.hide();
    });

});