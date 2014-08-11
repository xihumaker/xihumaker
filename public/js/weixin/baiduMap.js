$(function() {

    var map = new BMap.Map("l-map");
    var centerPoint = new BMap.Point(120.1769, 30.19078);
    var centerIcon = new BMap.Icon("/img/x_star.png", new BMap.Size(32, 32));
    var userIcon = new BMap.Icon("/img/location.gif", new BMap.Size(14, 23))

    map.centerAndZoom(centerPoint, 11);

    // 添加总部标注
    var centerMarker = new BMap.Marker(centerPoint, {
        icon: centerIcon
    });
    map.addOverlay(centerMarker);
    centerMarker.addEventListener('click', function() {
        var opts = {
            width: 160,
            title: "西湖创客汇"
        };
        var infoWindow = new BMap.InfoWindow("地址：杭州市滨江区诚业路江南大道口长健大厦10层", opts);
        map.openInfoWindow(infoWindow, centerMarker.getPosition());
    });


    // 添加用户标注
    function addUserMarker(config) {
        var point = new BMap.Point(config.longitude, config.latitude);
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        marker.addEventListener('click', function() {
            var opts = {

            };
            var content = '<div>' +
                '<img width="50" src="' + config.headimgurl + '" style="float:left;margin-right:8px;" />' +
                '<span>' + config.nickname + '<br/>' + config.province + ' ' + config.city + '</span>' +
                '</div>';
            var infoWindow = new BMap.InfoWindow(content, opts);
            map.openInfoWindow(infoWindow, marker.getPosition());
        });
    }

    function findAllMembers() {
        $.ajax({
            url: '/api/members/all',
            type: 'GET',
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                if (data.r === 0) {
                    console.log(data);
                    var members = data.members;
                    var len = members.length;
                    for (var i = 0; i < len; i++) {
                        addUserMarker(members[i]);
                    }
                }
            }
        });
    }

    findAllMembers();

});