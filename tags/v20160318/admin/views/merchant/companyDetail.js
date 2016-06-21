'use strict'

define([], function () {
    angular.module('merchantCompanyDetailModule', [])
        .controller("merchantCompanyDetailCtrl", ['$scope', '$request', '$ui', '$uibModalInstance', 'modalData',
            function ($scope, $request, $ui, $uibModalInstance, modalData) {

                $scope.merchant = modalData;

                $scope.getImage = function (path) {
                    return "http://93myb.com/" + path;
                }

                $scope.getAddress = function () {

                    var address = "";
                    if ($scope.merchant.district && $scope.merchant.district.cn) {
                        angular.forEach($scope.merchant.district.cn, function (cn) {
                            address += cn + " ";
                        })
                    }
                    address += $scope.merchant.address;
                    return address;
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }
                $scope.openImage = function (path) {
                    window.open("http://93myb.com/" + path);
                }
                $scope.submitForm = function (state) {
                    var confirmMsg = state == 1 ? "确认通过审核" : "确认拒绝通过";
                    $ui.confirm(confirmMsg, "确认", function () {
                        var data = {"state": state};
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