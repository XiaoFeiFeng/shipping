/**
 * Created by Administrator on 2016/1/11.
 */
'use strict'
define([], function () {

    angular.module("userPassResetModule", [])
        .controller('userPassResetCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store',
            function ($scope, $request, blockUI, $data, $ui, $store) {
                $scope.user = {};
                $scope.error = false;
                $scope.code = 0;

                $scope.getTelCode = function () {
                    $request.getWithNoBlock('api/?model=config&action=get_telcode', null,
                        function (response) {
                            if (response.success) {
                                $scope.code = response.data;
                                $scope.user.telcode = response.data + "";//临时验证码
                                $scope.telcodeTimeout = 300;
                                var timer = setInterval(function () {
                                    $scope. $apply(function () {
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

                    var code = $data.MD5($scope.user.telcode);

                    if ($scope.code == 0 || $scope.user.telcode != $scope.code) {
                        var element = $(passResetForm.telcode)
                        var parentElement = element.parent();
                        parentElement.addClass('has-error');
                        var showMsg = '<span class="help-block dir-error">验证码不正确</span>';
                        element.after(showMsg);
                        return false;
                    }

                    var data = angular.copy($scope.user);
                    delete data.telcode;

                    $request.post("api/?model=user&action=pass_reset", data, function (response) {
                        if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else if (response.success) {
                            $ui.notify("密码已经重置，新密码我们会以短信方式发送给您，请注意查收！", "提示", function () {
                                $scope.error = "临时实现，新密码：" + response.data;
                                //$ui.locate("#/user/login");
                            })
                        } else {
                            $scope.error = response.error;
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
                }
            }]);
})