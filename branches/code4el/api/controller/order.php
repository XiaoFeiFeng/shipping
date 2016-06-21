<?php

/**
 * User: fengxiaofei
 * Date: 2016/1/29
 * Time: 13:54
 */
class order extends Controller
{
    private $order;

    function __construct()
    {
        parent::__construct ();
        $this->order = new orderModel();
    }
    //region 通用方法


    //创建订单
    function create()
    {
        $data = postData ();
        for ($i = 0; $i < count ($data["tracks"]); $i++) {
            if (!isset($data["tracks"][$i]["time"])) {
                $data["tracks"][$i][time] = time ();
            }
        }
        
        $result = $this->order->save ('orders' , $data);
        echo $this->json->encode ($result);
    }

    //更改订单
    function edit()
    {
        $data = postData ();
        $result = $this->order->save ('orders' , $data);
        echo $this->json->encode ($result);
    }

    //获取订单列表
    function get_orders()
    {
        $state = $_GET["state"];

        $where = array ("created_time" => array ('$exists' => true));
        if (isset($state)) {
            $where["state"] = (int)$state;
        }

        $condition = getPageLimit ();
        $condition["sort"] = array ("created_time" => -1);

        $result = $this->order->find ("orders" , $where , $condition);

        echo $this->json->encode ($result);
    }

    //生成订单号
    function create_code()
    {

        $code = $this->order->randomCode ();

        $where = array ("code" => $code);
        $result = $this->order->findOne ("orders" , $where);

        if (!$result["success"]) {
            $result["success"] = true;
            $result["data"] = $code;
            echo $this->json->encode ($result);
            exit;
        }

        $this->create_code ();
    }


    //更新订单追踪信息
    function edit_track()
    {
        $data = postData ();
        $len = count ($data["tracks"]);
        $data["tracks"][$len - 1][time] = time ();
        $result = $this->order->save ('orders' , $data);
        echo $this->json->encode ($result);
    }

    function edit_tracks()
    {
        $data = postData ();

        foreach ($data["orders"] as $v) {

            $id = new MongoId($v["_id"]);

            $len = count ($v["tracks"]);
            $v["tracks"][$len - 1][time] = time ();

            $where = array ("_id" => $id);

            $result = $this->order->update ("orders" , $v , $where);
        }

        echo $this->json->encode ($result);
    }


    //endregion

    // 查找用户订单列表
    function get_order_byuser()
    {
        $userId = $_GET['uid'];
        if (!isset($userId)) {
            $this->outError ("参数错误");
        }

              $where = array ("userId" => $userId);

        $interval = $_GET["interval"];
        if (isset($interval)) {
            $interval = (int)$interval;
            if ($interval > 0) {
                $str = "-" . $interval . " months";
                $starTime = strtotime ($str);
                $where["created_time"] = array ('$gt' => $starTime , '$lte' => time ());
            }
        }

        $state = $_GET["state"];
        if (isset($state)) {
            $where["state"] = (int)$state;
        }
        $condition = getPageLimit ();
        $condition["sort"] = array ("created_time" => -1);

        $result = $this->order->find ("orders" , $where , $condition);

        echo $this->json->encode ($result);
    }

    function get_byowner()
    {
        $owner = $_GET['owner'];

        if (!isset($owner)) {
            $this->outError ("参数错误");
        }

        $where = array ("owner" => $owner , "state" => 2);

        $condition = getPageLimit ();
        $condition["sort"] = array ("created_time" => -1);

        $result = $this->order->find ("orders" , $where , $condition);

        echo $this->json->encode ($result);
    }

    //根据订单号查找订单

    function get_bycode()
    {
        $where = array ("userId" => $_GET['uid'] , '$or' => array (array ("code" => $_GET["code"]) , array ("telephone" => $_GET["code"])));
        $result = $this->order->findOne ("orders" , $where);
        echo $this->json->encode ($result);
    }

    //通过订单号或者手机号码查询
    function get_bykeyword()
    {
        $where = array ('$or' => array (array ("code" => $_GET["code"]) , array ("telephone" => $_GET["code"])));
        $result = $this->order->find ("orders" , $where);
        echo $this->json->encode ($result);
    }

    //通过ID查找
    function get_byid()
    {
        $where = array ("_id" => new MongoId($_GET["id"]));
        $result = $this->order->findOne ("orders" , $where);
        echo $this->json->encode ($result);
    }

    function order_cancel()
    {
        $data = array ("state" => -1);
        $result = $this->order->save ("orders" , $data);
        echo $this->json->encode ($result);
    }

    //查询订单追踪信息
    function track_order()
    {
        $orderId = str_replace ('，' , ',' , $_GET['oId']);
        $orderId = explode (',' , $orderId);
        $result = $this->order->find ('orders' , array ('code' => array ('$in' => $orderId)));
        echo $this->json->encode ($result);
    }

    /*
     * 获取不同状态下的订单个数
     * */
    function get_statecount_byuser()
    {
        $userId = $_GET['uid'];
        if (!isset($userId)) {
            $this->outError ("参数错误");
        }

        $where = array ("userId" => $userId);
        $interval = $_GET["interval"];
        if (isset($interval)) {
            $interval = (int)$interval;
            if ($interval > 0) {
                $str = "-" . $interval . " months";
                $starTime = strtotime ($str);
                $where["created_time"] = array ('$gt' => $starTime , '$lte' => time ());
            }
        }

        $data = array ();

        for ($i = -1; $i <= 3; $i++) {
            $where["state"] = $i;

            $result = $this->order->count ("orders" , $where);
            if ($result["success"]) {
                $data[$i . ""] = $result["count"];
            }
        }
        $result = array ("success" => true , "data" => $data);


        echo $this->json->encode ($result);
    }
    function check_the_waybill(){
        $where = array('code' => $_GET['code']);
        $result = $this->order->findOne ("orders" , $where);
        echo $this->json->encode ($result);
    }
    //weichat支付的监控
    function  weichat_monitoring(){
        $where = array('code' => $_GET['oid'],'state'=>1);
        $data = $this->order->findOne ("orders" , $where);
        echo $this->json->encode ($data);
       
    }
    //快递100
    function intelligent_inquiry(){
        $oid = $_GET['oid'];
        $ch = curl_init ();
        curl_setopt ($ch , CURLOPT_POST , 1);
        curl_setopt ($ch , CURLOPT_HEADER , 0);
        curl_setopt ($ch , CURLOPT_URL , 'http://www.kuaidi100.com/autonumber/auto?num='.$oid.'&key=fHzTcuaq6391');
        curl_setopt ($ch , CURLOPT_RETURNTRANSFER , 1);

        $result = curl_exec ($ch);
        print_r($result);
        

    }

}
