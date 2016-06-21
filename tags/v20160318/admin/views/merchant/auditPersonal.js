'use strict'

define([], function () {
    angular.module('merchantAuditPersonalModule', [])
        .controller("merchantAuditPersonalCtrl", ['$scope', '$ui', '$validate', '$data', '$request', '$config', '$q',
            function ($scope, $ui, $validate, $data, $request, $config, $q) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.viewDetail = function (data) {
                    $ui.openWindow('views/merchant/personalDetail.html', 'merchantCompanyDetailCtrl', data, function (result) {
                        if (result) $scope.initGridData();
                    });
                }
                $scope.mark = function (data) {
                    window.open("../admin/index/map.html?tp=personal&key=" + data._id.$id);
                }

                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'name', DisplayName: '姓名',},
                        {FieldName: 'address', DisplayName: '地址',},
                        {FieldName: 'applyTime', DisplayName: '申请日期'},
                        {FieldName: 'telphone', DisplayName: '联系电话'},
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: true,
                            viewTitle: "审核信息",
                            viewIcon:"fa fa-calendar-check-o",
                            viewFn: function (data) {
                                $scope.viewDetail(data);
                            },
                            showEdit: false,
                            showDelete: false,
                        },
                        colInfo: [
                            {
                                title: '地图标记',
                                iconClass: 'fa fa-map-marker text-danger',
                                clickFn: function (data) {
                                    $scope.mark(data);
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
                    state = angular.isUndefined(state) ? 0 : state;

                    $request.get('api/?model=merchant&action=get_audit_personal'
                        + '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize
                        + '*&state=' + state
                        , function (response) {
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

                $scope.initGridData();


            }
        ])

})