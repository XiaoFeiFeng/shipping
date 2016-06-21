/**
 * Created by Administrator on 2016/1/15.
 */
define([], function () {
    angular.module("orderMyOrderModule", [])
        .controller('orderMyOrderCtrl', ['$scope', '$request', '$store', '$ui', '$data', '$rootScope', '$state',
            function ($scope, $request, $store, $ui, $data, $rootScope, $state) {

                $scope.userInfo = $store.getUserInfo();
                $scope.interval = "1";
                $scope.currentPage = 1;
                $scope.pageSize = 5;

                if (!$rootScope.logined) {
                    $ui.locateLogin();
                }
                $scope.search = function () {
                    if (!$scope.searchValue) {
                        return false;
                    }

                    $request.get('api/?model=order&action=get_order_bycode'
                        + '&uid=' + $scope.userInfo._id.$id
                        + '&code=' + $scope.searchValue,
                        function (response) {
                            if (response.success) {
                                $scope.orders = [];
                                $scope.orders.push(response.data);
                                $scope.totalItems = response.count;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                };

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }

                $scope.getState = function (state) {
                    var str = "";
                    switch (state + "") {
                        case "0":
                            str = "待付款";
                            break;
                        case "1":
                            str = "待收货";
                            break;
                        case "2":
                            str = "已完成";
                            break
                        case "-1":
                            str = "已取消";
                            break
                    }
                    return str;
                }

                $scope.cancel = function (id) {

                    $ui.confirm("订单取消之后将无法恢复，您确定还要继续？", "确认", function () {
                        $request.get('api/?model=order&action=order_cancel&id=' + id,
                            function (response) {
                                if (response.success) {
                                    $scope.getOrdres();
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

                $scope.openDetail = function (key) {
                    $state.go('module', {
                        'module': 'order',
                        'action': 'detail',
                        'params': 'key=' + key
                    });
                }

                $scope.pageChange = function () {
                    $scope.getOrdres();
                }

                $scope.intervalChange = function () {
                    $scope.getOrdres();
                }

                $scope.findOrder = function (state) {
                    $scope.state = state;
                    $scope.getOrdres();
                }

                $scope.getOrdres = function () {

                    var paramStr = '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize
                        + '&uid=' + $scope.userInfo._id.$id
                        + '&interval=' + $scope.interval;

                    if ($scope.state != undefined) paramStr += '&state=' + $scope.state;

                    $request.get('api/?model=order&action=get_order_byuser' + paramStr,
                        function (response) {
                            if (response.success) {
                                $scope.orders = response.data;
                                $scope.totalItems = response.count;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                }

                $scope.getOrdres();
            }])
})