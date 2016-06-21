/**
 * Created by Administrator on 2016/1/15.
 */
define([], function () {
    angular.module("orderMyOrderModule", [])
        .controller('orderMyOrderCtrl', ['$scope', '$request', '$store', '$ui', '$data', '$rootScope', '$state',
            function ($scope, $request, $store, $ui, $data, $rootScope, $state) {

                $scope.search = function () {
                    if (!$scope.searchValue) {
                        return false;
                    }

                    $request.get('api/?model=order&action=get_bycode'
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
                    return $data.getOrderState(state);
                }

                $scope.cancel = function (id) {

                    if (!id) return false;
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

                $scope.openDetail = function (order) {
                    $state.go('module', {
                        'module': 'order',
                        'action': 'detail',
                        'params': 'id=' + order._id.$id
                    });
                }

                $scope.pay = function (order) {
                    var data = {};

                    data.tracks = order.tracks;

                    var track = {};
                    track.data = "付款成功，等待上门取件。";
                    data.tracks.push(track);

                    data.state = 1;

                    $request.post('api/?model=order&action=edit_track&id=' + order._id.$id, data,
                        function (response) {
                            if (response.success) {
                                $ui.notify('模拟支付成功', '提示', function () {
                                    $scope.getOrdres();
                                });
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }

                        }, function (err) {
                            $ui.error(err);
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

                $scope.getStateCount = function () {

                    $request.get('api/?model=order&action=get_statecount_byuser'
                        + '&uid=' + $scope.userInfo._id.$id
                        + '&interval=' + $scope.interval,
                        function (response) {
                            if (response.success) {
                                $scope.stateCount = response.data;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });

                }
                $scope.init = function () {

                    if (!$rootScope.logined) {
                        $ui.locateLogin();
                        return false;
                    }

                    $scope.userInfo = $store.getUserInfo();
                    $scope.interval = "1";
                    $scope.currentPage = 1;
                    $scope.pageSize = 5;

                    var param = $ui.getKeyByUrl();
                    if (param && param.tid) {
                        $scope.searchValue = param.tid;
                        $scope.search();
                    } else {
                        $scope.getOrdres();
                        $scope.getStateCount();
                    }
                }

                $scope.init();
            }])
})