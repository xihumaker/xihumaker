define(function(require, exports, module) {

    var Util = window.Util = require('../../angel/util');
    var area = require('../../angel/area');

    // 头像
    if (user.headimgurl) {
        $('#headimgItem img').attr('src', user.headimgurl);
    }

    // 真实姓名
    $('#usernameItem').click(function() {
        $('#usernameSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#usernameSidebar .save').click(function() {
        user.username = $('#usernameSidebar input').val();
        $('#usernameItem .tiny.header').html(user.username);
        $('#usernameSidebar').sidebar('toggle');
    });

    // 手机号码
    $('#phoneItem').click(function() {
        $('#phoneSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#phoneSidebar .save').click(function() {
        user.phone = $('#phoneSidebar input').val();
        if (!Util.isPhone(user.phone)) {
            alert('请输入有效的手机号码');
            return;
        }
        $('#phoneItem .tiny.header').html(user.phone);
        $('#phoneSidebar').sidebar('toggle');
    });


    // 性别选择
    if (user.sex == 1) {
        $('#sexSidebar .item[data-value="1"]').addClass('active');
    } else if (user.sex == 2) {
        $('#sexSidebar .item[data-value="2"]').addClass('active');
    }
    $('#sexItem').click(function() {
        $('#sexSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });

    $('#sexSidebar').click(function() {
        $(this).sidebar('toggle');
    });

    $('#sexSidebar .item').click(function() {
        var value = this.getAttribute('data-value');
        user.sex = Number(value) || 0;
        $('#sexSidebar .item').removeClass('active');
        $(this).addClass('active');
        if (value == '1') {
            $('#sexItem .tiny.header').html('男');
        } else {
            $('#sexItem .tiny.header').html('女');
        }
    });

    // 生日
    $('#birthdayItem .tiny.header').html(Util.formatDate(new Date(user.birthday), "YYYY-MM-DD"));
    $('#birthdayItem').click(function() {
        $('#birthdaySidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
        var localBirthday = Util.formatDate(new Date(user.birthday), "YYYY-MM-DD");
        $('#birthdaySidebar input').val(localBirthday);
    });
    $('#birthdaySidebar .save').click(function() {
        var localBirthday = $('#birthdaySidebar input').val();
        user.birthday = (new Date(localBirthday)).getTime();
        $('#birthdayItem .tiny.header').html(localBirthday);
        $('#birthdaySidebar').sidebar('toggle');
    });

    // QQ
    $('#qqSidebar input').val(user.qq);
    $('#qqItem').click(function() {
        $('#qqSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#qqSidebar .save').click(function() {
        var val = $('#qqSidebar input').val();
        if (!Util.isNumber(Number(val))) {
            alert('请输入有效的QQ号码');
            return;
        }
        user.qq = val;
        $('#qqItem .tiny.header').html(user.qq);
        $('#qqSidebar').sidebar('toggle');
    });

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

    // 学校
    $('#schoolSidebar input').val(user.school);
    $('#schoolItem').click(function() {
        $('#schoolSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#schoolSidebar .save').click(function() {
        $('#schoolSidebar').sidebar('toggle');
        user.school = $('#schoolSidebar input').val();
        $('#schoolItem .tiny.header').html(user.school);
    });

    // 专业
    $('#professionSidebar input').val(user.profession);
    $('#professionItem').click(function() {
        $('#professionSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#professionSidebar .save').click(function() {
        $('#professionSidebar').sidebar('toggle');
        user.profession = $('#professionSidebar input').val();
        $('#professionItem .tiny.header').html(user.profession);
    });

    // 公司
    $('#companySidebar input').val(user.company);
    $('#companyItem').click(function() {
        $('#companySidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#companySidebar .save').click(function() {
        $('#companySidebar').sidebar('toggle');
        user.company = $('#companySidebar input').val();
        $('#companyItem .tiny.header').html(user.company);
    });

    // 岗位
    $('#jobSidebar input').val(user.job);
    $('#jobItem').click(function() {
        $('#jobSidebar').sidebar({
            overlay: true
        }).sidebar('toggle');
    });
    $('#jobSidebar .save').click(function() {
        $('#jobSidebar').sidebar('toggle');
        user.job = $('#jobSidebar input').val();
        $('#jobItem .tiny.header').html(user.job);
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
        $.ajax({
            url: '/api/user/' + user._id,
            type: 'PUT',
            data: user,
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    alert(data.msg);
                } else {
                    alert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });



});