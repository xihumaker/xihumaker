"use strict";
var uyan = require('./uyan');

uyan.des({
    uid: '539d8e47c4ce46480dd4e9b7',
    uname: 'wanggan',
    email: '244098979@qq.com',
    uface: 'http://xihumaker.jios.org/img/face.png',
    ulink: 'http://xihumaker.jios.org/user/wanggan'
}, 3600, 'weitang', function(data) {
    console.log(data);
});