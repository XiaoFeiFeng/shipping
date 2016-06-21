'use strict'
define([], function () {
    angular.module('permissionSetUserRoleModule', [])
        .controller("permissionSetUserRoleCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $validate, $request, $uibModalInstance, modalData) {

                $scope.submit = function () {

                    var data = angular.copy($scope.user);
                    data.roles = [];
                    $scope.roles.forEach(function (role) {
                        if (role.checked) {
                            data.roles.push(role.code);
                        }
                    })

                    delete data._id;
                    delete data.$checked;

                    $request.post('api/?model=user&action=edit_user&id=' + $scope.user._id.$id,
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
                            $ui.error('修改失败，' + err, '错误');
                        });
                }

                $scope.cancel = function () {
                    $uibModalInstance.close($scope.isAdded);
                }

                $scope.reset = function () {
                    $scope.user = {};
                }

                $scope.initChecked = function () {
                    for (var i = 0; i < $scope.roles.length; i++) {
                        $scope.roles[i].checked = false;
                        for (var u = 0; u < $scope.user.roles.length; u++) {
                            if ($scope.roles[i].code == $scope.user.roles[u]) {
                                $scope.roles[i].checked = true;
                            }
                        }
                    }
                }

                $scope.init = function () {
                    if ($validate.isEmpty(modalData)) {
                        $ui.error("参数错误", function () {
                            $uibModalInstance.close();
                        });
                    }
                    $scope.user = modalData;
                    if ($validate.isEmpty($scope.user.roles)) {
                        $scope.user.roles = [];
                    }

                    $request.get('api/?model=role&action=get_roles', function (response) {
                        if (response.success) {
                            $scope.roles = response.data;
                            $scope.initChecked();
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    });
                }

                $scope.init();
            }
        ])
})