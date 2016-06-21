"use strict";
define([], function () {
    angular.module('aboutIndexModule', [])
        .controller('aboutIndexCtrl', ['$scope','$request', function ($scope,$request) {
            $scope.type = "intro";
            $scope.alter = function(mark,type){
                for(var i=0; i<4; i++){
                    $('.about-menus li:eq('+i+')').removeClass('about-active');
                }
                $('.about-menus li:eq('+mark+')').addClass('about-active');
                $scope.type = type;
                $scope.getDetails();
            }

            $scope.getDetails = function(){
                $request.get('api/?model=news&action=query_one_news&key=type&value='+$scope.type, function (response) {
                    if (response.data) {
                        $scope.data = response.data;
                        $scope.data.content = $scope.data.content.replace(/&quot;/g, "\"");
                        document.getElementById("content").innerHTML =  $scope.data.content;
                    }
                });
            }
            $scope.getDetails();

        }])
});