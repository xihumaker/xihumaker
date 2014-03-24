/**
 * 微信客户端登录页面
 */
$(function() {

    $('.ui.selection.dropdown').dropdown();

    var $title = $('#title'),
        $description = $('#description'),
        $industry = $('#industry'),
        $group = $('#group'),
        $create = $('#create');

    $create.click(function() {
        var title = $title.val().trim(),
            description = $description.val().trim(),
            industry = $industry.val().trim(),
            group = $group.val().trim();

        if (!title) {
            alert('项目标题不能为空');
            return;
        }
        if (title.length > 25) {
            alert('项目标题不能超过25个字');
            return;
        }

        $create.html('正在创建...');

        $.ajax({
            url: '/api/projects',
            type: 'POST',
            data: {
                title: title,
                description: description,
                industry: industry,
                group: group
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    $('#viewPro').attr('href', '/weixin/project/' + data.project._id);
                    $('.field1').show();
                    $('.field2').hide();
                    setTimeout(function() {
                        window.location.href = '/weixin/project/' + data.project._id;
                    }, 3000);
                } else {
                    alert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });


});