$(function() {

    var $username = $('#username'),
        $password = $('#password'),
        $rePassword = $('#rePassword'),
        $email = $('#email'),
        $phone = $('#phone'),
        $warning = $('.warning'),
        $register = $('#register');

    $register.click(function() {

        var username = $username.val().trim();
        var password = $password.val().trim();
        var rePassword = $rePassword.val().trim();
        var email = $email.val().trim();
        var phone = $phone.val().trim();

        if (!username) {
            $warning.html('<i class="icon attention"></i>请输入用户名').show();
            return;
        }
        if (!validator.isLength(username, 6, 16)) {
            $warning.html('<i class="icon attention"></i>用户名由6到16位').show();
            return;
        }
        if (!password) {
            $warning.html('<i class="icon attention"></i>请输入密码').show();
            return;
        }
        if (!rePassword) {
            $warning.html('<i class="icon attention"></i>请输入确认密码').show();
            return;
        }



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