/**
 * Created by Administrator on 2016/2/29.
 */


'use strict'
define([], function () {

    angular.module("newsDetailsModule", [])

        .controller('newsDetailsCtrl', ['$scope', '$request', 'blockUI', '$data','$ui',
            function ($scope, $request, blockUI,$data,$ui) {

                $scope.init = function(){
                    var params =  $ui.getUrlParam();
                    var id     =  params.id;
                    $request.get('/api/?model=news&action=get_one_news&id='+id, function (data) {
                        $scope.result = data.data;
                        $scope.result.content = $scope.result.content.replace(/&quot;/g, "\"");
                        document.getElementById("content").innerHTML = $scope.result.content;
                    }, function (err) {
                        alert(err);
                    })
                }
                $scope.init();
            }]);
})