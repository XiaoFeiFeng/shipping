/**
 * Created by fengxiaofei on 2016/2/23.
 */
'use strict'
define([], function () {

    angular.module("userEmailCheckedModule", [])
        .controller('userEmailCheckedCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store',
            function ($scope, $request, blockUI, $data, $ui, $store) {

                $scope.init = function () {
                    var data = $ui.getKeyByUrl();
                    $request.post("api/?model=user&action=email_decrypt", data, function (response) {
                        if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else if (response.success) {
                            var result = {};
                            var args = response.data.split('&');
                            if (args.length > 0) {
                                angular.forEach(args, function (arg) {
                                    var kv = arg.split('=');
                                    if (kv.length > 1) {
                                        result[kv[0]] = kv[1];
                                    }
                                });
                            }
                            $scope.user = result;
                        } else {
                            $scope.error = response.error;
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
                }
                $scope.submitForm = function () {

                    var data = angular.copy($scope.user);
                    var date = new Date(parseInt(data.time) * 1000);
                    var timeNow = new Date();

                    var temp = (timeNow.getTime() - date.getTime()) / 1000;
                    if (temp > 86400) { //大于一天过期
                        $ui.error("验证信息已过期.");
                        return false;
                    }

                    $request.post("api/?model=user&action=email_check_submit", data, function (response) {
                        if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else if (response.success) {
                            $ui.locate("shipping/user.html#/user/emailfinish");
                        } else {
                            $scope.error = response.error;
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
                }

                $scope.init();
            }]);
})