/**
 * Created by fengxiaofei on 2016/2/26.
 */

define(['angular-city'], function () {

    angular.module('pickupIndexModule', [])
        .controller('pickupIndexCtrl', ['$scope', '$ui', '$store', '$data', '$timeout', '$request', '$state',
            function ($scope, $ui, $store, $data, $timeout, $request, $state) {
                $scope.from = {};
                $scope.city = {};
                $scope.userInfo = $store.getUserInfo();
                $scope.countryData = {selectedData: {}};

                if (typeof ($scope.userInfo) == 'object') {
                    $scope.showChoose = true;
                }

                $scope.chooseAddress = function () {
                    $ui.openWindow('views/address/choose.html', 'AddressChooseCtrl', 'from', function (result) {
                        if (result) {
                            $scope.setFrom(result);
                        }
                    });
                }

                $scope.setFrom = function (data) {

                    $scope.from = data;

                    $scope.city = data.district;

                    $timeout(function () {
                        angular.element('#fromName').triggerHandler('focus');
                        angular.element('#fromTel').triggerHandler('focus');
                        angular.element('#fromAddress').triggerHandler('focus');
                    }, 100)
                }

                $scope.submit = function (invalid) {

                    var country = {};
                    country.Code = $scope.countryData.selectedData.Code;
                    country.Name = $scope.countryData.selectedData.Name;
                    country.EnName = $scope.countryData.selectedData.EnName;

                    if (invalid) return false;
                    var data = {};
                    data.name = $scope.from.name;
                    data.address = $scope.from.address;
                    data.tel = $scope.from.tel;
                    data.district = $scope.city.cn;
                    data.country = country;
                    data.state = 0;
                    $request.post('api/?model=package&action=create',
                        data,
                        function (response) {
                            if (response.success) {
                                $state.go('module', {
                                    'module': 'system',
                                    'action': 'success',
                                    'params': 'message=恭喜您，下单成功，稍后会有工作人员联系您取件，请保持手机畅通！'
                                });

                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (err) {
                            $ui.error('下单失败，' + err, '错误');
                        });
                }

            }
        ])
    ;
})