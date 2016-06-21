/**
 * Created by fengxiaofei on 2016/3/16.
 */

define([], function () {

    angular.module('orderClientDetailModule', [])
        .controller('orderClientDetailCtrl', ['$scope', '$ui', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $request, $uibModalInstance, modalData) {


                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.init = function () {

                    if (!modalData) {
                        $uibModalInstance.close();
                        return false;
                    }

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