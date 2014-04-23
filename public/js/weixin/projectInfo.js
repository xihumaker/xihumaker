define(function(require, exports, module) {

    // 加载HTML decode库
    require('../../lib/he');
    require('../../lib/md5');

    var CONST = require('../const');
    var INDUSTRY_LIST = CONST.INDUSTRY_LIST;
    var GROUP_LIST = CONST.GROUP_LIST;

    // 将项目详细描述添加进DOM树中
    $('#description').append(he.decode(project.description));

    function findUserById(id, succCall, failCall) {
        failCall = failCall || function() {
            console.log('Default failCall callback invoked.');
        }
        $.ajax({
            url: '/api/user/' + id,
            type: 'GET',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                succCall(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                failCall();
            }
        });
    }

    var $members = $('#members');

    // 获取项目创始人信息
    var authorId = project.authorId;
    findUserById(authorId, function(data) {
        if (data.r === 0) {
            var user = data.user;
            var headimgurl = user.headimgurl;
            // 如果头像地址为空，则使用默认头像
            if (!headimgurl) {
                headimgurl = '/img/default_avatar.png';
            }
            var username = user.username;
            var temp = '<div class="row rowMem">' +
                '<div class="col-md-4 col-xs-4">' +
                '<img class="media-object img-rounded" width="64" src="' + headimgurl + '">' +
                '</div>' +
                '<div class="col-md-8 col-xs-8">' +
                '<h5 style="margin: 0 0 5px;">' + username + '<span>(创始人)</span></h5></div>' +
                '</div>';
            $members.append($(temp));

        }
    });

    var members = project.members;
    if ( !! members) {
        var member;
        members = members.split(',');

        for (var i = 0; i < members.length; i++) {
            member = members[i];
            findUserById(member, function(data) {
                if (data.r === 0) {
                    var user = data.user;
                    var headimgurl = user.headimgurl;
                    // 如果头像地址为空，则使用默认头像
                    if (!headimgurl) {
                        headimgurl = '/img/default_avatar.png';
                    }
                    var username = user.username;
                    var temp = '<div class="row rowMem">' +
                        '<div class="col-md-4 col-xs-4">' +
                        '<img class="media-object img-rounded" width="64" src="' + headimgurl + '">' +
                        '</div>' +
                        '<div class="col-md-8 col-xs-8">' +
                        '<h5 style="margin: 0 0 5px;">' + username + '</h5></div>' +
                        '</div>';
                    $members.append($(temp));
                }
            });
        }
    }


    // 用户未登录时，点击赞、关注、金币、加入团队这些按钮，弹出登录框
    $('.loginBtn').click(function() {
        $('#loginModal').modal('show');
    });

    var $alertWarning = $('#alertWarning');

    // 用户点击登录Modal中的登录按钮
    $('#login').click(function() {

        var username = $('#username').val().trim();
        var password = $('#password').val().trim();

        if (!username) {
            $alertWarning.html('用户名不能为空').removeClass('hide');
            return;
        }
        if (!password) {
            $alertWarning.html('密码不能为空').removeClass('hide');
            return;
        }

        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: {
                email: username,
                password: hex_md5(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    window.location.reload();
                } else {
                    $alertWarning.html(data.msg).removeClass('hide');
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    $('#loginModal input').focus(function() {
        $alertWarning.addClass('hide');
    });

    // 加入项目
    $('#joinTeam').click(function() {
        var _id = project._id;
        $.ajax({
            url: '/api/project/' + _id + '/join',
            type: 'POST',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    alert('加入项目成功');
                    window.location.reload();
                } else {
                    alert(dat.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });

    });

    // 退出项目
    $('#quitTeam').click(function() {
        var _id = project._id;
        $.ajax({
            url: '/api/project/' + _id + '/quit',
            type: 'POST',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    alert('退出项目成功');
                    window.location.reload();
                } else {
                    alert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    $('.develop').click(function() {
        alert('加紧开发中，敬请期待');
    });


});