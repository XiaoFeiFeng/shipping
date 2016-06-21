/**
 * Created by Administrator on 2016/1/28.
 */

'use strict'
define(['angular-city'], function () {
    angular.module('addressCompileModule', [])
        .controller('addressCompileCtrl', ['$scope', '$ui', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $uibModalInstance, modalData) {

                $scope.city = {};

                if (modalData) {
                    $scope.result = modalData;
                    $scope.city = modalData.district;
                }

                //关闭窗口
                $scope.cancel = function () {
                    $uibModalInstance.close(false);
                }
                //保存
                $scope.save = function (invalid) {
                    if (invalid) {
                        return false;
                    }

                    if (modalData) {
                        delete $scope.result.district;
                    }
                    $scope.result.district = $scope.city.cn;
                    $uibModalInstance.close($scope.result);
                }

            }])
})
