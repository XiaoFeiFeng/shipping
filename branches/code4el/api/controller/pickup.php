<?php

/**
 * User: fengxiaofei
 * Date: 2016/2/26
 * Time: 16:04
 */
class pickup extends Controller
{
    private $pickup;

    function __construct()
    {
        parent::__construct ();
        $this->pickup = new pickupModel();
    }

    function create()
    {
        $data = postData ();
        $result = $this->pickup->save ('pickups' , $data);
        echo $this->json->encode ($result);
    }

    function get_pickups()
    {
        $state = $_GET["state"];

        $where = array ("created_time" => array ('$exists' => true));
        if (isset($state)) {
            $where["state"] = (int)$state;
        }

        $condition = getPageLimit ();
        $condition["sort"] = array ("created_time" => -1);

        $result = $this->pickup->find ('pickups' , $where , getPageLimit ());
        echo $this->json->encode ($result);
    }


    /*
     * 编辑上门取件订单
     * 主要编辑追踪信息，并且默认加上追踪时间
     */
    function edit()
    {
        $data = postData ();

        if (isset($data["tracks"])) {
            $len = count ($data["tracks"]);
            $data["tracks"][$len - 1][time] = time ();
        }

        $result = $this->pickup->save ('pickups' , $data);
        echo $this->json->encode ($result);
    }

    /*
     * 获取商家需要处理的上门取件订单
     * @owner $_GET['owner'] 商家Id
     * */
    function get_byowner()
    {
        $owner = $_GET['owner'];

        if (!isset($owner)) {
            $this->outError ("参数错误");
        }

        $where = array ("owner" => $owner , "state" => 1);
        if ($_GET["tel"]) {
            $where["tel"] = $_GET["tel"];
        }

        $condition = getPageLimit ();
        $condition["sort"] = array ("created_time" => -1);

        $result = $this->pickup->find ("pickups" , $where , $condition);

        echo $this->json->encode ($result);
    }

    /*
  * 获取我的上门取件订单
  * @owner $_GET['userId'] 用户Id
  * */
    function get_byuser()
    {
        $userId = $_GET['userId'];

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

        if ($_GET["tel"]) {
            $where["tel"] = $_GET["tel"];
        }

        $condition = getPageLimit ();
        $condition["sort"] = array ("created_time" => -1);

        $result = $this->pickup->find ("pickups" , $where , $condition);

        echo $this->json->encode ($result);
    }

    //更新订单追踪信息
    function edit_track()
    {
        $data = postData ();
        $len = count ($data["tracks"]);
        $data["tracks"][$len - 1][time] = time ();
        $result = $this->pickup->save ('pickups' , $data);
        echo $this->json->encode ($result);
    }

    function edit_tracks()
    {
        $data = postData ();

        foreach ($data["pickups"] as $v) {

            $id = new MongoId($v["_id"]);

            $len = count ($v["tracks"]);
            $v["tracks"][$len - 1][time] = time ();

            $where = array ("_id" => $id);

            $result = $this->pickup->update ("pickups" , $v , $where);
        }

        echo $this->json->encode ($result);
    }

}