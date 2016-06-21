'use strict'
define([], function () {
    angular.module('permissionRoleModule', [])
        .controller("permissionRoleCtrl", ['$scope', '$ui', '$validate', '$request',
            function ($scope, $ui, $validate, $request) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.add = function () {
                    $ui.openWindow('views/permission/editrole.html', 'permissionEditRoleCtrl', null, function (result) {
                        if (result) $scope.initGridData();
                    });
                }
                $scope.edit = function (data) {

                    $ui.openWindow('views/permission/editrole.html', 'permissionEditRoleCtrl', data, function (result) {
                        if (result) $scope.initGridData();
                    });
                }

                $scope.setPermissions = function (data) {
                    $ui.openWindow('views/permission/setpermission.html', 'permissionSetPermissionCtrl', data, function (result) {
                        if (result) $scope.initGridData();
                    });
                }
                $scope.batchDel = function () {
                    var ids = [];
                    angular.forEach($scope.gridOptions.colsChk.data, function (item) {
                        ids.push(item._id.$id);
                    })
                    if (ids.length > 0) {
                        $ui.confirm("确认删除？", "确认", function () {
                            $request.post('api/?model=role&action=remove_roles', ids, function (response) {
                                if (response.success) {
                                    $scope.initGridData();
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error(err);
                            });
                        });
                    }
                }

                $scope.del = function (id) {
                    $request.get('api/?model=role&action=remove_role&id=' + id, function (response) {
                        if (response.success) {
                            $scope.initGridData();
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (error) {
                        $ui.error(error)
                    });
                }

                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'name', DisplayName: '角色名',},
                        {FieldName: 'code', DisplayName: '角色代码',},
                        {FieldName: 'description', DisplayName: '角色描述',},
                        {FieldName: 'permissions', IsShow: false,},
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: false,
                            viewFn: function (data) {
                                alert('view');
                            },
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
                        },
                        colInfo: [
                            {
                                title: '设置角色权限',
                                iconClass: 'fa fa-user',
                                clickFn: function (data) {
                                    $scope.setPermissions(data);
                                },
                            },
                        ],
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
                    $request.get('api/?model=role&action=get_roles&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
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