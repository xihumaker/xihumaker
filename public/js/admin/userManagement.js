/**
 * 西湖创客汇 - 用户管理
 */
define(function(require) {

    "use strict";

    var iAlert = require('../../angel/alert');

    var $userList = $('#userList');
    var $loadMore = $('#loadMore');
    var $searchBtn = $('#searchBtn');
    var $searchKey = $('#searchKey');

    var userList = {};

    function searchUsers(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('Default failCall callback invoked.');
        };

        $.ajax({
            url: '/api/users/search',
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

    function addToUserList(user) {
        userList[user._id] = user;
    }

    function renderOne(user) {
        if (user.sex == 1) {
            user.localSex = "男";
        } else if (user.sex == 2) {
            user.localSex = "女";
        } else {
            user.localSex = "";
        }
        user.localCreateTime = (new Date(user.createTime)).toLocaleDateString();

        if (user.workOrStudy === 0) {
            user.localSorkOrStudy = "未知";
        } else if (user.workOrStudy === 1) {
            user.localSorkOrStudy = "已工作";
        } else {
            user.localSorkOrStudy = "在读学生";
        }
        addToUserList(user);
        var temp = '<tr>' +
            '<td>' + ($('#userList tr').length + 1) + '</td>' +
            '<td>' + user.username + '</td>' +
            '<td>' + user._id + '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + user.phone + '</td>' +
            '<td>' + user.localCreateTime + '</td>' +
            '<td>' +
            '<div class="ui mini icon buttons">' +
            '<div class="ui red button delete" data-id="' + user._id + '" title="删除" data-content="删除" data-variation="inverted"><i class="trash icon"></i> 删除</div>' +
            '<div class="ui default button view" data-id="' + user._id + '" title="查看" data-content="查看" data-variation="inverted"><i class="trash icon"></i> 查看</div>' +
            '</div>' +
            '</td>' +
            '</tr>';

        $userList.append($(temp));
    }

    function render(users) {
        var len = users.length;
        for (var i = 0; i < len; i++) {
            renderOne(users[i]);
        }
    }

    var searchConfig = {
        pageSize: 10,
        pageStart: 0
    };

    // 页面加载完成，默认去加载
    searchUsers(searchConfig, function(data) {
        if (data.r === 0) {
            var users = data.users;
            var len = users.length;

            if (len === 0) {
                $userList.append($('<tr><td colspan="8"><div class="ui center aligned teal header" style="padding: 100px 0;">用户列表为空</div></td></tr>'));
            } else if (len < searchConfig.pageSize) {
                render(users);
            } else if (len === searchConfig.pageSize) {
                $loadMore.show();
                searchConfig.pageStart += len;
                render(users);
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
                var users = data.users;
                var len = users.length;
                if (len === 0) {
                    $loadMore.html('无更多用户');
                } else if (len < searchConfig.pageSize) {
                    $loadMore.html('无更多用户');
                    searchConfig.pageStart += len;
                    render(users);
                } else if (len === searchConfig.pageSize) {
                    $loadMore.html('加载更多');
                    searchConfig.pageStart += len;
                    render(users);
                }
            } else {
                $userList.append($('<tr><td>' + data.msg + '</td></tr>'));
            }
        });
    });

    // 搜索
    $searchBtn.click(function() {
        var key = $searchKey.val().trim();
        if (!key) {
            iAlert('请输入搜索条件');
            return;
        }

        searchConfig.pageStart = 0;
        searchConfig.key = key;
        $('#userList tr').remove();
        $loadMore.hide();
        $loadMore.html('加载更多');

        searchUsers(searchConfig, function(data) {
            if (data.r === 0) {
                var users = data.users;
                var len = users.length;

                if (len === 0) {
                    $userList.append($('<tr><td colspan="12"><div class="ui center aligned teal header" style="padding: 100px 0;">查询结果为空</div></td></tr>'));
                } else if (len < searchConfig.pageSize) {
                    render(users);
                } else if (len === searchConfig.pageSize) {
                    $loadMore.show();
                    searchConfig.pageStart += len;
                    render(users);
                }
            } else {
                $userList.append($('<tr><td>' + data.msg + '</td></tr>'));
            }
        });
    });

    $('body').on('click', '.delete', function() {
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
                success: function(data) {
                    console.log(data);
                    if (data.r === 0) {
                        $(self).parents('tr').remove();
                    } else {
                        iAlert(data.msg);
                    }
                }
            });
        }
    });

    var $userInfoModal = $('#userInfo');
    var $userId = $('#userId');
    var $headimgurl = $('#headimgurl');
    var $username = $('#username');
    var $sex = $('#sex');
    var $email = $('#email');
    var $phone = $('#phone');
    var $openId = $('#openId');
    var $birthday = $('#birthday');
    var $coin = $('#coin');
    var $interest = $('#interest');
    var $inAddress = $('#inAddress');
    var $city = $('#city');
    var $province = $('#province');
    var $workOrStudy = $('#workOrStudy');
    var $school = $('#school');
    var $profession = $('#profession');
    var $company = $('#company');
    var $job = $('#job');
    var $createTime = $('#createTime');

    $('body').on('click', '.view', function() {
        var self = this;
        var _id = self.getAttribute('data-id');
        var user = userList[_id];

        $userId.html(user._id);
        $headimgurl.attr('src', user.headimgurl);
        $username.html(user.username);
        $sex.html(user.localSex);
        $email.html(user.email);
        $openId.html(user.openId);
        $phone.html(user.phone);
        $birthday.html((new Date(user.birthday).toLocaleDateString()));
        $coin.html(user.coin);
        $interest.html((user.interest || []).join("、"));
        $inAddress.html(user.inAddress);
        $city.html(user.city);
        $province.html(user.province);
        $workOrStudy.html(user.localSorkOrStudy);
        $school.html(user.school);
        $profession.html(user.profession);
        $company.html(user.company);
        $job.html(user.job);
        $createTime.html((new Date(user.createTime).toLocaleString()));

        $userInfoModal.modal('show');
    });

    $('#exportToExcel').click(function() {
        $.ajax({
            url: '/admin/exportToExcel',
            type: 'POST',
            data: {

            },
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                console.log(data);
            }
        });
    });





});