/**
 * Created by Administrator on 2016/3/7.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('customsEditModule', [])
        .controller('customsEditCtrl', ['$scope', '$ui', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $uibModalInstance, modalData) {

                $scope.user = modalData;
                console.log(modalData);

                $scope.cancel = function () {
                    $uibModalInstance.close(false);
                }

                $scope.submit = function (invalid) {
                    if (invalid) {
                        return false;
                    }

                    $uibModalInstance.close($scope.user);
                }
            }])
})
