define(function(require, exports, module) {

    var CONST = require("../const");
    var INDUSTRY_LIST = CONST.INDUSTRY_LIST;
    var GROUP_LIST = CONST.GROUP_LIST;

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
                            '<td>' + project.authorId + '</td>' +
                            '<td>' + project.members + '</td>' +
                            '<td>' + (new Date(project.createTime)).toLocaleString() + '</td>' +
                            '<td>' + project.teamName + '</td>' +
                            '<td>' + project.likeNum + '</td>' +
                            '<td>' + project.concernNum + '</td>' +
                            '<td>' + project.coinNum + '</td>' +
                            '<td>' + project.progress + '</td>' +
                            '<td>' +
                            '<div class="ui mini icon buttons">' +
                            '<div class="ui red button delete" data-content="删除" data-variation="inverted"><i class="trash icon"></i></div>' +
                            '<a class="ui button" data-content="查看" target="_blank" href="/project/' + project._id + '" data-variation="inverted"><i class="camera icon"></i></a>' +
                            '</div>' +
                            '</td>' +
                            '</tr>';
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