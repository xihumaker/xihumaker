/**
 * 我发起的项目
 */
define(function(require, exports, module) {

    var common = require('../common');

    var $loading = $('#loading').hide();
    var $projectList = $('#projectList');
    var $msgTip = $('#msgTip');

    $.ajax({
        url: '/api/user/' + userId + '/projects',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var projectList = data.projectList;
                var len = projectList.length;
                var project;
                var temp;
                var localProgress;
                // 用户还未创建任何项目
                $loading.hide();
                if (len === 0) {
                    $msgTip.show();
                } else {
                    for (var i = 0; i < len; i++) {
                        project = projectList[i];
                        localProgress = common.convertProgress(project.progress);

                        if (project.coverUrl == '') {
                            project.coverUrl = '/img/default_project_cover.png';
                        }

                        temp = '<a class="item project" href="/weixin/project/' + project._id + '">' +
                            '<div class="image">' +
                            '<img src="' + project.coverUrl + '">' +
                            '</div>' +
                            '<h4 class="ui black header title">' + project.title + '</h4>' +
                            '<div>' +
                            '<div class="team">' +
                            '<span class="teamName">' + project.teamName + '</span>' +
                            '<span class="ui green small label localProgress" style="">' + localProgress + '</span>' +
                            '</div>' +
                            '<div class="progress">' +
                            '<div class="progress-bar progress-bar-success" style="width: ' + project.progress + '%"></div>' +
                            '</div>' +
                            '<div style="text-align: center;">' +
                            '<button type="button" class="btn btn-link"><i class="heart icon"></i> 赞' + project.likeNum + '</button>' +
                            '<button type="button" class="btn btn-link"><i class="star icon"></i> 关注' + project.concernNum + '</button>' +
                            '<button type="button" class="btn btn-link"><i class="dollar icon"></i> 金币' + project.coinNum + '</button>' +
                            '</div>' +
                            '</div>' +
                            '</a>';

                        $projectList.append($(temp));
                    }
                }
            } else {

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

});