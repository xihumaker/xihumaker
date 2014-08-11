define(function(require) {

    "use strict";

    require('./inc_login');
    var Util = window.Util = require('../../angel/util');
    var iAlert = require('../../angel/alert');

    var vipInfo = vip;

    $('#createTime').html(Util.convertDate(vipInfo.updateTime));

    // 赞
    $('#likeBtn').click(function() {
        $.ajax({
            url: '/api/vip/' + vipInfo._id + '/like',
            type: 'POST',
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('赞 +1');
                    $('#likeNum').html(++vipInfo.likeNum);
                } else {
                    iAlert('已赞');
                }
            }
        });
    });


});