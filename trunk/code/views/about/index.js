"use strict";
define([], function () {
    angular.module('aboutIndexModule', [])
        .controller('aboutIndexCtrl', ['$scope', function ($scope) {
            $scope.url = 'http://www.kuaidi100.com/autonumber/auto?num=906919164534&key=fHzTcuaq6391';


            $scope.query = function () {


                $.ajax({
                    url: $scope.url,
                    data: "",
                    success: function (a, b, c, d) {

                        var response = a;
                    }, error: function (a, b, c, d) {
                        var error = a;
                    }
                });

                //
                // function jsonpCallback(result) {
                //     //alert(result);
                //     for (var i in result) {
                //         alert(i + ":" + result[i]);//循环输出a:1,b:2,etc.
                //     }
                // }
                //
                // var JSONP = document.createElement("script");
                // JSONP.type = "text/javascript";
                // JSONP.src = $scope.url + "&callback=jsonpCallback";
                // document.getElementsByTagName("head")[0].appendChild(JSONP);

            }
        }])
});