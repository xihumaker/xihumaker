define(function(require, exports, module) {

    $('.ui.checkbox').checkbox({
        onChange: function() {
            if (this[0].id == 'haswork') {
                $('#hasworkField').show();
                $('#studentField').hide();
            } else {
                $('#studentField').show();
                $('#hasworkField').hide();
            }
        }
    });

    if (workOrStudy == '1') {
        $('#hasworkField').show();
        $('#studentField').hide();
        $('#haswork').attr('checked', true)
    } else {
        $('#studentField').show();
        $('#hasworkField').hide();
        $('#student').attr('checked', true)
    }


    $('.ui.dropdown').dropdown({
        on: 'click',
    });

    // 性别选择
    $('#sexItem').click(function() {
        $('#sexField').sidebar({
            overlay: true
        }).sidebar('toggle');
    });

    $('#sexField').click(function() {
        $('#sexField').sidebar('toggle');
    });

    $('#sexField .item').click(function() {
        var value = this.getAttribute('data-value');
        user.sex = Number(value) || 0;
        $('#sexField .item').removeClass('active');
        $(this).addClass('active');
        if (value == '1') {
            $('#sexItem .tiny.header').html('男');
        } else {
            $('#sexItem .tiny.header').html('女');
        }
    });

});