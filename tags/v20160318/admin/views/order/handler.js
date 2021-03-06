'use strict'
define([], function () {
    angular.module('orderhandlerModule', [])
        .controller("orderhandlerCtrl", ['$scope', '$request', '$uibModalInstance', 'modalData', '$ui', '$data',
            function ($scope, $request, $uibModalInstance, modalData, $ui, $data) {


                $scope.getAddress = function (merchant) {

                    var address = "";
                    if (merchant.district && merchant.district.cn) {
                        angular.forEach(merchant.district.cn, function (cn) {
                            address += cn + " ";
                        })
                    }
                    address += merchant.address;
                    return address;
                }

                $scope.getName = function (merchant) {
                    return merchant.companyName ? merchant.companyName : merchant.name;
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.handler = function () {
                    var item = $('input:radio:checked').val();
                    var checkedItem = $data.toJson(item);
                    if (checkedItem) {
                        $uibModalInstance.close(checkedItem);
                    } else {
                        $ui.notify("请选择商家", "提示");
                    }
                }

                $scope.init = function () {

                    $request.get('api/?model=merchant&action=get_merchants_byaddress&pi=1&ps=10'
                        + '&address=' + modalData,
                        function (response) {
                            if (response.success) {
                                $scope.merchants = response.data;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }
                    );
                }


                $scope.init();
            }
        ])
})