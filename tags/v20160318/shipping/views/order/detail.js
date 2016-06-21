/**
 * Created by fengxiaofei on 2016/2/16.
 */

define([], function () {

    angular.module('orderDetailModule', [])
        .controller('orderDetailCtrl', ['$scope', '$ui', '$store', '$timeout', '$request', '$state', '$rootScope',
            function ($scope, $ui, $store, $timeout, $request, $state, $rootScope) {

                if (!$rootScope.logined) {
                    $ui.locateLogin();
                }

                $scope.user = $store.getUserInfo();

                if (!$scope.user) {
                    $ui.locateLogin();
                }

                var params = $ui.getUrlParam();
                if (!params) {
                    $ui.locate500();
                }

                $scope.init = function () {

                    $request.get('api/?model=order&action=get_order_bycode&uid=' + $scope.user._id.$id + "&code=" + params.key,

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

                $scope.change = function () {

                }

            }]);

})