/**
 * Created by Administrator on 2016/3/4.
 */
"use strict";
define([""], function () {
    angular.module('homeFooterModule', [])
        .controller('homeFooterCtrl', ['$scope','$request', '$state','$ui',function ($scope,$request,$state,$ui) {
            $scope.parents = [];
            $scope.childs = [];


            //把查出的所有子类，整合到父类中。
            $scope.integrate = function(){
                if($scope.parents && $scope.childs){
                    //第一层循坏所有子类
                    for(var i=0;i<$scope.childs.length; i++){
                        //第二层循坏所有父类
                        for(var j=0;j<$scope.parents.length;j++){
                            //判断当前子类的pid是否等于当前父类的_id.$id
                            if($scope.parents[j]._id.$id == $scope.childs[i].pid){
                                if(!$scope.parents[j].subclass) $scope.parents[j].subclass =[];
                                //等于 添加到父类的subclass中
                                $scope.parents[j].subclass.push($scope.childs[i]);
                                break;
                            }
                        }
                    }
                }
            }


            //查询所有子类
            $scope.inquireChild = function(){
                $request.getWithNoBlock('api/?model=news&action=custom_query&key=type&value=subclass',
                    function (response) {
                        if (response.success) {
                            $scope.childs  =  response.data;
                            //把查出的所有子类，整合到父类中。
                            $scope.integrate();
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
            }

            //查询所有父类
            $scope.inquireParent = function(){
                $request.getWithNoBlock('api/?model=news&action=custom_query&key=type&value=parent',
                    function (response) {
                        if (response.success) {
                            $scope.parents  =  response.data;
                            //查询所有子类
                            $scope.inquireChild();
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
            }
            $scope.inquireParent();

            $scope.godetails = function(id){
                $state.go('module', {
                    'module': 'news',
                    'action': 'details',
                    'params': 'id='+id+'&state=product'
                });
            }


        }])
});