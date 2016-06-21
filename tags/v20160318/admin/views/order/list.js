'use strict'

define([], function () {
    angular.module('orderListModule', [])
        .controller("orderListCtrl", ['$scope', '$ui', '$data', '$request', '$timeout',
            function ($scope, $ui, $data, $request, $timeout) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.view = function (data) {
                    $ui.openWindow('views/order/detail.html', 'orderDetailCtrl', data._id.$id);
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
                        {FieldName: 'created_time', DisplayName: '下单时间', Formatter: $scope.formatterTimer},
                        {FieldName: 'fromCity', DisplayName: '发货地',},
                        {FieldName: 'toCountry', DisplayName: '目的国家',},
                        {FieldName: 'weight', DisplayName: '重量',},
                        {FieldName: 'transportWayCName', DisplayName: '渠道',},
                        {FieldName: 'from.address', DisplayName: '地址',},
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: true,
                            viewTitle: "查看详情",
                            viewIcon: "fa fa-eye",
                            viewFn: function (data) {
                                $scope.view(data);
                            },
                            showEdit: false,
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

                $scope.initGridData = function (state) {

                    var url = 'api/?model=order&action=get_orders';

                    if (state != undefined) {
                        url += "&state=" + state;
                    }

                    url += '&pi=' + $scope.currentPage
                    url += '&ps=' + $scope.pageSize


                    $request.get(url,
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

                $scope.initGridData(1);
            }
        ])

})