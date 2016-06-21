/**
 * Created by admin on 2016/4/11.
 */
"use strict";
define([""], function () {
    angular.module('orderPaymentModule', [])
        .controller('orderPaymentCtrl', ['$scope','$ui','$request','$http',function ($scope,$ui,$request,$http) {
            $scope.init = function(){
                var params = $ui.getUrlParam();
                $scope.order  =  params.message;
                 $request.get('api/?model=order&action=check_the_waybill&code='+$scope.order,
                                     function (response) {
                                         if (response.success) {
                                             $scope.info = response.data;
                                         } else if (angular.isUndefined(response.success)) {
                                             $ui.error(response);
                                         } else {
                                             $ui.error(response.error);
                                         }
                                     }, function (err) {
                                         $ui.error(err);
                                     });

            }
            $scope.init();



            $scope.affrimPayment = function(param){
                //查看该订单是否是已支付状态
                $request.get('api/?model=order&action=weichat_monitoring&oid='+$scope.info.code,
                    function (response) {
                        if (response.success) {
                            //已支付
                              $ui.notify('该订单已支付', '提示', function () {
                                                  
                                              });
                            return;
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            //没支付
                            if(param == 1){
                                //支付宝支付、
                                window.location.href ='http://www.el56.com/api/ali_payment/alipayapi.php?oid='+$scope.info.code+'&rental='+ $scope.info.totalPrices;
                            }else{
                                //微信支付
                                $http.get("http://www.93myb.com/console/data/index.php?model=block&action=dopay&oid="+$scope.info.code+"&pid=2"+"&from=ylsd")
                                    .success(function(response){
                                        $scope.data = {};
                                        $scope.data.img  = response.data;
                                        $scope.data.oid  = $scope.info.code;
                                        if(response.status){
                                            $ui.openWindowSm('views/weixin/payment.html', 'weixinPaymentCtrl', $scope.data, function (data) {

                                            }, function (data) {

                                            });
                                        }else if(response.error){
                                            $ui.error(response.error, '错误', function () {

                                            });
                                        }else{
                                            $ui.error(response.data, '错误', function () {

                                            });
                                        }


                                    })
                            }

                        }
                    }, function (err) {
                        $ui.error(err);
                    });
                



            }

        }])
});