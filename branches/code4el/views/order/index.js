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
                        $ui.error('运单号不能为空', '错误', function () {
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
                                            $ui.error('追踪不到该运单的记录，核实运单号是否正确，请稍后再查。', '错误', function () {
                                                                
                                                            });
                                        }else{
                                            $scope.order = response.data[0];
                                            $scope.exist = true;
                                            console.log($scope.order );
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

                $scope.getDateTime = function (tick) {
                    return $data.getDateTime(tick);
                }


        }]);
})