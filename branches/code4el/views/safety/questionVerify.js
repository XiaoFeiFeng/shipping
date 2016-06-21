/**
 * Created by Administrator on 2016/1/18.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('questionVerifyModule', [])
        .controller('questionVerifyCtrl', ['$scope', '$ui', '$store', '$request', function ($scope, $ui, $store, $request) {

            $scope.selected1 = '';
            $scope.selected2 = '';
            $scope.selected3 = '';
            $scope.answer1 = '';
            $scope.answer2 = '';
            $scope.answer3 = '';

            $scope.issue1 = [
                {id: '1', name: '您父亲的姓名是?'},
                {id: '2', name: '您母亲的姓名是?'},
                {id: '3', name: '您父亲的生日是?'},
                {id: '4', name: '您母亲的生日是?'},
                {id: '5', name: '您配偶的姓名是?'},
                {id: '6', name: '您配偶的生日是?'},
                {id: '7', name: '您小学班主任的名字是?'},
                {id: '8', name: '您高中班主任的名字是?'},
                {id: '9', name: '您的学号（或工号）是?'},
                {id: '10', name: '您初中班主任的名字是?'},
                {id: '11', name: '对您影响最大的人名字是?'},
                {id: '12', name: '您最熟悉的童年好友名字是?'},
                {id: '13', name: '您最熟悉的学校宿舍舍友名字是?'}
            ];

            $scope.issue2 = [
                {id: '1', name: '您父亲的姓名是?'},
                {id: '2', name: '您母亲的姓名是?'},
                {id: '3', name: '您父亲的生日是?'},
                {id: '4', name: '您母亲的生日是?'},
                {id: '5', name: '您配偶的姓名是?'},
                {id: '6', name: '您配偶的生日是?'},
                {id: '7', name: '您小学班主任的名字是?'},
                {id: '8', name: '您高中班主任的名字是?'},
                {id: '9', name: '您的学号（或工号）是?'},
                {id: '10', name: '您初中班主任的名字是?'},
                {id: '11', name: '对您影响最大的人名字是?'},
                {id: '12', name: '您最熟悉的童年好友名字是?'},
                {id: '13', name: '您最熟悉的学校宿舍舍友名字是?'}
            ];

            $scope.issue3 = [
                {id: '1', name: '您父亲的姓名是?'},
                {id: '2', name: '您母亲的姓名是?'},
                {id: '3', name: '您父亲的生日是?'},
                {id: '4', name: '您母亲的生日是?'},
                {id: '5', name: '您配偶的姓名是?'},
                {id: '6', name: '您配偶的生日是?'},
                {id: '7', name: '您小学班主任的名字是?'},
                {id: '8', name: '您高中班主任的名字是?'},
                {id: '9', name: '您的学号（或工号）是?'},
                {id: '10', name: '您初中班主任的名字是?'},
                {id: '11', name: '对您影响最大的人名字是?'},
                {id: '12', name: '您最熟悉的童年好友名字是?'},
                {id: '13', name: '您最熟悉的学校宿舍舍友名字是?'}
            ];

            $scope.issue4 = [
                {id: '1', name: '您父亲的姓名是?'},
                {id: '2', name: '您母亲的姓名是?'},
                {id: '3', name: '您父亲的生日是?'},
                {id: '4', name: '您母亲的生日是?'},
                {id: '5', name: '您配偶的姓名是?'},
                {id: '6', name: '您配偶的生日是?'},
                {id: '7', name: '您小学班主任的名字是?'},
                {id: '8', name: '您高中班主任的名字是?'},
                {id: '9', name: '您的学号（或工号）是?'},
                {id: '10', name: '您初中班主任的名字是?'},
                {id: '11', name: '对您影响最大的人名字是?'},
                {id: '12', name: '您最熟悉的童年好友名字是?'},
                {id: '13', name: '您最熟悉的学校宿舍舍友名字是?'}
            ];

            $scope.submit = function (invalid) {
                if (invalid) {
                    return false;
                } else if ($scope.issueId1 == undefined || $scope.issueId2 == undefined || $scope.issueId3 == undefined) {
                    $ui.notify('请选择密保问题?', '温馨提示');
                    return false;
                }

                $scope.user.security = {};
                $scope.user.security.issue1 = $scope.issue4[$scope.issueId1].name;
                $scope.user.security.issue2 = $scope.issue4[$scope.issueId2].name;
                $scope.user.security.issue3 = $scope.issue4[$scope.issueId3].name;
                $scope.user.security.answer1 = $scope.answer1;
                $scope.user.security.answer2 = $scope.answer2;
                $scope.user.security.answer3 = $scope.answer3;
                
                var data = {security: angular.copy($scope.user.security)}
                $request.post("api/?model=user&action=edit_user&id=" + $scope.user._id.$id, data, function (response) {
                    if (response.success) {
                        $ui.notify('设置成功', '确认');
                        $store.setJson("USERINFO", $scope.user);
                    } else {
                        $ui.error(response.error);
                    }
                }, function (err) {
                    $ui.error('删除失败，' + err, '错误');
                });
            }

            $scope.question = function (index, id) {
                if (index == 1) {
                    $scope.issueId1 = $scope.selected1 - 1;

                } else if (index == 2) {
                    $scope.issueId2 = $scope.selected2 - 1;

                } else if (index == 3) {
                    $scope.issueId3 = $scope.selected3 - 1;

                }

            }

            $scope.judge = function (index) {

                if (index == 1) {

                    $scope.issue1 = angular.copy($scope.issue4);

                    var i = 0;
                    if (!isNaN($scope.issueId2)) {
                        $scope.issue1.splice($scope.issueId2, 1);
                        if ($scope.issueId2 < $scope.issueId3) {
                            i++;
                        }
                    }
                    if (!isNaN($scope.issueId3)) {
                        if ($scope.issueId3 == 0) {
                            i = 0;
                        }
                        $scope.issue1.splice($scope.issueId3 - i, 1);
                    }


                } else if (index == 2) {

                    $scope.issue2 = angular.copy($scope.issue4);

                    var i = 0;
                    if (!isNaN($scope.issueId1)) {
                        $scope.issue2.splice($scope.issueId1, 1);
                        if ($scope.issueId1 < $scope.issueId3) {
                            i++;
                        }
                    }
                    if (!isNaN($scope.issueId3)) {
                        $scope.issue2.splice($scope.issueId3 - i, 1);
                    }


                } else if (index == 3) {

                    $scope.issue3 = angular.copy($scope.issue4);

                    var i = 0;
                    if (!isNaN($scope.issueId1)) {
                        $scope.issue3.splice($scope.issueId1, 1);
                        if ($scope.issueId1 < $scope.issueId2) {
                            i++;
                        }
                    }
                    if (!isNaN($scope.issueId2)) {
                        $scope.issue3.splice($scope.issueId2 - i, 1);
                    }


                }
            }

            $scope.init = function () {
                var userInfoKey = 'USERINFO';
                $scope.userInfo = $store.getJson(userInfoKey);
                var id = $scope.userInfo._id.$id;
                $request.get("api/?model=user&action=get_user&id=" + id, function (response) {
                    if (response.success) {
                        $scope.user = response.data;

                    } else {
                        $scope.error = response.error;
                    }
                }, function (error) {
                    $ui.error(error);
                });

            };

            $scope.init();

            $scope.goBack = function () {
                location.href = "#/safety/index";
            }

        }])
})