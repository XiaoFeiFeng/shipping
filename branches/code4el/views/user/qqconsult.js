/**
 * Created by admin on 2016/4/29.
 */
"use strict";
define([""], function () {
    angular.module('userQqconsultModule', [])
        .controller('userQqconsultCtrl', ['$scope', '$request','$ui',function ($scope,$request,$ui) {
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
                                $scope.childs[i].subscript = j;
                                $scope.parents[j].subclass.push($scope.childs[i]);
                                break;
                            }
                        }
                    }
                }
            }


            //查询所有子类
            $scope.inquireChild = function(){
                $request.getWithNoBlock('api/?model=consult&action=custom_query&key=type&value=qq',
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
                $request.getWithNoBlock('api/?model=consult&action=custom_query&key=type&value=grouping',
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

            $scope.goChat = function(qq){
                window.open("http://www.baidu.com")
            }

           /* setTimeout(function(){
                // console.log($scope.parents);
                for(var i=0; i<$scope.childs.length;i++){
                    var url =    //$scope.childs[i].link
                  $(".relationqq:eq("+i+")").attr("href","tencent://message/?uin="+$scope.childs[i].link+"&site=qq&menu=yes");
                }

                console.log(aaa);
            },1000);
*/
            $scope.changeUrl = function(item,subscript){
                var sum = 0;
                for (var i = 0; i < item.subscript; i++) {
                    if($scope.parents[i].subclass){
                        sum +=  $scope.parents[i].subclass.length;
                    }

                }
                sum += subscript;
                $(".relationqq:eq("+sum+")").attr("href","tencent://message/?uin="+item.link+"&site=qq&menu=yes");
            }

        }])
});