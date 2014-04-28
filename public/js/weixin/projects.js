define(function(require, exports, module) {

    var common = require('../common');
    require('./common');

    var $msgTip = $('#msgTip');
    var $projectList = $('#projectList');
    var $loadMore = $('#loadMore');
    var $loading = $('#loading');

    // 时间格式转换
    function convertDate(date) {
        var ONE_MINUTE_MILLISECONDS = 1 * 60 * 1000,
            ONE_HOUR_MILLISECONDS = ONE_MINUTE_MILLISECONDS * 60,
            ONE_DAY_MILLISECONDS = ONE_HOUR_MILLISECONDS * 24;

        var currentMilliseconds = (new Date()).getTime(),
            difference = currentMilliseconds - date;

        if (difference < ONE_MINUTE_MILLISECONDS) {
            return parseInt(difference / 1000) + "秒前";
        }
        for (var i = 1; i < 60; i++) {
            if (difference < ONE_MINUTE_MILLISECONDS * i) {
                return i + "分钟前";
            }
        }
        for (var j = 1; j < 24; j++) {
            if (difference < ONE_HOUR_MILLISECONDS * j) {
                return j + "小时前";
            }
        }
        for (var k = 1; k < 30; k++) {
            if (difference < ONE_DAY_MILLISECONDS * k) {
                return k + "天前";
            }
        }
        return (new Date(date)).toLocaleDateString();
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
                // 查找成功一致的逻辑
                if (data.r == 0) {
                    var projectList = data.projectList;
                    var len = projectList.length;
                    var projectTemp = '';
                    var project;
                    var coverUrl;

                    for (var i = 0; i < len; i++) {
                        project = projectList[i];
                        coverUrl = project.coverUrl;
                        localProgress = common.convertProgress(project.progress);
                        if (!coverUrl) {
                            coverUrl = '/img/default_project_cover.jpg'
                        }

                        projectTemp = '<a class="item project" href="/weixin/project/' + project._id + '">' +
                            '<div class="image">' +
                            '<img src="' + coverUrl + '">' +
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

                        $projectList.append($(projectTemp));
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

    var searchConfig = {
        pageSize: 5,
        industry: -1,
        group: -1
    };

    // 页面加载完成后，默认去查找一次
    searchProjects(searchConfig, function(data) {
        $loading.removeClass('active');

        if (data.r == 0) {
            var projectList = data.projectList;
            var len = projectList.length;

            if (len === 0) {
                $msgTip.find('.header').html('项目为空');
                $msgTip.show();
            } else if (len === searchConfig.pageSize) {
                $loadMore.show();
                $loadMore.html('加载更多');
                searchConfig.createTime = projectList[len - 1].createTime;
            }
        } else {
            $msgTip.find('.header').html(data.msg);
            $msgTip.show();
        }
    });

    // 搜索条件改变时
    $('.ui.dropdown').dropdown({
        on: 'click',
        onChange: function(value, text) {
            if (this.id === 'industryDropdown') {
                searchConfig.industry = value;
            } else if (this.id === 'groupDropdown') {
                searchConfig.group = value;
            }

            $('.project').remove();
            $loading.addClass('active');
            $loadMore.hide();
            $msgTip.hide();
            searchConfig.createTime = undefined;

            searchProjects(searchConfig, function(data) {
                $loading.removeClass('active');

                if (data.r == 0) {
                    var projectList = data.projectList;
                    var len = projectList.length;

                    if (len === 0) {
                        $msgTip.find('.header').html('查询结果为空');
                        $msgTip.show();
                    } else if (len === searchConfig.pageSize) {
                        $loadMore.show();
                        $loadMore.html('加载更多');
                        searchConfig.createTime = projectList[len - 1].createTime;
                    }
                } else {
                    $msgTip.find('.header').html(data.msg);
                    $msgTip.show();
                }
            });
        }
    });

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