'use strict'

define([], function () {
    angular.module('orderPlistModule', [])
        .controller("orderPlistCtrl", ['$scope', '$ui', '$data', '$request', '$timeout',
            function ($scope, $ui, $data, $request, $timeout) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.formatterTimer = function (input) {
                    var date = new Date(input * 1000);
                    return date.format("yyyy-MM-dd HH:mm:ss");
                }
                $scope.stateFormatter = function (input) {
                    switch (input + "") {
                        case "0":
                            return "待分发";
                            break;
                        case "1":
                            return "待取件";
                            break;
                        case "2":
                            return "已完成";
                            break;
                        case "-1":
                            return "已取消";
                            break;
                    }
                }

                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'name', DisplayName: '寄件人',},
                        {FieldName: 'tel', DisplayName: '电话',},
                        {FieldName: 'created_time', DisplayName: '下单时间', Formatter: $scope.formatterTimer},
                        {FieldName: 'addressStr', DisplayName: '地址',},
                        {FieldName: 'state', DisplayName: '状态', Formatter: $scope.stateFormatter},
                    ]
                }

                $scope.initGridData = function (state) {
                    var url = 'api/?model=package&action=get_packages';

                    if (state != undefined) {
                        url += "&state=" + state;
                    }

                    url += '&pi=' + $scope.currentPage
                    url += '&ps=' + $scope.pageSize


                    $request.get(url,
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
                            d.addressStr = d.district.cn.join(" ") + " " + d.address;
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