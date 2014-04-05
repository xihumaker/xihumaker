define(function(require, exports, module) {


    // 底部导航栏，选中时添加active样式
    var href = window.location.href;
    if (/index/.test(href)) {
        $('#footernav #index').addClass('active');
    } else if (/projects/.test(href)) {
        $('#footernav #projects').addClass('active');
    } else if (/events/.test(href)) {
        $('#footernav #events').addClass('active');
    } else if (/user/.test(href)) {
        $('#footernav #me').addClass('active');
    } else if (/weikecheng/.test(href)) {
        $('#footernav #weikecheng').addClass('active');
    }

});