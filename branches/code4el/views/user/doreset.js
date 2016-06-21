/**
 * Created by fengxiaofei on 2016/4/5.
 */
'use strict'
define([], function () {

    angular.module("userDoResetModule", [])
        .controller('userDoResetCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store',
            function ($scope, $request, blockUI, $data, $ui, $store) {

                $scope.submitForm = function (invalid) {

                    if (invalid) return false;

                    var data = {}
                    data.password = $data.MD5($scope.user.password);

                    $request.post("api/?model=user&action=edit_user&id=" + $scope.user.id, data, function (response) {
                        if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else if (response.success) {
                            $ui.notify("密码已经重置，请使用新密码登录", "提示", function () {
                                $ui.locate("user.html#/user/login")
                            });
                        } else {
                            $scope.error = response.error;
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
                }
                $scope.init = function () {
                    var data = $ui.getKeyByUrl();
                    $request.post("api/?model=user&action=params_decrypt", data, function (response) {
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

                            var date = new Date(parseInt($scope.user.time) * 1000);
                            var timeNow = new Date();

                            var temp = (timeNow.getTime() - date.getTime()) / 1000;
                            if (temp > 86400) { //大于一天过期
                                $ui.locateCustomError("重置信息已过期.");
                                return false;
                            }

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