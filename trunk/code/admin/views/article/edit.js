/**
 * Created by admin on 2016/4/19.
 */

'use strict'

define([], function () {
    angular.module('articleEditModule', [])
        .controller('articleEditCtrl', ['$scope', '$ui', '$request', function ($scope, $ui, $request) {
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
                if(!$scope.news.img){
                      $ui.notify('请上传封面图片！', '提示', function () {
                                          
                                      });
                    return;
                }

                var data        =  angular.copy($scope.news);
                data.content   =  data.content.replace(/"/g, "&quot;");
                if (!$scope.id) {
                    data.type = 'notice';
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

            $scope.hlsOption = {
                id: "upload",
                multiple: true,
                url: "/api/upload_img/article.php",
                upload: {
                    uploadClass: "btn btn-success",
                    text: "上传",
                    icon: "fa fa-arrow-up"
                },
                brower: {
                    browerClass: "btn btn-success",
                    text: "选择图片",
                    icon: "fa fa-folder-open"
                },
                clean: {
                    enable: true,
                    cleanClass: "btn btn-success",
                    text: "清空",
                    icon: "fa fa-remove"
                },
                success: function (response) {
                    if(response){
                        $ui.notify('上传成功!', '提示', function () {
                            $scope.news.img =  response.replace(/\./,"/api/upload_img");
                        });
                    }else{
                        $ui.error('上传失败', '错误', function () {
                                            
                                        });
                    }

                }, error: function (err) {
                    console.log(err);
                }
            }

            if (request) {
                $scope.id = request.id;
                $scope.getData();
            }

        }])
})