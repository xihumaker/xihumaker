define(function(require, exports, module) {

    var CONST = require('../const');
    var QINIU_Bucket_Name = CONST.QINIU_Bucket_Name;

    var iAlert = require('../../angel/alert');

    // 加载HTML decode库
    require('../../lib/he');

    var um = UM.getEditor('myEditor');
    um.setContent(he.decode(vip.content));

    var $create = $('#create');
    var $title = $('#title');
    var $name = $('#name');

    var newVip = {
        _id: vip._id,
        name: vip.name,
        content: vip.content,
        title: vip.title,
        headimgurl: vip.headimgurl
    };

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

                newVip.headimgurl = sourceLink;
                $('#headimgurl').attr('width', '50%');
                $('#headimgurl').attr('src', sourceLink);
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

    $create.click(function() {
        newVip.name = $name.val().trim();
        newVip.title = $title.val().trim();
        newVip.content = um.getContent();

        if (!newVip.title) {
            alert('标题不能为空');
            return;
        }
        if (newVip.title.length > 14) {
            alert('标题不能超过14个字');
            return;
        }
        if (!newVip.name) {
            alert('会员秀姓名不能为空');
            return;
        }
        if (!newVip.headimgurl) {
            alert('会员秀头像不能为空');
            return;
        }

        $.ajax({
            url: '/api/vip/' + newVip._id,
            type: 'PUT',
            data: newVip,
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data.r === 0) {
                    iAlert('修改成功');
                } else {

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });


    });




});