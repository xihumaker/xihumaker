/**
 * 活动管理 - 西湖创客汇后台管理系统
 */
define(function(require) {

    "use strict";
    var CONST = require('../const');
    var CITY_LIST = CONST.CITY_LIST;

    var iAlert = require('../../angel/alert');

    function searchActivities(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('Default failCall callback invoked.');
        };

        $.ajax({
            url: '/api/activity/search',
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

    function renderOne(activity) {
        if (activity.limit === 0) {
            activity.limit = '不限';
        }
        var temp = '<tr>' +
            '<td>' + ($('#activityList tr').length + 1) + '</td>' +
            '<td>' + activity.topic + '</td>' +
            '<td>' + activity.organizer + '</td>' +
            '<td>' + activity.activityDate + '</td>' +
            '<td>' + activity.meetingTime + '</td>' +
            '<td>' + CITY_LIST[activity.city] + '</td>' +
            '<td>' + activity.location + '</td>' +
            '<td>' + activity.totalNum + '/' + activity.limit + '</td>' +
            '<td>' +
            '<div class="ui tiny red button delete" data-id="' + activity._id + '"><i class="trash icon"></i>删除</div>' +
            '<a href="/admin/activity/' + activity._id + '/edit" target="_blank" class="ui tiny button"><i class="edit icon"></i>编辑</a>' +
            '<a href="/weixin/activity/' + activity._id + '" target="_blank" class="ui tiny button"><i class="camera icon"></i>查看</a>' +
            '</td>' +
            '</tr>';

        $activityList.append($(temp));
    }

    function render(activities) {
        var len = activities.length;
        for (var i = 0; i < len; i++) {
            renderOne(activities[i]);
        }
    }

    var searchConfig = {
        pageSize: 10,
        pageStart: 0
    };

    var $activityList = $('#activityList');
    var $loadMore = $('#loadMore');

    // 默认加载活动
    searchActivities(searchConfig, function(data) {
        if (data.r === 0) {
            var activities = data.activities;
            var len = activities.length;

            if (len === 0) {
                $activityList.append($('<tr><td colspan="9"><div class="ui center aligned teal header" style="padding: 100px 0;">活动列表为空</div></td></tr>'));
            } else if (len < searchConfig.pageSize) {
                render(activities);
            } else if (len === searchConfig.pageSize) {
                render(activities);
                searchConfig.pageStart += len;
                $loadMore.show();
            }
        }
    });

    // 点击加载更多
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        searchActivities(searchConfig, function(data) {
            var activities = data.activities;
            var len = activities.length;
            if (len === 0) {
                $loadMore.html('无更多活动');
            } else if (len < searchConfig.pageSize) {
                render(activities);
                $loadMore.html('无更多活动');
                searchConfig.pageStart += len;
            } else if (len === searchConfig.pageSize) {
                render(activities);
                $loadMore.html('加载更多');
                searchConfig.pageStart += len;
            }
        });
    });

    // 删除
    $('body').on('click', '.delete', function() {
        var self = this;
        var _id = this.getAttribute('data-id');

        if (confirm('确定要删除这个活动吗？')) {
            $.ajax({
                url: '/api/activity/' + _id,
                type: 'DELETE',
                timeout: 15000,
                success: function(data) {
                    console.log(data);
                    if (data.r === 0) {
                        $(self).parents('tr').remove();
                        iAlert('删除成功');
                    } else {
                        iAlert(data.msg);
                    }
                }
            });
        }
    });


});