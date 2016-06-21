'use strict'
define([], function () {
    angular.module('channelCategoryModule', [])
        .controller("channelCategoryCtrl", ['$scope', '$ui', '$request', '$validate', function ($scope, $ui, $request, $validate) {
            $scope.categorys = [];
            $scope.category = {};
            $scope.isEdit = false;

            $scope.getCategory = function () {
                $request.get(
                    'api/?model=channel&action=logistic_category',
                    function (response) {
                        if (response.success) {
                            $scope.categorys = response.data;
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }

                    }, function (err) {
                        $ui.error('错误', err);
                    });
            }


            $scope.addCategory = function () {
                if ($validate.isEmpty($scope.category)) {
                    return;
                }
                $request.post('api/?model=channel&action=add_logistic_category',
                    $scope.category,
                    function (response) {
                        if (response.success) {
                            $ui.notify('添加成功', '提示', function () {
                                $scope.getCategory();
                            });
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }

                    }, function (err) {
                        $ui.error('添加失败，' + err, '错误');
                    });
            }

            $scope.saveCategory = function () {
                if ($validate.isEmpty($scope.category)) {
                    return;
                }
                var data = {
                    name: $scope.category.name,
                    code: $scope.category.code
                }
                $request.post('api/?model=channel&action=edit_logistic_category&id=' + $scope.category._id.$id,
                    data,
                    function (response) {
                        if (response.success) {
                            $ui.notify('保存成功', '提示', function () {
                                $scope.getCategory();
                            });
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }

                    }, function (err) {
                        $ui.error('保存失败，' + err, '错误');
                    });
            }
            $scope.reset = function () {
                $scope.category = {};
                $scope.isEdit = false;
            }

            $scope.modifyCategory = function (channel) {
                $scope.category = angular.copy(channel);
                $scope.isEdit = true;
            }

            $scope.delCategory = function (channel) {
                $ui.confirm("确认删除？", '确认', function () {
                    $request.get('api/?model=channel&action=remove_logistic_category&id=' + channel._id.$id,
                        function (response) {
                            if (response.success) {
                                $ui.notify('删除成功', '提示');
                                $scope.getCategory();
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }

                        }, function (err) {
                            $ui.error('删除失败，' + err, '错误');
                        });

                })
            }

            $scope.getCategory();


        }])
})