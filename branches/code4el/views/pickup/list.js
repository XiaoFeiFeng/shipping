/**
 * Created by Administrator on 2016/1/14.
 */
'use strict'
define([], function () {
    angular.module("pickupListModule", [])
        .controller('pickupListCtrl', ['$scope', '$store', '$rootScope', '$request', '$data', '$ui', '$timeout',
            function ($scope, $store, $rootScope, $request, $data, $ui, $timeout) {


                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }


                $scope.view = function (data) {
                    $ui.openWindow('views/order/clientDetail.html', 'orderClientDetailCtrl', data._id.$id);
                }

                $scope.cancel = function (id) {
                    if (!id) return false;
                    $ui.confirm("取消之后将无法恢复，您确定还要继续？", "确认", function () {
                        var data = {};
                        data.state = -1;
                        $request.post('api/?model=pickup&action=edit&id=' + id, data,
                            function (response) {
                                if (response.success) {
                                    $scope.getPickups();
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error(err);
                            });
                    })

                }

                $scope.getState = function (state) {
                    return $data.getPickupState(state);
                }

                $scope.intervalChange = function () {
                    $scope.getPickups();
                }

                $scope.getAddress = function (pickup) {
                    return $data.getAddress(pickup);
                }

                $scope.pageChange = function () {
                    $scope.getPickups();
                }

                $scope.search = function () {
                    $scope.getPickups();
                }

                $scope.getPickups = function () {
                    var paramStr = '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize
                        + "&userId=" + $scope.userInfo._id.$id
                        + '&interval=' + $scope.interval;

                    if ($scope.searchValue) {
                        paramStr += '&tel=' + $scope.searchValue;
                    }

                    $request.get('api/?model=pickup&action=get_byuser' + paramStr,
                        function (response) {
                            if (response.success) {
                                $scope.pickups = response.data;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                }

                $scope.init = function () {

                    $scope.interval = "1";
                    $scope.currentPage = 1;
                    $scope.pageSize = 10;

                    $scope.userInfo = $store.getUserInfo();

                    if (!$rootScope.logined) {
                        $ui.locateLogin();
                        return false;
                    }


                    var param = $ui.getKeyByUrl();
                    if (param && param.tid) {
                        $scope.searchValue = param.tid;
                    }

                    $scope.getPickups();

                }

                $scope.init();

            }]);
})