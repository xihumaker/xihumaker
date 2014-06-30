define(function(require, exports, module) {
    var Util = require('../angel/util');

    var $warning = $('.warning');
    var $captchaImg = $('#captchaImg');
    $captchaImg.attr('src', '/api/captcha');

    // 点击“重设密码”
    $('.resetPassword.button').click(function() {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        var email = $('input.email').val().trim(),
            captcha = $('#captcha').val().trim();

        if (!email) {
            $warning.html('<i class="icon attention"></i>请输入邮箱').show();
            return;
        }
        if (!Util.isEmail(email)) {
            $warning.html('<i class="icon attention"></i>请输入正确的邮箱地址').show();
            return;
        }
        if (!captcha) {
            $warning.html('<i class="icon attention"></i>请输入验证码').show();
            return;
        }
        $('.resetPassword.button').html('正在发送...').addClass('disabled');

        $.ajax({
            url: '/api/password/reset',
            type: 'POST',
            data: {
                email: email,
                captcha: captcha
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    $('.field1').show();
                    $('.field1 span').html(email);
                    $('.field2').hide();
                } else {
                    $warning.html('<i class="icon attention"></i>' + data.msg).show();
                    $('.resetPassword.button').html('重新发送').removeClass('disabled');
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

    $('#changeCaptcha').click(function() {
        $('#captchaImg').attr('src', '/api/captcha');
    });

    $('#captchaImg').click(function() {
        $(this).attr('src', '/api/captcha');
    })

});