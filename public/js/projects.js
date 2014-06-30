define(function(require) {
    "use strict";
    var iAlert = require('../angel/alert');
    var common = require('./common');

    var $projectList = $('#projectList');
    var $loadMore = $('#loadMore');

    // 项目查找配置参数
    var searchConfig = {
        pageSize: 12,
        industry: -1,
        group: -1
    };

    function searchProjects(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> searchProjects: Default failCall callback invoked.');
        };
        $.ajax({
            url: '/api/projects/search',
            type: 'GET',
            data: config,
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                succCall(data);
            },
            error: function() {
                failCall();
            }
        });
    }

    function renderOne(project) {
        var localProgress = common.convertProgress(project.progress);
        if (project.coverUrl === '') {
            project.coverUrl = '/img/default_project_cover.png';
        }
        var temp = '<a class="col-sm-6 col-md-3 project" target="_blank" href="/project/' + project._id + '">' +
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

        $projectList.append($(temp));
    }

    function render(projectList) {
        for (var i = 0; i < projectList.length; i++) {
            renderOne(projectList[i]);
        }
    }

    // 页面加载完成后，默认去查找一次
    searchProjects(searchConfig, function(data) {
        if (data.r === 0) {
            var projectList = data.projectList;
            var len = projectList.length;

            if (data.projectList.length === searchConfig.pageSize) {
                $loadMore.show();
            }
            render(projectList);
            searchConfig.createTime = projectList[len - 1].createTime;
        }
    });

    // 点击“加载更多”
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        searchProjects(searchConfig, function(data) {
            if (data.r === 0) {
                var projectList = data.projectList;
                var len = projectList.length;

                if (len === 0) {
                    $loadMore.html('无更多项目');
                } else if (len < searchConfig.pageSize) {
                    render(projectList);
                    $loadMore.html('无更多项目');
                    searchConfig.createTime = projectList[len - 1].createTime;
                } else if (len === searchConfig.pageSize) {
                    render(projectList);
                    $loadMore.html('加载更多');
                    searchConfig.createTime = projectList[len - 1].createTime;
                }
            } else {
                iAlert(data.msg);
            }
        });
    });

});