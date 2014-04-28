/**
 * iAlert组件
 */
define(function(require, exports, module) {
    module.exports = function(str) {
        var $alert = $('<div>');
        $alert.html(str);
        $alert.css({
            'padding': '15px 25px',
            'position': 'fixed',
            'left': '50%',
            'top': '50%',
            'background': '#000',
            'margin-top': '-50px',
            'color': '#fff',
            'opacity': '0.75',
            'border-radius': '5px',
            'font-size': '16px'
        });
        $('body').append($alert);
        $alert.css({
            'margin-left': -($alert.width() / 2 + 25) + 'px'
        });
        setTimeout(function() {
            $alert.remove();
        }, 1000);
    }
});