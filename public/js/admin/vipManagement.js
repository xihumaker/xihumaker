/**
 * 会员秀管理
 */
define(function(require, exports, module) {

    var iAlert = require('../../angel/alert');

    var $vipList = $('#vipList');

    // 加载会员秀列表
    $.ajax({
        url: '/api/vips/all',
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
                    $vipList.append($('<tr><td colspan="9"><div class="ui center aligned teal header" style="padding: 100px 0;">列表为空</div></td></tr>'));
                }
                for (var i = 0; i < len; i++) {
                    vip = vips[i];
                    temp = '<tr>' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td>' + vip.name + '</td>' +
                        '<td><img class="rounded ui small image" src="' + vip.headimgurl + '" width="50" height="75" alt=""></td>' +
                        '<td>' + vip.title + '</td>' +
                        '<td>' + vip.likeNum + '</td>' +
                        '<td>' + new Date(vip.createTime).toLocaleString() + '</td>' +
                        '<td>' +
                        '<div class="ui small red button delete" title="删除" data-id="' + vip._id + '"><i class="trash icon"></i>删除</div>' +
                        '<a class="ui small blue button" title="编辑" href="/admin/vip/' + vip._id + '/edit" target="_blank"><i class="edit icon"></i>编辑</a>' +
                        '<a class="ui small default button" title="查看" href="/weixin/vip/' + vip._id + '" target="_blank"><i class="camera icon"></i>查看</a>' +
                        '</td>' +
                        '</tr>';

                    $vipList.append($(temp));
                }
            }
        }
    });

    // 删除
    $('body').on('click', '.delete', function(e) {
        var self = this;
        var _id = this.getAttribute('data-id');

        if (confirm('你确定要删除这个会员秀吗？')) {
            $.ajax({
                url: '/api/vip/' + _id,
                type: 'DELETE',
                timeout: 15000,
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.r === 0) {
                        $(self).parents('tr').remove();
                        iAlert('删除成功');
                    } else {
                        iAlert(data.msg);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });
        }
    });


});