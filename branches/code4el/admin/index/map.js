/**
 * Created by fengxiaofei on 2015/12/4.
 */

var params = getParam();
var merchant = {}; //加盟商对象
var map; //地图对象
var myGeo;//地图搜索器
var poi = {}; //加盟商地址在地图上的位置

function getParam() {
    var result = null;
    var href = window.location.href;
    var dx = href.indexOf("?");
    if (dx > -1) {
        var temUrl = href.substring(dx + 1, href.length);
        if (temUrl.indexOf("&") > 0) {
            var args = temUrl.split('&');
            for (var i in args) {
                var kv = args[i].split('=');
                if (kv.length > 1) {
                    if (result == null) {
                        result = {};
                    }
                    result[kv[0]] = kv[1];
                }
            }
        } else {
            var kv = temUrl.split('=');
            if (kv.length > 1) {
                if (result == null) {
                    result = {};
                }
                result[kv[0]] = kv[1];
            }
        }
    }
    return result;
}

function searchPoint() {
    //清空其他点
    map.clearOverlays();
    // 将地址解析结果显示在地图上，并调整地图视野

    myGeo.getPoint($("#searchText").val(), function (point) {
        if (point) {
            map.centerAndZoom(point, 16);
            var marker = new BMap.Marker(point)
            marker.enableDragging();

            marker.addEventListener("dblclick", function () {
                poi = marker.point;
                openWindow();
            });

            marker.addEventListener("dragstart", function () {
                map.closeInfoWindow();
            })

            map.addOverlay(marker);
        }
    }, "深圳市");
}

function getAddress(merchant) {
    var address = "";
    if (merchant.district && merchant.district.cn) {
        for (var i in merchant.district.cn) {
            address += merchant.district.cn[i] + " ";
        }
    }
    address += merchant.address;
    return address;
}

function openWindow() {
    var conten =
        '<div style="width: 350px;" class="col-md-12">'
        + ' <dt class="pv-10">公司名称:</dt>'
        + ' <dd>' + merchant.name + '</dd>'
        + ' <dt class="pv-10">联系电话:</dt>'
        + ' <dd>' + merchant.telephone + '</dd>'
        + ' <dt class="pv-10">联系地址:</dt>'
        + ' <dd>' + getAddress(merchant) + '</dd>'
        + '<div class="row pv-15 text-center">   '
        + ' <input id="submitBtn" type="button" class="btn btn-info" onclick="submit()" map-btn  value="设置加盟点" />'
        + '</div>'
        + '</div>';
    var infoWindow = new BMap.InfoWindow(conten, {offset: new BMap.Size(0, -10)});  // 创建信息窗口对象
    map.openInfoWindow(infoWindow, poi);      // 打开信息窗口
}

function closeWindow() {
    var result = confirm("确认关闭当前页面？");
    if (result) {
        window.close();
    }
}

function changeAddress() {
    var address = $("#txtAddress").val();
    $.post('/api/?model=merchant&action=edit&id=' + params.key,
        {
            address: address
        }
        , function (result) {
            result = eval("(" + result + ")");
            if (result.success) {
                getInfo();
                alert("保存成功");
                $("#addressModal").modal("hide");
            } else {
                alert(result.error);
            }
        })
}

function submit() {
    $.post('/api/?model=merchant&action=edit&id=' + params.key,
        {
            "lng": poi.lng,
            "lat": poi.lat
        }
        , function (result) {
            result = eval("(" + result + ")");
            if (result.success) {
                alert("设置成功");
                map.closeInfoWindow();
            } else {
                alert(result.error);
            }
        })
}

function getInfo() {
    $.get('/api/?model=merchant&action=get_byid&id=' + params.key, function (result) {
        var data = eval("(" + result + ")");
        if (data.success) {
            merchant = data.data;
            setHtml();
        }
    });
}

function setHtml() {
    var html = "";
    if (params.tp == "personal") {
        html =
            '<dt class="pv-10">姓名:</dt>'
            + '<dd>' + merchant.name + '</dd>'
            + '<dt class="pv-10">联系电话:</dt>'
            + '<dd>' + merchant.telephone + '</dd>'
            + '<dt class="pv-10">联系地址:</dt>'
            + '<dd>' + getAddress(merchant) + '</dd>';
    } else {
        html =
            '<dt class="pv-10">公司名称:</dt>'
            + '<dd>' + merchant.name + '</dd>'
            + '<dt class="pv-10">申请人:</dt>'
            + '<dd>' + merchant.applyUser + '</dd>'
            + '<dt class="pv-10">申请人职位:</dt>'
            + '<dd>' + merchant.applyUserOffice + '</dd>'
            + '<dt class="pv-10">联系电话:</dt>'
            + '<dd>' + merchant.telephone + '</dd>'
            + '<dt class="pv-10">成立时间:</dt>'
            + '<dd>' + merchant.CompanyTime + '</dd>'
            + '<dt class="pv-10">联系地址:</dt>'
            + '<dd>' + getAddress(merchant) + '</dd>';
    }
    $("#info").html(html);
    $("#searchText").val(getAddress(merchant));
    $("#txtAddress").val(getAddress(merchant));

    setTimeout(searchPoint, 500);

}


$(function () {

    $("#mapdiv").width($("#rightDiv").width());
    var h = $(document).height() - $("#topDiv").height() - 45;
    $("#mapdiv").height(h);

    map = new BMap.Map("mapdiv");            // 创建Map实例
    map.centerAndZoom("深圳", 15);
    map.enableScrollWheelZoom();                 //启用滚轮放大缩小
    // 创建地址解析器实例
    myGeo = new BMap.Geocoder();
    getInfo();

    $("#btnChangeAddress").click(function () {
        $("#addressModal").modal("toggle");
    });
})



