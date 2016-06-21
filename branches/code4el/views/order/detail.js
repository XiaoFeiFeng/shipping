/**
 * Created by fengxiaofei on 2016/3/23.
 */

define([], function () {

    angular.module('orderDetailModule', [])
        .controller('orderDetailCtrl', ['$scope', '$ui', '$request', '$data',
            function ($scope, $ui, $request, $data) {
                var param = $ui.getUrlParam();
                if (!param) {
                    param = $ui.getKeyByUrl();
                }
                if (!param || !param.id) {
                    $ui.locate500();
                }

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }

                $scope.init = function () {

                    $request.get('api/?model=order&action=get_byid&id=' + param.id,
                        function (response) {
                            if (response.success) {
                                var tracks = response.data.tracks ? response.data.tracks.sortby("time", true) : "";
                                $scope.order = response.data;
                                $scope.order.tracks = tracks;
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