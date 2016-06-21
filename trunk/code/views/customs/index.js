/**
 * Created by Administrator on 2016/1/19.
 */

'use strict'
define(['angular-city'], function () {
    angular.module('customsIndexModule', [])
        .controller('customsIndexCtrl', ['$scope', '$ui', '$store', '$request', '$timeout', '$q',
            function ($scope, $ui, $store, $request, $timeout, $q) {
                $scope.isAllChecked = false;
                $scope.hint = true;


                $scope.isAllChange = function (check) {
                    for (var i = 0; i < $scope.user.customs.length; i++) {
                        $scope.user.customs[i].check = check;
                    }
                }


                $scope.isOneChange = function () {
                    var check = true;
                    for (var i = 0; i < $scope.user.customs.length; i++) {
                        if (!$scope.user.customs[i].check) {
                            check = false;
                        }
                    }
                    $scope.isAllChecked = check;
                }


                //点击是否默认触发的方法
                $scope.checked = function (index) {
                    for (var i = 0; i < $scope.user.customs.length; i++) {
                        $scope.user.customs[i].is_default = false;
                    }
                    $scope.user.customs[index].is_default = true;

                    var data = {customs: angular.copy($scope.user.customs)}
                    $request.post('api/?model=user&action=edit_user&id=' + $scope.user._id.$id,
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify('设置成功', '确认');
                                $store.setUserInfo($scope.user);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (err) {
                            $ui.error('设置失败，' + err, '错误');
                        });

                }


                //删除地址
                $scope.del = function () {
                    var whether = false;
                    for (var i = 0; i < $scope.user.customs.length; i++) {
                        if ($scope.user.customs[i].check) {
                            whether = true;
                        }
                    }
                    if (whether) {
                        $ui.confirm('确认删除？', '确认', function () {
                            for (var i = 0; i < $scope.user.customs.length; i++) {
                                if ($scope.user.customs[i].check) {
                                    $scope.user.customs.splice(i, 1);
                                    i--;
                                }
                            }
                            var data = {customs: angular.copy($scope.user.customs)}
                            $request.post('api/?model=user&action=edit_user&id=' + $scope.user._id.$id,
                                data,
                                function (response) {
                                    if (response.success) {
                                        $ui.notify('删除成功', '确认');
                                        render();
                                    } else {
                                        $ui.error(response.error);
                                    }

                                }, function (err) {
                                    $ui.error('删除失败，' + err, '错误');
                                });
                        });
                    } else {
                        $ui.notify('至少勾选一条信息', '提示', function () {
                            return;
                        });
                    }
                };


                $scope.edit = function (data, index) {
                    var customsData = data;
                    $ui.openWindow('views/customs/edit.html', 'customsEditCtrl', data, function (result) {
                        if (!result) {
                            return false;
                        }

                        if (result.is_default) {
                            for (var i = 0; i < $scope.user.customs.length; i++) {
                                $scope.user.customs[i].is_default = false;
                            }
                        }

                        if (customsData) {
                            $scope.user.customs[index] = result;
                        } else {
                            if (!$scope.user.customs) {
                                $scope.user.customs = [];
                            }
                            $scope.user.customs.push(result);
                        }

                        var data = {customs: angular.copy($scope.user.customs)}

                        $request.post('api/?model=user&action=edit_user&id=' + $scope.user._id.$id,
                            data,
                            function (response) {
                                if (response.success) {
                                    $ui.notify('设置成功', '确认');
                                    render();
                                } else {
                                    $ui.error(response.error);
                                }

                            }, function (err) {
                                $ui.error('失败，' + err, '错误');
                            });
                    });
                };

                function render() {
                    $store.setUserInfo($scope.user);
                    if ($scope.user.customs && $scope.user.customs.length > 0) {
                        $scope.exist = true;
                        $scope.hint = false;
                    } else {
                        $scope.user.customs = [];
                        $scope.hint = true;
                        $scope.exist = false;
                    }
                }


                //页面首次加载时获取用户的数据
                $scope.init = function () {

                    $scope.userInfo = $store.getUserInfo();
                    var id = $scope.userInfo._id.$id;
                    console.log($scope.userInfo);
                    $request.get("api/?model=user&action=get_user&id=" + id, function (response) {
                        if (response.success) {
                            $scope.user = response.data;
                            render();
                        } else {
                            $scope.error = response.error;
                        }

                    }, function (err) {
                        $ui.error(err);
                    });
                }

                $scope.init();

            }])
})
