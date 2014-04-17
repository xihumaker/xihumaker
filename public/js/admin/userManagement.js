/**
 * 西湖创客汇 - 用户管理
 */
define(function(require, exports, module) {

    window.allUsers = [];

    var counter = 0;

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

                    allUsers = allUsers.concat(users);

                    for (var i = 0; i < len; i++) {
                        counter++;
                        user = users[i];
                        if (user.sex == 1) {
                            user.localSex = "男";
                        } else if (user.sex == 2) {
                            user.localSex = "女";
                        } else {
                            user.localSex = "";
                        }
                        user.localCreateTime = (new Date(user.createTime)).toLocaleDateString();

                        if (user.workOrStudy == 0) {
                            user.localSorkOrStudy = "未知";
                        } else if (user.workOrStudy == 1) {
                            user.localSorkOrStudy = "已工作";
                        } else {
                            user.localSorkOrStudy = "在读学生";
                        }
                        temp = '<tr>' +
                            '<td>' + counter + '</td>' +
                            '<td>' + user.username + '</td>' +
                            '<td>' + user.localSex + '</td>' +
                            '<td>' + user.email + '</td>' +
                            '<td>' + user.phone + '</td>' +
                            '<td>' + user.qq + '</td>' +
                            '<td>' + user.province + '</td>' +
                            '<td>' + user.city + '</td>' +
                            '<td>' + user.coin + '</td>' +
                            '<td>' + user.localCreateTime + '</td>' +
                            '<td>' + user.localSorkOrStudy + '</td>' +
                            '<td>' +
                            '<div class="ui mini icon buttons">' +
                            '<div class="ui red button delete" data-id="' + user._id + '" title="删除" data-content="删除" data-variation="inverted"><i class="trash icon"></i></div>' +
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
                $userList.append($('<tr><td colspan="8"><div class="ui center aligned teal header" style="padding: 100px 0;">用户列表为空</div></td></tr>'));
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

        if (!$('#searchKey').val().trim()) {
            alert('请输入搜索条件');
            return;
        }

        allUsers = []; // 清空数组
        counter = 0; // 计时器初始化0

        searchConfig.pageStart = 0;
        searchConfig.key = $searchKey.val().trim();
        $('#userList tr').remove();
        $loadMore.hide();

        searchUsers(searchConfig, function(data) {
            if (data.r === 0) {
                var len = data.users.length;
                if (len === 0) {
                    $userList.append($('<tr><td colspan="12"><div class="ui center aligned teal header" style="padding: 100px 0;">查询结果为空</div></td></tr>'));
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多').show();
                    searchConfig.pageStart = $('#userList tr').length;
                }
            } else {
                $userList.append($('<tr><td>' + data.msg + '</td></tr>'));
            }
        });
    });

    $('body').on('click', '.delete', function(e) {
        var self = this;
        var _id = this.getAttribute('data-id');

        if (confirm('你确定要删除这个用户吗？')) {
            $.ajax({
                url: '/api/user',
                type: 'DELETE',
                data: {
                    _id: _id
                },
                dataType: 'json',
                timeout: 15000,
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.r === 0) {
                        $(self).parents('tr').remove();
                    } else {
                        alert(data.msg);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });
        }
    });

    $('#exportToExcel').click(function() {
        $.ajax({
            url: '/admin/exportToExcel',
            type: 'POST',
            data: {

            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });



});