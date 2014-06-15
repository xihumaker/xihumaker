/**
 * Web - 项目编辑
 * @author wanggan
 * @email 244098979@qq.com
 */
define(function(require, exports, module) {

    var iAlert = require('../angel/alert');

    var CONST = require('./const');
    var QINIU_Bucket_Name = CONST.QINIU_Bucket_Name;

    // 加载HTML decode库
    require('../lib/he');

    var um = UM.getEditor('myEditor');
    /* 获取编辑器内容 */
    // var html = um.getContent();
    // var txt = um.getContentTxt();

    /* 设置编辑器内容 */
    // um.setContent('要设置的编辑器内容.');
    um.setContent(he.decode(project.description));

    $('#industry').val(project.industry);
    $('#group').val(project.group);

    if ( !! project.coverUrl) { // 封面图片不为空
        $('#coverUrl').attr('src', project.coverUrl);
        $('#coverUrl').attr('width', '85%');
    }

    // 项目封面图片的上传
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
                $('#coverUrl').attr('src', sourceLink);
                $('#coverUrl').attr('width', '85%');
                $('#pickfiles').html('修改图片');
            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情
                console.log(errTip)
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

    var $title = $('#title');
    var $industry = $('#industry');
    var $group = $('#group');
    var $teamName = $('#teamName');
    var $teamProfile = $('#teamProfile');
    var $progress = $('#progress');
    var $coverUrl = $('#coverUrl');
    var $saveBtn = $('#saveBtn');

    $saveBtn.click(function() {
        var _id = project._id;
        var title = $title.val().trim();
        var description = um.getContent();
        var industry = Number($industry.val());
        var group = Number($group.val());
        var teamName = $teamName.val();
        var teamProfile = $teamProfile.val();
        var progress = Number($progress.val());
        var coverUrl = $coverUrl.attr('src');

        if (!title) {
            iAlert('项目标题不能为空');
            return;
        }
        if (title.length > 25) {
            iAlert('项目标题不能超过25个字');
            return;
        }
        if (Number(industry) === -1) {
            iAlert('行业选择不能为空');
            return;
        }
        if (Number(group) === -1) {
            iAlert('组别选择不能为空');
            return;
        }
        if (!teamName) {
            iAlert('项目队名不能为空');
            return;
        }
        $saveBtn.html('正在保存...');

        $.ajax({
            url: '/api/project/' + _id,
            type: 'PUT',
            data: {
                title: title,
                description: description,
                industry: industry,
                group: group,
                teamName: teamName,
                teamProfile: teamProfile,
                progress: progress,
                coverUrl: coverUrl
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('保存成功');
                    $saveBtn.html('保存修改');
                } else {
                    iAlert(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });


    // 江湖告急相关代码
    var $addOneTopic = $('#addOneTopic'),
        $projectTopic = $('#projectTopic');

    var $projectTopicList = $('#projectTopicList');

    // 添加一个江湖告急
    $addOneTopic.click(function(e) {
        var content = $projectTopic.val().trim();

        if (!content) {
            iAlert('不能为空');
            return;
        }

        $.ajax({
            url: '/api/project/' + project._id + '/topic',
            type: 'POST',
            data: {
                content: content
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    var topic = data.topic;
                    iAlert('添加成功');
                    $projectTopic.val('');
                    var index = $projectTopicList.find('p').length;
                    var temp = '<p data-id=' + topic._id + '>【' + (index + 1) + '】' + topic.content + '<a href="javascript:void(0);" class="deleteTopic">删除</a></p>';
                    $projectTopicList.append($(temp));
                } else {
                    iAlert(data.msg);
                }
            }
        });
    });

    // 查找项目的所有江湖告急
    $.ajax({
        url: '/api/project/' + project._id + '/topics',
        type: 'get',
        dataType: 'json',
        timeout: 15000,
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            if (data.r === 0) {
                var topics = data.topics,
                    len = topics.length,
                    topic,
                    temp;
                for (var i = 0; i < len; i++) {
                    topic = topics[i];
                    temp = '<p data-id=' + topic._id + '>【' + (i + 1) + '】' + topic.content + '<a href="javascript:void(0);" class="deleteTopic">删除</a></p>';
                    $projectTopicList.append($(temp));
                }
            }
        }
    });

    // 删除某条江湖告急
    $projectTopicList.on('click', '.deleteTopic', function() {
        var _this = this;
        var projectTopicId = $(this).parent().attr('data-id');
        var projectId = project._id;

        $.ajax({
            url: '/api/project/' + projectId + '/topic/' + projectTopicId,
            type: 'delete',
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('删除成功');
                    $(_this).parent().remove();
                }
            }
        });
    });






});