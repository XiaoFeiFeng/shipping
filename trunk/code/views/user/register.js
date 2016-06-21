/**
 * Created by Administrator on 2016/1/7.
 */

'use strict'

define([], function () {
    angular.module("userRegisterModule", [])
        .controller("userRegisterCtrl", ['$scope', '$ui', '$q', '$request', '$data', function ($scope, $ui, $q, $request, $data) {

            $scope.checkKeyValid = function (input) {
                var deferred = $q.defer();
                var url = 'api/?model=user&action=checkAccount&name=' + input;
                $request.getWithNoBlock(url,
                    function (response) {
                        if (response.success) {
                            if (response.data && response.data.length > 0)
                                deferred.resolve(false);
                            else
                                deferred.resolve(true);
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
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

            $scope.cleanError = function () {
                $scope.error = false;
            }

            $scope.submitForm = function (invalid) {

                if (invalid)return false;

                var code = $data.MD5($scope.user.telcode);

              /*  if ($scope.code == 0 || code != $scope.code) {
                    var element = $(registerForm.telcode)
                    var parentElement = element.parent();
                    if (parentElement[0].className.indexOf("has-error") > -1) {
                        return false;
                    }
                    parentElement.addClass('has-error');
                    var showMsg = '<span class="help-block dir-error">验证码不正确</span>';
                    element.after(showMsg);
                    return false;
                }*/
                if (!$scope.protocol) {
                    $scope.error = "请先阅读易联速递用户注册协议";
                    return false;
                } else {
                    $scope.error = false;
                }

                var data = angular.copy($scope.user);
                delete data.confirmPassword;
                delete data.telcode;
                data.used = true;
                data.roles = [];
                data.roles.push("user");
                data.password = $data.MD5(data.password);
                $request.post('api/?model=user&action=add_user',
                    data,
                    function (response) {
                        if (response.success) {
                            $ui.notify('注册成功，请登录!', '提示', function () {
                                $ui.locatePart('/user/login');
                            });
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error('添加失败，' + err, '错误');
                    });
            }

            $scope.init = function () {
                $scope.user = {};
                $scope.code = 0;

            }

            $scope.init();

        }])
})
