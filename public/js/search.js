define(function(require, exports, module) {

    var common = require('./common');

    function searchProjectsByKey(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> searchProjectsByKey: Default failCall callback invoked.')
        }
        $.ajax({
            url: '/api/projects/key',
            type: 'GET',
            data: searchConfig,
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);

                // 查找成功一致的逻辑
                if (data.r == 0) {
                    var projectList = data.projectList;
                    var len = projectList.length;
                    var project;
                    var temp;
                    var localProgress;
                    for (var i = 0; i < len; i++) {
                        project = projectList[i];
                        localProgress = common.convertProgress(project.progress);
                        if (project.coverUrl == '') {
                            project.coverUrl = '/img/default_project_cover.png';
                        }

                        temp = '<a class="col-sm-6 col-md-3 project" target="_blank" href="/project/' + project._id + '">' +
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

                        $('#projectList').append($(temp));
                    }
                }
                // 查找成功不一致的逻辑写在回调函数里面
                succCall(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                failCall();
            }
        });

    }

    // 搜索关键字
    var href = decodeURI(window.location.href);
    var q = href.split('?')[1].split('=')[1];


    var searchConfig = {
        q: q,
        pageSize: 12,
        pageStart: 0
    };

    var $loadMore = $('#loadMore');

    // 页面加载完成后，默认去查找一次
    searchProjectsByKey(searchConfig, function(data) {
        if (data.r == 0) {
            var projectList = data.projectList;
            var len = projectList.length;
            if (len === searchConfig.pageSize) {
                $loadMore.show();
                searchConfig.pageStart = searchConfig.pageStart + searchConfig.pageSize;
            }

            $('#totalNum').html(data.total);
        }
    });

    // 点击“加载更多”
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        searchProjectsByKey(searchConfig, function(data) {
            if (data.r == 0) {
                var projectList = data.projectList;
                var len = projectList.length;

                if (len === 0) {
                    $loadMore.html('无更多项目');
                } else if (len < searchConfig.pageSize) {
                    $loadMore.html('无更多项目');
                    searchConfig.pageStart = searchConfig.pageStart + searchConfig.pageSize;
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多');
                    searchConfig.pageStart = searchConfig.pageStart + searchConfig.pageSize;
                }
            } else {
                alert(data.msg);
            }
        });
    });



});