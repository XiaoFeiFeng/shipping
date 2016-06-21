<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/15
 * Time: 13:54
 */
class channel extends Controller
{

    private $channel;

    function __construct()
    {
        parent::__construct ();
        $this->channel = new channelModel();
    }

    //获取互联易所有渠道列表
    function getTransportWayList()
    {

        include ('./lib/util/Logistic.class.php');
        $logistic = new Logistic();
        $result = $logistic->getTransportWayList ();
        $json = new Services_JSON();
        echo $json->encode ($result);

    }


    //查询物流运费
    function getFee()
    {

        include ('./lib/util/Logistic.class.php');
        $post = postData ();

        $channels = array ();

        if (is_array ($post["channels"]) && count ($post["channels"])) $channels = $post["channels"];

        if (isset($_GET["channels"]) && !empty($_GET["channels"])) $channels = explode (',' , $_GET["channels"]);

        $logistic = new Logistic();
        $result = $logistic->calculateCharge ($_GET["country"] , $_GET["weight"] , $channels);

        if ($result->success) {
            if (!is_array ($result->transportFee)) {
                $result->transportFee = array ($result->transportFee);
            }
        } else {
            $result = array ("success" => false , "error_msg" => $result->error->errorInfo);
        }

        $json = new Services_JSON();
        echo $json->encode ($result);

    }


    //logistic_category列表
    function logistic_category()
    {
        $where = array ();
        $result = $this->channel->find ('logistics_category' , $where , getPageLimit ());
        echo $this->json->encode ($result);
    }

    //logistics_channels列表
    function logistics_channels()
    {
        $where = array ("category" => $_GET["category"] , 'used' => true);
        $result = $this->channel->find ('logistics_channels' , $where , getPageLimit ());
        echo $this->json->encode ($result);
    }



    /*****************************
     * 互联易运输方式 **********
     **************************/

    //新增logistic_category
    function add_logistic_category()
    {
        $data = postData ();
        $result = $this->channel->save ('logistics_category' , $data);
        echo $this->json->encode ($result);
    }

    //删除logistic_category
    function remove_logistic_category()
    {
        $result = $this->channel->removeById ('logistics_category');
        echo $this->json->encode ($result);
    }

    //更新logistic_category
    function edit_logistic_category()
    {
        $data = postData ();
        $result = $this->channel->save ('logistics_category' , $data);
        echo $this->json->encode ($result);
    }

    /*****************************
     * 互联易渠道管理 **********
     **************************/

    //新增logistics_channels
    function add_logistics_channels()
    {
        $data = postData ();
        $result = $this->channel->save ('logistics_channels' , $data);
        echo $this->json->encode ($result);
    }

    //删除logistics_channels
    function remove_logistics_channels()
    {
        $result = $this->channel->removeById ('logistics_channels');
        echo $this->json->encode ($result);
    }

    //更新logistics_channels
    function edit_logistics_channels()
    {

        $data = postData ();
        $result = $this->channel->save ('logistics_channels' , $data);
        echo $this->json->encode ($result);
    }


}