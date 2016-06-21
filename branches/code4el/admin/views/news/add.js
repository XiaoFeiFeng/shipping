/**
 * Created by admin on 2016/3/21.
 */
'use strict'

define([], function () {
    angular.module('newsAddModule', [])
        .controller('newsAddCtrl', ['$scope', '$ui', '$request', '$state', '$data', function ($scope, $ui, $request, $state, $data) {
            $scope.news = {};
            var params = $ui.getUrlParam();
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

            $scope.getBack = function () {
                $state.go('module', {
                    'module': 'news',
                    'action': $scope.type
                });
            }


            $scope.submitForm = function ($invalid) {
                if ($invalid) {
                    return false;
                }
                var news = UE.getEditor('ueditor').getContent();
                $scope.news.content = news.replace(/"/g, "&quot;");

                if (!$scope.id) {
                    var id = "";
                } else {
                    var id = '&id=' + $scope.id;
                }
                var data = angular.copy($scope.news);
                data.type = $scope.type;
                $request.post('api/?model=news&action=edit_one_news'+ id, data,
                    function (response) {
                        if (response.success) {
                            if ($scope.id) {
                                //修改
                                $ui.notify('修改成功', '提示', function () {});
                                $scope.getData();
                            } else {
                                //添加
                                $ui.confirm('添加成功，继续添加？', '确认', function () {
                                    $scope.news = {};
                                }, function () {});

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

            if (params) {
                $scope.type = params.type
                $scope.id = params.id;
                if ($scope.id) {
                    $scope.getData();
                }
            }


            $scope.hlsOption = {
                id: "upload",
                multiple: true,
                url: "http://www.93myb.com/shipping/api/upload_img/article.php",
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
                    if (response) {
                        $ui.notify('上传成功!', '提示', function () {
                            $scope.news.img = response.replace(/\./, "/api/upload_img");
                        });
                    } else {
                        $ui.error('上传失败', '错误', function () {

                        });
                    }
                }, error: function (err) {
                    console.log(err);
                }
            }

        }])
})
