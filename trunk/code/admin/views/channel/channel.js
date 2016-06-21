'use strict'
define([], function () {
    angular.module('channelIndexModule', [])
        .controller("channelIndexCtrl", ['$scope', '$ui', '$request', '$validate', function ($scope, $ui, $request, $validate) {
            $scope.categorys = [];
            $scope.channels = [];
            $scope.currentCategory = "";
            $scope.getCategory = function () {
                $request.get(
                    'api/?model=channel&action=logistic_category',
                    function (response) {
                        if (response.success) {
                            $scope.categorys = response.data;
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }

                    }, function (err) {
                        $ui.error('获取失败，' + err, '错误');
                    });
            }

            $scope.state = function (used) {
                return used ? "启用" : "未启用";
            }
            $scope.stateOper = function (used) {
                return used ? "禁用" : "启用";
            }

            $scope.getChannels = function (type) {
                $request.get(
                    'api/?model=channel&action=logistics_channels&category=' + type.code,
                    function (response) {
                        if (response.success) {
                            $scope.channels = response.data;
                            $scope.currentCategory = type;
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error('获取失败，' + err, '错误');
                    });
            }

            $scope.addChannel = function () {
                if ($validate.isEmpty($scope.currentCategory)) {
                    return;
                }
                var data = {
                    'operator': 'add',
                    'category': $scope.currentCategory
                }
                $ui.openWindow('views/channel/addorEdit.html', 'channeladdOrEditCtrl', data, function (data) {
                    $scope.getChannels($scope.currentCategory);
                }, function (data) {
                });
            }

            $scope.modifyChannel = function (channel) {
                var data = {
                    'operator': 'edit',
                    'category': $scope.currentCategory,
                    'channel': channel
                }
                $ui.openWindow('views/channel/addorEdit.html', 'channeladdOrEditCtrl', data, function (data) {
                    $scope.getChannels($scope.currentCategory);
                }, function (data) {

                });
            }

            $scope.modifyState = function (channel) {
                var data = {
                    name: channel.name,
                    code: channel.code,
                    category: channel.category,
                    used: !channel.used
                }
                $request.post('api/?model=channel&action=edit_logistics_channels&id=' + channel._id.$id,
                    data,
                    function (response) {
                        if (response.success) {
                            $scope.getChannels($scope.currentCategory);
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error('修改失败，' + err, '错误');
                    });
            }

            $scope.delChannel = function (id) {
                $ui.confirm('确认删除?', '确认',
                    function () {
                        $request.get('api/?model=channel&action=remove_logistics_channels&id=' + id,
                            function (response) {
                                if (response.success) {
                                    $ui.notify('删除成功', '提示');
                                    $scope.getChannels($scope.currentCategory);
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error('修改失败，' + err, '错误');
                            });
                    });
            }
            $scope.getCategory();
        }])
})