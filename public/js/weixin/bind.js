/**
 * 微信客户端登录页面
 * @author wanggan
 */
$(function() {

    var $username = $('#username'),
        $password = $('#password'),
        $message = $('.message'),
        $bind = $('#bind');

    $bind.click(function() {

        var username = $username.val().trim();
        var password = $password.val().trim();

        if (!username) {
            $message.html('<i class="icon attention"></i>请输入用户名').show();
            return;
        }
        if (!password) {
            $message.html('<i class="icon attention"></i>请输入密码').show();
            return;
        }

        $bind.html('正在绑定...');

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
                if (data.r === 0) {
                    $('.field1').show();
                    $('.field2').hide();
                } else {
                    alert(data.msg);
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