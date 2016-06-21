/**
 * Created by fengxiaofei on 2015/12/4.
 */
'use strict'
var remoteUrl = 'http://192.168.100.254/';
require.config({

    baseUrl: "../../shipping/",

    // alias libraries paths
    paths: {
        'jquery': remoteUrl + 'jquery/dist/jquery.min',
        'angular': remoteUrl + 'angular/angular',
        'uiRouter': remoteUrl + 'angular-ui-router/release/angular-ui-router.min',
        'angularAMD': remoteUrl + 'angularAMD/angularAMD.min',
        'ngload': remoteUrl + 'angularAMD/ngload.min',
        'blockUI': remoteUrl + 'angular-block-ui/dist/angular-block-ui.min',
        'bootstrap': remoteUrl + 'bootstrap/dist/js/bootstrap.min',
        'angular-sanitize': remoteUrl + 'angular-sanitize/angular-sanitize.min',
        'ui-bootstrap-tpls': remoteUrl + 'angular-bootstrap/ui-bootstrap-tpls',
        'moment': remoteUrl + 'moment/moment',
        'locale': remoteUrl + 'moment/locale/zh-cn',
        'datetimepicker': remoteUrl + 'angular-bootstrap-datetimepicker/src/js/datetimepicker',
        'summernote': remoteUrl + 'summernote/dist/summernote.min',
        'angular-summernote': remoteUrl + 'angular-summernote/dist/angular-summernote.min',
        'summernote-lang': remoteUrl + 'summernote/dist/lang/summernote-zh-CN.min',
        'fileinput': remoteUrl + 'fileinput/js/fileinput.min',
        'fileinput-lang': remoteUrl + 'fileinput/js/fileinput_locale_zh',
        'hls-core': '../common/js/hls/hls-core',
        'hls-util': '../common/js/hls/hls-util',
        'hls-ui': '../common/js/hls/hls-ui'
    },
    map: {
        '*': {
            'css': remoteUrl + 'require-css/css.js'
        }
    },
    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        "angular": {exports: "angular"},
        'angularAMD': ['angular'],
        'uiRouter': ["angular"],
        'ngLoad': ["angularAMD"],
        'ui-bootstrap-tpls': ['angular'],
        'angular-sanitize': ['angular'],
        'blockUI': ['angular',
            'css!' + remoteUrl + 'angular-block-ui/dist/angular-block-ui.css'],
        'bootstrap': ['jquery',
            'css!' + remoteUrl + 'bootstrap/dist/css/bootstrap.css',
            'css!' + remoteUrl + 'bootstrap/dist/css/bootstrap-theme.css',
            'css!' + remoteUrl + 'font-awesome/css/font-awesome.css',
            'css!../shipping/css/bootstrap-hls.css',],
        'summernote': ['bootstrap',
            'css!' + remoteUrl + 'summernote/dist/summernote.css'],
        'summernote-lang': ['summernote'],
        'angular-summernote': ['angular', 'summernote', 'summernote-lang'],
        'fileinput': ['bootstrap',
            'css!' + remoteUrl + 'fileinput/css/fileinput.min.css'],
        'fileinput-lang': ['fileinput'],
        'datetimepicker': [
            'css!' + remoteUrl + 'angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
        ],
        'hls-ui': ['hls-core',
            'css!../shipping/css/hls-ui.css'
        ],
        'hls-util': ['hls-ui']
    }
});

define(['angular', 'angularAMD', 'uiRouter', 'blockUI', 'bootstrap', 'ui-bootstrap-tpls', 'angular-sanitize',
    'hls-util',
    'css!../shipping/css/index.css', 'css!../common/css/hls.css'], function (angular, angularAMD, blockUI) {

    var app = angular.module("indexModule", ["ui.router", 'blockUI', 'ui.bootstrap', 'ngSanitize', 'hls.util']);

    app.controller('indexCtrl', ['$scope', '$timeout', '$ui', function ($scope, $timeout, $ui) {

        var map = new BMap.Map("allmap", {enableMapClick: false});            // 创建Map实例
        map.centerAndZoom("深圳", 15);
        map.enableScrollWheelZoom();                 //启用滚轮放大缩小


        $scope.goToCompany = function () {

            var address = new BMap.Point(113.945425, 22.563518);

            map.centerAndZoom(address, 15);
            var opts = {
                position: address,    // 指定文本标注所在的地理位置
            }
            var label = new BMap.Label("欢迎来到易联速递总部~", opts);  // 创建文本标注对象
            label.setStyle({
                color: "red",
                fontSize: "12px",
                height: "20px",
                lineHeight: "20px",
                fontWeight: "300",
                fontFamily: "微软雅黑"
            });
            map.addOverlay(label);
        }


        map.addEventListener("rightclick", function (e) {
            $ui.notify("点击坐标:" + e.point.lng + ", " + e.point.lat + "可以设置为加盟店的点在地图上显示");
        });

        $scope.address = "中国深圳市南山区朗山二号路3号互联易电商园";
        $scope.searchPoint = function () {
            //清空其他点
            map.clearOverlays();

            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上，并调整地图视野

            myGeo.getPoint($scope.address, function (point) {
                if (point) {
                    map.centerAndZoom(point, 16);
                    var marker = new BMap.Marker(point)
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                }
            }, "深圳市");
        }

        function getCenter() {
            var center = map.getCenter();
            $scope.$apply(function () {
                $scope.centerText = "中心点:" + center.lng + "," + center.lat;
            })
        }

        map.addEventListener("dragend", function () {
            getCenter();
        });

        $scope.setMark = function () {
            map.centerAndZoom("深圳", 15);
            var point1 = new BMap.Point(114.0429, 22.548248);
            addMarker(point1);
            var point2 = new BMap.Point(114.082066, 22.545911);
            addMarker(point2);
            var point3 = new BMap.Point(114.078473, 22.55993);
            addMarker(point3);
            var point4 = new BMap.Point(114.076389, 22.546646);
            addMarker(point4);
            var point5 = new BMap.Point(114.0641, 22.536431);
            addMarker(point5);

            addCustomMarker();

        }
        function addMarker(point) {  // 创建图标对象

            var marker = new BMap.Marker(point);  // 创建标注
            map.addOverlay(marker);               // 将标注添加到地图中
            //  marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

            marker.addEventListener("click", function () {
                openWindwo(point);
            });


        }

        function openWindwo(point) {

            var mypoint = new BMap.Point(114.063884, 22.547914);

            var distanceText = '距离我' + (map.getDistance(mypoint, point)).toFixed(2) + ' 米。';

            var sContent =
                "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>易联加盟商某某某</h4>" +
                "<img style='float:right;margin:4px' id='imgDemo' src='../img/icon/93myb.png' width='139' height='104' title='易联速递'/>" +
                "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" +
                " 物流信息点 地址，电话什么的\n" + distanceText +
                "</p>" +
                "</div>";


            var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point);      // 打开信息窗口

        }

        //我的位置
        function addCustomMarker() {
            var pt = new BMap.Point(114.063884, 22.547914);
            var myIcon = new BMap.Icon("../img/favicon.png", new BMap.Size(32, 32));
            var marker2 = new BMap.Marker(pt, {icon: myIcon});  // 创建标注
            map.addOverlay(marker2);              // 将标注添加到地图中
            marker2.setAnimation(BMAP_ANIMATION_BOUNCE);
        }

    }]);

// bootstrap
    return angularAMD.bootstrap(app);

});



