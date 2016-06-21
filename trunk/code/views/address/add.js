/**
 * Created by Administrator on 2016/1/27.
 */

'use strict'
define(['angular-city'], function () {
    angular.module('addressAddModule', [])
        .controller('addressAddCtrl', ['$scope', '$ui', '$uibModalInstance',
            function ($scope, $ui, $uibModalInstance) {

            $scope.user = {};
            $scope.user.is_default = false;

            $scope.cancel = function () {
                $uibModalInstance.close();
            }

            $scope.addAddress = function (invalid) {
                if(invalid){
                    return false;
                }

                $uibModalInstance.close($scope.user);
            }



        }])
})
