'use strict'
define([], function () {
    angular.module('permissionMenuModule', [])
        .controller("permissionMenuCtrl", ['$scope', '$ui', '$validate', '$request',
            function ($scope, $ui, $validate, $request) {

                function setParent(root, menu) {
                    if ($validate.isEmpty(root)) {
                        root = {};
                        root.name = "根节点";
                        root.code = "root";
                    }
                    var data = {};
                    if (!$validate.isEmpty(menu)) {
                        data = menu;
                    }
                    data.pcode = root.code;
                    data.pname = root.name;
                    return data;
                }

                $scope.add = function (root) {
                    var data = setParent(root);
                    $ui.openWindow('views/permission/editmenu.html', 'permissionEditMenuCtrl', data, function (result) {
                        if (result) $scope.initData();
                    });
                }

                $scope.edit = function (menu, root) {
                    var data = setParent(root, menu);
                    $ui.openWindow('views/permission/editmenu.html', 'permissionEditMenuCtrl', data, function (result) {
                        if (result) $scope.initData();
                    });
                }

                $scope.del = function (item) {
                    if (item.hasChild) {
                        $ui.notify("菜单存在子节点，不能删除")
                        return false;
                    }
                    $ui.confirm("确认删除？", "确认", function () {
                        $request.get('api/?model=menu&action=remove_menu&id=' + item._id.$id, function (response) {
                            if (response.success) {
                                $scope.initData();
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (error) {
                            $ui.error(error)
                        });
                    })
                }

                $scope.initData = function () {

                    function dataConvert(data) {
                        function sortup(x, y) {
                            return (x.sort < y.sort) ? -1 : 1
                        }

                        var roots = [];
                        var children = [];
                        angular.forEach(data, function (item) {
                            if (item.pcode == 'root') {
                                item.children = [];
                                item.hasChild = false;
                                roots.push(item);
                            } else {
                                children.push(item);
                            }
                        });

                        angular.forEach(children, function (child) {
                            angular.forEach(roots, function (root) {
                                if (child.pcode == root.code) {
                                    root.children.push(child);
                                    root.hasChild = true;
                                }
                            });
                        });

                        angular.forEach(roots, function (root) {
                            root.children.sort(sortup);
                        })

                        roots.sort(sortup);
                        return roots;
                    }

                    $request.get('api/?model=menu&action=get_menus', function (response) {
                        if (response.success) {
                            $scope.menus = dataConvert(response.data);
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