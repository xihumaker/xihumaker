define(function(require) {

    "use strict";
    var iAlert = require('../../angel/alert');
    var Util = window.Util = require('../../angel/util');
    var area = require('../../angel/area');

    $('.ui.accordion').accordion();

    // 头像

    // 生日
    $('#birthday').val(Util.formatDate(new Date(user.birthday), "YYYY-MM-DD"));

    // 我的收货地址
    $('#inAddressSidebar input').val(user.inAddress);
    $('#inAddressItem').click(function() {
        $('#inAddressSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#inAddressSidebar .save').click(function() {
        var val = $('#inAddressSidebar input').val();
        user.inAddress = val;
        $('#inAddressSidebar').sidebar('toggle');
    });

    // 地区
    $('#provinceSelect').val(user.province);
    var citys = area[user.province];
    var city;
    if (citys) {
        for (var i = 0; i < citys.length; i++) {
            city = citys[i];
            $('#citySelect').append($('<option value=' + city + '>' + city + '</option>'));
        }
    }

    $('#citySelect').val(user.city);
    $('#areaItem').click(function() {
        $('#areaSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#areaSidebar .save').click(function() {
        user.province = $('#provinceSelect').val();
        user.city = $('#citySelect').val();

        if (user.province != '0') {
            $('#areaItem .tiny.header').html(user.province + ' ' + user.city);
        } else {
            $('#areaItem .tiny.header').html('');
        }

        $('#areaSidebar').sidebar('toggle');
    });

    $('#provinceSelect').on('change', function() {
        $('#citySelect option').remove();
        var val = this.value;
        var citys = area[val];
        var city;

        if (!citys) {
            $('#citySelect').append($('<option value="0">请选择</option>'));
        } else {
            for (var i = 0; i < citys.length; i++) {
                city = citys[i];
                $('#citySelect').append($('<option value=' + city + '>' + city + '</option>'));
            }
        }
    });

    // 感兴趣的行业
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        for (var i = index; i < this.length - 1; i++) {
            this[i] = this[i + 1];
        }
        this.pop();
    };

    for (var i = 0; i < user.interest.length; i++) {
        var name = user.interest[i];
        $('#interestSidebar input[name="' + name + '"]').attr('checked', true);
    }
    $('#interestItem').click(function() {
        $('#interestSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#interestSidebar .save').click(function() {
        $('#interestSidebar').sidebar('toggle');
    });
    $('#interestSidebar .ui.checkbox').checkbox({
        onEnable: function() {
            var name = this[0].name;
            user.interest.push(name);
        },
        onDisable: function() {
            var name = this[0].name;
            user.interest.remove(name);
        }
    });

    // 已工作与在读学生的切换
    $('#workOrStudyField .ui.checkbox').checkbox({
        onChange: function() {
            if (this[0].id == 'haswork') {
                user.workOrStudy = 1;
                $('#hasworkField').show();
                $('#studentField').hide();
            } else {
                user.workOrStudy = 2;
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

    // 保存修改
    $('#saveUpdate').click(function() {
        var headimgurl = $('#headimgurl').attr('src');
        var phone = $('#phone').html().trim();
        var sex = Number($('#sex').val());
        var birthday = new Date($('#birthday').val()).getTime();
        var qq = $('#qq').html().trim();
        var province = user.province;
        var city = user.city;
        var inAddress = user.inAddress;
        var interest = user.interest;
        var school = $('#school').html().trim();
        var profession = $('#profession').html().trim();
        var company = $('#company').html().trim();
        var job = $('#job').html().trim();

        $.ajax({
            url: '/api/user/update',
            type: 'POST',
            data: {
                headimgurl: headimgurl,
                phone: phone,
                sex: sex,
                birthday: birthday,
                qq: qq,
                province: province,
                city: city,
                inAddress: inAddress,
                interest: interest,
                workOrStudy: user.workOrStudy,
                school: school,
                profession: profession,
                company: company,
                job: job
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert(data.msg);
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });



});