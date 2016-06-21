'use strict'
define([], function () {
    angular.module('orderDistributeModule', [])
        .controller("orderDistributeCtrl", ['$scope', '$request', '$uibModalInstance', 'modalData', '$ui', '$data',
            function ($scope, $request, $uibModalInstance, modalData, $ui, $data) {

                $scope.currentPage = 1;
                $scope.pageSize = 5;

                $scope.getAddress = function (merchant) {
                    return $data.getAddress(merchant);
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

                $scope.pageChange = function () {
                    $scope.init();
                }

                $scope.init = function () {

                    $request.get('api/?model=merchant&action=get_merchants_bymerchant'
                        + '&pi=' + $scope.currentPage
                        + '&ps=' + $scope.pageSize
                        + '&address=' + modalData.address
                        + '&id=' + modalData.id,
                        function (response) {
                            if (response.success) {
                                $scope.merchants = response.data;
                                $scope.totalItems = response.count;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }
                    )
                    ;
                }


                $scope.init();
            }
        ])
})