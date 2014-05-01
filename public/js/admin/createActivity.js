/**
 * 创建活动
 */
define(function(require, exports, module) {

    var Util = require('../../angel/util');
    var iAlert = require('../../angel/alert');

    var CONST = require('../const');
    var QINIU_Bucket_Name = CONST.QINIU_Bucket_Name;

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: '/qiniuUptoken',
        // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://' + QINIU_Bucket_Name + '.qiniudn.com/',
        container: 'pickfilesContainer',
        max_file_size: '4mb',
        flash_swf_url: '../plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'pickfilesContainer',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {

                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情

            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                $('#pickfiles').html('正在上传' + file.percent + '%');
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

                $('#coverUrl').attr('width', '100%');
                $('#coverUrl').attr('src', sourceLink);
                $('#pickfiles').html('修改图片');
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

    var $topic = $('#topic'); // 活动主题输入框
    var $activityDate = $('#activityDate'); // 活动日期
    var $meetingTime = $('#meetingTime'); // 集合时间
    var $organizer = $('#organizer'); // 发起人
    var $city = $('#city'); // 城市
    var $location = $('#location'); // 地点
    var $limit = $('#limit'); // 名额
    var $coverUrl = $('#coverUrl'); // 活动封面图片地址
    var $createBtn = $('#createBtn'); // 确认新建按钮

    // 设置活动日期与集合时间默认值
    var nowDate = Util.formatDate(new Date(), 'YYYY-MM-DD');
    $activityDate.val(nowDate);
    $meetingTime.val('09:00');

    $createBtn.click(function(e) {
        var topic = $topic.val().trim(),
            activityDate = $activityDate.val(),
            meetingTime = $meetingTime.val(),
            organizer = $organizer.val().trim(),
            city = $city.val().trim(),
            location = $location.val().trim(),
            limit = Number($limit.val()) || 0,
            coverUrl = $coverUrl.attr('src'),
            description = um.getContent();

        if (!topic) {
            iAlert('活动主题不能为空');
            return;
        }
        if (!activityDate) {
            iAlert('活动日期不能为空');
            return;
        }
        if (!meetingTime) {
            iAlert('集合时间不能为空');
            return;
        }
        if (!organizer) {
            iAlert('发起人不能为空');
            return;
        }
        if (!city) {
            iAlert('城市不能为空');
            return;
        }
        if (!location) {
            iAlert('地点不能为空');
            return;
        }

        $.ajax({
            url: '/api/activity',
            type: 'POST',
            data: {
                activityDate: activityDate,
                meetingTime: meetingTime,
                topic: topic,
                organizer: organizer,
                city: city,
                location: location,
                limit: limit,
                description: description,
                coverUrl: coverUrl
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    if (confirm("新建活动成功，继续创建活动？")) { // 继续创建活动
                        window.location.reload();
                    } else {
                        window.location.href = '/admin/activityManagement';
                    }
                } else {
                    iAlert(data.msg);
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // 搜索条件改变时
    $('.ui.dropdown').dropdown({
        on: 'click',
        onChange: function(value, text) {

        }
    });


});