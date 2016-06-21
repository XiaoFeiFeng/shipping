/**
 * Created by Administrator on 2016/2/24.
 */
'use strict'
define(['angular-city'],function(){
    angular.module('issueresetModule',[])
        .controller('issueresetCtrl',['$scope','$ui','$store','$request',function($scope,$ui,$store,$request){

            $scope.answer1 = "";
            $scope.answer2 = "";
            $scope.answer3 = "";

            $scope.init = function(){

                $scope.userInfo = $store.getUserInfo();
                var id          = $scope.userInfo._id.$id;
                $request.get("api/?model=user&action=get_user&id=" + id,function(response){
                    if(response.success){
                        $scope.user = response.data;
                        console.log($scope.user);
                    }else{
                        $scope.error = response.error;
                    }
                },function(error){
                    $ui.error(error);
                });

            };

            $scope.init();

            $scope.goBack = function(){
                location.href = "#/safety/index";
            }

            $scope.submit = function(invalid){
                if(invalid){
                    return false;
                }
                if($scope.answer1 == $scope.user.security.answer1 && $scope.answer2 == $scope.user.security.answer2 &&
                    $scope.answer3 == $scope.user.security.answer3){
                    $ui.notify("验证成功，请认真填写下面的密保问题","温馨提示");
                    window.location.href = "#/safety/questionVerify"
                }else{
                    $ui.notify("验证失败,请重新填写答案","温馨提示");
                }
            }

        }])
})