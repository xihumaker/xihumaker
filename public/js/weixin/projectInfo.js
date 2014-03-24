$(function() {

    /**
     * @method quitProject
     * 退出项目
     */
    function quitProject() {
        $.ajax({
            url: '/api/project/' + _id + '/quit',
            type: 'POST',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);

            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    }

    /**
     * @method joinProject
     * 加入项目
     */
    function joinProject() {
        $.ajax({
            url: '/api/project/' + _id + '/join',
            type: 'POST',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);

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
        if (hasLogin === 'true') {
            if (hasJoin === 'true') {
                $('#quit').click(quitProject);
            } else {
                $('#join').click(joinProject);
            }
        }
    }





});