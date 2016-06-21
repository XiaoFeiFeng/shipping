/**
 * Created by fengxiaofei on 2016/3/21.
 */
"use strict";
define([], function () {
    angular.module('myelMerchantModule', [])
        .controller('myelMerchantCtrl', ['$scope', '$request', '$store', '$data', '$timeout',
            function ($scope, $request, $store, $data, $timeout) {

                $scope.userInfo = $store.getUserInfo();

                $scope.merchant = $store.getJson("merchantInfo");

                $scope.getAddress = function () {
                    return $data.getAddress($scope.merchant);
                }

                $scope.getState = function () {
                    return $data.getMerchantState($scope.merchant.state);
                }

                $scope.getApplyTime = function () {
                    return $data.getDate($scope.merchant.created_time);
                }

                $scope.init = function () {
                    if (!$scope.merchant) {
                        $request.get('api/?model=merchant&action=get_byuser&userId=' + $scope.userInfo._id.$id,
                            function (response) {
                                if (response.success) {
                                    $scope.merchant = response.data;
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error(err);
                            });
                    }
                }

                $scope.init();

            }]);
});
