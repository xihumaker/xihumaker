define(function(require) {

    "use strict";

    var iAlert = require('../../angel/alert');

    var $searchKey = $('#searchKey');
    var $searchBtn = $('#searchBtn');
    var $industry = $('#industry');
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
        var index = $('#productList .product').length;
        var temp;
        if (global.hasLogin) {
            temp = '<a href="/weixin/product/' + product._id + '" class="ui fluid green button product">' + product.name + ' ' + product.topicNum + '</a>';
        } else {
            temp = '<a href="/weixin/login?returnUrl=/weixin/product/' + product._id + '" class="ui fluid green button product">' + product.name + ' ' + product.topicNum + '</a>';
        }
        $productList.append($(temp));
    }

    function render(products) {
        for (var i = 0; i < products.length; i++) {
            renderOne(products[i]);
        }
    }

    function resetPage() {
        searchConfig.pageStart = 0;
        searchConfig.key = undefined;
        searchConfig.industry = undefined;
        $('#productList .product').remove();
        $loadMore.hide();
        $loadMore.html('下一页');
    }

    var searchConfig = {
        pageSize: 18,
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
            console.log(data);
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
                    $loadMore.html('下一页');
                    searchConfig.pageStart += len;
                }
            } else {
                iAlert(data.msg);
            }
        });
    });

    // 行业选择改变时
    $('.ui.dropdown').dropdown({
        on: 'hover',
        onChange: function(value, text) {
            resetPage();
            $searchKey.val('');
            if (value !== -1) {
                searchConfig.industry = value;
            }

            findProductsByPage(searchConfig, function(data) {
                console.log(data);
                if (data.r === 0) {
                    var products = data.products;
                    var len = products.length;

                    if (len === 0) {
                        iAlert('查询结果为空');
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
        }
    });

    // 搜索
    $searchBtn.on('click', function() {
        var key = $searchKey.val().trim();
        var industry = $industry.val();

        if (!key) {
            iAlert('请输入关键字');
            return;
        } else {
            resetPage();
            searchConfig.key = key;
            if (industry !== '-1') {
                searchConfig.industry = industry;
            }
        }

        findProductsByPage(searchConfig, function(data) {
            console.log(data);
            if (data.r === 0) {
                var products = data.products;
                var len = products.length;

                if (len === 0) {
                    iAlert('查询结果为空');
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
    });

});