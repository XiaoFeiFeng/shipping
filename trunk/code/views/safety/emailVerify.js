/**
 * Created by fengxiaofei on 2016/1/18.
 */
'use strict'
define([], function () {

    angular.module("safetyEmailVerifyModule", [])
        .controller('safetyEmailVerifyCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store',
            function ($scope, $request, blockUI, $data, $ui, $store) {

                $scope.getTelCode = function () {
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

                $scope.submit = function (invalid) {

                    if (invalid) return false;

                    var code = $data.MD5($scope.user.telcode);

                    if ($scope.code == 0 || code != $scope.code) {
                        var element = $(emailVerifyForm.telcode)
                        var parentElement = element.parent();
                        parentElement.addClass('has-error');
                        var showMsg = '<span class="help-block dir-error">验证码不正确</span>';
                        element.after(showMsg);
                        return false;
                    }

                    $ui.locatePart('/safety/emailAlter');

                }

                $scope.init = function () {
                    $scope.user = $store.getUserInfo();
                    var telephone = $scope.user.telephone;
                    if (telephone) {
                        $scope.telephone = telephone.substring(0, 3) + "****" + telephone.substring(7, 11);
                    }

                    $scope.code = 0;
                }

                $scope.init();
            }]);
})