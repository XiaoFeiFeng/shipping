/**
 * Created by fengxiaofei on 2016/2/16.
 */

define([], function () {

    angular.module('orderCreateModule', [])
        .controller('orderCreateCtrl', ['$scope', '$ui', '$store', '$data', '$timeout', '$state', '$rootScope',
            function ($scope, $ui, $store, $data, $timeout, $state, $rootScope) {

                if (!$rootScope.logined) {
                    $ui.locateLogin();
                }

                var params = $ui.getUrlParam();
                if (!params) {
                    $ui.locate500();
                }
                else {
                    $scope.order = $store.getJson("orderInfo" + params.key);
                    if ($scope.order) {
                        $scope.from = $scope.order.from;
                        $scope.to = $scope.order.to;
                    } else {
                        $ui.locate500();
                    }
                }
                $scope.submitForm = function (invalid) {

                    if (invalid)  return false;

                    var data = angular.copy($scope.order);
                    data.from = angular.copy($scope.from);
                    data.to = angular.copy($scope.to);
                    $store.setJson("orderInfo" + params.key, data);

                    $state.go('module', {
                        'module': 'order',
                        'action': 'confirm',
                        'params': 'key=' + params.key
                    });
                }

                $scope.setFrom = function (data) {
                    $scope.from = data;
                    var address = "";
                    for (var i in  data.district.cn) {
                        if (typeof (data.district.cn[i]) == "string")
                            address += data.district.cn[i] + " ";
                    }
                    address += data.address;
                    $scope.from.address = address;
                    $scope.from.zip = data.district.zip;

                    $timeout(function () {
                        angular.element('#fromName').triggerHandler('focus');
                        angular.element('#fromTel').triggerHandler('focus');
                        angular.element('#fromAddress').triggerHandler('focus');
                        angular.element('#fromCode').triggerHandler('focus');
                    }, 100)
                }

                $scope.setTo = function (data) {
                    $scope.to = data;
                    var address = "";
                    for (var i in  data.district.cn) {
                        if (typeof (data.district.cn[i]) == "string")
                            address += data.district.cn[i] + " ";
                    }
                    address += data.address;
                    $scope.to.address = address;
                }

                $scope.chooseAddress = function (flag) {
                    $ui.openWindow('views/address/choose.html', 'AddressChooseCtrl', flag, function (result) {
                        if (result) {
                            if (flag == "from") {
                                $scope.setFrom(result);
                            } else {
                                $scope.setTo(data)
                            }
                        }
                    });
                }

                $scope.init = function () {

                    $scope.user = $store.getUserInfo();

                    if (!$scope.user || !$scope.user.address) {
                        return false;
                    }
                    for (var i in $scope.user.address) {
                        if ($scope.user.address[i].is_default) {
                            $scope.setFrom($scope.user.address[i]);
                        }
                    }

                }

                $scope.init();
            }]);

})