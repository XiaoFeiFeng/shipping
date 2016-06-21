'use strict'
define([], function () {
    angular.module('permissionEditRoleModule', [])
        .controller("permissionEditRoleCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $validate, $request, $uibModalInstance, modalData) {

                $scope.role = {};;
                if (!$validate.isEmpty(modalData) && !$validate.isEmpty(modalData._id)) {
                    $scope.role = modalData;
                    $scope.isEdit = true;
                }
                $scope.wen = function(){
                    console.log($scope.role);
                }
                $scope.submitForm = function () {
                    if ($scope.isEdit) {
                        var data = angular.copy($scope.role);
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
                    } else {
                        $request.post('api/?model=role&action=add_role',
                            $scope.role,
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
                    $scope.role = {};
                }

            }
        ])
})