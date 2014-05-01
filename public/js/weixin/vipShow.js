/**
 * 微信端 - 会员秀列表
 */
$(function() {

    var $msgTip = $('#msgTip');
    var $vipList = $('#vipList');

    $.ajax({
        url: '/api/vips',
        type: 'GET',
        dataType: 'json',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var vips = data.vips;
                var len = vips.length;
                var vip;
                var temp;
                if (len === 0) {
                    $msgTip.html('会员秀为空').show();
                    return;
                }
                for (var i = 0; i < len; i++) {
                    vip = vips[i];
                    temp = '<a class="item" href="/weixin/vip/' + vip._id + '">' +
                        '<img class="ui avatar huge image" src="' + vip.headimgurl + '">' +
                        '<div class="content">' +
                        '<div class="header">' + vip.name + '</div>' + vip.title +
                        '</div>' +
                        '</a>';

                    $vipList.append($(temp));
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });



});