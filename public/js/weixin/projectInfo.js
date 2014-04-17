$(function() {

    // 将项目详细描述添加进DOM树中
    $('#description').append(he.decode(project.description));

    function findUserById(_id, succCall) {
        $.ajax({
            url: '/api/user/' + _id,
            type: 'GET',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                succCall(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    }

    if (r === '0') { // 项目加载成功
        var hasLogin = $('input').attr('data-hasLogin');
        var isMyProject = $('input').attr('data-isMyProject');
        var hasJoin = $('input').attr('data-hasJoin');
        var _id = $('input').attr('data-_id');
        var authorId = $('input').attr('data-authorId');
        var members = $('input').attr('data-members');

        findUserById(authorId, function(data) {
            if (data.r === 0) {
                $('#authorId').html('创始人：' + data.user.username);
            }
        })

        if ( !! members) {
            members = members.split(',');
            $('#teaminfo').append($('<p id="members">项目成员：</p>'));
            for (var i = 0; i < members.length; i++) {
                var id = members[i];

                findUserById(id, function(data) {
                    if (data.r === 0) {
                        $('#members').append($('<span> ' + data.user.username + ' </span>'));
                    }
                })
            }
        }
    }

    // 退出项目
    $('#quit').click(function() {
        var _id = $('input').attr('data-_id');
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

    // 加入项目
    $('#join').click(function() {
        var _id = $('input').attr('data-_id');
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


});