define(function(require, exports, module) {

    require('jquery');
    require('./common');

    $('.devitem').click(function() {
        alert('开发中，敬请期待');
    });

    $('#logout').click(function() {
        var ret = confirm('你确定要退出登录吗？');
        if (ret) {
            $.ajax({
                url: '/api/logout',
                type: 'POST',
                timeout: 15000,
                success: function(data, textStatus, jqXHR) {
                    if (data.r === 0) {
                        window.location.href = '/weixin/login';
                    } else {
                        $login.html('退出登录');
                        alert(data.msg);
                        return;
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });
        } else {
            return;
        }
    });

});