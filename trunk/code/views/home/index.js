/**
 * Created by fengxiaofei on 2015/12/17.
 */

'use strict'
define([], function () {
    angular.module('homeIndexModule', [])
        .controller("homeIndexCtrl", ['$scope', '$ui', '$request', '$data','$state', function ($scope, $ui, $request, $data,$state) {

            $scope.getDate = function (tick) {
                return $data.getDate(tick);
            }


            $scope.currentPage = 1;
            $scope.pageSize = 5;
            $scope.init = function () {
                // 新闻资讯
                var url = '&ps=' + $scope.pageSize + '&pi=' + $scope.currentPage;
                $request.get('/api/?model=news&action=get_all_news&type=news' + url, function (data) {
                    $scope.items = data;
                    $scope.totalItems = $scope.items.count;
                }, function (err) {
                    alert(err);
                })
                // 列表公告
                var noticeUrl = '&ps=6&pi=1';
                $request.get('/api/?model=news&action=get_all_news&type=notice'+noticeUrl ,function (data) {
                    $scope.imgNews = data.data;
                    var omit = '...';
                    for(var i=0;i<$scope.imgNews.length; i++){
                        if($scope.imgNews[i].title.length > 30){
                            $scope.imgNews[i].title = $scope.imgNews[i].title.substring(0,30)+omit;
                            console.log($scope.imgNews[i].title);
                        }
                    }
                    
                }, function (err) {
                    alert(err);
                })
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

            $scope.new_details = function(id){
                $state.go('module', {
                    'module': 'news',
                    'action': 'details',
                    'params': 'id='+id
                });
            }

           /* $scope.imgNews = [];

            for (var i = 0; i < 6; i++) {
                var news = {};
                news.img = '../../img/news/' + (i + 1) + '.jpg';
                news.tiltle = 'Wish专题班';
                news.content = 'Wish平台主要针对欧美、北美国家，客户群体很广，新兴平台，所以关注的人非...';
                $scope.imgNews.push(news);
            }*/
        }])
})


	