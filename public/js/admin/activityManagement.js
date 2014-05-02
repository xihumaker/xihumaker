/**
 * 活动管理 - 西湖创客汇后台管理系统
 */
define(function(require, exports, module) {

    var CONST = require('../const');
    var CITY_LIST = CONST.CITY_LIST;

    var iAlert = require('../../angel/alert');

    /**
     * @method searchActivities
     * 活动查询
     */
    function searchActivities(config, succCall) {
        $.ajax({
            url: '/api/activity/search',
            type: 'GET',
            data: config,
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    var activities = data.activities,
                        len = activities.length,
                        activity,
                        temp;

                    for (var i = 0; i < len; i++) {
                        activity = activities[i];
                        if (activity.limit === 0) {
                            activity.limit = '不限';
                        }
                        temp = '<tr>' +
                            '<td>' + (searchConfig.pageStart + i + 1) + '</td>' +
                            '<td>' + activity.topic + '</td>' +
                            '<td>' + activity.organizer + '</td>' +
                            '<td>' + activity.activityDate + '</td>' +
                            '<td>' + activity.meetingTime + '</td>' +
                            '<td>' + CITY_LIST[activity.city] + '</td>' +
                            '<td>' + activity.location + '</td>' +
                            '<td>' + activity.totalNum + '/' + activity.limit + '</td>' +
                            '<td>' +
                            '<div class="ui tiny red button" data-content="删除" data-variation="inverted"><i class="trash icon"></i>删除</div>' +
                            '<a href="/admin/activity/' + activity._id + '/edit" target="_blank" class="ui tiny button" data-content="编辑" data-variation="inverted"><i class="edit icon"></i>编辑</a>' +
                            '<a href="/weixin/activity/' + activity._id + '" target="_blank" class="ui tiny button" data-content="查看" data-variation="inverted"><i class="camera icon"></i>查看</a>' +
                            '</td>' +
                            '</tr>';

                        $activityList.append($(temp));
                    }
                    succCall(data);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    }

    var searchConfig = {
        pageSize: 10,
        pageStart: 0
    };

    var $activityList = $('#activityList');
    var $loadMore = $('#loadMore');

    // 默认加载活动列表
    searchActivities(searchConfig, function(data) {
        var activities = data.activities,
            len = activities.length;

        if (len === 0) {
            $activityList.append($('<tr><td colspan="9"><div class="ui center aligned teal header" style="padding: 100px 0;">活动列表为空</div></td></tr>'));
        } else if (len === searchConfig.pageSize) {
            $loadMore.show();
            searchConfig.pageStart = searchConfig.pageStart + len;
        }
    });

    // 点击加载更多
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        searchActivities(searchConfig, function(data) {
            var len = data.activities.length;
            if (len === 0) {
                $loadMore.html('无更多活动');
            } else if (len < searchConfig.pageSize) {
                $loadMore.html('无更多活动');
                searchConfig.pageStart = searchConfig.pageStart + len;
            } else if (len === searchConfig.pageSize) {
                $loadMore.html('加载更多');
                searchConfig.pageStart = searchConfig.pageStart + len;
            }
        });
    });

    var $searchBtn = $('#searchBtn'); //  搜索按钮

    $searchBtn.click(function(e) {
        iAlert('开发中...');
    });



});