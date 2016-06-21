'use strict'
define([], function () {
    angular.module('channeladdOrEditModule', [])
        .controller("channeladdOrEditCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $validate, $request, $uibModalInstance, modalData) {
                $scope.data = modalData;
                if ($validate.isEmpty($scope.data)) {
                    $uibModalInstance.close();
                }

                $scope.title = $scope.data.operator == "edit" ? "编辑" : '添加';

                $scope.submitForm = function () {
                    var data = {
                        name: $scope.data.channel.name,
                        code: $scope.data.channel.code,
                        used: $scope.data.channel.used,
                        category: $scope.data.category.code
                    }

                    if ($scope.data.operator == "edit") {
                        $request.post('api/?model=channel&action=edit_logistics_category_channels&id=' + $scope.data.channel._id.$id,
                            data,
                            function (response) {
                                $ui.notify('保存成功！', '提示',
                                    function () {
                                        $scope.cancel()
                                    })
                            }, function (err) {
                                $ui.error('添加失败，' + err, '错误');
                            });
                    } else {
                        $request.post('api/?model=channel&action=add_logistics_category_channels',
                            data,
                            function (response) {
                                $ui.confirm('添加成功，是否继续添加?', '确认',
                                    function () {
                                        $scope.reset()
                                    },
                                    function () {
                                        $scope.cancel()
                                    })
                            }, function (err) {
                                $ui.error('添加失败，' + err, '错误');
                            });
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.close();
                }

                $scope.reset = function () {
                    $scope.data.channel = {};
                }

            }
        ])
})