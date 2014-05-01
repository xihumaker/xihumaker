define(function(require, exports, module) {

    var Util = {

    };

    /**
     * @method isPhone
     * 判断是否是手机号码
     */
    Util.isPhone = function(val) {
        if (!/^(((13[0-9]{1})|159|180|181|186|189|(15[0-9]{1}))+\d{8})$/.test(val)) {
            return false;
        } else {
            return true;
        }
    }

    Util.pad = function(c, n, s) {
        var m = n - String(s).length;
        return (m < 1) ? s : new Array(m + 1).join(c) + s;
    }

    Util.formatDate = function(date, format) {
        return format.replace(/YYYY|YY|MM|DD|hh|mm|ss/g, function(a) {
            switch (a) {
                case 'YYYY':
                    return date.getFullYear();
                case 'YY':
                    return (date.getFullYear() + '').slice(2);
                case 'MM':
                    return Util.pad('0', 2, date.getMonth() + 1);
                case 'DD':
                    return Util.pad('0', 2, date.getDate());
                case 'hh':
                    return Util.pad('0', 2, date.getHours());
                case 'mm':
                    return Util.pad('0', 2, date.getMinutes());
                case 'ss':
                    return Util.pad('0', 2, date.getSeconds());
            }
        });
    }

    Util.isNumber = function(val) {
        return Object.prototype.toString.call(val) == "[object Number]";
    }

    Util.isEmail = function(str) {
        if (!str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
            return false;
        }
        return true;
    }

    Util.convertDate = function(date) {
        var ONE_MINUTE_MILLISECONDS = 1 * 60 * 1000,
            ONE_HOUR_MILLISECONDS = ONE_MINUTE_MILLISECONDS * 60,
            ONE_DAY_MILLISECONDS = ONE_HOUR_MILLISECONDS * 24;

        var currentMilliseconds = (new Date()).getTime(),
            difference = currentMilliseconds - date;

        if (difference < ONE_MINUTE_MILLISECONDS) {
            return parseInt(difference / 1000) + "秒前";
        }
        for (var i = 1; i < 60; i++) {
            if (difference < ONE_MINUTE_MILLISECONDS * i) {
                return i + "分钟前";
            }
        }
        for (var j = 1; j < 24; j++) {
            if (difference < ONE_HOUR_MILLISECONDS * j) {
                return j + "小时前";
            }
        }
        for (var k = 1; k < 30; k++) {
            if (difference < ONE_DAY_MILLISECONDS * k) {
                return k + "天前";
            }
        }
        return (new Date(date)).toLocaleDateString();
    }


    module.exports = Util;


});