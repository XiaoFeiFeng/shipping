/**
 * Created by Administrator on 2016/1/19.
 */
'use strict'
define([], function () {
    angular.module("safetyChangePassModule", [])
        .controller('safetyChangePassCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store',
            function ($scope, $request, blockUI, $data, $ui, $store) {

                $scope.checkImgSrc = "/admin/api/view/img.php";
                $scope.user = {};

                $scope.exchangeImg = function () {
                    $scope.checkImgSrc = "/admin/api/view/img.php?r=" + $data.randomStr(10);
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
                                //$ui.locate("#/user/login");
                            })
                        } else {
                            $ui.error(response.error, function () {
                                $scope.user = {};
                                $scope.checkImgSrc = "/admin/api/view/img.php?r=" + $data.randomStr(10);
                            })
                        }
                    }, function (err) {
                        $ui.error(err);
                    });

                }

            }])
})