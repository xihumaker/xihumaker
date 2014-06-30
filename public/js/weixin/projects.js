define(function(require) {
    "use strict";
    var common = require('../common');
    require('./common');

    var $msgTip = $('#msgTip');
    var $projectList = $('#projectList');
    var $loadMore = $('#loadMore');
    var $loading = $('#loading');

    var searchConfig = {
        pageSize: 5,
        pageStart: 0,
        industry: -1,
        group: -1,
        sortBy: 1
    };

    function findProjects(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> findProjects: Default failCall callback invoked.');
        };

        $.ajax({
            url: '/api/projects/find',
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
        var coverUrl = project.coverUrl;
        var localProgress = common.convertProgress(project.progress);
        if (!coverUrl) {
            coverUrl = '/img/default_project_cover.jpg';
        }

        var projectTemp = '<a class="item project" href="/weixin/project/' + project._id + '">' +
            '<div class="image">' +
            '<img src="' + coverUrl + '">' +
            '</div>';
        if (project.level === 3) {
            projectTemp += '<h4 class="ui black header title"><img class="jinghua" src="/img/xunzhang.png" />' + project.title + '</h4>';
        } else {
            projectTemp += '<h4 class="ui black header title">' + project.title + '</h4>';
        }
        projectTemp += '<div>' +
            '<div class="misc">' +
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

    function render(projectList) {
        for (var i = 0; i < projectList.length; i++) {
            renderOne(projectList[i]);
        }
    }

    // 页面加载完成后，默认去查找一次
    findProjects(searchConfig, function(data) {
        $loading.removeClass('active');

        if (data.r === 0) {
            var projectList = data.projectList;
            var len = projectList.length;

            render(projectList);
            searchConfig.pageStart = searchConfig.pageStart + len;

            if (len === 0) {
                $msgTip.find('.header').html('项目为空');
                $msgTip.show();
            } else if (len === searchConfig.pageSize) {
                $loadMore.html('加载更多').show();
            }
        } else {
            $msgTip.find('.header').html(data.msg);
            $msgTip.show();
        }
    });

    // 搜索条件改变时
    $('.ui.dropdown').dropdown({
        on: 'hover',
        onChange: function(value, text) {
            searchConfig.pageStart = 0;
            searchConfig.sortBy = 1;
            searchConfig.progress = undefined;
            searchConfig.level = undefined;

            if (this.id === 'industryDropdown') {
                searchConfig.industry = value;
            } else if (this.id === 'groupDropdown') {
                searchConfig.group = value;
            } else if (this.id === "moreDropdown") {
                if (value === 3001) { // 精华
                    searchConfig.level = 3;
                } else if (value === 3002) { // 按热度排序
                    searchConfig.sortBy = 1;
                } else if (value === 3003) { // 按时间排序
                    searchConfig.sortBy = 2;
                } else if (value === 3004) { // 已完成项目
                    searchConfig.progress = 100;
                }
            }

            $('.project').remove();
            $loading.addClass('active');
            $loadMore.hide();
            $msgTip.hide();

            findProjects(searchConfig, function(data) {
                $loading.removeClass('active');

                if (data.r === 0) {
                    var projectList = data.projectList;
                    var len = projectList.length;

                    render(projectList);
                    searchConfig.pageStart = searchConfig.pageStart + len;

                    if (len === 0) {
                        $msgTip.find('.header').html('查询结果为空');
                        $msgTip.show();
                    } else if (len === searchConfig.pageSize) {
                        $loadMore.html('加载更多').show();
                    }
                } else {
                    $msgTip.find('.header').html(data.msg);
                    $msgTip.show();
                }
            });
        }
    });

    // 点击加载更多
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        findProjects(searchConfig, function(data) {
            if (data.r === 0) {
                var projectList = data.projectList;
                var len = projectList.length;

                render(projectList);
                searchConfig.pageStart = searchConfig.pageStart + len;

                if (len === 0) {
                    $loadMore.html('无更多项目');
                } else if (len < searchConfig.pageSize) {
                    $loadMore.html('无更多项目');
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多');
                }
            } else {
                alert(data.msg);
            }
        });
    });

    // 滚动到页面底部时自动加载
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
            $loadMore.html('正在加载...');
            findProjects(searchConfig, function(data) {
                if (data.r === 0) {
                    var projectList = data.projectList;
                    var len = projectList.length;

                    render(projectList);
                    searchConfig.pageStart = searchConfig.pageStart + len;

                    if (len === 0) {
                        $loadMore.html('无更多项目');
                    } else if (len < searchConfig.pageSize) {
                        $loadMore.html('无更多项目');
                    } else if (len === searchConfig.pageSize) {
                        $loadMore.html('加载更多');
                    }
                    console.log(searchConfig);
                } else {
                    alert(data.msg);
                }
            });
        }
    });



});