/**
 * Created by Administrator on 2016/1/15.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('personInfoIndexModule', [])
        .controller('personInfoIndexCtrl', ['$scope', '$store', '$request', '$ui', function ($scope, $store, $request, $ui) {


            $scope.user = $store.getUserInfo();
            if ($scope.user && $scope.user.city) {
                $scope.city = $scope.user.city.cn;
            }

            $scope.$on('onCitySelected', function (event, item) {
                $scope.user.city = item;
            });

            $scope.submit = function () {

                var data = {};

                data.city = $scope.user.city;
                data.brithday = $scope.user.brithday;
                data.nickname = $scope.user.nickname;
                data.realname = $scope.user.realname;
                data.gender = $scope.user.gender;

                $request.post('api/?model=user&action=edit_user&id=' + $scope.user._id.$id,
                    data,
                    function (response) {
                        if (response.success) {
                            $ui.notify('保存成功！', '提示', function () {
                                $store.setUserInfo($scope.user);
                            })
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error('修改失败，' + err, '错误');
                    });
            }
        }])
})