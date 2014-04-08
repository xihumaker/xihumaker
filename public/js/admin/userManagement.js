/**
 * 西湖创客汇 - 用户管理
 */
define(function(require, exports, module) {

    $('.ui.button').popup({
        on: 'hover'
    });

    function searchUsers(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('Default failCall callback invoked.')
        }

        $.ajax({
            url: '/api/users/search',
            type: 'GET',
            data: config,
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    var users = data.users;
                    var len = users.length;
                    var user;
                    var temp;

                    for (var i = 0; i < len; i++) {
                        user = users[i];
                        temp = '<tr>' +
                            '<td>' + user._id + '</td>' +
                            '<td>' + user.username + '</td>' +
                            '<td>' + user.email + '</td>' +
                            '<td>' + user.phone + '</td>' +
                            '<td>' + user.sex + '</td>' +
                            '<td>' + user.city + '</td>' +
                            '<td>' + user.coin + '</td>' +
                            '<td>' +
                            '<div class="ui mini icon buttons">' +
                            '<div class="ui red button" title="删除" data-content="删除" data-variation="inverted"><i class="trash icon"></i></div>' +
                            '</div>' +
                            '</td>' +
                            '</tr>';

                        $userList.append($(temp));

                    }
                }
                succCall(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                failCall();
            }
        });
    }

    var $userList = $('#userList');
    var $loadMore = $('#loadMore');
    var $searchBtn = $('#searchBtn');
    var $searchKey = $('#searchKey');

    var searchConfig = window.searchConfig = {
        pageSize: 10,
        pageStart: 0
    };


    // 页面加载完成，默认去加载
    searchUsers(searchConfig, function(data) {
        if (data.r === 0) {
            var len = data.users.length;
            if (len === 0) {
                $userList.append($('<tr><td>用户列表为空</td></tr>'));
            } else if (len === searchConfig.pageSize) {
                $loadMore.show();
                searchConfig.pageStart = $('#userList tr').length;
            }
        } else {
            $userList.append($('<tr><td>' + data.msg + '</td></tr>'));
        }
    });

    // 加载更多
    $loadMore.click(function() {
        $loadMore.html('正在加载...');
        searchUsers(searchConfig, function(data) {
            if (data.r === 0) {
                var len = data.users.length;
                if (len === 0) {
                    $loadMore.html('无更多用户');
                } else if (len < searchConfig.pageSize) {
                    $loadMore.html('无更多用户');
                    searchConfig.pageStart = $('#userList tr').length;
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多');
                    searchConfig.pageStart = $('#userList tr').length;
                }
            } else {
                $userList.append($('<tr><td>' + data.msg + '</td></tr>'));
            }
        });
    });

    // 搜索
    $searchBtn.click(function() {
        searchConfig.pageStart = 0;
        searchConfig.key = $searchKey.val().trim();
        $('#userList tr').remove();
        $loadMore.hide();

        searchUsers(searchConfig, function(data) {
            if (data.r === 0) {
                var len = data.users.length;
                if (len === 0) {
                    $userList.append($('<tr><td>查找结果为空</td></tr>'));
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多').show();
                    searchConfig.pageStart = $('#userList tr').length;
                }
            } else {
                $userList.append($('<tr><td>' + data.msg + '</td></tr>'));
            }
        });
    });



});