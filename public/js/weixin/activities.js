define(function(require) {

    "use strict";
    var CONST = require('../const');
    var CITY_LIST = CONST.CITY_LIST;

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
        if (!activity.coverUrl) {
            activity.coverUrl = '/img/default_activity_cover.jpg';
        }
        var progress;
        if (activity.limit === 0) {
            progress = 50;
            activity.limit = '不限';
        } else {
            progress = activity.totalNum * 100 / activity.limit;
        }

        var temp = '<a class="item event" href="/weixin/activity/' + activity._id + '">' +
            '<div class="image">' +
            '<img src="' + activity.coverUrl + '">' +
            '</div>' +
            '<h4 class="ui black header title">' + activity.topic + '</h4>' +
            '<div>' +
            '<div class="misc">' +
            '<span style="margin-right: 15px;">' + activity.activityDate + '</span>' +
            '<span>发起人：' + activity.organizer + '</span>' +
            '<span class="ui green small label city" style="">' + CITY_LIST[activity.city] + '</span>' +
            '</div>' +
            '<div class="progress">';
        if (progress === 100) {
            temp += '<div class="progress-bar progress-bar-success" style="width: ' + progress + '%"></div>';
        } else {
            temp += '<div class="progress-bar progress-bar-success" style="width: ' + progress + '%"></div>';
        }
        temp += '</div>' +
            '<div style="text-align: center;">' +
            '<button type="button" class="btn btn-link"><i class="heart icon"></i> 赞 ' + activity.likeNum + '</button>' +
            '<button type="button" class="btn btn-link">报名  ' + activity.totalNum + '/' + activity.limit + '</button>' +
            '</div>' +
            '</div>' +
            '</a>';

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

    var $msgTip = $('#msgTip');
    var $activityList = $('#activityList');
    var $loadMore = $('#loadMore');
    var $loading = $('#loading');

    // 默认加载活动列表
    searchActivities(searchConfig, function(data) {
        $loading.hide();
        if (data.r === 0) {
            var activities = data.activities;
            var len = activities.length;

            if (len === 0) {
                $msgTip.find('.header').html('活动列表为空');
                $msgTip.show();
            } else if (len < searchConfig.pageSize) {
                render(activities);
                searchConfig.pageStart += len;
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
            if (data.r === 0) {
                var activities = data.activities;
                var len = activities.length;

                if (len === 0) {
                    $loadMore.html('无更多活动');
                } else if (len < searchConfig.pageSize) {
                    $loadMore.html('无更多活动');
                    render(activities);
                    searchConfig.pageStart += len;
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多');
                    render(activities);
                    searchConfig.pageStart += len;
                }
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
            searchActivities(searchConfig, function(data) {
                if (data.r === 0) {
                    var activities = data.activities;
                    var len = activities.length;

                    if (len === 0) {
                        $loadMore.html('无更多活动');
                    } else if (len < searchConfig.pageSize) {
                        $loadMore.html('无更多活动');
                        render(activities);
                        searchConfig.pageStart += len;
                    } else if (len === searchConfig.pageSize) {
                        $loadMore.html('加载更多');
                        render(activities);
                        searchConfig.pageStart += len;
                    }
                }
            });
        }
    });

    // 搜索条件改变时
    $('.ui.dropdown').dropdown({
        on: 'click',
        onChange: function(value, text) {
            if (this.id === "cityDropdown") {
                searchConfig.city = value;

                $('.event').remove();
                $loading.addClass('active');
                $loadMore.html('加载更多').hide();
                $msgTip.hide();
                searchConfig.pageStart = 0;

                searchActivities(searchConfig, function(data) {
                    var activities = data.activities,
                        len = activities.length;
                    $loading.hide();
                    if (len === 0) {
                        $msgTip.find('.header').html('搜索结果为空');
                        $msgTip.show();
                    } else if (len < searchConfig.pageSize) {
                        render(activities);
                        searchConfig.pageStart += len;
                    } else if (len === searchConfig.pageSize) {
                        $loadMore.show();
                        render(activities);
                        searchConfig.pageStart += len;
                    }
                });

            }
        }
    });




});