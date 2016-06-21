/**
 * Created by admin on 2016/3/21.
 */
'use strict'

define([], function () {
    angular.module('newsEditsubclassModule', [])
        .controller('newsEditsubclassCtrl', ['$scope', '$ui', '$request', '$state', '$data', function ($scope, $ui, $request, $state, $data) {
            $scope.news = {};


            $scope.submitForm = function ($invalid) {
                if ($invalid) {
                    return false;
                }
                var news = UE.getEditor('ueditor').getContent();
                $scope.news.content = news.replace(/"/g, "&quot;");

                var data = angular.copy($scope.news);

                if(!$scope.state){
                    data.pid = $scope.pid;
                    data.type = 'details';
                    var notify = '添加成功！';
                    var id = '';
                }else{
                    var notify = '修改成功！';
                    var id = '&id='+$scope.news._id.$id;
                }
                $request.post('api/?model=news&action=add_classify'+id, data,
                    function (response) {
                        if (response.success) {
                            $ui.notify(notify, '提示', function () {
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
                $request.get('api/?model=news&action=custom_query&key=pid&value=' + $scope.pid, function (response) {
                    if (response.success) {
                        $scope.news = response.data[0];
                        $scope.news.content = $scope.news.content.replace(/&quot;/g, "\"");
                        $scope.state = true;
                    } else {
                        $scope.state = false;
                    }
                });
            }

            var params = $ui.getUrlParam();
            if (params) {
                $scope.pid = params.pid;
                if ($scope.pid) {
                    $scope.getData();
                }
            }

        }])
})
