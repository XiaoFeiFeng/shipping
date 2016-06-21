/**
 * Created by fengxiaofei on 2016/2/16.
 */

define([], function () {

    angular.module('orderConfirmModule', [])
        .controller('orderConfirmCtrl', ['$scope', '$ui', '$store', '$timeout', '$request', '$state', '$rootScope',
            function ($scope, $ui, $store, $timeout, $request, $state, $rootScope) {

                if (!$rootScope.logined) {
                    $ui.locateLogin();
                }

                var params = $ui.getUrlParam();
                if (!params) {
                    $ui.locate500();
                }
                $scope.order = $store.getJson("orderInfo" + params.key);

                if (!$scope.order) {
                    $ui.locate500();
                }

                $scope.order.code = params["key"];
                $scope.customsInfo = {};

                $scope.chooseCustoms = function () {
                    $ui.openWindow('views/customs/choose.html', 'customsChooseCtrl', null, function (result) {
                        if (result) {
                            $scope.customsInfo = result;
                        }
                    });
                }

                $scope.submitForm = function (invalid) {

                    if (invalid) return false;

                    var data = {};
                    data.userId = $store.getUserInfo()._id.$id;
                    data.code = $scope.order.code;
                    data.transportWayCName = $scope.order.transportWayCName;
                    data.transportWayCode = $scope.order.transportWayCode;


                    data.fromCity = $scope.order.fromCity;
                    data.toCountry = $scope.order.country.Name;
                    data.toCountryCode = $scope.order.country.Code;
                    data.weight = $scope.order.weight;
                    data.cost = $scope.order.sum;
                    data.goodsType = $scope.order.goodsType;
                    data.message = $scope.order.message;
                    data.from = {
                        name: $scope.order.from.name,
                        tel: $scope.order.from.tel,
                        address: $scope.order.from.address,
                        zip: $scope.order.from.zip,
                        email: $scope.order.from.email
                    }
                    data.telephone = $scope.order.from.tel;
                    data.to = {
                        name: $scope.order.to.name,
                        tel: $scope.order.to.tel,
                        address: $scope.order.to.address,
                        zip: $scope.order.to.zip
                    }

                    data.customsInfo = $scope.customsInfo;
                    data.state = 0;

                    $request.post('api/?model=order&action=create', data,
                        function (response) {
                            if (response.success) {
                                var message = "恭喜您，下单成功！订单编号:" + params.key;
                                $store.remove("orderInfo" + params.key);

                                $state.go('module', {
                                    'module': 'system',
                                    'action': 'success',
                                    'params': 'message=' + message
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

                $scope.cancel = function () {

                }

            }]);

})