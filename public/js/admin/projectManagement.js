define(function(require) {
    "use strict";
    var iAlert = require('../../angel/alert');

    var CONST = require("../const");
    var INDUSTRY_LIST = CONST.INDUSTRY_LIST;
    var GROUP_LIST = CONST.GROUP_LIST;

    // 项目查找配置参数
    var searchConfig = {
        pageSize: 15,
        pageStart: 0,
        sortBy: 2
    };

    var $searchKey = $('#searchKey');
    var $searchBtn = $('#searchBtn');
    var $projectList = $('#projectList');
    var $loadMore = $('#loadMore');

    function updateProjectLevel(projectId, level) {
        $.ajax({
            url: '/api/project/' + projectId + '/level',
            type: 'POST',
            data: {
                level: level
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('修改成功');
                }
            }
        });
    }

    function addDropdownEvent() {
        $('.ui.dropdown').dropdown({
            on: 'click',
            onChange: function(value, text) {
                var projectId = $(this).parents('tr').attr('data-id');
                updateProjectLevel(projectId, value);
            }
        });
    }

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
        var counter = $('#projectList tr').length + 1;
        var temp = '<tr class="project" data-id="' + project._id + '">' +
            '<td>' + counter + '</td>' +
            '<td>' + project.title + '</td>' +
            '<td>' + INDUSTRY_LIST[project.industry] + '</td>' +
            '<td>' + GROUP_LIST[project.group] + '</td>' +
            '<td data-authorId="' + project.authorId + '"></td>' +
            '<td class="members"></td>' +
            '<td>' + (new Date(project.createTime)).toLocaleString() + '</td>' +
            '<td>' + project.teamName + '</td>' +
            '<td>' + project.likeNum + '</td>' +
            '<td>' + project.concernNum + '</td>' +
            '<td>' + project.coinNum + '</td>' +
            '<td>' + project.rankScore + '</td>' +
            '<td>' + project.progress + '</td>' +
            '<td>' +
            '<div class="ui blue top left pointing dropdown">' +
            '<input type="hidden" name="level" value="' + project.level + '" class="level">' +
            '<span class="text"></span>' +
            '<i class="dropdown icon"></i>' +
            '<div class="menu">' +
            '<div class="item" data-value="1">普通</div>' +
            '<div class="item" data-value="2">创新</div>' +
            '<div class="item" data-value="3">精华</div>' +
            '</div>' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="ui mini red button delete" style="margin-right:5px;"><i class="trash icon"></i>删除</div>' +
            '<a class="ui mini button" target="_blank" href="/project/' + project._id + '"><i class="camera icon"></i>查看</a>' +
            '</td>' +
            '</tr>';
        $projectList.append($(temp));
    }

    function render(projectList) {
        for (var i = 0; i < projectList.length; i++) {
            renderOne(projectList[i]);
        }
        addDropdownEvent();
    }

    // 页面加载完成后，默认去查找一次
    findProjects(searchConfig, function(data) {
        if (data.r === 0) {
            var projectList = data.projectList;
            var len = projectList.length;

            if (len === 0) {

            } else if (len < searchConfig.pageSize) {
                render(projectList);
                searchConfig.pageStart += len;
            } else if (len === searchConfig.pageSize) {
                render(projectList);
                searchConfig.pageStart += len;
                $loadMore.show();
            }
        }
    });

    // 点击“加载更多”
    $loadMore.click(function() {
        $loadMore.html('正在加载...');

        findProjects(searchConfig, function(data) {
            if (data.r === 0) {
                var projectList = data.projectList;
                var len = projectList.length;

                if (len === 0) {
                    $loadMore.html('无更多项目');
                } else if (len < searchConfig.pageSize) {
                    render(projectList);
                    $loadMore.html('无更多项目');
                    searchConfig.pageStart += len;
                } else if (len === searchConfig.pageSize) {
                    render(projectList);
                    $loadMore.html('加载更多');
                    searchConfig.pageStart += len;
                }
            } else {
                iAlert(data.msg);
            }
        });
    });

    // 删除
    $projectList.on('click', '.delete', function() {
        var self = this;
        var _id = $(this).parents('.project').attr('data-id');
        var ret = confirm('你确定要删除这个项目吗?');
        if (ret) { // 确定删除
            $.ajax({
                url: '/api/project/' + _id,
                type: 'DELETE',
                timeout: 15000,
                success: function(data) {
                    console.log(data);
                    if (data.r === 0) {
                        $(self).parents('.project').remove();
                    } else {

                    }
                }
            });
        }
    });

    $searchBtn.on('click', function() {
        var q = $searchKey.val().trim();

        if (!q) {
            return;
        }
        searchConfig.pageStart = 0;
        searchConfig.q = q;
        $('#projectList tr').remove();
        $loadMore.html('加载更多').hide();

        findProjects(searchConfig, function(data) {
            console.log(data);
            if (data.r === 0) {
                var projectList = data.projectList;
                var len = projectList.length;

                if (len === 0) {

                } else if (len < searchConfig.pageSize) {
                    render(projectList);
                    searchConfig.pageStart += len;
                } else if (len === searchConfig.pageSize) {
                    render(projectList);
                    searchConfig.pageStart += len;
                    $loadMore.show();
                }
            } else {
                iAlert(data.msg);
            }
        });
    });





});