'use strict'

define([], function () {
    angular.module('merchantCompanyDetailModule', [])
        .controller("merchantCompanyDetailCtrl", ['$scope', '$request', '$ui', '$data', '$uibModalInstance', 'modalData',
            function ($scope, $request, $ui, $data, $uibModalInstance, modalData) {

                $scope.merchant = modalData;

                $scope.getImage = function (path) {
                    return "/" + path;
                }

                $scope.openImage = function (path) {
                    window.open("/" + path);
                }

                $scope.getAddress = function () {
                    return $data.getAddress($scope.merchant);
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.submitForm = function (state, invalid) {
                    if (state == -1 && invalid) {
                        $ui.notify("请输入拒绝理由", "提示");
                        return false;
                    }
                    var confirmMsg = state == 1 ? "确认通过审核" : "确认拒绝通过";
                    $ui.confirm(confirmMsg, "确认", function () {
                        var data = {"state": state, "message": $scope.merchant.message};
                        $request.post('api/?model=merchant&action=edit&id=' + $scope.merchant._id.$id,
                            data,
                            function (response) {
                                if (response.success) {
                                    $scope.pushRole();
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error('提交失败，' + err, '错误');
                            });
                    }, function () {
                        return false;
                    });
                }

                $scope.pushRole = function () {
                    var data = {"roles": "merchant"};
                    $request.post('api/?model=user&action=push_role&id=' + $scope.merchant.userId,
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify('提交成功！', '提示',
                                    function () {
                                        $uibModalInstance.close(true);
                                    })
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (err) {
                            $ui.error('提交失败，' + err, '错误');
                        });
                }
            }
        ])

})