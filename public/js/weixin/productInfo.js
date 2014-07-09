define(function(require) {
    "use strict";

    var iAlert = require('../../angel/alert');

    var $topicList = $('#topicList');
    var $loadMore = $('#loadMore');
    var $replyBox = $('#replyBox');

    function findProductTopicsByPage(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> findProductTopicsByPage: Default failCall callback invoked.');
        };
        $.ajax({
            url: '/api/product/' + global.product._id + '/topics',
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

    function renderOne(topic) {
        var temp = '<div class="ui segment topic">' +
            '<h4 class="ui header">';

        if (!topic.belongToUserHeadimgurl) {
            temp += '<img class="rounded ui image" width="40" height="40" src="/img/default_avatar.png">';
        } else {
            temp += '<img class="rounded ui image" width="40" height="40" src="' + topic.belongToUserHeadimgurl + '">';
        }
        temp += '<div class="content">' + topic.belongToUsername + '<div class="sub header">' + new Date(topic.createTime).toLocaleDateString() + '</div></div></h4>';

        if (topic.content.length <= 80) {
            temp += '<div class="content" data-content="' + topic.content + '">' + topic.content + '</div>';
        } else {
            temp += '<div class="content" data-content="' + topic.content + '">' + topic.content.slice(0, 80) + '</div>' +
                '<a href="javascript:void(0);" class="toggle-content part">全文</a>';
        }

        if (topic.picList.length !== 0) {
            temp += '<ul class="picList">';
            for (var i = 0; i < topic.picList.length; i++) {
                temp += '<li><img src="' + topic.picList[i] + '" width="100%" alt=""></li>';
            }
            temp += '</ul>';
        }

        if (topic.likeList.indexOf(global.userId) !== -1) { // 已赞
            temp += '<div class="meta">' +
                '<a href="javascript:void(0);" class="likeBtn" data-id="' + topic._id + '" data-likeNum="' + topic.likeNum + '">' +
                '<i class="thumbs up blue icon"></i>&nbsp;' + topic.likeNum + '</a>';
        } else { // 未赞
            temp += '<div class="meta">' +
                '<a href="javascript:void(0);" class="likeBtn" data-id="' + topic._id + '" data-likeNum="' + topic.likeNum + '">' +
                '<i class="thumbs up outline blue icon"></i>&nbsp;' + topic.likeNum + '</a>';
        }

        temp += '&nbsp;&nbsp;<a href="javascript:void(0);" class="reply" data-id="' + topic._id + '"><i class="chat outline blue icon"></i>回复</a>' +
            '</div>';

        var len = topic.commentList.length;
        var counter = 0;
        temp += '<div class="ui divider"></div>' +
            '<ul class="commentList" data-topic-id="' + topic._id + '">';
        if (len !== 0) {
            for (var i = len - 1; i >= 0; i--) {
                counter++;
                if (counter > 3) {
                    temp += '<li class="hide"><strong>' + topic.commentList[i].belongToUsername + '：</strong>' + topic.commentList[i].content + '</li>';
                } else {
                    temp += '<li><strong>' + topic.commentList[i].belongToUsername + '：</strong>' + topic.commentList[i].content + '</li>';
                }
            }
        }
        temp += '</ul>';
        if (len > 3) {
            temp += '<span><a href="javascript:void(0);" class="more">更多</a> 共' + len + '条回复</span>' + '</div>';
        }
        $topicList.append($(temp));
    }

    function render(topicList) {
        for (var i = 0; i < topicList.length; i++) {
            renderOne(topicList[i]);
        }
    }

    function resetPage() {
        searchConfig.pageStart = 0;
        $('#topicList .topic').remove();
        $loadMore.html('加载更多');
        $loadMore.hide();
    }

    var searchConfig = {
        pageSize: 5,
        pageStart: 0
    };

    if (/1/.test(window.location.search)) { // 说明处于完美世界,否则为现实世界状态
        searchConfig.whichWorld = 1;
    } else {
        searchConfig.whichWorld = 0;
    }

    // 默认加载
    findProductTopicsByPage(searchConfig, function(data) {
        console.log(data);
        if (data.r === 0) {
            var topicList = data.topicList;
            var len = topicList.length;

            if (len === 0) {
                iAlert('帖子列表为空');
            } else if (len < searchConfig.pageSize) {
                render(topicList);
                searchConfig.pageStart += len;
            } else if (len === searchConfig.pageSize) {
                render(topicList);
                searchConfig.pageStart += len;
                $loadMore.show();
            }
        } else {
            iAlert(data.msg);
        }
    });

    function loadMore() {
        $loadMore.html('正在加载...');
        findProductTopicsByPage(searchConfig, function(data) {
            console.log(data);
            if (data.r === 0) {
                var topicList = data.topicList;
                var len = topicList.length;

                if (len === 0) {
                    $loadMore.html('已显示全部');
                } else if (len < searchConfig.pageSize) {
                    render(topicList);
                    searchConfig.pageStart += len;
                    $loadMore.html('已显示全部');
                } else if (len === searchConfig.pageSize) {
                    render(topicList);
                    searchConfig.pageStart += len;
                    $loadMore.html('加载更多');
                }
            } else {
                iAlert(data.msg);
            }
        });
    }

    // 加载更多
    $loadMore.on('click', function() {
        loadMore();
    });

    // 滚动到页面底部时自动加载
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
            loadMore();
        }
    });

    // 全文 收起
    $('body').on('click', '.toggle-content', function() {
        if ($(this).hasClass('part')) {
            // 全文
            $(this).html('收起');
            $(this).removeClass('part');
            $(this).addClass('all');
            $(this).siblings('.content').html($(this).siblings('.content').attr('data-content'));
        } else if ($(this).hasClass('all')) {
            // 收起
            $(this).html('全文');
            $(this).removeClass('all');
            $(this).addClass('part');
            $(this).siblings('.content').html($(this).siblings('.content').attr('data-content').slice(0, 80))
        }
    });

    // 赞
    $('body').on('click', '.likeBtn', function() {
        var that = this;
        var topicId = $(this).attr('data-id');
        var likeNum = Number($(this).attr('data-likeNum'));

        if ($(this).find('i.outline').length === 0) { // 已赞
            return;
        }

        $.ajax({
            url: '/api/product/topic/' + topicId + '/like',
            type: 'POST',
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                if (data.r === 0) {
                    $(that).html('<i class="thumbs up blue icon"></i>&nbsp;' + (likeNum + 1));
                    iAlert('赞 +1');
                }
            }
        });
    });

    // 回复
    $('body').on('click', '.reply', function() {
        var that = this;
        var topicId = $(this).attr('data-id');
        $replyBox.attr('data-id', topicId);
        $replyBox.fadeIn();
    });

    // 发送回复
    $('#replyBox .sendBtn').on('click', function(e) {
        var that = this;
        var topicId = $replyBox.attr('data-id');
        var content = $('#replyBox textarea').val().trim();

        if (!content) {
            iAlert('内容不能为空');
            return;
        }

        $.ajax({
            url: '/api/product/topic/' + topicId + '/comment',
            type: 'POST',
            dataType: 'json',
            data: {
                content: content
            },
            timeout: 15000,
            success: function(data) {
                console.log(data);
                if (data.r === 0) {
                    $replyBox.hide();
                    $replyBox.attr('data-id', '');
                    $('.replyBox textarea').val('');
                    iAlert('发送成功');
                    var temp = '<li><strong>' + data.comment.belongToUsername + '：</strong>' + data.comment.content + '</li>';
                    $('.commentList[data-topic-id=' + topicId + ']').prepend($(temp));
                }
            }
        });
    });

    // 取消回复
    $('#replyBox .cancelBtn').on('click', function(e) {
        $replyBox.hide();
        $replyBox.attr('data-id', '');
        return;
    });

    // 评论 - 更多
    $('body').on('click', '.topic .more', function() {
        $(this).parents('.topic').find('.commentList li.hide').removeClass('hide');
    });

    var $imageView = $('#imageView');
    var $largeImage = $('#largeImage');
    // 大图查看
    $('body').on('click', '.picList img', function() {
        var picUrl = $(this).attr('src');
        $largeImage.attr('src', picUrl);
        $imageView.show();
        var winH = $(window).height();
        var imgH = $largeImage.height();
        var top = (winH - imgH) / 2;
        $largeImage.css('margin-top', top + 'px');
    });

    $('#imageView .close').on('click', function() {
        $imageView.hide();
        $largeImage.attr('src', '');
    });

});