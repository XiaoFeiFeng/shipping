/**
 * Created by fengxiaofei on 2015/12/17.
 */

'use strict'
define([], function () {
    angular.module('homeIndexModule', [])
        .controller("homeIndexCtrl", ['$scope', '$ui', '$request', '$data', '$state', 'validateService',
            function ($scope, $ui, $request, $data, $state, validateService) {

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }

                $scope.currentPage = 1;
                $scope.pageSize = 6;
                $scope.init = function () {
                    var url = '&ps=' + $scope.pageSize + '&pi=' + $scope.currentPage;
                    $request.get('/api/?model=news&action=get_all_news&type=press' + url, function (data) {
                        $scope.items = data.data.reverse();
                        for (var i = 0; i < $scope.items.length; i++) {
                            if ($scope.items[i].title.length >= 28) {
                                $scope.items[i].title = $scope.items[i].title.substring(0, 28) + '...';
                            }
                        }

                        $scope.totalItems = $scope.items.count;
                    }, function (err) {
                        alert(err);
                    })
                    $request.get('api/?model=news&action=get_all_news&type=notice&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize,
                        function (response) {
                            if (response.success) {
                                $scope.imgNews = response.data;

                                for(var i=0;i<$scope.imgNews.length; i++){
                                    for (var j = 0; j < i; j++) {
                                        if($scope.imgNews[i].created_time > $scope.imgNews[j].created_time){
                                            var arr = $scope.imgNews[i];
                                            $scope.imgNews[i] = $scope.imgNews[j];
                                            $scope.imgNews[j] = arr;
                                        }
                                    }
                                }
                                for (var i = 0; i < $scope.imgNews.length; i++) {
                                    if ($scope.imgNews[i].title.length >= 40) {
                                        $scope.imgNews[i].title = $scope.imgNews[i].title.substring(0, 37) + '...';
                                    }
                                }
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        }, function (err) {
                            $ui.error(err);
                        });

                }

                $scope.init();

                $scope.countryData = {selectedData: {}};
                $scope.weight = "";


                $scope.gotoList = function () {
                    if (validateService.isEmpty($scope.weight)) {
                        $scope.weight = 0.1;
                    }
                    var path = "/quote/list";
                    var data = {
                        'countryData': $scope.countryData,
                        'weight': $scope.weight
                    }

                    $ui.locatePartWithData(path, data);
                }

                $scope.new_details = function (id) {
                    $state.go('module', {
                        'module': 'news',
                        'action': 'details',
                        'params': 'id=' + id
                    });
                }

            }])
})


	