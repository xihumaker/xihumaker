/**
 * 我参加的活动
 */
define(function(require, exports, module) {

    var CONST = require('../const');
    var CITY_LIST = CONST.CITY_LIST;

    var $loading = $('#loading'),
        $myActivities = $('#myActivities');


    function findActivitiesByUserId(userId, succCall) {
        $.ajax({
            url: '/api/user/' + userId + '/activities',
            type: 'GET',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);

                $loading.hide();
                if (data.r === 0) {
                    var activities = data.activities,
                        len = activities.length,
                        temp,
                        activity;

                    if (len === 0) {
                        $('#msgTip').show();
                        $('#topmenu').hide();
                    }

                    for (var i = 0; i < len; i++) {
                        activity = activities[i];
                        if (!activity.coverUrl) {
                            activity.coverUrl = '/img/default_activity_cover.jpg'
                        }

                        if (activity.limit === 0) {
                            progress = 50;
                            activity.limit = '不限';
                        } else {
                            progress = activity.totalNum * 100 / activity.limit;
                        }
                        temp = '<a class="item event" href="/weixin/activity/' + activity._id + '">' +
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
                            '<button type="button" class="btn btn-link"><i class="heart icon"></i> 赞' + activity.likeNum + '</button>' +
                            '<button type="button" class="btn btn-link">报名  ' + activity.totalNum + '/' + activity.limit + '</button>' +
                            '</div>' +
                            '</div>' +
                            '</a>'

                        $myActivities.append($(temp));
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    }

    // 加载当前用户所有报名的活动
    findActivitiesByUserId(userId);






});