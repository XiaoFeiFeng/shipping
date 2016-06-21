/**
 * Created by Administrator on 2016/1/14.
 */
'use strict'
define([], function () {
    angular.module("orderClientOrderModule", [])
        .controller('orderClientOrderCtrl', ['$scope', '$store', '$rootScope', '$request', '$data', '$ui', '$timeout',
            function ($scope, $store, $rootScope, $request, $data, $ui, $timeout) {

                $scope.search = function () {
                    if (!$scope.searchValue) {
                        return false;
                    }

                    $request.get('api/?model=order&action=get_bykeyword'
                        + '&code=' + $scope.searchValue,
                        function (response) {
                            if (response.success) {
                                $scope.gridOptions.data = response.data;
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

                $scope.view = function (data) {
                    $ui.openWindow('views/order/clientDetail.html', 'orderClientDetailCtrl', data._id.$id);
                }

                $scope.sendNotify = function (order, merchant) {
                    var data = {
                        "userNotify": {
                            "uid": order.userId,
                            "data": "您有一条订单更新",
                            "tid": order._id.$id,
                            "type": "myorder",
                        },
                        "merchantNotify": {
                            "uid": merchant.userId,
                            "data": "您有一条订单需要处理",
                            "tid": order._id.$id,
                            "type": "clientorder",
                        }
                    }

                    $request.postWithNoBlock('api/?model=notification&action=creates', data,
                        function (response) {
                            if (response.success) {

                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }

                        }, function (err) {
                            $ui.error(err);
                        });
                }

                $scope.distributes = function () {
                    var datas = $scope.gridOptions.colsChk.data;

                    if (datas.length == 0) {
                        $ui.notify("请选择订单", "提示");
                        return false;
                    }
                    var data = {address: $scope.merchant.address, id: $scope.merchant._id.$id};

                    $ui.openWindow('views/order/distribute.html', 'orderDistributeCtrl', data, function (result) {
                        if (result) {
                            $timeout(function () {
                                $scope.distributeSubmits(datas, result);
                            }, 100);
                        }
                    });
                }

                $scope.distributeSubmits = function (orders, merchant) {

                    var data = {orders: []};

                    var track = {};
                    track.address = $data.getAddress(merchant);
                    track.data = "订单转发至 " + track.address;
                    track.mid = merchant._id.$id;
                    track.tel = merchant.telephone;

                    angular.forEach(orders, function (order) {
                        var d = {};
                        d._id = order._id.$id;
                        d.owner = merchant._id.$id;
                        d.tracks = order.tracks;
                        d.tracks.push(track);
                        data.orders.push(d);
                    })


                    $request.post('api/?model=order&action=edit_tracks',
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify("分发成功", "提示", function () {
                                    $scope.getOrdres();
                                });

                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response, "错误");
                            } else {
                                $ui.error(response.error, "错误");
                            }

                        }, function (err) {
                            $ui.error('分发失败，' + err, '错误');
                        });
                }

                $scope.handlers = function () {
                    var datas = $scope.gridOptions.colsChk.data;
                    if (datas.length == 0) {
                        $ui.notify("请选择订单", "提示");
                    }
                }

                $scope.handler = function (data) {
                    var data = {address: $scope.merchant.address, id: $scope.merchant._id.$id};

                    $ui.openWindow('views/order/distribute.html', 'orderDistributeCtrl', data, function (result) {
                        if (result) {
                            $timeout(function () {
                                $scope.distributeSubmit(order, result);
                            }, 100);
                        }
                    });
                }

                $scope.distribute = function (order) {
                    var data = {address: $scope.merchant.address, id: $scope.merchant._id.$id};

                    $ui.openWindow('views/order/distribute.html', 'orderDistributeCtrl', data, function (result) {
                        if (result) {
                            $timeout(function () {
                                $scope.distributeSubmit(order, result);
                            }, 100);
                        }
                    });
                }

                $scope.distributeSubmit = function (order, merchant) {

                    var data = {};
                    data.tracks = order.tracks;

                    if (!data.tracks) {
                        data.tracks = [];
                    }
                    var track = {};
                    track.address = $data.getAddress(merchant);
                    track.data = "订单转发至 " + track.address;
                    track.mid = merchant._id.$id;
                    track.tel = merchant.telephone;
                    data.tracks.push(track);
                    data.owner = merchant._id.$id;
                    $request.post('api/?model=order&action=edit_track&id=' + order._id.$id,
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify("分发成功", "提示", function () {
                                    $scope.getOrdres();
                                });

                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response, "错误");
                            } else {
                                $ui.error(response.error, "错误");
                            }

                        }, function (err) {
                            $ui.error('分发失败，' + err, '错误');
                        });
                }

                $scope.getState = function (state) {
                    return $data.getOrderState(state);
                }

                $scope.pageChange = function () {
                    $scope.getOrdres();
                }

                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'code', DisplayName: '订单号',},
                        {FieldName: 'created_time', DisplayName: '下单时间', Formatter: $scope.getDate},
                        {FieldName: 'fromCity', DisplayName: '发货地',},
                        {FieldName: 'toCountry', DisplayName: '目的国家',},
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: true,
                            viewTitle: "查看详情",
                            viewIcon: "fa fa-eye text-warning",
                            viewFn: function (data) {
                                $scope.view(data);
                            },

                            showEdit: true,
                            editTitle: "转送",
                            editIcon: "fa fa-external-link text-warning",
                            editFn: function (data) {
                                $scope.distribute(data)
                            },

                            showDelete: true,
                            delTitle: "处理",
                            delIcon: "fa fa-car text-warning",
                            delFn: function (data) {
                                $scope.handler(data);
                            }
                        },
                    },
                    colsChk: {//if not need checkbox,undefined this
                        //rowCheckname: 'checked',//if undefined,use default name
                        checkAllChange: function () {
                        },
                        rowCheckChange: function (data) {
                        },
                        keyName: '_id',//if not get selected data.undefined
                        data: [],//if not get selected data.undefined
                    },
                    rowOpr: {
                        rowSelected: function (data) {
                            //alert("row selected");
                        },
                    },
                    colsHidden: [],

                }

                $scope.findOrder = function (state) {
                    $scope.state = state;
                    $scope.getOrdres();
                }

                $scope.getOrdres = function () {
                    var paramStr = '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize
                        + "&owner=" + $scope.merchant._id.$id;

                    $request.get('api/?model=order&action=get_byowner' + paramStr,
                        function (response) {
                            if (response.success) {
                                $scope.gridOptions.data = response.data;
                                $scope.totalItems = response.count;
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

                    $scope.merchant = $store.getJson("merchantInfo");

                    if (!$scope.merchant) {
                        $ui.notify('未加入易联商盟', '提示', function () {
                            $ui.locate("#/myel/merchant");
                        });

                        return false;
                    }

                    $scope.userInfo = $store.getUserInfo();
                    $scope.currentPage = 1;
                    $scope.pageSize = 5;

                    var param = $ui.getKeyByUrl();
                    if (param && param.code) {
                        $scope.searchValue = param.code;
                        $scope.search();
                    } else {
                        $scope.getOrdres();
                    }
                }

                $scope.init();

            }]);
})