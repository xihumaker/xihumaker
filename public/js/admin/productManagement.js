/**
 * 产品乌托邦管理
 */
"use strict";
define(function(require) {

    var iAlert = require('../../angel/alert');

    var CONST = require("../const");
    var INDUSTRY_LIST = CONST.INDUSTRY_LIST;

    var $productList = $('#productList');
    var $loadMore = $('#loadMore');

    function findProductsByPage(config, succCall, failCall) {
        failCall = failCall || function() {
            console.log('>>> LOG >>> findProductsByPage: Default failCall callback invoked.');
        };
        $.ajax({
            url: '/api/products',
            type: 'GET',
            data: config,
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                succCall(data);
            },
            error: function() {
                failCall();
            }
        });
    }

    function renderOne(product) {
        var index = $('#productList tr').length;
        var temp = '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td>' + product._id + '</td>' +
            '<td>' + product.name + '</td>' +
            '<td>' + INDUSTRY_LIST[product.industry] + '</td>' +
            '<td>' + product.topicNum + '</td>' +
            '<td>' + new Date(product.lastActionTime).toLocaleString() + '</td>' +
            '<td>' + new Date(product.createTime).toLocaleString() + '</td>' +
            '<td>' +
            '<div class="ui mini red button delete" title="删除" data-id="' + product._id + '"><i class="trash icon"></i>删除</div>' +
            '<a class="ui mini blue button" title="编辑" href="/admin/product/' + product._id + '/edit"><i class="edit icon"></i>编辑</a>' +
            '</td>' +
            '</tr>';
        $productList.append($(temp));
    }

    function render(products) {
        for (var i = 0; i < products.length; i++) {
            renderOne(products[i]);
        }
    }

    var searchConfig = {
        pageSize: 12,
        pageStart: 0
    };

    // 默认加载
    findProductsByPage(searchConfig, function(data) {
        console.log(data);
        if (data.r === 0) {
            var products = data.products;
            var len = products.length;

            if (len === 0) {

            } else if (len < searchConfig.pageSize) {
                render(products);
                searchConfig.pageStart += len;
            } else if (len === searchConfig.pageSize) {
                render(products);
                searchConfig.pageStart += len;
                $loadMore.show();
            }
        } else {
            iAlert(data.msg);
        }
    });

    // 点击“加载更多”
    $loadMore.click(function() {
        $loadMore.html('正在加载...');

        findProductsByPage(searchConfig, function(data) {
            if (data.r === 0) {
                var products = data.products;
                var len = products.length;

                if (len === 0) {
                    $loadMore.html('无更多产品');
                } else if (len < searchConfig.pageSize) {
                    render(products);
                    $loadMore.html('无更多产品');
                    searchConfig.pageStart += len;
                } else if (len === searchConfig.pageSize) {
                    render(products);
                    $loadMore.html('加载更多');
                    searchConfig.pageStart += len;
                }
            } else {
                iAlert(data.msg);
            }
        });
    });

    // 删除
    $('body').on('click', '.delete', function() {
        var self = this;
        var _id = this.getAttribute('data-id');

        if (confirm('你确定要删除这个产品吗？')) {
            $.ajax({
                url: '/api/product/' + _id,
                type: 'DELETE',
                timeout: 15000,
                success: function(data) {
                    console.log(data);
                    if (data.r === 0) {
                        $(self).parents('tr').remove();
                        iAlert('删除成功');
                    } else {
                        iAlert(data.msg);
                    }
                }
            });
        }
    });



});