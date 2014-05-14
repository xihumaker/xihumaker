define(function(require, exports, module) {

    var iAlert = require('../../angel/alert');

    var CONST = require("../const");
    var INDUSTRY_LIST = CONST.INDUSTRY_LIST;
    var GROUP_LIST = CONST.GROUP_LIST;

    function updateProjectLevel(projectId, level) {
        $.ajax({
            url: '/api/project/' + projectId + '/level',
            type: 'POST',
            data: {
                level: level
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('修改成功');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

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
        })
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
                    var project;
                    var temp;

                    for (var i = 0; i < len; i++) {
                        counter++;
                        project = projectList[i];
                        temp = '<tr class="project" data-id="' + project._id + '">' +
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
                        $('#projectList').append($(temp));
                    }

                    addDropdownEvent();
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
        pageSize: 15,
        industry: -1,
        group: -1
    };
    var counter = 0;

    var $loadMore = $('#loadMore');

    // 页面加载完成后，默认去查找一次
    searchProjects(searchConfig, function(data) {
        console.log(data);
        if (data.r == 0) {
            var projectList = data.projectList;
            var len = projectList.length;
            if (len == searchConfig.pageSize) {
                $loadMore.show();
                searchConfig.createTime = projectList[len - 1].createTime;
            }
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

    // 删除
    $('#projectList').on('click', '.delete', function() {
        var self = this;
        var _id = $(this).parents('.project').attr('data-id');
        var ret = confirm('你确定要删除这个项目吗?');
        if (ret) { // 确定删除

            $.ajax({
                url: '/api/project/' + _id,
                type: 'DELETE',
                timeout: 15000,
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.r == 0) {
                        $(self).parents('.project').remove();
                    } else {

                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });

        } else { // 取消删除
            return;
        }
    });





});