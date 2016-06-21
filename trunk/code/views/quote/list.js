/**
 * Created by fengxiaofei on 2015/12/2.
 */
'use strict'
define([], function () {

    var quoteListModule = angular.module("quoteListModule", []);

    quoteListModule.controller('quoteListCtrl', ['$scope', '$ui', '$validate', '$request', 'validateService', '$store', '$data', '$state',
        function ($scope, $ui, $validate, $request, validateService, $store, $data, $state) {

            $scope.priceDesc = false;//价格降序

            $scope.feeResult = [];//查价结果集合

            $scope.getFee = function (type) {
                var filter = $scope.filter;
                if ($validate.isEmpty(filter.country.code)) {
                    if (type == 'button') {
                        $ui.error('请选择出口国家', '提示');
                    }
                    return;
                }

                $scope.outCountry = angular.copy($scope.countryData.selectedData.Name);

                var url = 'api/?model=channel&action=getFee&country=' + $scope.countryData.selectedData.Code + '&weight=' + $scope.weight;

                var data = {
                    channels: []
                };

                if (!$validate.isEmpty($scope.filter.transWay.code)) {
                    data.channels.push($scope.filter.transWay.code);
                } else if (!$validate.isEmpty($scope.filter.transType.code) && $scope.transWays.length > 0) {
                    angular.forEach($scope.transWays, function (item) {
                        data.channels.push(item.code);
                    })
                }

                $request.post(url, data, function (response) {
                    $scope.feeResult = response.transportFee;
                    $scope.resultWeight = angular.copy($scope.weight);
                    $scope.dataSort(false);
                    if (response.success) {
                        $scope.totalItems = $scope.feeResult.length;
                        $scope.FeeHasErro = false;
                        $scope.FeeError = "";
                    } else {
                        $scope.FeeHasError = true;
                        //$ui.error(data.error_msg);
                        $scope.FeeError = response.error_msg;
                    }
                }, function (err) {
                    alert(err);
                })
            }

            $scope.createOrder = function (item) {
                var data = angular.copy(item);
                data.country = angular.copy($scope.countryData.selectedData);
                data.fromCity = "深圳";
                data.transWay = angular.copy($scope.filter.transWay);
                data.transType = angular.copy($scope.filter.transType);
                data.weight = angular.copy($scope.weight);
                var key = "";
                $request.getWithNoBlock('api/?model=order&action=create_code',
                    function (response) {
                        if (response.success) {
                            key = response.data;
                            $store.setJson("orderInfo" + key, data);

                            $state.go('module', {
                                'module': 'order',
                                'action': 'create',
                                'params': 'key=' + key
                            });
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    },
                    function (err) {
                        $ui.error(err, '错误');
                    }
                );
            }

            $scope.dataSort = function (isDesc) {
                $scope.priceDesc = !isDesc;
                if ($scope.feeResult)
                    $scope.feeResult.sortby("sum", isDesc);
            }

            $scope.filterClick = function (item) {
                item.isShow = !item.isShow;
            }

            $scope.$watch('filter', function (newValue, oldValue, scope) {

                if (validateService.isEmpty(newValue) || validateService.isEmpty(oldValue)) return;
                var objProps = Object.getOwnPropertyNames($scope.filter);

                for (var i = 0; i < objProps.length; i++) {

                    if (objProps[i] == 'country') {
                        if (!newValue[objProps[i]].isShow) {
                            $scope.countryData.selectedData = "";
                        }
                    }
                    else if (objProps[i] == 'weight') {
                        if (!newValue[objProps[i]].isShow) {
                            $scope.weight = 0.1;
                            newValue[objProps[i]].isShow = true;
                        }
                    } else if (!newValue[objProps[i]].isShow) {
                        cleanFilter(objProps[i]);
                    }

                }
            }, true);

            $scope.$watch('countryData', function (newValue, oldValue, scope) {
                if (validateService.isEmpty($scope.filter))  return;
                $scope.filter.country.name = $scope.countryData.selectedData.Name;
                $scope.filter.country.code = $scope.countryData.selectedData.Code;
                $scope.filter.country.isShow = $scope.countryData.selectedData.Name ? true : false
            }, true)

            $scope.weightChange = function () {
                if (validateService.isEmpty($scope.weight) || $scope.weight < 0.1) {
                    $scope.weight = 0.1;
                }

                $scope.filter.weight.name = $scope.weight + ' KG';
                $scope.filter.weight.code = $scope.weight;
            }

            //设置激活状态
            function setActive(arr, item) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i].isActive = false;
                    if (arr[i].code == item.code) {
                        arr[i].isActive = true;
                    }
                }
            }

            function setFilter(item, type) {
                $scope.filter[type].code = item.code;
                $scope.filter[type].isShow = true;
                $scope.filter[type].name = item.name;
                var arr = $scope[type + 's'];
                setActive(arr, item);
            }

            function cleanFilter(type) {
                $scope.filter[type].code = $scope.filter[type].defaultValue;
                $scope.filter[type].isShow = false;
                $scope.filter[type].name = "";
                var arr = $scope[type + 's'];
                for (var i = 0; i < arr.length; i++) {
                    arr[i].isActive = false;
                }
            }

            $scope.transTypeChange = function (item) {
                setFilter(item, 'transType');
                cleanFilter('transWay');
                $request.get(
                    'api/?model=channel&action=logistics_channels&status=1&category=' + item.code,
                    function (response) {
                        $scope.transWays = response.data;
                    }, function (err) {
                        $ui.error('错误', err);
                    }
                );
            }

            $scope.transWayChange = function (item) {
                setFilter(item, 'transWay');
                $scope.getFee();
            }

            $scope.goodsTypeChange = function (item) {
                setFilter(item, 'goodsType');
            }

            $scope.resTypeChange = function (item) {
                setFilter(item, 'resType');
            }

            $scope.init = function () {

                $scope.countryData = {'selectedData': ""};
                $scope.weight = 0.1;
                $scope.urlParam = $ui.getData();
                $scope.transTypes = [];
                $scope.transWays = [];
                $request.get(
                    'api/?model=channel&action=logistic_category',
                    function (response) {
                        $scope.transTypes = response.data;
                    }, function (err) {
                        $ui.error('错误', err);
                    }
                );

                if (!validateService.isEmpty($scope.urlParam)) {
                    $scope.countryData = $scope.urlParam.countryData;
                    $scope.weight = $scope.urlParam.weight;
                }


                $scope.resTypes = [
                    {'name': '纺织品', 'code': '纺织品'},
                    {'name': '纯电池', 'code': '纯电池'},
                    {'name': '手机', 'code': '手机'},
                    {'name': '内置电池', 'code': '内置电池'},
                    {'name': '电容', 'code': '电容'},
                    {'name': '移动电源', 'code': '移动电源'},
                    {'name': '电子烟', 'code': '电子烟'},
                    {'name': '独轮车', 'code': '独轮车'},
                    {'name': '普货', 'code': '普货'},
                    {'name': '配套电池', 'code': '配套电池'},
                    {'name': '木箱', 'code': '木箱'},
                ];

                $scope.filter = {
                    'country': {
                        'disKey': '目的国家：',
                        'name': "",
                        'code': "",
                        'defaultValue': "",
                        'isShow': true
                    },
                    'weight': {
                        'disKey': '重量：',
                        'name': $scope.weight + ' KG',
                        'code': $scope.weight,
                        'defaultValue': "",
                        'isShow': true
                    },
                    'resType': {
                        'disKey': '物品种类：',
                        'name': "",
                        'code': "",
                        'defaultValue': "",
                        'isShow': false
                    },
                    'transType': {
                        'disKey': '运输类型：',
                        'name': "",
                        'code': "",
                        'defaultValue': "",
                        'isShow': false
                    },
                    'transWay': {
                        'disKey': '运输方式：',
                        'name': "",
                        'code': "",
                        'defaultValue': "",
                        'isShow': false
                    }

                };
            }

            $scope.init();
        }
    ])
    ;
})