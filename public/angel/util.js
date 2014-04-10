define(function(require, exports, module) {

    var Util = {

    };

    /**
     * @method isPhone
     * 判断是否是手机号码
     */
    Util.isPhone = function(val) {
        if (!/^(((13[0-9]{1})|159|180|181|186|(15[0-9]{1}))+\d{8})$/.test(val)) {
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


    module.exports = Util;


});