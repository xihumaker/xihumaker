define(function(require, exports, module) {

    function convertProgress(val) {
        if (val < 10) {
            return 'idea';
        } else if (val >= 10 && val < 20) {
            return '招兵买马';
        } else if (val >= 20 && val < 60) {
            return '火热施工';
        } else if (val >= 60 && val < 80) {
            return '初露曙光';
        } else if (val >= 80 && val <= 99) {
            return '冲刺';
        } else if (val === 100) {
            return '胜利';
        } else {
            return '未知';
        }
    }

    /**
     * @method searchProjects
     * 项目查询
     */
    function searchProjects(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> searchProjects: Default failCall callback invoked.')
        }
        $.ajax({
            url: '/api/projects/search',
            type: 'GET',
            data: config,
            dataType: 'json',
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
                        localProgress = convertProgress(project.progress);
                        if (project.coverUrl == '') {
                            project.coverUrl = '/img/default_project_cover.png';
                        }
                        console.log(project);
                        temp = '<a class="col-sm-6 col-md-3 project" target="_blank" href="/project/' + project._id + '">' +
                            '<div class="thumbnail">' +
                            '<img class="img-rounded" src="' + project.coverUrl + '" data-pinit="registered">' +
                            '<div class="caption">' +
                            '<h3 class="title" style="margin-bottom: 10px;">' + project.title + '</h3>' +
                            '<p style="height: 20px;margin-bottom: 5px;">' +
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

    // 项目查找配置参数
    var searchConfig = {
        pageSize: 12,
        industry: -1,
        group: -1
    };

    var $loadMore = $('#loadMore');

    // 页面加载完成后，默认去查找一次
    searchProjects(searchConfig, function(data) {
        if (data.r == 0) {
            var projectList = data.projectList;
            var len = projectList.length;
            if (len === searchConfig.pageSize) {
                $loadMore.show();
                searchConfig.createTime = projectList[len - 1].createTime;
            }
        } else {

        }
    });

    // 点击“加载更多”
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        searchProjects(searchConfig, function(data) {
            if (data.r == 0) {
                var projectList = data.projectList;
                var len = projectList.length;

                if (len === 0) {
                    $loadMore.html('无更多项目');
                } else if (len < searchConfig.pageSize) {
                    $loadMore.html('无更多项目');
                    searchConfig.createTime = projectList[len - 1].createTime;
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多');
                    searchConfig.createTime = projectList[len - 1].createTime;
                }
            } else {
                alert(data.msg);
            }
        });
    });

});