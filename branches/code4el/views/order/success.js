/**
 * Created by fengxiaofei on 2016/2/26.
 */

define([], function () {

    angular.module('orderSuccessModule', [])
        .controller('orderSuccessCtrl', ['$scope', '$ui', '$store', '$data', '$timeout',
            function ($scope, $ui, $store, $data, $timeout) {

                var params = $ui.getKeyByUrl();
                if (!params) {
                    $ui.locate500();
                }
                if (!$store.getJson("orderInfo" + params.key)) {
                    $ui.locate500();
                }

                $scope.key = params.key;
                $store.remove("orderInfo" + params.key)

            }]);
})