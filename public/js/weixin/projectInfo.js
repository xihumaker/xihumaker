$(function() {

    var $join = $('#join');

    $join.click(function() {

        var _id = project._id;

        $.ajax({
            url: '/api/project/' + _id + '/join',
            type: 'POST',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                alert(data.msg);
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });

    });





});