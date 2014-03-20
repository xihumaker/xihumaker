/**
 * 微信客户端登录页面
 */
$(function() {

    $('.ui.selection.dropdown').dropdown();

    var $title = $('#title'),
        $description = $('#description'),
        $industry = $('#industry'),
        $group = $('#group'),
        $purpose = $('#purpose'),
        $solution = $('#solution'),
        $teamInfo = $('#teamInfo'),
        $newPro = $('#newPro');

    $newPro.click(function() {
        var title = $title.val().trim(),
            description = $description.val().trim(),
            industry = $industry.val().trim(),
            group = $group.val().trim(),
        purpose = $purpose.val().trim(),
            solution = $solution.val().trim(),
            teamInfo = $teamInfo.val().trim();

        if (!title) {
            alert('项目标题不能为空');
            return;
        }
        if (!description) {
            alert('项目简介不能为空');
            return;
        }

        $newPro.html('正在创建...');

        $.ajax({
            url: '/api/projects',
            type: 'POST',
            data: {
                title: title,
                description: description,
                industry: industry,
                group: group,
                purpose: purpose,
                solution: solution,
                teamInfo: teamInfo
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    $('#viewPro').attr('href', '/weixin/project/' + data.project._id);
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





});