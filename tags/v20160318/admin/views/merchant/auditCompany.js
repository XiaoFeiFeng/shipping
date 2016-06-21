'use strict'

define([], function () {
    angular.module('merchantAuditCompanyModule', [])
        .controller("merchantAuditCompanyCtrl", ['$scope', '$ui', '$validate', '$data', '$request', '$config', '$q',
            function ($scope, $ui, $validate, $data, $request, $config, $q) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.viewDetail = function (data) {
                    data.companyScale = $scope.formatterCompanyScale(data.scale);
                    $ui.openWindow('views/merchant/companyDetail.html', 'merchantCompanyDetailCtrl', data, function (result) {
                        if (result) $scope.initGridData();
                    });
                }

                $scope.mark = function (data) {
                    window.open("../admin/index/map.html?tp=company&key=" + data._id.$id);
                }

                $scope.formatterCompanyScale = function (value) {
                    if ($validate.isEmpty(value))
                        return "";
                    for (var i = 0; i < $scope.companyScale.length; i++) {
                        if ($scope.companyScale[i].key == value) {
                            return $scope.companyScale[i].value;
                        }
                    }
                    return "";
                }

                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'companyName', DisplayName: '公司名称',},
                        {FieldName: 'companyType', DisplayName: '性质',},
                        {FieldName: 'leader', DisplayName: '企业法人',},
                        {FieldName: 'scale', DisplayName: '公司规模', Formatter: $scope.formatterCompanyScale},
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

                    $request.get('api/?model=merchant&action=get_audit_company'
                        + '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize
                        + '&state=' + state,
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


                $scope.init = function () {
                    var key = "companyScale";
                    $request.get('api/?model=config&action=get_config&key=' + key, function (response) {
                        if (response.success) {
                            $scope.companyScale = response.data.value;
                            $scope.initGridData();
                        }
                    }, function (error) {
                        $ui.error(error);
                    })
                };

                $scope.init();


            }
        ])

})