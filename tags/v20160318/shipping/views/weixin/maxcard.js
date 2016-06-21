/**
 * Created by Administrator on 2016/3/4.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('weixinMaxcardModule', [])
        .controller('weixinMaxcardCtrl', ['$scope', '$ui', '$uibModalInstance','modalData','$request','$store','$data','$http',
            function ($scope, $ui, $uibModalInstance,modalData,$request,$store,$data,$http) {

                $scope.random = modalData;
                $scope.cancel = function () {
                    clearInterval($scope.timer);
                    $uibModalInstance.close();
                }

                $scope.init = function(){
                   $scope.img = 'http://www.93myb.com/api/tx/weixin/a/'+$scope.random+'.png';
                    console.log(modalData);
                }
                $scope.init();
                $scope.deleteImg = function(random){
                    $http({
                        url:'http://www.93myb.com/api/tx/weixin/a/delete_img.php?img='+random+'.png',
                        method:'GET'
                    }).success(function(result,header,config,status){

                    }).error(function(data,header,config,status){

                    });
                }
                $scope.detection = function(){
                    $request.get('api/?model=user&action=get_weixin&random=' + $scope.random, function (response) {
                        if (response.data) {

                            $request.get('api/?model=user&action=get_users_weixin&wechatid=' + response.data.wechatid, function (resp) {

                                if (resp.data) {

                                    //根据$scope.random去删除weixin表中的记录
                                    $request.get('api/?model=user&action=remove_weixin&random=' + response.data.random, function (data) {
                                        $store.setUserInfo(resp.data);
                                        $scope.deleteImg($scope.random);
                                        location.href='http://localhost/shipping';

                                    }, function (err) {
                                        $ui.error(err);
                                    })


                                } else {
                                    var name = encodeURIComponent(response.data.name);
                                    var wechatid = response.data.wechatid;

                                    //根据$scope.random去删除weixin表中的记录
                                    $request.get('api/?model=user&action=remove_weixin&random=' + response.data.random, function (data) {
                                        $scope.deleteImg($scope.random);
                                        location.href='http://localhost/shipping/user.html#/weixin/register?name='+name +'&wechatid='+wechatid;
                                    }, function (err) {
                                        $ui.error(err);
                                    })




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

                $scope.timer = setInterval($scope.detection,1000);

            }])
})
