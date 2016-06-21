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
        parent::__construct ();
        $this->config = new configModel();
    }

    function get_data()
    {
        $data = postData ();
        $result = array ("p" => $data["str"] , "md5" => md5 ($data["str"]));
        echo $this->json->encode ($result);
    }
    //region config
    //查看配置
    function get_config()
    {
        $key = $_REQUEST['key'];
        $where = array ('key' => $key);

        $result = $this->config->findOne ("sys_config" , $where);
        echo $this->json->encode ($result);
    }

    function get_telcode()
    {
        $tel = $_GET["tel"];
        if (!isset($tel) || empty($tel)) {

            $this->outError ("手机号码为空！");
            exit;
        }

        $code = rand (100000 , 999999);

        $content = "【93贸易宝】验证码" . $code . "，5分钟内有效，打死都不能告诉别人哦！";

        $this->config->sendMsg ($tel , $content);

        $_SESSION['telCode'] = $code;
        log_debug ($code);
        $result = array ("success" => true , "data" => md5 ($code));

        $this->outData ($result);
    }


    //endregion
}