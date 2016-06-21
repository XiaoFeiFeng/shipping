'use strict'
define([], function () {
    angular.module('homeTopModule', [])
        .controller("homeTopCtrl", ['$scope', '$timeout', '$ui', '$data', '$state', '$store', '$rootScope', '$request', '$http'
            , function ($scope, $timeout, $ui, $data, $state, $store, $rootScope, $request, $http) {

                function setLogined(logined) {
                    $scope.logined = logined;
                    $rootScope.logined = logined;
                }

                $scope.logout = function () {
                    $ui.confirm("确定退出登录?", "确认提示", function () {
                        $scope.userInfo = null;
                        $store.removeUserInfo();
                        $store.remove("merchantInfo");
                        setLogined(false);
                        location.href = "#";
                    })
                }

                $scope.getDate = function (tick) {
                    return $data.getInterval(tick);
                }

                $scope.notifyClick = function (notify) {
                    var url = "";
                    switch (notify.type) {
                        case "myorder":
                            url = "#/order/detail?id=" + notify.tid;
                            break;
                        case "clientorder":
                            url = "#/order/clientorder?tid=" + notify.tid;
                            break;
                        case "mypickup":
                            url = "#/pickup/list";
                            break;
                        case "clientpickup":
                            url = "#/pickup/clientlist";
                            break;
                        case "system":
                            $scope.notifys.systems.push(n)
                            break;
                    }
                    $request.getWithNoBlock('api/?model=notification&action=set_readed&id=' + notify._id.$id,
                        function (response) {
                            if (response.success) {
                                $ui.locate(url);
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (err) {
                            $ui.error(err);
                        });
                }

                $scope.calcNotify = function (notifications) {
                    $scope.notifys = {};
                    $scope.notifys.orders = [];
                    $scope.notifys.pickups = [];
                    $scope.notifys.systems = [];

                    angular.forEach(notifications, function (n) {
                        switch (n.type) {
                            case "myorder":
                                $scope.notifys.orders.push(n);
                                break;
                            case "clientorder":
                                $scope.notifys.orders.push(n)
                                break;
                            case "mypickup":
                                $scope.notifys.pickups.push(n)
                                break;
                            case "clientpickup":
                                $scope.notifys.pickups.push(n)
                                break;
                            case "system":
                                $scope.notifys.systems.push(n)
                                break;
                        }
                    })

                }

                $scope.getNotifications = function () {

                    $request.getWithNoBlock('api/?model=notification&action=get_byuser&uid=' + $scope.userInfo._id.$id,
                        function (response) {
                            if (response.success) {
                                $scope.calcNotify(response.data);
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                }

                $scope.notifyTimer = function () {
                    // $timeout(function () {
                    //     $scope.getNotifications();
                    // }, 100);
                }

                $scope.richScan = function () {

                    $http({
                        url: 'http://www.93myb.com/api/tx/weixin/a/ylsd_weixin.php',
                        method: 'GET'
                    }).success(function (result, header, config, status) {
                        $ui.openWindowSm('views/weixin/maxcard.html', 'weixinMaxcardCtrl', result, function (data) {
                            if (data) {
                                $scope.init();
                            }
                        }, function (data) {

                        });

                    }).error(function (data, header, config, status) {

                    });
                }

                $scope.setPph = function () {
                    $http({
                        url: '/api/view/weixin.php',
                        method: 'GET'
                    }).success(function (result, header, config, status) {
                    }).error(function (data, header, config, status) {
                    });
                }

                $scope.init = function () {

                    $rootScope.logined = false;

                    $scope.logined = false;

                    var sessionId = $data.getCookie("PHPSESSID");
                    if (!sessionId) {
                        $store.removeUserInfo();
                        return false;
                    }


                    $scope.userInfo = $store.getUserInfo();

                    if ($scope.userInfo) {
                        setLogined(true);

                        if ($scope.userInfo.roles.indexOf("merchant") > -1) {
                            $scope.showMerchantIcon = true;
                        }

                        $scope.notifyTimer();
                        //  setInterval($scope.notifyTimer, 3000);
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