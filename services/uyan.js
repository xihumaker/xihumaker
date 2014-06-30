"use strict";
var request = require('request');

var UYAN_API_URL = "http://api.uyan.cc";
var COOKIE_MAX_AGE = 120 * 24 * 60 * 60 * 60;

module.exports = {

    /**
     * @method des
     * 友言加密
     */
    des: function(user, expire, key, callback) {
        var uid = user.uid;
        var uname = user.uname;
        var email = user.email;
        var uface = user.uface;
        var ulink = user.ulink;

        var url = UYAN_API_URL + "?mode=des&uid=" + uid + "&uname=" + encodeURI(uname);
        if ( !! email) {
            url += "&email=" + encodeURI(email);
        }
        if ( !! uface) {
            url += "&uface=" + encodeURI(uface);
        }
        if ( !! ulink) {
            url += "&ulink=" + encodeURI(ulink);
        }
        if ( !! expire) {
            url += "&expire=" + expire;
        }
        url += "&key=" + encodeURI(key);

        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            }
        });
    },

    login: function(req, res, user, callback) {
        this.des(user, "360000", "www.xihumaker.com", function(data) {
            console.log(data);
            res.cookie('syncuyan', data, {
                maxAge: COOKIE_MAX_AGE,
                path: '/',
                domain: 'xihumaker.jios.org'
            });
            callback();
        });
    },

    logout: function(req, res, callback) {
        res.clearCookie('syncuyan', {
            path: '/'
        });
        // res.cookie('syncuyan', 'logout', {
        //     path: '/',
        //     maxAge: COOKIE_MAX_AGE,
        //     domain: ''
        // });
        callback();
    }


};