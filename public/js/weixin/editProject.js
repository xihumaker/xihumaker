$(function() {

    $('.ui.selection.dropdown').dropdown();

    var $title = $('#title'),
        $description = $('#description'),
        $industry = $('#industry'),
        $group = $('#group'),
        $purpose = $('#purpose'),
        $solution = $('#solution'),
        $teamInfo = $('#teamInfo'),
        $save = $('#save');

    var _id = project._id;

    $purpose.val(project.purpose);
    $solution.val(project.solution);
    $teamInfo.val(project.teamInfo);

    // 保存修改
    $save.click(function() {
        var title = $title.val().trim();
        var description = $description.val().trim();
        var industry = $industry.val().trim();
        var group = $group.val().trim();
        var purpose = $purpose.val().trim();
        var solution = $solution.val().trim();
        var teamInfo = $teamInfo.val().trim();


        $.ajax({
            url: '/api/project/' + _id,
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
                    alert(data.msg);
                } else {
                    alert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });


});