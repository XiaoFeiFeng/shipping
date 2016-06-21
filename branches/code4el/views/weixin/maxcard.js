/**
 * Created by Administrator on 2016/3/4.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('weixinMaxcardModule', [])
        .controller('weixinMaxcardCtrl', ['$scope', '$ui', '$uibModalInstance', 'modalData', '$request', '$store', '$data', '$http',
            function ($scope, $ui, $uibModalInstance, modalData, $request, $store, $data, $http) {

                $scope.init = function () {
                    $scope.random = modalData;
                    $scope.timerNum = 120;
                    $scope.img = 'http://www.93myb.com/api/tx/weixin/a/' + $scope.random + '.png';
                }
                $scope.init();

                $scope.cancel = function (whether) {
                    $scope.deleteImg($scope.random);
                    clearInterval($scope.timer);
                    $uibModalInstance.close(whether);
                }

                $scope.deleteImg = function (random) {
                    $http({
                        url: 'http://www.93myb.com/api/tx/weixin/a/delete_img.php?img=' + random + '.png',
                        method: 'GET'
                    }).success(function (result, header, config, status) {

                    }).error(function (data, header, config, status) {

                    });
                }
                $scope.detection = function () {
                    $scope.timerNum = $scope.timerNum - 1;
                    if ($scope.timerNum < 1) {
                        $scope.cancel();
                    }
                    $request.getWithNoBlock('api/?model=user&action=get_weixin&random=' + $scope.random,
                        function (response) {
                            if (response.data) {
                                $request.get('api/?model=user&action=get_users_weixin&wechatid=' + response.data.wechatid, function (resp) {
                                    //删除微信的临时记录
                                    $request.get('api/?model=user&action=remove_weixin&random=' + response.data.random, function (data) {
                                    }, function (err) {
                                        $ui.error(err);
                                    })
                                    if (resp.data) {
                                          $store.setUserInfo(resp.data);
                                          $scope.cancel(true);
                                    } else {
                                        var name = encodeURIComponent(response.data.name);
                                        var wechatid = response.data.wechatid;
                                        $scope.deleteImg($scope.random);
                                        $ui.locate('/user.html#/weixin/register?name=' + name + '&wechatid=' + wechatid);

                                    }
                                }, function (err) {
                                    $ui.error(err);
                                })

                            } else {

                            }
                        }, function (err) {
                            $ui.error(err);
                        })
                }

                $scope.timer = setInterval($scope.detection, 1000);

            }])
})
