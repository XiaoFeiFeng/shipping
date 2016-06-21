'use strict'
define([], function () {
    angular.module('permissionSetPermissionModule', [])
        .controller("permissionSetPermissionCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $validate, $request, $uibModalInstance, modalData) {

                $scope.checkAllPer = function (menus) {
                    if (!$validate.isArray(menus)) {
                        return;
                    }
                    menus.forEach(function (menu) {
                        if (menu.permissions && menu.permissions.length > 0) {
                            menu.permissions.forEach(function (per) {
                                per.checked = $scope.isAllChecked;
                            })
                        }
                        if (menu.hasChild) {
                            $scope.checkAllPer(menu.children);
                        }
                    });
                }

                $scope.check = function (item) {
                    $scope.isAllChecked = $scope.isAllCheckedFn($scope.menus, item.checked)
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.submit = function () {
                    var data = angular.copy($scope.role);
                    $scope.datas = [];
                    $scope.getChecked($scope.menus);
                    data.permissions = $scope.datas;
                    delete data._id;
                    delete data.$checked;

                    $request.post('api/?model=role&action=edit_role&id=' + $scope.role._id.$id,
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
                }

                $scope.getChecked = function (menus) {

                    if (!$validate.isArray(menus))
                        return;

                    menus.forEach(function (menu) {
                        if ($validate.isArray(menu.permissions)) {
                            menu.permissions.forEach(function (per) {
                                if (per.checked) {
                                    $scope.datas.push(per.code);
                                }
                            })
                        }
                        if (menu.hasChild)  $scope.getChecked(menu.children);
                    })
                }

                $scope.isAllCheckedFn = function (menus, checked) {
                    if ($validate.isArray(menus)) {
                        for (var i = 0; i < menus.length; i++) {
                            var menu = menus[i];
                            if ($validate.isArray(menu.permissions)) {
                                for (var p = 0; p < menu.permissions.length; p++) {
                                    if (menu.permissions[p].checked != checked)
                                        return false;
                                }
                            }
                            if (menu.hasChild) {
                                if (!$scope.isAllCheckedFn(menu.children, checked))
                                    return false;
                            }
                        }
                    }
                    return true;
                }

                $scope.initData = function () {

                    $scope.role = modalData;

                    if ($validate.isEmpty(modalData.permissions)) {
                        $scope.role.permissions = [];
                    }

                    function dataConvert(data) {
                        function sortup(x, y) {
                            return (x.sort < y.sort) ? -1 : 1
                        }

                        var roots = [];
                        var children = [];
                        data.forEach(function (item) {
                            if (item.pcode == 'root') {
                                item.children = [];
                                roots.push(item);
                            } else {
                                children.push(item);
                            }
                        });
                        children.forEach(function (child) {
                            roots.forEach(function (root) {
                                if (child.pcode == root.code) {
                                    root.children.push(child);
                                    root.hasChild = true;
                                }
                            });
                        });
                        roots.forEach(function (root) {
                            root.children.sort(sortup);
                        })
                        roots.sort(sortup);
                        return roots;
                    }

                    function hasPermission(per) {
                        if (!$validate.isArray($scope.role.permissions)) return;

                        for (var i = 0; i < $scope.role.permissions.length; i++) {
                            if ($scope.role.permissions[i] == per.code)
                                return true;
                        }
                        return false;
                    }

                    function checkedInit(data) {
                        for (var i in data) {
                            var menu = data[i];
                            for (var p in menu.permissions) {
                                var per = menu.permissions[p];
                                per.checked = hasPermission(per);
                            }
                        }
                        return data;
                    }

                    $request.get('api/?model=menu&action=get_menus', function (response) {
                        if (response.success) {
                            var data = checkedInit(response.data);
                            $scope.menus = dataConvert(data);
                            $scope.isAllChecked = $scope.isAllCheckedFn($scope.menus, true);
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    });
                }

                $scope.initData();
            }
        ])
})