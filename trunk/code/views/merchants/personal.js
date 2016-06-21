/**
 * Created by Administrator on 2015/12/10.
 */
'use strict'
define(['angular-city'], function () {
        var merchantsIndexModule = angular.module("merchantsPersonalModel", []);

        merchantsIndexModule.controller('merchantsPersonalCtrl', ['$scope', '$ui', '$request', '$rootScope', '$store',
            function ($scope, $ui, $request, $rootScope, $store) {

                if (!$rootScope.logined) {
                    $ui.locateLogin();
                }

                $scope.merchant = {};
                $scope.merchant.type = "personal";
                $scope.merchant.images = [];

                $scope.apply = function (invalid) {
                    if (invalid) return false;
                    var data = angular.copy($scope.merchant);
                    if (data.images.length == 0) {
                        $ui.error("请上传证件.");
                        return false;
                    }

                    data.state = 0;
                    data.userId = $store.getUserInfo()._id.$id;

                    $request.post('api/?model=merchant&action=apply', data, function (response) {
                        if (response.success) {
                            $ui.notify('您的申请已提交工作人员审核,处理结果我们会在第一时间通知您，请保持电话畅通！', '提示', function () {
                                $ui.locate("#/home/index");
                            });
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error(err);
                    })
                }

                $("#fileupload").fileinput({
                    uploadUrl: 'api/?model=merchant&action=upload', //文件上传地址
                    uploadAsync: false,
                    uploadExtraData: {},
                    maxFileCount: 2,
                    allowedFileExtensions: ["jpg", "jpeg", "png"],//允许文件后缀名
                    overwriteInitial: false,
                    maxFileSize: 2048,//单个文件最大值 (KB)
                    maxFilesNum: 2, //单次最多上传文件数
                    showCaption: false,//是否显示输入框
                    showPreview: true,//是否显示预览

                    browseClass: "btn btn-success",
                    browseLabel: "选择文件",
                    browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",

                    removeClass: "btn btn-danger",
                    removeLabel: "删除",
                    removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",

                    uploadClass: "btn btn-info",
                    uploadLabel: "上传",
                    uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> ",
                    //allowedFileTypes: ['image', 'video', 'flash'], //允许文件的类型
                    slugCallback: function (filename) {
                        return filename.replace('(', '_').replace(']', '_');
                    }
                });

                $('#fileupload').on('fileloaded', function (event, file, previewId, index, reader) {
                    $(".file-caption-name").width(195);
                    $(".file-preview-image").height(110);
                    $(".file-preview-frame").height(110);

                });
                $('#fileupload').on('filebatchuploadsuccess', function (event, data, previewId, index) {

                    if (data.response.success) {
                        for (var i = 0; i < data.response.paths.length; i++) {
                            $scope.merchant.images.push(data.response.paths[i]);
                        }
                    }
                });

                $('#fileupload').on('filebatchuploaderror', function (event, data) {
                    var form = data.form, files = data.files, extra = data.extra,
                        response = data.response, reader = data.reader;
                    console.log('File batch upload error');
                });

            }]);
    }
)