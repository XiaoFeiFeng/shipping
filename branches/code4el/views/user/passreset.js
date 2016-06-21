/**
 * Created by Administrator on 2016/1/11.
 */
'use strict'
define([], function () {

    angular.module("userPassResetModule", [])
        .controller('userPassResetCtrl', ['$scope', '$request', '$data', '$ui', '$config',
            function ($scope, $request, $data, $ui, $config) {

                $scope.typeChange = function (type) {
                    $scope.resetType = type;
                }

                $scope.exchangeImg = function () {
                    $scope.checkImgSrc = $config.getCheckImg();
                }


                $scope.getTelCode = function (invalid) {
                    if (invalid) return false;
                    $request.getWithNoBlock('api/?model=config&action=get_telcode&tel=' + $scope.user.telephone,
                        function (response) {
                            if (response.success) {
                                $scope.code = response.data;
                                $scope.telcodeTimeout = 300;
                                var timer = setInterval(function () {
                                    $scope.$apply(function () {
                                        $scope.telcodeTimeout--;
                                        if ($scope.telcodeTimeout == 0) {
                                            clearInterval(timer);
                                            $scope.code = 0;
                                        }
                                    })
                                }, 1000);
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (result) {
                            deferred.reject(result);
                        });
                }

                $scope.submitForm = function (invalid) {

                    if (invalid)  return false;

                    if ($scope.resetType == 'email') {

                        $scope.sendReset();
                    } else {
                        $scope.inputCode = $data.MD5($scope.user.telcode);

                        if ($scope.code == 0 || $scope.inputCode != $scope.code) {
                            $scope.error = "验证码不正确";
                            return false;
                        }


                        $scope.sendReset();
                    }
                }

                $scope.sendReset = function () {

                    var data = angular.copy($scope.user);
                    data.type = $scope.resetType;
                    data.code = $scope.inputCode;

                    $request.post("api/?model=user&action=pass_reset", data, function (response) {
                        if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else if (response.success) {
                            var notify = $scope.resetType == "email" ? "重置连接已发送至您的预留邮箱，请根据提示重置密码" : "密码已经重置，新密码我们会以短信方式发送给您，请注意查收！";
                            $ui.notify(notify, "提示", function () {
                                $ui.locate("user.html#/user/login");
                            })
                        } else {
                            $scope.error = response.error;
                        }
                        $scope.exchangeImg();
                    }, function (err) {
                        $ui.error(err);
                        $scope.exchangeImg();
                    });
                }

                $scope.init = function () {
                    $scope.user = {};
                    $scope.error = false;
                    $scope.code = 0;
                    $scope.resetType = "email";
                    $scope.exchangeImg();
                }

                $scope.init();
            }]);
})