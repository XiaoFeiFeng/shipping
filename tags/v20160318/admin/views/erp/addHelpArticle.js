'use strict'
define([], function () {
    angular.module('erpaddHelpArticleModule', [])
        .controller("addHelpArticleCtrl", ['$scope', '$ui', '$validate', '$request', '$http','$location',
            function ($scope, $ui, $validate, $request, $http,$location) {


            $scope.operator = $location.search().operator;




            if($scope.operator == 'add'){

                $scope.category_id = $location.search().category_id;

                $scope.name = $location.search().name;

            }else{
                $scope.id = $location.search().id;
                $request.get('api/?model=erp&action=get_article&id='+$scope.id,function(response){
                    if(response.success){
                        $scope.article = response.data;
                    }else{
                        $ui.error(response.error);
                    }
                });
            }





            $scope.return = function(){
                $location.url('/erp/helpArticle');
            }

            $scope.submitForm = function () {
                if ($scope.operator == 'edit') {
                    var data = angular.copy($scope.article);
                    delete data._id;
                    delete data.$checked;
                    delete data.__v;
                    console.log(data);
                    $request.post('api/?model=erp&action=edit_help_article&id='+ $scope.id,
                        data,
                        function (response) {
                            if(response.success){
                                $ui.notify('保存成功！', '提示',
                                function () {
                                    $uibModalInstance.close(true);
                                })
                            }else{
                                $ui.error('修改失败，' + response.error);
                            }

                        }, function (err) {
                            $ui.error('修改失败，' + err, '错误');
                        });
                } else {
                    var data = angular.copy($scope.article);
                    data.category_id = $scope.category_id;
                    $request.post('api/?model=erp&action=edit_help_article',
                        data,
                        function (response){
                            if(response.success){
                                $ui.confirm('添加成功，是否继续添加?', '确认',
                                function () {
                                    $scope.article = {};
                                })
                            }else{
                                $ui.error('修改失败，' + response.error);
                            }

                        }, function (err){
                            $ui.error('添加失败，' + err, '错误');
                        });
                }
            }

        }])


})