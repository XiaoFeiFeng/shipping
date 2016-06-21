/**
 * Created by Administrator on 2016/1/11.
 */
'use strict'
define([], function () {

    angular.module("userLoginModule", [])
        .controller('userLoginCtrl', ['$scope', '$request', 'blockUI', '$data', '$ui', '$store', '$http',
            function ($scope, $request, blockUI, $data, $ui, $store, $http) {
                $scope.checkImgSrc = "/admin/api/view/img.php";
                $scope.user = {};
                $scope.error = false;

                $scope.exchangeImg = function () {
                    $scope.checkImgSrc = "/admin/api/view/img.php?r=" + $data.randomStr(10);
                }

                $scope.params = $ui.getKeyByUrl();

                $scope.logined = function () {
                    if ($scope.params && $scope.params.module && $scope.params.action) {
                        $ui.locate("shipping/#/" + $scope.params.module + "/" + $scope.params.action);
                    }
                    else {
                        $ui.locate("shipping/#/myyilian/index");
                    }
                }

                $scope.getMerchatInfo = function (user) {
                    $request.get('api/?model=merchant&action=get_merchant_byuser&userId=' + user._id.$id,
                        function (response) {
                            if (response.success) {
                                $store.setJson("merchantInfo", response.data);
                                $scope.logined();
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                }


                $scope.login = function (invalid) {

                    if (invalid)   return false;

                    var data = angular.copy($scope.user);

                    data.password = $data.MD5(data.password);
                    $request.post("api/?model=user&action=login&test=true", data, function (response) {
                        if (response.success) {
                            $store.setUserInfo(response.data);
                            $scope.getMerchatInfo(response.data);
                        } else {
                            $scope.error = response.error;
                        }
                        $scope.checkImgSrc = "/admin/api/view/img.php?r=" + $data.randomStr(10);
                        $scope.user.checkimg = "";
                    }, function (err) {
                        $ui.error(err);
                        $scope.checkImgSrc = "/admin/api/view/img.php?r=" + $data.randomStr(10);
                        $scope.user.checkimg = "";
                    });

                }

                $scope.richScan = function () {
                    $http({
                        url: 'http://www.93myb.com/api/tx/weixin/a/ylsd_weixin.php',
                        method: 'GET'
                    }).success(function (result, header, config, status) {
                        $ui.openWindowSm('views/weixin/maxcard.html', 'weixinMaxcardCtrl', result, function (data) {
                            if (data) {
                                alert(data);
                            }
                        }, function (data) {

                        });

                    }).error(function (data, header, config, status) {

                        console.log(data);
                    });


                }


            }]);
})