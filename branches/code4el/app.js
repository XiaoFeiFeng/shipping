/**
 * Created by fengxiaofei on 2015/12/4.
 */
'use strict'
var remoteUrl = 'http://cdn.93myb.com/';
require.config({

    baseUrl: "",

    paths: {
        'jquery': remoteUrl + 'jquery/dist/jquery.min',
        'angular': remoteUrl + 'angular/angular',
        'uiRouter': remoteUrl + 'angular-ui-router/release/angular-ui-router.min',
        'angularAMD': remoteUrl + 'angularAMD/angularAMD.min',
        'angular-animate': remoteUrl + 'angular-animate/angular-animate',
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
        'fileinput': remoteUrl + 'fileinput/js/fileinput',
        'fileinput-lang': remoteUrl + 'fileinput/js/fileinput_locale_zh',
        'angular-city': remoteUrl + 'angular-city-select/dist/angular-city-select',
        'hls-core': 'common/js/hls/hls-core',
        'hls-util': 'common/js/hls/hls-util',
        'hls-ui': 'common/js/hls/hls-ui'
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
        'angular-animate': ['angular'],
        'ui-bootstrap-tpls': ['angular'],
        'angular-sanitize': ['angular'],
        'blockUI': ['angular',
            'css!' + remoteUrl + 'angular-block-ui/dist/angular-block-ui.css'],
        'bootstrap': ['jquery',
            'css! css/bootstrap.css',
            // 'css! css/bootstrap-theme.css',
            'css!' + remoteUrl + 'font-awesome/css/font-awesome.css',
            'css! css/bootstrap-hls.css',],
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
        'angular-city': ['angular', 'css!' + remoteUrl + 'angular-city-select/dist/angular-city-select.css'],
        'hls-ui': ['hls-core',
            'css! css/hls-ui.css'
        ],
        'hls-util': ['hls-ui'],
    }
});

define(['angular', 'angularAMD', 'uiRouter', 'blockUI', 'bootstrap', 'ui-bootstrap-tpls', 'angular-sanitize', 'angular-summernote', 'fileinput-lang',
    'hls-util',

    // 'css! css/less,'
    'css! css/index', 'css! common/css/hls'], function (angular, angularAMD, blockUI) {
    // routes
    var registerRoutes = function ($stateProvider, $urlRouterProvider) {
        var jsResolve = {
            load: ['$q', '$rootScope', '$stateParams',
                function ($q, $rootScope, $stateParams) {

                    if ($stateParams.length == 0) {
                        return null;
                    }
                    var path = './views/' + $stateParams.module + "/" + $stateParams.action;
                    var deferred = $q.defer();
                    require([path], function () {
                        $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }]
        };
        // default

        $urlRouterProvider.when('', '/home/index');
        //$urlRouterProvider.otherwise("/tutorials/main");

        // route
        $stateProvider.state('module', {
            url: "/{module}/{action}?{params}",
            templateUrl: function ($scope) {
                return 'views/' + $scope.module + '/' + $scope.action + '.html';
            },
            resolve: jsResolve
        });
    };
    // module
    var app = angular.module("indexModule", ["ui.router", 'blockUI', 'ui.bootstrap', 'ngSanitize', 'hls.util', 'summernote']);

    // config
    app.config(["$stateProvider", "$urlRouterProvider", registerRoutes]);

    app.config(function ($httpProvider) {
        //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    });

    app.config(['$compileProvider', function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);
    }]);
    app.config(function (blockUIConfig) {
        // Change the default overlay message
        blockUIConfig.message = "请稍候...";
        // Change the default delay to 100ms before the blocking is visible
        blockUIConfig.delay = 100;
        // Disable automatically blocking of the user interface
        blockUIConfig.autoBlock = false;
    });

    app.controller('indexCtrl', ['$scope', '$request', '$store', '$ui', '$data', '$rootScope', 'blockUI','$state',


        function ($scope, $request, $store, $ui, $data, $rootScope, blockUI,$state) {
            $(document).ready(function () {
                $("#popnav").affix({
                    offset: {
                        top: 125
                    }
                })

                $('.popup-box').each(function () {
                    var element = $(this);

                    element.popover({
                        html: true,
                        placement: "left",
                    }).on("mouseenter", function () {
                        var _this = this;
                        setTimeout(function () {
                            $(_this).popover("show");
                        }, 100);
                    }).on("mouseleave", function () {
                        var _this = this;
                        setTimeout(function () {
                            $(_this).popover("hide");
                        }, 100);
                    });
                });

                $scope.goConsult = function(){
                    $state.go('module',{
                        'module':'user',
                        'action':'qqconsult'
                    })
                }




            });

        }]);

    // bootstrap
    return angularAMD.bootstrap(app);

})
;



