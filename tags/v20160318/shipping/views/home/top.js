'use strict'
define([], function () {
    angular.module('homeTopModule', [])
        .controller("homeTopCtrl", ['$scope', '$ui', '$data', '$state', '$store', '$rootScope', '$request', '$http'
            , function ($scope, $ui, $data, $state, $store, $rootScope, $request, $http) {

                $scope.logined = false;
                $rootScope.logined = false;

                function setLogined(logined) {
                    $scope.logined = logined;
                    $rootScope.logined = logined;
                }

                $scope.logout = function () {
                    $ui.confirm("确定退出登录?", "确认提示", function () {
                        $scope.userInfo = null;
                        $store.removeUserInfo();
                        setLogined(false);
                        location.href = "http://localhost/shipping/#/home/index";

                    })
                }

                function calcNotify(notifications) {
                    $scope.notifys = {};
                    $scope.notifys.orders = [];
                    $scope.notifys.clientOrders = [];
                    $scope.notifys.systems = [];

                    angular.forEach(notifications, function (n) {
                        switch (n.type) {
                            case "order":
                                $scope.notifys.orders.push(n);
                                break;
                            case "clientOrder":
                                $scope.notifys.clientOrders.push(n)
                                break;

                            case "system":
                                $scope.notifys.systems.push(n)
                                break;
                        }
                    })

                }


                $scope.getNotifications = function () {

                    $request.get('api/?model=notification&action=get_byuser&uid=' + $scope.userInfo._id.$id,
                        function (response) {
                            if (response.success) {
                                calcNotify(response.data);
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                }

                $scope.richScan = function () {
                    $http({
                        url: 'http://www.93myb.com/api/tx/weixin/a/ylsd_weixin.php',
                        method: 'GET'
                    }).success(function (result, header, config, status) {
                        $ui.openWindowSm('views/weixin/maxcard.html', 'weixinMaxcardCtrl', result, function (data) {
                            if (data) {
                                alert(data);
                            }
                        }, function (data) {

                        });

                    }).error(function (data, header, config, status) {

                        console.log(data);
                    });
                }


                $scope.init = function () {

                    $scope.userInfo = $store.getUserInfo();

                    if ($scope.userInfo) {
                        setLogined(true);

                        if ($scope.userInfo.roles.indexOf("merchant") > -1) {
                            $scope.showMerchantIcon = true;
                        }
                        $scope.getNotifications();
                    }

                    var request = $ui.getKeyByUrl();
                    if (request) {

                        var qqid = request.indexid;
                        var aliId = request.aliId;

                        if (aliId) {
                            $request.get('api/?model=user&action=get_user_ali&aliId=' + aliId, function (response) {
                                if (response.success) {
                                    $store.setUserInfo(response.data);
                                    setLogined(true);
                                    $scope.userInfo = response.data;
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error(err);
                            })

                        }

                        if (qqid) {
                            $request.get('api/?model=user&action=get_user_name&qqid=' + qqid, function (response) {
                                if (response.success) {
                                    $store.setUserInfo(response.data);
                                    setLogined(true);
                                    $scope.userInfo = response.data;
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error(err);
                            })
                        }
                    }
                }

                $scope.init();
            }])
})