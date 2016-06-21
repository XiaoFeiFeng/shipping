/**
 * Created by fengxiaofei on 2016/2/23.
 */
'use strict'
define([], function () {

    angular.module("safetyTelVerifyModule", [])
        .controller('safetyTelVerifyCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store',
            function ($scope, $request, blockUI, $data, $ui, $store) {

                $scope.user = $store.getUserInfo();
                var telephone = $scope.user.telephone;
                if (telephone) {
                    $scope.telephone = telephone.substring(0, 3) + "****" + telephone.substring(7, 11);
                }

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

                $scope.submit = function (invalid) {

                    if (invalid) return false;

                    var code = $data.MD5($scope.user.telcode);

                    if ($scope.code == 0 || $scope.user.telcode != $scope.code) {
                        var element = $(passResetForm.telcode)
                        var parentElement = element.parent();
                        parentElement.addClass('has-error');
                        var showMsg = '<span class="help-block dir-error">验证码不正确</span>';
                        element.after(showMsg);
                        return false;
                    }

                    var data = {};
                    data.id = $scope.user._id.$id;
                    data.telephone = $scope.user.telephone;

                    $request.post('api/?model=user&action=tel_check',
                        data,
                        function (response) {
                            if (response.success) {

                                $scope.user.telephone = data.telephone;
                                $scope.user.telchecked = true;
                                $store.setUserInfo($scope.user);
                                setTimeout(function () {
                                    $ui.locatePart('/safety/telFinish');
                                }, 100);

                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (err) {
                            $ui.error('发送失败' + err);
                        });
                }
            }]);
})