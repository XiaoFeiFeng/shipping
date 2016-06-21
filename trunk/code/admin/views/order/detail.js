/**
 * Created by fengxiaofei on 2016/2/16.
 */

define([], function () {

    angular.module('orderDetailModule', [])
        .controller('orderDetailCtrl', ['$scope', '$ui', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $request, $uibModalInstance, modalData) {

                if (!modalData) {
                    $uibModalInstance.close();
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.init = function () {
                    $request.get('api/?model=order&action=get_byid&id=' + modalData,
                        function (response) {
                            if (response.success) {
                                $scope.order = response.data;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        },
                        function (err) {
                            $ui.error(err, '错误');
                        }
                    );
                }

                $scope.init();

            }]);

})