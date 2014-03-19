$(function() {

    var $msgTip = $('#msgTip');
    var $projectList = $('#projectList');
    var $loadMore = $('#loadMore');
    var $loadMoreTwo = $('#loadMoreTwo');
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

    // 分页查询项目列表接口函数
    function findProjectsByPage(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> Default failCall callback invoked.')
        }
        $.ajax({
            url: '/api/projects',
            type: 'GET',
            data: config,
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    var projectList = data.projectList;
                    var projectTemp = '';
                    var len = projectList.length;
                    var project;

                    for (var i = 0; i < len; i++) {
                        project = projectList[i];
                        projectTemp = '<a class="item project" href="/weixin/project/' + project._id + '">' +
                            '<h4 class="ui black header">' + project.title + '</h4>' +
                            '<h5 class="ui black header">' + convertDate(project.createTime) + '</h5>' +
                            '<div class="image">' +
                            '<img src="/img/垂丝海棠.jpg">' +
                            '</div>' +
                            '<div class="content ellipsis">' +
                            '<p class="description">' + project.description + '</p>' +
                            '</div>' +
                            '<div class="ui divider"></div>' +
                            '<h5 class="ui black header">查看详情<i class="right arrow icon"></i></h5 class="ui black header">' +
                            '</a>';
                        $projectList.append($(projectTemp));
                    }
                    succCall(data);
                } else {
                    alert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                failCall();
            }
        });
    }

    var config = {
        pageSize: 3
    }

    // 页面第一次加载完成时
    findProjectsByPage(config, function(data) {
        $loading.removeClass('active');
        var projectList = data.projectList;
        var len = projectList.length;
        if (len === 0) {
            $msgTip.find('.header').html('项目为空');
            $msgTip.show();
        }
        if (len === config.pageSize) {
            $loadMore.show();
            config.createTime = projectList[len - 1].createTime;
        }
    });

    // 用户点击“加载更多”
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        findProjectsByPage(config, function(data) {
            var projectList = data.projectList;
            var len = projectList.length;
            if (len === 0) {
                $loadMore.html('无更多项目');
            } else if (len < config.pageSize) {
                $loadMore.html('无更多项目');
                config.createTime = projectList[len - 1].createTime;
            } else if (len === config.pageSize) {
                config.createTime = projectList[len - 1].createTime;
                $loadMore.html('更多');
            }
        });
    });

    /**
     * @method searchProjects
     * 项目查询接口
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
                succCall(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    }

    var searchConfig = {
        pageSize: 3,
        industry: -1,
        group: -1
    };

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
            $loadMoreTwo.hide();
            $msgTip.hide();
            searchConfig.createTime = undefined;

            searchProjects(searchConfig, function(data) {
                $loading.removeClass('active');

                if (data.r == 0) {
                    var projectList = data.projectList;
                    var len = projectList.length;
                    var projectTemp = '';
                    var project;

                    for (var i = 0; i < len; i++) {
                        project = projectList[i];
                        projectTemp = '<a class="item project" href="/weixin/project/' + project._id + '">' +
                            '<h4 class="ui black header">' + project.title + '</h4>' +
                            '<h5 class="ui black header">' + convertDate(project.createTime) + '</h5>' +
                            '<div class="image">' +
                            '<img src="/img/垂丝海棠.jpg">' +
                            '</div>' +
                            '<div class="content ellipsis">' +
                            '<p class="description">' + project.description + '</p>' +
                            '</div>' +
                            '<div class="ui divider"></div>' +
                            '<h5 class="ui black header">查看详情<i class="right arrow icon"></i></h5 class="ui black header">' +
                            '</a>';
                        $projectList.append($(projectTemp));
                    }

                    if (len === 0) {
                        $msgTip.find('.header').html('查询结果为空');
                        $msgTip.show();
                    } else if (len === searchConfig.pageSize) {
                        $loadMoreTwo.show();
                        $loadMoreTwo.html('加载更多');
                        searchConfig.createTime = projectList[len - 1].createTime;
                    }
                } else {
                    $msgTip.find('.header').html(data.msg);
                    $msgTip.show();
                }
            });
        }
    });

    $loadMoreTwo.click(function() {
        $loadMoreTwo.html('正在加载...');
        searchProjects(searchConfig, function(data) {
            if (data.r == 0) {
                var projectList = data.projectList;
                var len = projectList.length;
                var projectTemp = '';
                var project;

                for (var i = 0; i < len; i++) {
                    project = projectList[i];
                    projectTemp = '<a class="item project" href="/weixin/project/' + project._id + '">' +
                        '<h4 class="ui black header">' + project.title + '</h4>' +
                        '<h5 class="ui black header">' + convertDate(project.createTime) + '</h5>' +
                        '<div class="image">' +
                        '<img src="/img/垂丝海棠.jpg">' +
                        '</div>' +
                        '<div class="content ellipsis">' +
                        '<p class="description">' + project.description + '</p>' +
                        '</div>' +
                        '<div class="ui divider"></div>' +
                        '<h5 class="ui black header">查看详情<i class="right arrow icon"></i></h5 class="ui black header">' +
                        '</a>';
                    $projectList.append($(projectTemp));
                }

                if (len === 0) {
                    $loadMoreTwo.html('无更多项目');
                } else if (len < searchConfig.pageSize) {
                    $loadMoreTwo.html('无更多项目');
                    searchConfig.createTime = projectList[len - 1].createTime;
                } else if (len === searchConfig.pageSize) {
                    $loadMoreTwo.html('加载更多');
                    searchConfig.createTime = projectList[len - 1].createTime;
                }
            } else {
                alert(data.msg);
            }
        });
    });





});