'use strict'
define([], function () {
    angular.module('orderDistributeModule', [])
        .controller("orderDistributeCtrl", ['$scope', '$ui', '$data', '$request', '$timeout',
            function ($scope, $ui, $data, $request, $timeout) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.handler = function (order) {
                    $ui.openWindow('views/order/handler.html', 'orderhandlerCtrl', order.from.address, function (result) {
                        if (result) {
                            $timeout(function () {
                                $scope.submit(order, result);
                            }, 100);
                        }
                    });
                }

                $scope.submit = function (order, merchant) {

                    var data = {};
                    data.tracks = order.tracks;

                    if (!data.tracks) {
                        data.tracks = [];
                    }
                    var track = {};
                    track.address = merchant.address;
                    track.mid = merchant._id.$id;
                    track.tel = merchant.telephone;
                    data.tracks.push(track);
                    data.state = 2;
                    data.owner = merchant._id.$id;
                    $request.post('api/?model=order&action=edit_track&id=' + order._id.$id,
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify("分发成功", "提示", function () {
                                    $scope. initGridData();
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
                        {FieldName: 'code', DisplayName: '订单号',},
                        {FieldName: 'name', DisplayName: '寄件人',},
                        {FieldName: 'fromCity', DisplayName: '发货地',},
                        {FieldName: 'toCountry', DisplayName: '目的国家',},
                        {FieldName: 'weight', DisplayName: '重量',},
                        {FieldName: 'transportWayCName', DisplayName: '渠道',},
                        {FieldName: 'created_time', DisplayName: '下单时间', Formatter: $scope.formatterTimer},
                        {FieldName: 'from.address', DisplayName: '地址',},
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: false,

                            showEdit: true,
                            editTitle: "分配订单",
                            editIcon: "fa fa-edit",
                            editFn: function (data) {
                                $scope.handler(data);
                            },

                            showDelete: false,
                        },
                    },
                    rowOpr: {
                        rowSelected: function (data) {
                            //alert("row selected");
                        },
                    },
                    colsHidden: [],

                }

                $scope.initGridData = function () {
                    $request.get('api/?model=order&action=get_orders&state=1'
                        + '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize,

                        function (response) {
                            if (response.success) {
                                $scope.gridOptions.data = response.data;
                                $scope.totalItems = response.count;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }
                    );
                }

                $scope.initGridData();
            }
        ])

})