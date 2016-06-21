'use strict'
define([], function () {
    angular.module('logisticaddChannelTplModule', [])
        .controller("logisticaddChannelTplCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData','$http',function ($scope, $ui, $validate, $request, $uibModalInstance, modalData,$http) {

            $scope.data = modalData;

            if ($validate.isEmpty($scope.data)) {
                $uibModalInstance.close();
            }

            $scope.title = $scope.data.operator == "edit" ? "编辑" : '添加';

            $scope.channel = {};


            if ($scope.data.operator == "edit") {

                $scope.channel = $scope.data.channel;
                $scope.isEdit = true;

            }
            $scope.reset = function () {
                $scope.channel = {};
            }

            $scope.cancel = function () {
                $uibModalInstance.close($scope.isAdded);
            }

            $scope.submitForm = function () {
                if ($scope.isEdit) {
                    var data = angular.copy($scope.channel);
                    delete data._id;
                    delete data.$checked;
                    delete data.channel_logId;
                    delete data.__v;
                    console.log(data);
                    $request.post('api/?model=logistic&action=edit_channel&id=' + $scope.channel._id.$id + '&channel_logId='+$scope.channel.channel_logId.$id,
                        data,
                        function (response) {
                            $ui.notify('保存成功！', '提示',
                                function () {
                                    $uibModalInstance.close(true);
                                })
                        }, function (err) {
                            $ui.error('修改失败，' + err, '错误');
                        });
                } else {

                    $request.post('api/?model=logistic&action=edit_channel&channel_logId=' + $scope.data.category._id.$id,
                        $scope.channel,
                        function (response){
                            $ui.confirm('添加成功，是否继续添加?', '确认',
                                function () {
                                    $scope.reset()
                                    $scope.isAdded = true;
                                },
                                function () {
                                    $uibModalInstance.close(true);
                                })
                        }, function (err){
                            $ui.error('添加失败，' + err, '错误');
                        });
                }
            }



            $scope.uploadAddressTemplate = function () {

               var oData = new FormData(document.forms.namedItem("address_template_file"));
                $.ajax({
                    url: 'http://www.93myb.com/admin/api/?model=logistic&action=upload_channel_file&type=address_template',
                    type: 'POST',
                    data: oData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (returndata) {
                        var data = eval('(' + returndata + ')');
                        if(data.success){
                            $scope.channel.address_template = data.path;
                        }else{
                            $ui.error(data.error);
                        }
                    },
                    error: function (returndata) {
                        $ui.error(returndata);
                    }
                });
            }


            $scope.uploadAddressTemplateImage = function () {
                var oData = new FormData(document.forms.namedItem("address_template_img_file"));
                $.ajax({
                    url: 'http://www.93myb.com/admin/api/?model=logistic&action=upload_channel_file&type=address_template_img',
                    type: 'POST',
                    data: oData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (returndata) {
                        var data = eval('(' + returndata + ')');
                        if(data.success){
                            $scope.channel.address_template_img = data.path;
                        }else{
                            $ui.error(data.error);
                        }
                    },
                    error: function (returndata) {
                        $ui.error(returndata);
                    }
                });
            }



            $scope.uploadCustomsTemplate = function () {
                var oData = new FormData(document.forms.namedItem("customs_template_file"));
                $.ajax({
                    url: 'http://www.93myb.com/admin/api/?model=logistic&action=upload_channel_file&type=customs_template',
                    type: 'POST',
                    data: oData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (returndata) {
                        var data = eval('(' + returndata + ')');
                        if(data.success){
                            $scope.channel.customs_template = data.path;
                        }else{
                            $ui.error(data.error);
                        }
                    },
                    error: function (returndata) {
                        $ui.error(returndata);
                    }
                });
            }


            $scope.uploadCustomsTemplateImage = function () {
                var oData = new FormData(document.forms.namedItem("customs_template_img_file"));
                $.ajax({
                    url: 'http://www.93myb.com/admin/api/?model=logistic&action=upload_channel_file&type=customs_template_img',
                    type: 'POST',
                    data: oData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (returndata) {
                        var data = eval('(' + returndata + ')');
                        if(data.success){
                            $scope.channel.customs_template_img = data.path;
                        }else{
                            $ui.error(data.error);
                        }
                    },
                    error: function (returndata) {
                        $ui.error(returndata);
                    }
                });
            }



            /*$scope.hlsOption = {
                url: "http://www.93myb.com/admin/api/?model=logistic&action=upload_channel_file&type=customs_template_img",
                id:'upload',
                upload: {
                    class: "btn btn-success",
                    text: "上传",
                    icon: "fa fa-arrow-up"
                },
                brower: {
                    class: "btn btn-success",
                    text: "选择图片",
                    icon: "fa fa-folder-open"
                },
                clean: {
                    enable: false
                },
                success: function (response) {


                }, error: function (err) {
                    alert(err);
                }
            }*/

        }])


})