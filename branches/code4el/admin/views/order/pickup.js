'use strict'

define([], function () {
    angular.module('orderPickupModule', [])
        .controller("orderPickupCtrl", ['$scope', '$ui', '$data', '$request', '$timeout',
            function ($scope, $ui, $data, $request, $timeout) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.sendNotify = function (pickup, merchant) {

                    var data = {
                        "merchantNotify": {
                            "uid": merchant.userId,
                            "data": "您有一条上门订单需要处理",
                            "tid": pickup._id.$id,
                            "type": "clientpickup",
                        }
                    }

                    if (pickup.userId) {
                        var userNotify = {
                            "uid": pickup.userId,
                            "data": "您有一条上门订单更新",
                            "tid": pickup._id.$id,
                            "type": "mypickup",
                        };
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

                $scope.handler = function (data) {
                    $ui.openWindow('views/order/handler.html', 'orderhandlerCtrl', data.addressStr, function (result) {
                        if (result) {
                            $timeout(function () {
                                $scope.submit(data, result);
                            }, 100);
                        }
                    });
                }

                //提交分发数据
                $scope.submit = function (pickup, merchant) {

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
                    data.state = 1;
                    data.owner = merchant._id.$id;
                    $request.post('api/?model=pickup&action=edit&id=' + pickup._id.$id,
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify("分发成功", "提示", function () {
                                    $scope.initGridData();
                                    $scope.sendNotify(pickup, merchant);
                                });

                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response, "错误");
                            } else {
                                $ui.error(response.error, "错误");
                            }

                        }, function (err) {
                            $ui.error('添加失败，' + err, '错误');
                        });
                }


                $scope.formatterTimer = function (input) {
                    var date = new Date(input * 1000);
                    return date.format("yyyy-MM-dd HH:mm:ss");
                }

                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'name', DisplayName: '寄件人',},
                        {FieldName: 'tel', DisplayName: '电话',},
                        {FieldName: 'created_time', DisplayName: '下单时间', Formatter: $scope.formatterTimer},
                        {FieldName: 'addressStr', DisplayName: '地址',},
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: false,
                            viewFn: function (data) {
                                $scope.viewDetail(data);
                            },
                            showEdit: false,
                            editFn: function (data) {
                                $scope.edit(data);
                            },
                            showDelete: false,
                        },
                        colInfo: [
                            {
                                title: '分配加盟商',
                                iconClass: 'fa fa-edit',
                                clickFn: function (data) {
                                    $scope.handler(data);
                                },
                            },
                        ],
                    },
                    rowOpr: {
                        rowSelected: function (data) {
                            //alert("row selected");
                        },
                    },
                    colsHidden: [],

                }

                $scope.initGridData = function (state) {
                    $request.get('api/?model=pickup&action=get_pickups&state=0'
                        + '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize,
                        function (response) {
                            if (response.success) {
                                $scope.handlerData(response.data);
                                $scope.totalItems = response.count;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }
                    );
                }

                $scope.handlerData = function (data) {
                    if (data && data.length > 0) {
                        angular.forEach(data, function (d) {
                            d.addressStr = $data.getAddress(d);
                        })
                    } else {
                        data = [];
                    }
                    $scope.gridOptions.data = data;
                }

                $scope.initGridData();


            }
        ])

})