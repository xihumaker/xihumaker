define(function(require, exports, module) {

    // 加载HTML decode库
    require('../lib/he');
    require('../lib/md5');

    var iAlert = require('../angel/alert');
    var Util = require('../angel/util');

    var common = require('./common');

    var CONST = require('./const');
    var INDUSTRY_LIST = CONST.INDUSTRY_LIST;
    var GROUP_LIST = CONST.GROUP_LIST;

    $('#createTime').html(Util.convertDate(project.createTime));
    $('#group').html(GROUP_LIST[project.group]);
    $('#industry').html(INDUSTRY_LIST[project.industry]);
    $('#description').append(he.decode(project.description));
    $('#progress').html(common.convertProgress(project.progress));

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
                '<div class="col-md-4">' +
                '<img class="media-object img-rounded" width="64" src="' + headimgurl + '">' +
                '</div>' +
                '<div class="col-md-8">' +
                '<h5 style="margin: 0 0 5px;">' + username + '<span>(创始人)</span></h5></div>' +
                '</div>';
            $members.append($(temp));

        }
    });

    // 根据项目ID查找所有的项目组成员
    $.ajax({
        url: '/api/project/' + project._id + '/peoples',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var projectPeoples = data.projectPeoples,
                    len = projectPeoples.length,
                    projectPeople,
                    temp;

                for (var i = 0; i < len; i++) {
                    projectPeople = projectPeoples[i];
                    if (projectPeople.headimgurl === '') {
                        projectPeople.headimgurl = '/img/default_avatar.png';
                    }
                    temp = '<div class="row rowMem">' +
                        '<div class="col-md-4 col-xs-4">' +
                        '<img class="media-object img-rounded" width="64" src="' + projectPeople.headimgurl + '">' +
                        '</div>' +
                        '<div class="col-md-8 col-xs-8">' +
                        '<h5 style="margin: 0 0 5px;">' + projectPeople.belongToUsername + '</h5></div>' +
                        '</div>';
                    $members.append($(temp));
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

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
                    iAlert('加入成功');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                } else {
                    iAlert(data.msg);
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
                    iAlert('退出成功');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    $('.develop').click(function() {
        alert('加紧开发中，敬请期待');
    });

    // 用户是否已经赞过该项目
    var userId = $('#currentUsername').attr('data-id');
    $.ajax({
        url: '/api/user/' + userId + '/projects/like',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var projects = data.projects,
                    len = projects.length;

                for (var i = 0; i < len; i++) {
                    if (project._id === projects[i]._id) {
                        $('#like').removeClass('likeBtn');
                        $('#like').addClass('unlikeBtn');
                        $('#likeLabel').html('取消');
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

    // 用户是否已经关注该项目
    $.ajax({
        url: '/api/user/' + userId + '/projects/concern',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var projects = data.projects,
                    len = projects.length;

                for (var i = 0; i < len; i++) {
                    if (project._id === projects[i]._id) {
                        $('#concern').removeClass('concernBtn');
                        $('#concern').addClass('unconcernBtn');
                        $('#concernLabel').html('已关注');
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

    // 赞
    $('body').on('click', '.likeBtn', function() {
        var _id = project._id;
        $.ajax({
            url: '/api/project/' + _id + '/like',
            type: 'POST',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    $('#likeNum').html(++project.likeNum);
                    $('#likeLabel').html('取消');
                    $('#like').removeClass('likeBtn');
                    $('#like').addClass('unlikeBtn');
                    iAlert('赞成功');
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // 取消赞
    $('body').on('click', '.unlikeBtn', function() {
        var _id = project._id;
        $.ajax({
            url: '/api/project/' + _id + '/unlike',
            type: 'POST',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    $('#likeNum').html(--project.likeNum);
                    $('#likeLabel').html('赞');
                    $('#like').addClass('likeBtn');
                    $('#like').removeClass('unlikeBtn');
                    iAlert('取消赞');
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // 关注
    $('body').on('click', '.concernBtn', function() {
        var _id = project._id;
        $.ajax({
            url: '/api/project/' + _id + '/concern',
            type: 'POST',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    $('#concernNum').html(++project.concernNum);
                    $('#concernLabel').html('已关注');
                    $('#concern').removeClass('concernBtn');
                    $('#concern').addClass('unconcernBtn');
                    iAlert('关注成功');
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // 取消关注
    $('body').on('click', '.unconcernBtn', function() {
        var _id = project._id;
        $.ajax({
            url: '/api/project/' + _id + '/unconcern',
            type: 'POST',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    $('#concernNum').html(--project.concernNum);
                    $('#concernLabel').html('关注');
                    $('#concern').addClass('concernBtn');
                    $('#concern').removeClass('unconcernBtn');
                    iAlert('取消关注');
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });








});