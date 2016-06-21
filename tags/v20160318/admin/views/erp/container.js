'use strict'
define([], function () {
    angular.module('erpContainerModule', [])
        .controller("erpContainerCtrl", ['$scope', '$ui', '$request', '$validate', '$filter', function ($scope, $ui, $request, $validate, $filter) {

            $scope.currentCategory = "";

            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.formatterDate = function(value){
                return $filter('date')(value*1000,'yyyy-MM-dd');
            }
            $scope.gridOptions = {
                data: [],
                cols: [
                    {FieldName: 'containerId', DisplayName: 'containerId'},
                    {FieldName: 'username', DisplayName: '用户名'},
                    {FieldName: 'name', DisplayName: '姓名'},
                    {FieldName: 'email', DisplayName: 'email'},
                    {FieldName: 'login_type', DisplayName: '账号类型'},/*
                    {FieldName: 'containerName', DisplayName: '容器名'},
                    {FieldName: 'port_80', DisplayName: '80端口'},
                    {FieldName: 'port_27017', DisplayName: '数据库端口'},*/
                    {FieldName: 'expirationTime', DisplayName: '过期时间', Formatter: $scope.formatterDate},
                    {FieldName: 'status', DisplayName: '状态'}
                ],
                colsOpr: {
                    headName: '操作',
                    headClass: '',
                    init: {

                        showView: true,
                        viewFn: function (data) {
                            $scope.view(data);
                        },
                        /*showEdit: true,
                        editFn: function (data) {
                            $scope.edit(data);
                        },
                        showDelete: true,
                        delFn: function (data) {
                            $ui.confirm("确认删除？", "确认", function () {
                                $scope.del(data._id.$id);
                            });
                        }*/
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
                $request.get('api/?model=erp&action=erp_container_lists&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
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
                $scope.initGridData();
            }

            $scope.view = function(data){
                var data = data;
                $ui.openWindow('views/erp/showContainer.html', 'erpShowContainerCtrl', data, function (data) {
                    $scope.initGridData();
                }, function (data) {});
            }


            $scope.edit = function (channel) {
                var data = {
                    'operator': 'edit',
                    'category': $scope.currentCategory,
                    'channel': channel
                }
                $ui.openWindow('views/logistic/addChannelTpl.html', 'logisticaddChannelTplCtrl', data, function (data) {
                    $scope.getChannels();
                }, function (data) {

                });

            }


            $scope.del = function (id) {
                $request.get('api/?model=erp&action=del_container&id=' + id, function (response) {
                    $scope.initGridData();
                });
            }

            $scope.isAdd = false;


        }])
})