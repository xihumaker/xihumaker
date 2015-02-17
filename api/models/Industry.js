"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IndustrySchema = new Schema({
    code: Number,
    name: String,
    createTime: {
        type: Number,
        default: Date.now
    },
    updateTime: {
        type: Number,
        default: Date.now
    }
});

module.exports = mongoose.model('Industry', IndustrySchema, 'ck_industry');
