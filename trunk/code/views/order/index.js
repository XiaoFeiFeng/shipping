/**
 * Created by fengxiaofei on 2015/12/2.
 */
'use strict'
define([], function () {

    angular.module("orderIndexModule", [])

        .controller('orderIndexCtrl', ['$scope','$ui','$request','$data',
            function ($scope, $ui, $request,$data) {
                $scope.orders = {};
                $scope.order_Wrong = false;

                $scope.inquire = function () {
                    if ($scope.waybill == undefined) {
                        $ui.error('运单号不能为空且不能超过二十条，两条运单号之间以逗号区分。', '错误', function () {
                                        });
                    } else {
                        var order = $scope.waybill.replace(/，/g,',').split(",");
                        if(order.length > 20){
                            $ui.error('运单号不能超过二十条', '错误', function () {
                            });
                        }else{
                            $request.get('api/?model=order&action=track_order&oId=' + $scope.waybill,
                                function (response) {
                                    if(response.success){
                                        if(response.count == 0 ){
                                            $scope.order_Wrong = true;
                                        }else{
                                            $scope.order_Wrong = false;
                                            $scope.orders = response.data;
                                            $scope.orders[0].is_default = true;
                                            console.log($scope.orders);
                                        }

                                    }else{
                                        $ui.error("查询失败","请销后再试");
                                    }
                                }, function (err) {
                                    $ui.error('查询失败，' + err, '错误');
                                });
                        }

                    }
                }

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }
                $scope.color = function(index){
                    $('.slide-nav li:eq(0)').addClass('slide-fff');
                    $('.slide-nav li:eq('+$scope.slideIndex+')').removeClass('slide-default');
                    $('.slide-nav li:eq('+index+')').addClass('slide-default');
                    $scope.slideIndex = index;
                }

                //
                $scope.maopao = function(){
                    var array = [1, 3, 4, 2, 5];
                    var huan = 0;
                    for(var i =0;i<array.length; i++){
                        for(var j=0;j<array.length-i;j++){
                            if(array[j] >array[j+1]){
                                huan = array[j];
                                array[j] = array[j+1];
                                array[j+1] = huan;
                            }
                        }
                    }
                    console.log(array);
                }
                $scope.maopao();

        }]);
})