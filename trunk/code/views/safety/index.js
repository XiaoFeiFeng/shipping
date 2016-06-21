/**
 * Created by Administrator on 2016/1/15.
 */
'use strict'
define(['angular-city'], function () {
    angular.module('safetyIndexModule', [])
        .controller('safetyIndexCtrl', ['$scope', '$request', '$store', function ($scope, $request, $store) {
            $scope.securityQuestion = false;
            $scope.email = false;

            $scope.init = function () {
                var userInfoKey = 'USERINFO';
                $scope.userInfo = $store.getJson(userInfoKey);
                var id          = $scope.userInfo._id.$id;
                $request.get("api/?model=user&action=get_user&id=" + id,function(response){
                    if(response.success){
                        $scope.user = response.data;
                        if ($scope.user.security) {
                            $scope.securityQuestion = true;
                        }
                        ;
                        if ($scope.user.email) {
                            $scope.email = true;
                        }

                    }else{
                        $scope.error = response.error;
                    }
                },function(error){
                    $ui.error(error);
                });


            };

            $scope.init();


        }])
})
