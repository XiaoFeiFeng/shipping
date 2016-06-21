'use strict'
define([], function () {
    angular.module('logisticAddTemplateModule', [])
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs, ngModel) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.on('change', function (event) {
                        scope.$apply(function () {
                            modelSetter(scope, element[0].files[0]);
                        });
                        //附件预览
                        scope.file = (event.srcElement || event.target).files[0];
                        scope.getFile();
                    });
                }
            };
        }])
        .factory('fileReader', ["$q", "$log", function ($q, $log) {
            var onLoad = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };
            var onError = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };
            var getReader = function (deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                return reader;
            };
            var readAsDataURL = function (file, scope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };
            return {
                readAsDataUrl: readAsDataURL
            };
        }])
        .controller("logisticAddTemplateCtrl", ['$scope', '$ui', '$request', 'fileReader', function ($scope, $ui, $request, fileReader) {
            $scope.submitFlag = true;

            $scope.flag = {};
            $request.get('http://www.cpowersoft.com:8888/join/logistic/logistics_channel', function (response) {
                $scope.flag.templateName = response.list;
            }, function () {

            })

            $scope.reset = function () {
                $scope.submitFlag = true;
                $scope.imageSrc = null;
            }

            $scope.$watch('tem', function (newValue) {
                if (newValue != undefined) {
                    if (newValue.template_name && newValue.template_path)
                        $scope.submitFlag = false;
                }
            }, true);

            $scope.getFile = function () {
                fileReader
                    .readAsDataUrl($scope.file, $scope)
                    .then(function (result) {
                        $scope.imageSrc = result;
                    });
            };

            $scope.submitForm = function () {
                $.ajax({
                    type: 'POST',
                    url: 'http://www.cpowersoft.com:8888/logist_tem/logistic/logistics_template',
                    data: {
                        "template_name": $scope.tem.template_name._id,
                        "template_path": $scope.tem.template_path,
                        "template_base": $scope.imageSrc,
                        "type": $scope.file.type,
                        "size": $scope.file.size
                    },
                    dataType: 'html',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    enctype: "multipart/form-data",
                    success: function (data) {
                        if (data == 'OK') {
                            $alert({
                                title: '信息',
                                content: '&emsp;添加成功',
                                type: 'success',
                                duration: '2',
                                animation: 'am-fade-and-slide-top'
                            });
                            $scope.flag = {};
                            $scope.imageSrc = '';
                        }
                    }
                })
            }
        }])
})