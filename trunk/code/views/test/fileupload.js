/**
 * Created by Administrator on 2015/12/10.
 */
'use strict'
define([], function () {
        var testFileUploadModule = angular.module("testFileUploadModule", []);

        testFileUploadModule.controller('testFileUploadCtrl', function ($scope, $ui, $http, $request, blockUI) {
            $scope.uploadFile = function () {
              /*  var formId = "testForm";
                var url = '/api/view/test.php';
                var data = {
                    name: "张三",
                    age: 35,
                    address: '深圳市南山区'
                }

                var formData = new FormData(document.forms.namedItem(formId));
                for (var key in data) {
                    formData.append(key, data[key]);
                }

                $request.postFile(url, formData, function (response) {
                    alert(response);
                }, function (error) {
                    alert(error);
                })*/
                ///api?model=merchant&action=upload
                var fd = new FormData(document.getElementById("testForm"));
                var xhr = new XMLHttpRequest();
                xhr.open("POST" ,"/api/view/test.php" , true);
                xhr.send(fd);
                xhr.onload = function(e) {
                    if (this.status == 200) {
                        alert(this.responseText);
                    };
                };

            }

            $scope.hlsOption = {
                id: "testUpload",
                multiple: true,
                url: "/api/view/test.php",
                data: {
                    name: "张三",
                    address: "深圳"
                },
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
                    console.log(response);
                }, error: function (err) {
                    alert(err);
                }
            }

        });
    }
)