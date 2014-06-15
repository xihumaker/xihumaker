define(function(require, exports, module) {

    // 加载HTML decode库
    require('../../lib/he');
    require('../../lib/md5');

    var iAlert = require('../../angel/alert');
    var Util = require('../../angel/util');

    var common = require('../common');

    var CONST = require('../const');
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
                '<div class="col-md-4 col-xs-4">' +
                '<img class="media-object img-rounded" width="64" src="' + headimgurl + '">' +
                '</div>' +
                '<div class="col-md-8 col-xs-8">' +
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
    $('body').on('click', '.loginBtn', function() {
        $('#loginModal').modal('show');
    });

    // 用户点击登录Modal中的登录按钮
    $('#login').click(function() {
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();

        if (!username) {
            iAlert('用户名不能为空');
            return;
        }
        if (!password) {
            iAlert('密码不能为空');
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
                    iAlert(data.msg);
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
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
        iAlert('开发中，敬请期待');
    });

    // 用户是否已经赞过该项目
    function findLikesByUserId(userId) {
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
    }

    // 用户是否已经关注该项目
    function findConcernsByUserId(userId) {
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
    }

    // 获取当前登录用户的信息
    $.ajax({
        url: '/api/currentUserinfo',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var userId = data.user._id;
                findLikesByUserId(userId);
                findConcernsByUserId(userId);
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


    // 围观群众 - 查找该项目所有的评论
    $.ajax({
        url: '/api/project/' + project._id + '/comments',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var projectComments = data.projectComments,
                    len = projectComments.length,
                    temp,
                    comment;

                for (var i = 0; i < len; i++) {
                    comment = projectComments[i];

                    temp = '<p>' +
                        '<img class="media-object img-rounded" width="20" style="float:left;margin-right:5px;" src="/img/default_avatar.png">' +
                        '<span style="float: left;">' + comment.belongToUsername + '</span>：' +
                        '<span>' + comment.content + '</span>' +
                        '</p>';
                    $('#commentList').append($(temp));
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

    // 围观群众 - 发言
    var $content = $('#content');
    $('body').on('click', '#addComment', function() {
        var content = $content.val().trim();
        if (!content) {
            iAlert('评论不能为空');
            return;
        }

        $.ajax({
            url: '/api/project/' + project._id + '/comment',
            type: 'POST',
            timeout: 15000,
            data: {
                content: content
            },
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    var comment = data.comment;

                    if (comment.headimgurl === '') {
                        comment.headimgurl = '/img/default_avatar.png';
                    }

                    var temp = '<p>' +
                        '<img class="media-object img-rounded" width="20" style="float:left;margin-right:5px;" src="' + comment.headimgurl + '">' +
                        '<span style="float: left;">' + comment.belongToUsername + '</span>：' +
                        '<span>' + comment.content + '</span>' +
                        '</p>';
                    $('#commentList').append($(temp));
                    $content.val('');
                    iAlert('发言成功');
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });


    // 江湖告急相关代码
    var $projectTopicList = $('#projectTopicList');

    $.ajax({
        url: '/api/project/' + project._id + '/topics',
        type: 'get',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var topics = data.topics,
                    len = topics.length,
                    topic,
                    temp,
                    comments;
                for (var i = 0; i < len; i++) {
                    topic = topics[i];
                    comments = topic.comments;

                    if (hasLogin) {
                        temp = '<div class="topic">' +
                            '<p data-id="' + topic._id + '">【' + (i + 1) + '】' + topic.content + '<a href="javascript:void(0);" class="replay">回复</a></p>' +
                            '<div class="commentList">';
                    } else {
                        temp = '<div class="topic">' +
                            '<p data-id="' + topic._id + '">【' + (i + 1) + '】' + topic.content + '<a href="javascript:void(0);" class="loginBtn">回复</a></p>' +
                            '<div class="commentList">';
                    }



                    for (var j = 0; j < comments.length; j++) {
                        temp += '<p>' +
                            '<img class="media-object img-rounded" width="20" style="float:left;margin-right:5px;" src="/img/default_avatar.png">' +
                            '<span style="float: left;">' + comments[j].belongToUsername + '</span>：<span>' + comments[j].content + '</span></p>';
                    }

                    temp += '';

                    temp += '</div><div class="misc">' +
                        '<textarea class="form-control" rows="2"></textarea>' +
                        '<button type="button" class="btn btn-default cancel" style="margin-right: 15px;">取消</button>' +
                        '<button type="button" class="btn btn-success ok">回复</button>' +
                        '</div>' +
                        '</div>';


                    $projectTopicList.append($(temp));
                }
            }
        }
    });

    // 点击“回复”显示回复框
    $('body').on('click', '.replay', function() {
        $(this).parents('.topic').find('.misc').show()
    });
    // 点击“取消”隐藏回复框
    $('body').on('click', '.cancel', function() {
        $(this).parents('.topic').find('.misc').hide()
    });
    // 点击“回复”按钮
    $('body').on('click', '.ok', function() {
        var _this = this;
        var topicId = $(this).parents('.topic').find('p[data-id]').attr('data-id');
        var content = $(this).siblings('textarea').val();

        if (!content) {
            iAlert('回复不能为空');
            return;
        }

        $.ajax({
            url: '/api/project/' + project._id + '/topic/' + topicId,
            type: 'post',
            data: {
                content: content
            },
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('回复成功');
                    $(_this).siblings('textarea').val('');
                    var comment = data.comment;
                    var temp = '<p>' +
                        '<img class="media-object img-rounded" width="20" style="float:left;margin-right:5px;" src="/img/default_avatar.png">' +
                        '<span style="float: left;">' + comment.belongToUsername + '</span>：<span>' + comment.content + '</span></p>';

                    $(_this).parents('.topic').find('.commentList').append($(temp));
                }
            }
        });


    });









});