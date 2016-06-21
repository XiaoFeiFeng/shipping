'use strict'

define([], function () {
    angular.module('yilianJoinModule', [])
        .controller('yilianJoinCtrl', ['$scope', '$ui', '$request', '$state', '$data', function ($scope, $ui, $request, $state, $data) {
            $scope.news = {};
            $scope.submitForm = function ($invalid) {
                if ($invalid) {
                    return false;
                }

                var news = UE.getEditor('ueditor').getContent();
                $scope.news.content = news.replace(/"/g, "&quot;");

                if (!$scope.state) {
                    var id = "";
                    $scope.news.type = "join";
                    var hint = "添加成功";
                } else {
                    var hint = "修改成功";
                    var id = '&id=' + $scope.news._id.$id;
                }

                var obj = angular.copy($scope.news)

                $request.post('api/?model=news&action=edit_one_news' + id, obj,
                    function (response) {
                        if (response.success) {

                            $ui.notify(hint, '提示', function () {
                            });
                            $scope.getData();

                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }

                    }, function (err) {
                        $ui.error(err);
                    });

            }

            $scope.getData = function () {
                $request.get('api/?model=news&action=query_one_news&key=type&value=join', function (response) {
                    if (response.data) {
                        $scope.news = response.data;
                        $scope.news.content = $scope.news.content.replace(/&quot;/g, "\"");
                        $scope.state = true;
                    } else {
                        $scope.state = false;
                    }
                });
            }
            $scope.getData();


        }])
})
