define(function(require) {

    "use strict";

    var iAlert = require('../../angel/alert');

    // 搜索条件改变时
    $('.ui.dropdown').dropdown({
        on: 'hover'
    });

    $('#updateBtn').click(function() {
        var name = $('#name').val().trim();
        var industry = Number($('#industry').val());

        if (!name) {
            iAlert('请输入产品名字');
            return;
        }
        if (!industry || industry === -1) {
            iAlert('请选择产品所属行业');
            return;
        }

        $.ajax({
            url: '/api/product/' + product._id,
            type: 'PUT',
            data: {
                name: name,
                industry: industry
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('修改成功');
                } else {
                    iAlert(data.msg);
                }
            }
        });

    });

});