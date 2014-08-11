define(function(require) {

    "use strict";
    var iAlert = require('../../angel/alert');
    var Util = window.Util = require('../../angel/util');
    var area = require('../../angel/area');
    var CONST = require('../const');
    var QINIU_Bucket_Name = CONST.QINIU_Bucket_Name;

    $('.ui.accordion').accordion();

    // 头像
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: '/qiniuUptoken',
        // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://' + QINIU_Bucket_Name + '.qiniudn.com/',
        container: 'headimgItem',
        max_file_size: '4mb',
        flash_swf_url: '../plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'headimgItem',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {

                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
                $('.mask').show();
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                $('.mask span').html(file.percent);
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var sourceLink = domain + res.key;
                console.log(sourceLink);

                $('.mask').hide();
                $('#headimgurl').attr('src', sourceLink);

            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情

            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情

            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效

                var key = "";
                // do something with key here
                return key
            }
        }
    });


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