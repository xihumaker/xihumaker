define(function(require) {

    "use strict";
    var common = require('./common');

    var $projectList = $('#projectList');
    var $loadMore = $('#loadMore');
    var $totalNum = $('#totalNum');

    function searchProjectsByKey(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> searchProjectsByKey: Default failCall callback invoked.');
            return;
        };
        $.ajax({
            url: '/api/projects/key',
            type: 'GET',
            data: searchConfig,
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
        if (!project.coverUrl) {
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
        var len = projectList.length;
        for (var i = 0; i < len; i++) {
            renderOne(projectList[i]);
        }
    }

    // 搜索关键字
    var href = decodeURI(window.location.href);
    var q = href.split('?')[1].split('=')[1];

    if (!q) {
        $totalNum.html('0');
        return;
    }

    var searchConfig = {
        q: q,
        pageSize: 12,
        pageStart: 0
    };

    var hasLoadedNum = 0;

    // 页面加载完成后，默认去查找一次
    searchProjectsByKey(searchConfig, function(data) {
        if (data.r === 0) {
            var total = data.total;
            var projectList = data.projectList;
            var len = projectList.length;

            if (total === 0) {
                $totalNum.html('0');
                return;
            }

            render(projectList);
            $totalNum.html(data.total);
            hasLoadedNum += len;

            if (len < total) {
                $loadMore.show();
                searchConfig.pageStart += len;
            }
        }
    });

    // 点击“加载更多”
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        searchProjectsByKey(searchConfig, function(data) {
            if (data.r === 0) {
                var total = data.total;
                var projectList = data.projectList;
                var len = projectList.length;

                if ((len + hasLoadedNum) < total) {
                    $loadMore.html('加载更多');
                } else if ((len + hasLoadedNum) === total) {
                    $loadMore.html('无更多项目');
                }

                render(projectList);
                searchConfig.pageStart += len;
                hasLoadedNum += len;
            }
        });
    });



});