$(function() {

    "use strict";
    var $email = $('#email');
    var $password = $('#password');
    var $message = $('#message');
    var $loginBtn = $('#loginBtn');

    function showMessage(msg) {
        $message.html('<i class="icon attention"></i>' + msg).show();
    }

    $loginBtn.on('click', function() {
        var email = $email.val().trim();
        var password = $password.val().trim();

        if (!email) {
            showMessage('用户名不能为空');
            return;
        }
        if (!password) {
            showMessage('密码不能为空');
            return;
        }

        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: {
                email: email,
                password: hex_md5(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                console.log(data);
                if (data.r === 0) {

                } else {
                    showMessage(data.msg);
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