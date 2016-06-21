/**
 * Created by admin on 2016/3/21.
 */
'use strict'

define([], function () {
    angular.module('newsAddModule', [])
        .controller('newsAddCtrl', ['$scope', '$ui', '$request', function ($scope, $ui, $request) {
            $scope.news = {};
            var request = $ui.getKeyByUrl();

            $scope.getData = function () {
                $request.get('api/?model=news&action=get_one_news&id=' + $scope.id, function (response) {
                    if (response.success) {
                        $scope.news = response.data;
                        $scope.news.content = $scope.news.content.replace(/&quot;/g, "\"");
                    } else {
                        $ui.error(response.error);
                    }
                });
            }
            

            $scope.submitForm = function ($invalid) {
                if ($invalid) {
                    return false;
                }
                var data = angular.copy($scope.news);
                data.content = data.content.replace(/"/g, "&quot;");

                if (!$scope.id) {
                    data.type = 'news';
                    $request.post('api/?model=news&action=edit_one_news', data,
                        function (response) {
                            if (response.success) {

                                $ui.confirm('添加成功，是否继续添加?', '确认',
                                    function () {
                                        $scope.news = {};
                                    })
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }

                        }, function (err) {
                            $ui.error(err);
                        });
                } else {

                    delete data._id;
                    $request.post('api/?model=news&action=edit_one_news&id=' + $scope.id, data,
                        function (response) {
                            if (response.success) {
                                $ui.notify('修改成功', '提示', function () {
                                    $scope.getData();
                                });
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }

                        }, function (err) {
                            $ui.error(err);
                        });
                }


            }

            if (request) {
                $scope.id = request.id;
                $scope.getData();
            }

        }])
})