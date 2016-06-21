'use strict'
define([], function () {
    angular.module('logistricproTplModel', [])
        .controller("logistricProTplCtrl", ['$scope', '$ui', '$request', '$filter', function ($scope, $ui, $request, $filter) {

            $scope.currentPage = 1;
            $scope.pageSize = 25;

            $scope.pageChange = function () {
                $scope.initGridData();
            }

            $scope.formatterImg = function (value) {
                return '<img class="img" src="'+value+'">';
            }

            $scope.add = function () {
                $ui.openWindow('views/logistic/addProTpl.html', 'logisticaddProTplCtrl', null, function () {
                    $scope.initGridData();
                });
            }
            $scope.edit = function (data) {
                $ui.openWindow('views/logistic/addProTpl.html', 'logisticaddProTplCtrl', data, function (result) {
                    if (result) $scope.initGridData();
                });
            }
            $scope.del = function (id) {
                $request.get('api/?model=logistic&action=del_logistic&id=' + id, function (response) {
                        $scope.initGridData();
                });
            }
            $scope.gridOptions = {
                data: [],
                cols: [
                    {FieldName: 'name', DisplayName: '物流商名称',},
                    {FieldName: 'code', DisplayName: '编码',},
                    {FieldName: 'img', DisplayName: 'LOGO', Formatter: $scope.formatterImg}
                ],
                colsOpr: {
                    headName: '操作',
                    headClass: '',
                    init: {
                        showEdit: true,
                        editFn: function (data) {
                            $scope.edit(data);
                        },
                        showDelete: true,
                        delFn: function (data) {
                            $ui.confirm("确认删除？", "确认", function () {
                                $scope.del(data._id.$id);
                            });
                        }
                    }
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
            $scope.initGridData = function () {
                $request.get('api/?model=logistic&action=logisticList&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
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

        }])
})