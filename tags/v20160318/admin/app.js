/**
 * Created by fengxiaofei on 2015/12/4.
 */
'use strict'
var remoteUrl = 'http://192.168.100.254/';

require.config({

    baseUrl: "../admin/",

    // alias libraries paths
    paths: {
        'jquery': remoteUrl + 'jquery/dist/jquery.min',
        'angular': remoteUrl + 'angular/angular',
        'uiRouter': remoteUrl + 'angular-ui-router/release/angular-ui-router',
        'angularAMD': remoteUrl + 'angularAMD/angularAMD',
        'blockUI': remoteUrl + 'angular-block-ui/dist/angular-block-ui.min',
        'bootstrap': remoteUrl + 'bootstrap/dist/js/bootstrap',
        'angular-sanitize': remoteUrl + 'angular-sanitize/angular-sanitize',
        'ui-bootstrap-tpls': remoteUrl + 'angular-bootstrap/ui-bootstrap-tpls',
        'moment': remoteUrl + 'moment/moment',
        'locale': remoteUrl + 'moment/locale/zh-cn',
        'datetimepicker': remoteUrl + 'angular-bootstrap-datetimepicker/src/js/datetimepicker',
        'ng-table': remoteUrl + 'ng-table/dist/ng-table.min',
        'ueditor': 'plugins/ueditor/ueditor.all',
        'ueditor-config': 'plugins/ueditor/ueditor.config',
        'ZeroClipboard': "plugins/ueditor/third-party/zeroclipboard/ZeroClipboard",
        'fileinput': remoteUrl + 'fileinput/js/fileinput.min',
        'fileinput-lang': remoteUrl + 'fileinput/js/fileinput_locale_zh',
        'ng-ueditor': remoteUrl + 'angular-ueditor/dist/angular-ueditor',
        'select2': remoteUrl + 'select2/dist/js/select2',
        'hls-core': '../common/js/hls/hls-core',
        'hls-util': '../common/js/hls/hls-util',
        'hls-ui': '../common/js/hls/hls-ui',
        'demoApp': 'js/app'
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
        'ui-bootstrap-tpls': ['angular'],
        'angular-sanitize': ['angular'],
        'ng-table': ['angular',
            'css!' + remoteUrl + 'ng-table/dist/ng-table.min.css'
        ],
        'blockUI': ['angular',
            'css!' + remoteUrl + 'angular-block-ui/dist/angular-block-ui.css'],
        'bootstrap': ['jquery',
            'css!' + remoteUrl + 'bootstrap/dist/css/bootstrap.css',
            'css!' + remoteUrl + 'bootstrap/dist/css/bootstrap-theme.css',
            'css!' + remoteUrl + 'font-awesome/css/font-awesome.css',
            'css!../shipping/css/bootstrap-hls.css'],
        'datetimepicker': [
            'css!' + remoteUrl + 'angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
        ],
        'select2': ['angular', 'css!' + remoteUrl + 'select2/dist/css/select2.min.css'],
        'ng-ueditor': ['ZeroClipboard', 'ueditor', 'ueditor-config', 'angular',
            'css!' + remoteUrl + 'angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
        ],
        'fileinput': ['bootstrap',
            'css!' + remoteUrl + 'fileinput/css/fileinput.min.css'],
        'fileinput-lang': ['fileinput'],
        'hls-ui': ['hls-core',
            'css!../admin/css/hls-ui.css'
        ],
        'hls-util': ['hls-ui'],
        'demoApp': ['jquery',
            'css!../admin/css/AdminLTE.min.css',
            'css!../admin/css/skins/_all-skins.min.css']
    }
});

require(['ZeroClipboard'], function (ZeroClipboard) {
    window['ZeroClipboard'] = ZeroClipboard;
});

define(['angular', 'angularAMD', 'uiRouter', 'blockUI', 'bootstrap', 'ui-bootstrap-tpls', 'angular-sanitize', 'ng-table', 'fileinput-lang', 'hls-util', 'demoApp', 'ng-ueditor', 'ZeroClipboard'
        , 'css!../common/css/hls.css']
    , function (angular, angularAMD, blockUI) {
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
        var app = angular.module("indexModule", ["ui.router", 'blockUI', 'ui.bootstrap', 'ngSanitize', 'ngTable', 'hls.util', 'ng.ueditor']);

        // config
        app.config(["$stateProvider", "$urlRouterProvider", registerRoutes]);

        app.config(function ($httpProvider) {
            //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        });

        app.config(function (blockUIConfig) {
            // Change the default overlay message
            blockUIConfig.message = "请稍候...";
            // Change the default delay to 100ms before the blocking is visible
            blockUIConfig.delay = 100;
            // Disable automatically blocking of the user interface
            blockUIConfig.autoBlock = false;
        });

        app.controller('indexCtrl', ['$scope', '$request', '$ui', function ($scope, $request, $ui) {

            $scope.initData = function () {
                function dataConvert(data) {
                    function sortup(x, y) {
                        return (x.sort < y.sort) ? -1 : 1
                    }

                    var roots = [];
                    var children = [];
                    angular.forEach(data, function (item) {
                        if (item.pcode == 'root') {
                            item.children = [];
                            roots.push(item);
                        } else {
                            children.push(item);
                        }
                    });
                    angular.forEach(children, function (child) {
                        angular.forEach(roots, function (root) {
                            if (child.pcode == root.code) {
                                root.children.push(child);
                                root.hasChild = true;
                            }
                        });
                    });
                    angular.forEach(roots, function (root) {
                        root.children.sort(sortup);
                    })

                    roots.sort(sortup);
                    return roots;
                }

                $request.get('api/?model=menu&action=get_menus', function (response) {
                    if (response.success) {
                        $scope.menus = dataConvert(response.data);
                    } else if (angular.isUndefined(response.success)) {
                        $ui.error(response);
                    } else {
                        $ui.error(response.error);
                    }
                });
            }

            $scope.menuClick = function (item) {
                if (!item.hasChild)
                    $scope.currentMenu = item;
            }

            $scope.initData();
        }]);

// bootstrap
        return angularAMD.bootstrap(app);

    })
;



