/**
 * Created by admin on 2016/3/29.
 */
"use strict";
define([""], function () {
    angular.module('expressQueryModule', [])
        .controller('expressQueryCtrl', ['$scope', '$ui','$uibModalInstance','modalData','$http',
            function ($scope,$ui,$uibModalInstance,modalData,$http) {
                $scope.item = modalData;
                $scope.code = modalData.code;
                $scope.cancel = function () {
                    $uibModalInstance.close();
                }
                $scope.query = function(){
                    $scope.loading = true;
                    if($scope.order){

                        $.get('http://www.93myb.com/api/kuaidi100/get.php?com=',{com:$scope.code,nu:$scope.order},function(data){

                            $("#content").html(data)
                            $('#img').remove();
                        })

                    }else{
                          $ui.notify('请输入运单号', '提示', function () {

                                          });
                    }

                }
        }])
});