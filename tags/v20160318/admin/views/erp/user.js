'use strict'
define([], function () {
    angular.module('erpUserModule', [])
        .controller("erpUserCtrl", ['$scope', '$ui', '$request', '$validate', '$filter', function ($scope, $ui, $request, $validate, $filter) {

            $scope.currentCategory = "";

            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.gridOptions = {
                data: [],
                cols: [
                    {FieldName: 'username', DisplayName: '用户名'},
                    {FieldName: 'name', DisplayName: '姓名'},
                    {FieldName: 'reg_type', DisplayName: '注册类型'},
                    {FieldName: 'login_type', DisplayName: '登陆类型'},
                    {FieldName: 'email', DisplayName: 'email'},
                    {FieldName: 'tel', DisplayName: '手机号码'}
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

            $scope.initGridData = function (type) {
                $request.get('api/?model=erp&action=users_lists&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
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

            $scope.pageChange = function () {
                $scope.initGridData($scope.currentCategory);
            }



            $scope.add = function () {
                if ($validate.isEmpty($scope.currentCategory)) {
                    return;
                }
                var data = {
                    'operator': 'add',
                    'category': $scope.currentCategory
                }
                $ui.openWindow('views/logistic/addChannelTpl.html', 'logisticaddChannelTplCtrl', data, function (data) {
                    $scope.getChannels($scope.currentCategory);
                }, function (data) {
                });

            }
            $scope.edit = function (channel) {

                var data = {
                    'operator': 'edit',
                    'category': $scope.currentCategory,
                    'channel': channel
                }
                $ui.openWindow('views/logistic/addChannelTpl.html', 'logisticaddChannelTplCtrl', data, function (data) {
                    $scope.getChannels($scope.currentCategory);
                }, function (data) {

                });

            }
            $scope.del = function (id) {
                $request.get('api/?model=logistic&action=del_channel&id=' + id, function (response) {
                    $scope.initGridData($scope.currentCategory);
                });
            }

            $scope.isAdd = false;


        }])
})