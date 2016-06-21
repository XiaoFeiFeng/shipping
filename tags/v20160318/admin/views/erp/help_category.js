'use strict'
define([], function () {
    angular.module('erpHelpCategoryModel', [])
        .controller("erpHelpCategoryCtrl", ['$scope', '$ui', '$request', '$filter', function ($scope, $ui, $request, $filter) {

            $scope.currentPage = 1;
            $scope.pageSize = 25;

            $scope.pageChange = function () {
                $scope.initGridData();
            }


            $scope.add = function () {
                $ui.openWindow('views/erp/addHelpCategory.html', 'addHelpCategoryCtrl', null, function () {
                    $scope.initGridData();
                });
            }
            $scope.edit = function (data) {
                $ui.openWindow('views/erp/addHelpCategory.html', 'addHelpCategoryCtrl', data, function (result) {
                    if (result) $scope.initGridData();
                });
            }
            $scope.del = function (id) {
                $request.get('api/?model=erp&action=del_help_category&id=' + id, function (response) {
                    $scope.initGridData();
                });
            }
            $scope.gridOptions = {
                data: [],
                cols: [
                    {FieldName: 'name', DisplayName: '分类名',}
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
                $request.get('api/?model=erp&action=help_category_list&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
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