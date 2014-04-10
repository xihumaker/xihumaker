define(function(require, exports, module) {

    require('../lib/md5');

    var $alert = $('.alert');
    var $email = $('#email');
    var $password = $('#password');
    var $loginBtn = $('#loginBtn');

    $loginBtn.click(function() {

        var email = $email.val().trim();
        var password = $password.val().trim();

        if (!email) {
            $alert.html('用户名不能为空').show();
            return;
        }
        if (!password) {
            $alert.html('密码不能为空').show();
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
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    window.location.href = '/';
                } else {
                    $alert.html(data.msg).show();
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });


    });

    $('input').focus(function() {
        $alert.hide();
    });


});