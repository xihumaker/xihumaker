/**
 * 财富榜
 */
define(function(require, exports, module){
	
	var iAlert = require('../../angel/alert');
    var $richList = $('#richList');

    function getCoinRankByUserId(userId, succCall) {
        $.ajax({
            url: '/api/user/' + userId + '/coinRank',
            type: 'GET',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                succCall(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    }

    // 如果已登录，则需获取当前登录用户的金币排名
    if (hasLogin) {
        $.ajax({
            url: '/api/currentUserinfo',
            type: 'GET',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    var user = data.user;
                    var userId = user._id;
                    if (user.headimgurl === '') {
                        user.headimgurl = '/img/default_avatar.png';
                    }

                    getCoinRankByUserId(userId, function(data) {
                        if (data.r === 0) {
                            var temp = '<tr>' +
                            '<td><img class="rounded mini ui image" src="' + user.headimgurl + '"></td>' +
                                '<td>' + data.  + '</td>' +
                                '<td>我</td>' +
                                '<td>' + user.coin + '</td>' +
                                '</tr>';

                            $richList.prepend($(temp));
                        }
                    });
                }
            }
        });
    }

    // 获取前20用户金币排名
    $.ajax({
        url: '/api/richList/20',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var users = data.users;
                var len = users.length;
                var user;
                var temp;

                for (var i = 0; i < len; i++) {
                    user = users[i];
                    if (user.headimgurl === '') {
                        user.headimgurl = '/img/default_avatar.png';
                    }
                    temp = '<tr>' +
                        '<td><img class="rounded mini ui image" src="' + user.headimgurl + '"></td>' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td>' + user.username + '</td>' +
                        '<td>' + user.coin + '</td>' +
                        '</tr>';

                    $richList.append($(temp));
                }
            }
        }
    });

    $('.dev').click(function() {
        iAlert('开发中，敬请期待！')
    });

});