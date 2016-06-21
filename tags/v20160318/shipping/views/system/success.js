/**
 * Created by fengxiaofei on 2016/2/26.
 */

define([], function () {

    angular.module('orderSuccessModule', [])
        .controller('orderSuccessCtrl', ['$scope', '$ui', '$store', '$data', '$timeout',
            function ($scope, $ui, $store, $data, $timeout) {

                var params = $ui.getUrlParam();
                if (!params) {
                    $ui.locate500();
                }
                $scope.message = params.message;

            }]);
})