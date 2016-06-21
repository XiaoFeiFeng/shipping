/**
 * Created by Administrator on 2016/1/18.
 */
'use strict'
define([], function () {

    angular.module("emailAlterModule", [])

        .controller('emailAlterCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store', '$config',
            function ($scope, $request, blockUI, $data, $ui, $store, $config) {

                $scope.user = $store.getUserInfo();

                $scope.exchangeImg = function () {
                    $scope.checkImgSrc = $config. getCheckImg();
                }

                $scope.submit = function () {

                    var data = {};
                    data._id = $scope.user._id.$id;
                    data.email = $scope.user.email;
                    data.checkimg = $scope.checkimg;
                    data.name = $scope.user.name;

                    $request.post('api/?model=user&action=email_check',
                        data,
                        function (response) {
                            $scope.exchangeImg();
                            if (response.success) {
                                $ui.locatePart('/safety/emailsended');
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (err) {
                            $scope.exchangeImg();
                            $ui.error('发送失败' + err);
                        });
                }
                $scope.exchangeImg();

            }]);
})