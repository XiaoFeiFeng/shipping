/**
 * Created by Administrator on 2016/1/15.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('AddressChooseModule', [])
        .controller('AddressChooseCtrl', ['$scope', '$store', '$uibModalInstance', 'modalData',
            function ($scope, $store, $uibModalInstance, modalData) {

                $scope.check = function (index) {
                    for (var i in $scope.user.address) {
                        if (i == index) {
                            $scope.user.address[i].checked = true;
                        }
                        else {
                            $scope.user.address[i].checked = false;
                        }
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.submit = function () {
                    var data = {};
                    for (var i in $scope.user.address) {
                        if ($scope.user.address[i].checked) {
                            data = $scope.user.address[i];
                            break;
                        }
                    }

                    if (data.name) {
                        $uibModalInstance.close(data);
                    }
                }

                $scope.init = function () {
                    var flag = modalData;

                    if (flag == "from") {

                        $scope.user = $store.getUserInfo();
                        if (!$scope.user || !$scope.user.address) {
                            return false;
                        }
                        for (var i in $scope.user.address) {
                            if ($scope.user.address[i].is_default) {
                                $scope.user.address[i].checked = true;
                            }
                        }
                    } else {

                    }
                }

                $scope.init();

            }])
})