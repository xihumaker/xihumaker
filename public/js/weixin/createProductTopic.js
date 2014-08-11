define(function(require) {

    var CONST = require('../const');
    var QINIU_Bucket_Name = CONST.QINIU_Bucket_Name;

    var iAlert = require('../../angel/alert');

    var $picList = $('#picList');
    var $content = $('#content');
    var $sendBtn = $('#sendBtn');

    var href = window.location.href;
    var params = href.split("?")[1].split('&');
    var belongToProductId = params[0].split('=')[1];
    var whichWorld = Number(params[1].split('=')[1]) || 0;

    var addedNum = 0; // 记录添加的图片个数
    var finishedNum = 0; // 记录已经完成上传的图片个数

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: '/qiniuUptoken',
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
                addedNum += files.length;
                plupload.each(files, function(file) {
                    var temp = '<li>' +
                        '<span>0%</span>' +
                        '<img src="" width="62" height="56" data-file-id="' + file.id + '">' +
                        '<a href="javascript:void(0);" class="close"></a>' +
                        '</li>';

                    $picList.append($(temp));
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情

            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                $('img[data-file-id="' + file.id + '"]').siblings('span').html(file.percent + '%');
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                finishedNum += 1;
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var sourceLink = domain + res.key;
                console.log(sourceLink);

                $('img[data-file-id="' + file.id + '"]').attr('src', sourceLink);
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

    $picList.on('click', '.close', function() {
        $(this).parents('li').remove();
        $('.large.button').show();
    });

    $('#content').on('keyup', function(e) {
        var len = $(this).val().length;
        if (len === 0) {
            $sendBtn.addClass('disabled');
        } else {
            $sendBtn.removeClass('disabled');
        }
    });

    $sendBtn.on('click', function() {
        if ($sendBtn.hasClass('disabled')) {
            return;
        }
        var content = $content.val().trim();
        var picList = []; // 存放图片地址数组

        if (content.length < 10) {
            iAlert('内容过短');
            return;
        } else {
            if (addedNum !== finishedNum) {
                iAlert('图片上传中...');
                return;
            }
            var imgList = $picList.find('img');
            var src = '';
            for (var i = 0; i < imgList.length; i++) {
                src = imgList[i].src;
                picList.push(src);
            }

            var data = {
                whichWorld: whichWorld,
                content: content
            }

            if (picList.length !== 0) {
                data.picList = picList;
            }

            $.ajax({
                url: '/api/product/' + belongToProductId + '/topic',
                type: 'POST',
                dataType: 'json',
                data: data,
                timeout: 15000,
                success: function(data) {
                    console.log(data);
                    if (data.r === 0) {
                        iAlert('发送成功');
                        setTimeout(function() {
                            window.history.back();
                        }, 1000);
                    } else {
                        iAlert(data.msg);
                    }
                }
            });

        }
    })

});