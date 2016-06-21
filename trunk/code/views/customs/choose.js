/**
 * Created by Administrator on 2016/3/15.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('customsChooseModule', [])
        .controller('customsChooseCtrl', ['$scope', '$store', '$uibModalInstance', 'modalData',
            function ($scope, $store, $uibModalInstance, modalData) {

                $scope.check = function (index) {
                    for (var i in $scope.user.customs) {
                        if (i == index) {
                            $scope.user.customs[i].checked = true;
                        }
                        else {
                            $scope.user.customs[i].checked = false;
                        }
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.submit = function () {
                    var data = {};
                    for (var i in $scope.user.customs) {
                        if ($scope.user.customs[i].checked) {
                            data = $scope.user.customs[i];
                            break;
                        }
                    }
                    if (data.chineseName) {
                        $uibModalInstance.close(data);
                    }
                }

                $scope.init = function () {
                    $scope.user = $store.getUserInfo();
                    if (!$scope.user || !$scope.user.customs) {
                        return false;
                    }
                    for (var i in $scope.user.customs) {
                        if ($scope.user.customs[i].is_default) {
                            $scope.user.customs[i].checked = true;
                        }
                    }
                }

                $scope.init();

            }
        ])
})