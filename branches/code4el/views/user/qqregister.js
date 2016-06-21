/**
 * Created by Administrator on 2016/3/2.
 */

'use strict'

define([], function () {
    angular.module("userQqregisterModule", [])
        .controller("userQqregisterCtrl", ['$scope', '$ui', '$q', '$request', '$data', '$store',
            function ($scope, $ui, $q, $request, $data, $geturl, $store) {


                $scope.getTelCode = function (ivalid) {
                    if (invalid) return false;
                    $request.getWithNoBlock('api/?model=config&action=get_telcode&tel=' + $scope.user.telephone,
                        function (response) {
                            if (response.success) {
                                $scope.code = response.data;
                                $scope.user.telcode = response.data + "";//临时验证码
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

                    if (invalid)return false;

                    var code = $data.MD5($scope.user.telcode);

                    if ($scope.code == 0 || code != $scope.code) {
                        var element = $(registerForm.telcode)
                        var parentElement = element.parent();
                        parentElement.addClass('has-error');
                        var showMsg = '<span class="help-block dir-error">验证码不正确</span>';
                        element.after(showMsg);
                        return false;
                    }

                    var data = angular.copy($scope.user);
                    delete data.confirmPassword;
                    data.telcode = code;
                    data.used = true;
                    data.roles = [];
                    data.roles.push("user");
                    data.password = $data.MD5(data.password);

                    $request.post('api/?model=user&action=add_user',
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify('注册成功!', '提示', function () {

                                    if ($scope.user.qqid) {
                                        var idkey = 'qqid';
                                        var idval = $scope.user.qqid;
                                        var action = 'get_user_name';
                                    } else {
                                        var idkey = 'aliId';
                                        var idval = $scope.user.aliId;
                                        var action = 'get_user_ali';
                                    }

                                    $request.get('api/?model=user&action=' + action + '&' + idkey + '=' + idval, function (response) {
                                        if (response.success) {
                                            $store.setUserInfo(response.data);
                                            location.href = '#';
                                        } else {
                                            $ui.error(response.error);
                                        }
                                    }, function (err) {
                                        $ui.error(err);
                                    })

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
                    var request = $ui.getKeyByUrl();
                    if (request) {
                        var qqid = request.openId;
                        var aliId = request.aliId;
                        if (aliId) {
                            $scope.user.aliId = request.aliId;
                        }

                        if (qqid) {
                            $scope.user.name = decodeURI(Request.name);
                            $scope.user.qqid = decodeURI(Request.qqid);
                        }
                    }
                }
                $scope.init();

            }])
})
