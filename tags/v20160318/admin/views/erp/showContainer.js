'use strict'
define([], function () {
    angular.module('erpShowContainerModule', [])
        .controller("erpShowContainerCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData','$filter', function (
            $scope, $ui, $validate, $request, $uibModalInstance, modalData,$filter) {
            $scope.container = {};

            if (!$validate.isEmpty(modalData) && !$validate.isEmpty(modalData._id)) {
                $scope.container = modalData;

                $scope.container.expirationTime = $filter('date')($scope.container.expirationTime*1000,'yyyy-MM-dd');
            }
            //消费记录
            $request.get('api/?model=erp&action=user_qb&uid='+$scope.container.user_ObjectId.$id, function (response) {
                if (response.success) {
                   $scope.qbData = response.data;
                } else if (angular.isUndefined(response.success)) {
                    $ui.error(response);
                } else {
                    $ui.error(response.error);
                }
            });


            $scope.reset = function () {
                $scope.container = {};
            }

            $scope.cancel = function () {
                $uibModalInstance.close();
            }


        }])
})
