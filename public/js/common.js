define(function(require, exports, module) {

    var common = {};

    common.convertProgress = function(val) {
        if (val < 10) {
            return 'idea';
        } else if (val >= 10 && val < 20) {
            return '招兵买马';
        } else if (val >= 20 && val < 60) {
            return '火热施工';
        } else if (val >= 60 && val < 80) {
            return '初露曙光';
        } else if (val >= 80 && val <= 99) {
            return '冲刺';
        } else if (val === 100) {
            return '胜利';
        } else {
            return '未知';
        }
    }


    module.exports = common;

});