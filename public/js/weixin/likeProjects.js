/**
 * 我点赞的项目
 */
define(function(require, exports, module) {

    var common = require('../common');

    var $loading = $('#loading').hide();
    var $projectList = $('#projectList');
    var $msgTip = $('#msgTip');


    $.ajax({
        url: '/api/user/' + userId + '/likes',
        type: 'GET',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);

        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });


});