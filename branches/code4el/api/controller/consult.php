<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/4/29
 * Time: 17:05
 */

class consult extends Controller{
    private $consult;

    function __construct()
    {
        parent::__construct();
        $this->consult  = new consultModel();
    }
    //查询
    function custom_query()
    {
        $where = array($_GET['key'] => $_GET['value']);
        $result = $this->consult->find('consult', $where);
        echo $this->json->encode($result);
    }
    //添加or修改
    function edit_consult()
    {
        $data = postData();
        $result = $this->consult->save('consult', $data);
        echo $this->json->encode($result);
    }
    //删除
    function remove_consult()
    {
        $result = $this->consult->removeById('consult');
        echo $this->json->encode($result);
    }
}