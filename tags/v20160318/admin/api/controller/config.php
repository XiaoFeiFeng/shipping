<?php

/**
 * User: fengxiaofei
 * Date: 2016/1/25
 * Time: 13:54
 */
class config extends Controller
{
    private $config;

    function __construct()
    {
        parent::__construct();
        $this->config = new configModel();
    }

    function get_data()
    {
        $data = postData();
        $result = array("p" => $data["str"], "md5" => md5($data["str"]));
        echo $this->json->encode($result);
    }
    //region config
    //查看配置
    function get_config()
    {
        $key = $_REQUEST['key'];
        $where = array('key' => $key);

        $result = $this->config->findOne("sys_config", $where);
        echo $this->json->encode($result);
    }

    function get_telcode()
    {
        $code = rand(100000, 999999);
        // sendMSG();
        $result = array();
        $result['data'] = $code;//md5($code);
        $result['success'] = true;
        echo $this->json->encode($result);
    }

//endregion
}