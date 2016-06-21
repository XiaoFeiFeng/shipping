/**
 * Created by admin on 2016/4/14.
 */
"use strict";
define([""], function () {
    angular.module('weixinPaymentModule', [])
        .controller('weixinPaymentCtrl', ['$scope','modalData','$uibModalInstance', '$request','$ui',function ($scope,modalData,$uibModalInstance,$request,$ui) {

            $scope.reciprocal1 = 180;
            $scope.countdown = false;

            $scope.img = modalData.img;

            $scope.cancel = function (three) {
                clearInterval($scope.timer);
                $uibModalInstance.close();
            }

            $scope.monitoring = function(){
                 $scope.reciprocal1 = $scope.reciprocal1-1;
                if($scope.reciprocal1<1){
                    $scope.cancel();
                }

                $request.get('api/?model=order&action=weichat_monitoring&oid='+modalData.oid,
                                 function (response) {
                                     if (response.success) {
                                         //检测微信支付成功
                                         $scope.countdown = true;
                                         $scope.cancel();
                                         $ui.notify('付款成功', '提示', function () {
                                               $ui.locate('#/order/myorder');
                                                           });

                                     } else if (angular.isUndefined(response.success)) {
                                         $ui.error(response);
                                     } else {
                                         //
                                     }
                                 }, function (err) {
                                     $ui.error(err);
                                 });
            }

            $scope.timer = setInterval($scope.monitoring, 1000);



        }])
});