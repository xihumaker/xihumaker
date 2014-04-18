/**
 * 我的创客汇
 */
define(function(require, exports, module) {

    var common = require('./common');

    var _id = $('#currentUsername').attr('data-id');
    var username = $('#currentUsername').html();

    $('#username').html(username);

    var $myProjects = $('#myProjects');

    $.ajax({
        url: '/api/user/' + _id + '/projects',
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
                if (len === 0) {
                    $('.jumbotron').show();
                } else {
                    for (var i = 0; i < len; i++) {
                        project = projectList[i];
                        localProgress = common.convertProgress(project.progress);

                        if (project.coverUrl == '') {
                            project.coverUrl = '/img/default_project_cover.png';
                        }
                        temp = '<a class="col-sm-6 col-md-4 project" target="_blank" href="/project/' + project._id + '">' +
                            '<div class="thumbnail">' +
                            '<img class="img-rounded" src="' + project.coverUrl + '" data-pinit="registered">' +
                            '<div class="caption">' +
                            '<h3 class="title">' + project.title + '</h3>' +
                            '<p class="team">' +
                            '<span> ' + project.teamName + '</span>' +
                            '<span class="label label-success localProgress">' + localProgress + '</span>' +
                            '</p>' +
                            '<div class="progress active">' +
                            '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + project.progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + project.progress + '%"></div>' +
                            '</div>' +
                            '<p class="text-center misc">' +
                            '<button type="button" class="btn btn-link">' +
                            '<i class="glyphicon glyphicon-heart"></i> 赞' + project.likeNum + '' +
                            '</button>' +
                            '<button type="button" class="btn btn-link">' +
                            '<i class="glyphicon glyphicon-star"></i> 关注' + project.concernNum + '' +
                            '</button>' +
                            '<button type="button" class="btn btn-link">' +
                            '<i class="glyphicon glyphicon-usd"></i> 金币' + project.coinNum + '' +
                            '</button>' +
                            '</p>' +
                            '</div>' +
                            '</div>' +
                            '</a>';
                        $myProjects.append($(temp));
                    }
                }
            } else {

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });


    $('.dev').click(function() {
        alert('我们的开发人员正在加紧开发中，敬请期待！');
    });


});