/**
 * Created by Administrator on 2016/1/19.
 */
'use strict'
define([], function () {
    angular.module("safetyChangePassModule", [])
        .controller('safetyChangePassCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store', '$config',
            function ($scope, $request, blockUI, $data, $ui, $store, $config) {

                $scope.exchangeImg = function () {
                    $scope.checkImgSrc = $config.getCheckImg();
                }

                $scope.submitForm = function (invalid) {

                    if (invalid)  return false;

                    $scope.userInfo = $store.getUserInfo();

                    var data = angular.copy($scope.user);
                    data.name = $scope.userInfo.name;
                    data.oldpass = $data.MD5(data.oldpass);
                    data.newpass = $data.MD5(data.newpass);

                    delete data.confirmPassword;

                    $request.post("api/?model=user&action=pass_change", data, function (response) {
                        if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else if (response.success) {
                            $ui.notify("修改成功", "提示", function () {
                                $scope.error = "";
                                //$ui.locate("#/user/login");
                            })
                        } else {
                            $scope.error = response.error;
                            $scope.exchangeImg();
                        }
                    }, function (err) {
                        $ui.error(err);
                    });

                }

                $scope.init = function () {
                    $scope.user = {};
                    $scope.exchangeImg();
                    $scope.error = "";
                }

                $scope.init();

            }
        ])
})