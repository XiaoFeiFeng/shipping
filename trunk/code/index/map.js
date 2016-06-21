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

    app.controller('indexCtrl', ['$scope', '$timeout', '$ui', '$request', '$data', function ($scope, $timeout, $ui, $request, $data) {

        $(function () {
            $("#mapdiv").height($(document).height() - 35);

            $scope.map = new BMap.Map("mapdiv", {enableMapClick: false});            // 创建Map实例
            $scope.map.centerAndZoom("深圳", 12);
            $scope.map.enableScrollWheelZoom();                 //启用滚轮放大缩小

        })

        function getCenter() {
            var center = $scope.map.getCenter();
            $scope.$apply(function () {
                $scope.centerText = "中心点:" + center.lng + "," + center.lat;
            })
        }


        function openWindwo(point, merchant) {

            var sContent =
                "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>" + merchant.name + "</h4>" +
                "<h5 style='margin:0 0 5px 0;padding:0.2em 0'>" + merchant.telephone + "</h5>" +
                "<img style='float:right;margin:4px' id='imgDemo' src='../img/icon/93myb.png' width='139' height='104' title='易联速递'/>" +
                "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + merchant.addressStr +
                "</p>" +
                "</div>";

            var infoWindow = new BMap.InfoWindow(sContent, {offset: new BMap.Size(0, -10)});  // 创建信息窗口对象
            $scope.map.openInfoWindow(infoWindow, point);      // 打开信息窗口
        }

        $scope.init = function () {

            $request.get('api/?model=merchant&action=get_merchants'
                , function (response) {
                    if (response.success) {
                        $scope.data = response.data;
                        setPoint();
                    } else if (angular.isUndefined(response.success)) {
                        $ui.error(response);
                    } else {
                        $ui.error(response.error);
                    }
                });

            function setPoint() {
                if ($scope.data) {
                    angular.forEach($scope.data, function (d) {
                        d.addressStr = $data.getAddress(d);
                        var point = new BMap.Point(d.lng, d.lat);
                        var marker = new BMap.Marker(point);  // 创建标注
                        $scope.map.addOverlay(marker);               // 将标注添加到地图中
                        marker.addEventListener("click", function () {
                            openWindwo(point, d);
                        });
                    })
                }
            }
        }

        $scope.init();

    }]);

// bootstrap
    return angularAMD.bootstrap(app);

});



