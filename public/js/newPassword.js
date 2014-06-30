define(function(require, exports, module) {

    require('../lib/md5');

    var href = window.location.href,
        token = href.split('?')[1].split('=')[1];

    var $password = $('.password'),
        $rePassword = $('.rePassword'),
        $warning = $('.warning'),
        $save = $('.save');

    $save.click(function() {
        if ($(this).hasClass('disabled')) {
            return;
        }
        var password = $password.val().trim(),
            rePassword = $rePassword.val().trim();

        if (!password) {
            $warning.html('<i class="icon attention"></i>新密码不能为空').show();
            return;
        }
        if (!rePassword) {
            $warning.html('<i class="icon attention"></i>确认新密码不能为空').show();
            return;
        }
        if (password !== rePassword) {
            $warning.html('<i class="icon attention"></i>两次输入的密码不一致').show();
            return;
        }

        $save.html('正在保存...').addClass('disabled');

        $.ajax({
            url: '/api/password/new',
            type: 'POST',
            data: {
                password: hex_md5(password),
                token: token
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    $('.field1').show();
                    $('.field2').hide();
                } else {
                    $warning.html('<i class="icon attention"></i>' + data.msg).show();
                    $save.html('保存新密码').removeClass('disabled');
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    $('input').focus(function() {
        $warning.hide();
    });

});