/**
 * Created by fengxiaofei on 2015/12/2.
 */
'use strict'
define([], function () {

    angular.module("newsNoticeModule", [])

        .controller('newsNoticeCtrl', ['$scope', '$request', 'blockUI', '$data','$ui','$state',
            function ($scope, $request, blockUI,$data,$ui,$state) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }
                $scope.pageChange = function () {
                    $scope.init();
                }
                $scope.init = function(){
                    var url = '&ps='+ $scope.pageSize + '&pi='+$scope.currentPage;
                    $request.get('/api/?model=news&action=get_all_news&type=notice'+url, function (data) {
                        $scope.items = data;
                        $scope.totalItems = $scope.items.count;
                    }, function (err) {
                        alert(err);
                    })
                }
                $scope.init();


                $scope.new_details = function(id){

                    $state.go('module', {
                        'module': 'news',
                        'action': 'details',
                        'params': 'id='+id
                    });
                }
            }]);
})