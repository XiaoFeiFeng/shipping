'use strict'
define([], function () {
    angular.module('logistricCreateModule', [])
        .controller("logisticaddProTplCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData', function (
            $scope, $ui, $validate, $request, $uibModalInstance, modalData) {
            $scope.logistic = {};
            if (!$validate.isEmpty(modalData) && !$validate.isEmpty(modalData._id)) {
                $scope.logistic = modalData;
                $scope.isEdit = true;
            }
            $scope.reset = function () {
                $scope.logistic = {};
            }

            $scope.cancel = function () {
                $uibModalInstance.close($scope.isAdded);
            }

            $scope.submitForm = function () {

                if ($scope.isEdit) {
                    var data = angular.copy($scope.logistic);
                    delete data._id;
                    delete data.$checked;

                    $request.post('api/?model=logistic&action=edit_logistic&id=' + $scope.logistic._id.$id,
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

                    $request.post('api/?model=logistic&action=edit_logistic',
                        $scope.logistic,
                        function (response) {
                               $ui.confirm('添加成功，是否继续添加?', '确认',
                                    function () {
                                        $scope.reset()
                                        $scope.isAdded = true;
                                    },
                                    function () {
                                        $uibModalInstance.close(true);
                                    })
                        }, function (err) {
                            $ui.error('添加失败，' + err, '错误');
                        });
                }
            }

            $scope.uploadLogoImage = function () {
                var oData = new FormData(document.forms.namedItem("logo_file"));
                $.ajax({
                    url: 'http://www.93myb.com/admin/api/?model=logistic&action=upload_logistic_logo_file',
                    type: 'POST',
                    data: oData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (returndata) {
                        var data = eval('(' + returndata + ')');
                        if(data.success){
                            $scope.logistic.img = data.path;
                        }else{
                            $ui.error(data.error);
                        }
                    },
                    error: function (returndata) {
                        $ui.error(returndata);
                    }
                });
            }

        }])
})
