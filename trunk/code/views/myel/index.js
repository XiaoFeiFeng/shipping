/**
 * Created by fengxiaofei on 2016/1/14.
 */
define([], function () {

    angular.module('myelIndexModule', [])
        .controller('myelIndexCtrl', ['$scope', '$ui', '$store', '$request', '$data',
            function ($scope, $ui, $store, $request, $data) {

                $scope.userInfo = $store.getUserInfo()
                $scope.orders = {};

                $scope.getState = function (state) {
                    return $data.getOrderState(state);
                }
                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }
                $scope.init = function () {
                    $request.get('api/?model=order&action=get_order_byuser&pi=1&ps=5&uid=' + $scope.userInfo._id.$id, function (response) {
                        if (response.success) {
                            $scope.orders = response.data;

                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    });
                }
                $scope.init();
            }])
})
