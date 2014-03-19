var crypto = require('crypto');

module.exports = {

    /**
     * @method randomString
     * 产生一段随机字符串
     * Math.random() 返回0和1之间的伪随机数，可能为0，但总是小于1，[0,1)
     * Math.floor(x) 返回小于等于x的最大整数
     * @param  {Number} [size] 可选，产生的随机字符串的长度
     * @return {String} 一段随机字符串
     */
    randomString: function(size) {
        size = size || 6;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // 62个字符
            maxNum = chars.length,
            ret = '';
        while (size > 0) {
            ret += chars.charAt(Math.floor(Math.random() * maxNum));
            size--;
        }
        return ret;
    },

    isEmail: function(str) {
        if (!str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
            return false;
        }
        return true;
    },

    md5: function(text) {
        return crypto.createHash('md5').update(text).digest('hex');
    },

    convertDate: function(date) {
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





}