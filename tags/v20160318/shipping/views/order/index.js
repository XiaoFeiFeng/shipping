/**
 * Created by fengxiaofei on 2015/12/2.
 */
'use strict'
define([], function () {

    angular.module("orderIndexModule", [])

        .controller('orderIndexCtrl', ['$scope','$ui','$request',
            function ($scope, $ui, $request) {
                $scope.result = [];
                $scope.totalItems = 175;
                $scope.currentPage = 1;
                $scope.order_exists = false;
                $scope.order_Wrong = false;
                $scope.leftArrow = false;
                $scope.rightArrow = false;
                $scope.order_Wrong = false;
                $scope.logisticsInformation = false;
                $scope.dunnage = true;
                $scope.logistics = {};
                $scope.item = [
                    {
                        order_sn: 123456791, default: true, xianshi: true, wuliu: [
                        {data: '快递公司已收件', time: 1455782121},
                        {data: '快件已从西丽快递公司出发，下一站广州快递揽收总局', time: 1455782178},
                        {data: '快件已到达广州总局，正发向湛江分局', time: 1455782199},
                        {data: '快件已到达湛江，正在派件中（联系人：吴日文，电话：18218846438）', time: 1455782221},
                        {data: '快件已签收，感谢您的支持，欢迎下次再为您服务', time: 1455782321}
                    ]
                    },
                    {
                        order_sn: 123456792, default: false, xianshi: true, wuliu: [
                        {data: '快递公司已收件', time: 1455782121},
                        {data: '快件已从西丽快递公司出发，下一站广州快递揽收总局', time: 1455782178},
                        {data: '快件已到达广州总局，正发向茂名分局', time: 1455782199},
                        {data: '快件已到达茂名，正在派件中（联系人：小吴，电话：18218846438）', time: 1455782221},
                        {data: '快件已签收，感谢您的支持，欢迎下次再为您服务', time: 1455782321}
                    ]
                    },
                    {
                        order_sn: 123456793, default: false, xianshi: true, wuliu: [
                        {data: '快递公司已收件', time: 1455782121},
                        {data: '快件已从科技园快递公司出发，下一站广州快递揽收总局', time: 1455782178},
                        {data: '快件已到达广州总局，正发向北京总局', time: 1455782199},
                        {data: '快件已到达北京，正在派件中（联系人：吴日文，电话：18218846438）', time: 1455782221},
                        {data: '快件已签收，感谢您的支持，欢迎下次再为您服务', time: 1455782321}
                    ]
                    },
                    {
                        order_sn: 123456794, default: false, xianshi: false, wuliu: [
                        {data: '快递公司已收件', time: 1455782121},
                        {data: '快件已从布吉快递公司出发，下一站广州快递揽收总局', time: 1455782178},
                        {data: '快件已到达广州总局，正发向哈尔滨总局', time: 1455782199},
                        {data: '快件已到达哈尔滨，正在派件中（联系人：吴日文，电话：18218846438）', time: 1455782221},
                        {data: '快件已签收，感谢您的支持，欢迎下次再为您服务', time: 1455782321}
                    ]
                    },
                    {
                        order_sn: 123456795, default: false, xianshi: false, wuliu: [
                        {data: '快递公司已收件', time: 1455782121},
                        {data: '快件已从上海快递公司出发，下一站广州快递揽收总局', time: 1455782178},
                        {data: '快件已到达广州总局，正发向深圳总局', time: 1455782199},
                        {data: '快件已到达深圳宝安区，正在派件中（联系人：吴日文，电话：18218846438）', time: 1455782221},
                        {data: '快件已签收，感谢您的支持，欢迎下次再为您服务', time: 1455782321}
                    ]
                    },
                    {
                        order_sn: 123456796, default: false, xianshi: false, wuliu: [
                        {data: '快递公司已收件', time: 1455782121},
                        {data: '快件已从江苏快递公司出发，下一站广州快递揽收总局', time: 1455782178},
                        {data: '快件已到达广州总局，正发向深圳总局', time: 1455782199},
                        {data: '快件已到达深圳科技园，正在派件中（联系人：吴日文，电话：18218846438）', time: 1455782221},
                        {data: '快件已签收，感谢您的支持，欢迎下次再为您服务', time: 1455782321}
                    ]
                    },
                    {
                        order_sn: 1234567917, default: false, xianshi: false, wuliu: [
                        {data: '快递公司已收件', time: 1455782121},
                        {data: '快件已从湛江快递公司出发，下一站广州快递揽收总局', time: 1455782178},
                        {data: '快件已到达广州总局，正发向深圳总局', time: 1455782199},
                        {data: '快件已到达深圳，正在派件中（联系人：吴日文，电话：18218846438）', time: 1455782221},
                        {data: '快件已签收，感谢您的支持，欢迎下次再为您服务', time: 1455782321}
                    ]
                    }
                ]

            $scope.formatDate = function (date) {
                return new Date(parseInt(date) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            }

            $scope.inquire = function () {
                if ($scope.waybill == undefined) {
                    alert("请输入运单号");
                } else {

                    $request.get('api/?model=order&action=track_order&oId=' + $scope.waybill,
                        function (response) {

                            if(response.success){
                                if(response.count !=0){

                                    $scope.logistics =  response.data;
                                    $scope.items = $scope.logistics[0];
                                    for(var i=0;i<$scope.logistics.length;i++){
                                        $scope.logistics[i].default = false;
                                    }
                                    $scope.logistics[0].default = true;
                                    if($scope.logistics.length > 3){
                                        for(var i=0;i<$scope.logistics.length;i++){
                                            $scope.logistics[i].xianshi = false;
                                        }
                                        $scope.logistics[0].xianshi = true;
                                        $scope.logistics[1].xianshi = true;
                                        $scope.logistics[2].xianshi = true;
                                        $scope.rightArrow = true;
                                        $scope.arrowhead = true;
                                    }else{
                                        for(var i=0;i<$scope.logistics.length;i++){
                                            $scope.logistics[i].xianshi = true;
                                        }
                                        $scope.arrowhead = false;

                                    }
                                    $scope.order_Wrong = false;
                                    $scope.logisticsInformation = true;
                                    $scope.dunnage = false;

                                }else{
                                    $scope.dunnage = false;
                                    $scope.order_Wrong = true;
                                    $scope.logisticsInformation = false;
                                }
                            }else{
                                $ui.error("查询失败","请销后再试");
                            }
                        }, function (err) {
                            $ui.error('查询失败，' + err, '错误');
                        });
                }
            }


            $scope.transition = function (id) {
                for (var i = 0; i < $scope.logistics.length; i++) {
                    if (id == $scope.logistics[i].order_sn) {

                        for (var j = 0; j < $scope.logistics.length; j++) {
                            $scope.logistics[j].default = false;
                        }
                        $scope.logistics[i].default = true;
                        $scope.items = $scope.logistics[i];
                        if (i + 1 == $scope.logistics.length) {
                            $scope.rightArrow = false;
                        } else {
                            $scope.rightArrow = true;
                        }
                        if (i == 0) {
                            $scope.leftArrow = false;
                        } else {
                            $scope.leftArrow = true;
                        }


                        return;
                    }
                }
            }
            $scope.turnRight = function () {
                for (var i = 0; i < $scope.logistics.length; i++) {

                    if ($scope.logistics[i].default) {

                        if (i != 0) {

                            if (i - 2 >= 0) {
                                if ($scope.logistics[i - 1].xianshi && $scope.logistics[i - 2].xianshi) {
                                    if (i + 1 == $scope.logistics.length) {
                                        $ui.notify("没有更多运单？", "操作错误");
                                        return;
                                    }
                                    if (i + 2 == $scope.logistics.length) {
                                        $scope.rightArrow = false;
                                    }
                                    $scope.logistics[i - 2].xianshi = false;
                                    $scope.logistics[i + 1].xianshi = true;
                                    $scope.logistics[i + 1].default = true;
                                    $scope.logistics[i].default = false;
                                    $scope.items = $scope.logistics[i + 1];
                                    $scope.leftArrow = true;
                                    return;
                                }
                            }

                            if ($scope.logistics[i - 1].xianshi) {
                                if (i + 2 == $scope.logistics.length) {
                                    $scope.logistics[i + 1].default = true;
                                    $scope.logistics[i].default = false;
                                    $scope.items = $scope.logistics[i + 1];
                                    $scope.rightArrow = false;
                                    $scope.leftArrow = true;
                                    return;
                                }
                                $scope.logistics[i - 1].xianshi = false;
                                $scope.logistics[i + 2].xianshi = true;
                                $scope.logistics[i + 1].default = true;
                                $scope.logistics[i].default = false;
                                $scope.items = $scope.logistics[i + 1];
                                $scope.leftArrow = true;
                                return;
                            }

                        }

                        if ($scope.logistics[i + 1].xianshi && $scope.logistics[i + 2].xianshi) {
                            if (i + 3 == $scope.logistics.length) {
                                $scope.logistics[i].default = false;
                                $scope.logistics[i + 1].default = true;
                                $scope.items = $scope.logistics[i + 1];
                                $scope.leftArrow = true;
                                return;
                            }
                            $scope.logistics[i].xianshi = false;
                            $scope.logistics[i].default = false;
                            $scope.logistics[i + 1].default = true;
                            $scope.logistics[i + 3].xianshi = true;
                            $scope.items = $scope.logistics[i + 1];
                            $scope.leftArrow = true;
                            return;

                        }

                    }
                }


            }
            $scope.turnLeft = function () {

                for (var i = 0; i < $scope.logistics.length; i++) {
                    if ($scope.logistics[i].default && i > 0) {
                        $scope.logistics[i].default = false;
                        $scope.logistics[i - 1].default = true;
                        $scope.logistics[i - 1].xianshi = true;
                        if(i+2 < $scope.logistics.length){
                            $scope.logistics[i + 2].xianshi = false;
                        }

                        $scope.items = $scope.logistics[i - 1];
                        $scope.rightArrow = true;
                        if (i == 1) {
                            $scope.leftArrow = false;
                        }
                        return;

                    }


                }

            }

        }]);
})