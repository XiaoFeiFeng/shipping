/**
 * Created by fengxiaofei on 2016/2/26.
 */

define([], function () {

    angular.module('orderSuccessModule', [])
        .controller('orderSuccessCtrl', ['$scope', '$ui', '$store', '$data', '$timeout',
            function ($scope, $ui, $store, $data, $timeout) {

                $scope.back = function () {
                    $ui.locate("#");
                }

                $scope.init = function () {
                    var params = $ui.getUrlParam();
                    if (!params) {
                        $ui.locate500();
                        return false;
                    }
                    $scope.title = params.title;
                    $scope.message = params.message;
                }

                $scope.init();
            }]);
})