/**
 * Created by Administrator on 2016/1/14.
 */
'use strict'
define([], function () {
    angular.module("pickupClientListModule", [])
        .controller('pickupClientListCtrl', ['$scope', '$store', '$rootScope', '$request', '$data', '$ui', '$timeout',
            function ($scope, $store, $rootScope, $request, $data, $ui, $timeout) {


                $scope.search = function () {
                    $scope.getPickups();
                };

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
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

                $scope.distributeSubmits = function (pickups, merchant) {

                    var data = {pickups: []};

                    var track = {};
                    track.address = $data.getAddress(merchant);
                    track.data = "订单转发至 " + track.address;
                    track.mid = merchant._id.$id;
                    track.tel = merchant.telephone;

                    angular.forEach(pickups, function (pickup) {
                        var d = {};
                        d._id = pickup._id.$id;
                        d.owner = merchant._id.$id;
                        d.tracks = pickup.tracks;
                        d.tracks.push(track);
                        data.pickups.push(d);
                    })


                    $request.post('api/?model=pickup&action=edit_tracks',
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify("分发成功", "提示", function () {
                                    $scope.getPickups();
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

                $scope.distribute = function (pickup) {
                    var data = {address: $scope.merchant.address, id: $scope.merchant._id.$id};

                    $ui.openWindow('views/order/distribute.html', 'orderDistributeCtrl', data, function (result) {
                        if (result) {
                            $timeout(function () {
                                $scope.distributeSubmit(pickup, result);
                            }, 100);
                        }
                    });
                }

                $scope.distributeSubmit = function (pickup, merchant) {

                    var data = {};
                    data.tracks = pickup.tracks;

                    if (!data.tracks) {
                        data.tracks = [];
                    }
                    var track = {};
                    track.address = merchant.address;
                    track.mid = merchant._id.$id;
                    track.tel = merchant.telephone;
                    data.tracks.push(track);
                    data.owner = merchant._id.$id;

                    $request.post('api/?model=pickup&action=edit_track&id=' + pickup._id.$id,
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify("转送成功", "提示", function () {
                                    $scope.getPickups();
                                });

                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response, "错误");
                            } else {
                                $ui.error(response.error, "错误");
                            }

                        }, function (err) {
                            $ui.error('转送失败，' + err, '错误');
                        });
                }

                $scope.getState = function (state) {
                    return $data.getPickupState(state);
                }

                $scope.pageChange = function () {
                    $scope.getPickups();
                }

                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'name', DisplayName: '姓名',},
                        {FieldName: 'tel', DisplayName: '电话',},
                        {FieldName: 'country.Name', DisplayName: '目的地',},
                        {FieldName: 'created_time', DisplayName: '下单时间', Formatter: $scope.getDate},
                        {FieldName: 'addressStr', DisplayName: '地址',}
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: false,
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

                $scope.getPickups = function () {

                    var paramStr = '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize
                        + "&owner=" + $scope.merchant._id.$id;

                    if ($scope.searchValue) {
                        paramStr += "&tel=" + $scope.searchValue;
                    }

                    $request.get('api/?model=pickup&action=get_byowner' + paramStr,
                        function (response) {
                            if (response.success) {
                                $scope.initDate(response.data);
                                $scope.totalItems = response.count;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                }

                $scope.initDate = function (datas) {
                    angular.forEach(datas, function (data) {
                        data.addressStr = $data.getAddress(data);
                    })
                    $scope.gridOptions.data = datas;
                }

                $scope.init = function () {

                    $scope.userInfo = $store.getUserInfo();
                    $scope.merchant = $store.getJson("merchantInfo");

                    if (!$scope.merchant) {
                        $ui.notify('未加入易联商盟', '提示', function () {
                            $ui.locate("#/myel/merchant");
                        });
                        return false;
                    }

                    $scope.currentPage = 1;
                    $scope.pageSize = 10;

                    if (!$rootScope.logined) {
                        $ui.locateLogin();
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