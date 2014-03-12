$(function() {

    var $username = $('#username'),
        $password = $('#password'),
        $warning = $('.warning'),
        $login = $('#login');

    $login.click(function() {

        var username = $username.val().trim();
        var password = $password.val().trim();

        if (!username) {
            $warning.html('<i class="icon attention"></i>请输入用户名').show();
            return;
        }
        if (!password) {
            $warning.html('<i class="icon attention"></i>请输入密码').show();
            return;
        }

        $login.html('正在登录...');

        $.ajax({
            url: '',
            type: 'POST',
            data: {
                username: username,
                password: hex_md5(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {

            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });

    });

    $('input').focus(function() {
        $warning.hide();
    });




});