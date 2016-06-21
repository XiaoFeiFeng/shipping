'use strict'
define([], function () {
    angular.module('logistricCreateModule', [])
        .controller("addHelpCategoryCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData', function (
            $scope, $ui, $validate, $request, $uibModalInstance, modalData) {
            $scope.category = {};

            if (!$validate.isEmpty(modalData) && !$validate.isEmpty(modalData._id)) {
                $scope.category = modalData;
                $scope.isEdit = true;
            }

            $scope.reset = function () {
                $scope.category = {};
            }

            $scope.cancel = function () {
                $uibModalInstance.close($scope.isAdded);
            }

            $scope.submitForm = function () {

                if ($scope.isEdit) {
                    var data = angular.copy($scope.category);
                    delete data._id;
                    delete data.$checked;



                    debugger;

                    $request.post('api/?model=erp&action=edit_help_category&id=' + $scope.category._id.$id,
                        data,
                        function (response) {
                            $ui.notify('保存成功！', '提示',
                                function () {
                                    $uibModalInstance.close(true);
                                })
                        }, function (err) {
                            $ui.error('修改失败，' + err, '错误');
                        });
                } else {

                    $request.post('api/?model=erp&action=edit_help_category',
                        $scope.category,
                        function (response) {
                            $ui.confirm('添加成功，是否继续添加?', '确认',
                                function () {
                                    $scope.reset()
                                    $scope.isAdded = true;
                                },
                                function () {
                                    $uibModalInstance.close(true);
                                })
                        }, function (err) {
                            $ui.error('添加失败，' + err, '错误');
                        });
                }
            }



        }])
})
