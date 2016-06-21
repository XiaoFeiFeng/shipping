'use strict'
define([], function () {
    angular.module('permissionEditMenuModule', [])
        .controller("permissionEditMenuCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $validate, $request, $uibModalInstance, modalData) {

                if ($validate.isEmpty(modalData) || $validate.isEmpty(modalData.pcode)) {
                    $uibModalInstance.close();
                }
                $scope.pcode = modalData.pcode;
                $scope.menu = modalData;

                if (!$validate.isEmpty(modalData._id)) {
                    $scope.isEdit = true;
                }
                if ($validate.isEmpty(modalData.permissions)) {
                    $scope.menu.permissions = [];
                }

                $scope.permission = {};

                $scope.removePermission = function (item) {
                    $scope.menu.permissions.remove(item);
                }
                $scope.addPermission = function () {
                    if ($validate.isEmpty($scope.permission.name) || $validate.isEmpty($scope.permission.code)) {
                        $ui.error("请输入权限名称和权限Code");
                        return false;
                    }
                    $scope.permission.code += $scope.menu.code;
                    $scope.menu.permissions.push(angular.copy($scope.permission));
                    $scope.permission = {};
                }

                $scope.submitForm = function () {
                    var data = angular.copy($scope.menu);
                    data.pcode = $scope.pcode;

                    delete data._id;
                    delete data.pname;
                    delete data.children;
                    delete data.hasChild;

                    if ($scope.isEdit) {
                        $request.post('api/?model=menu&action=edit_menu&id=' + $scope.menu._id.$id,
                            data,
                            function (response) {
                                if (response.success) {
                                    $ui.notify('保存成功！', '提示',
                                        function () {
                                            $uibModalInstance.close(true);
                                        })
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error('添加失败，' + err, '错误');
                            });
                    } else {
                        $request.post('api/?model=menu&action=add_menu',
                            data,
                            function (response) {
                                if (response.success) {
                                    $ui.confirm('添加成功，是否继续添加?', '确认',
                                        function () {
                                            $scope.reset()
                                            $scope.isAdded = true;
                                        },
                                        function () {
                                            $uibModalInstance.close(true);
                                        })
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }

                            }, function (err) {
                                $ui.error('添加失败，' + err, '错误');
                            });
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.close($scope.isAdded);
                }

                $scope.reset = function () {
                    $scope.menu = {};
                }
            }
        ])
})