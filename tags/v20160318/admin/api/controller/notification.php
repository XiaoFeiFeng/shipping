<?php

/**
 * User: fengxiaofei
 * Date: 2016/3/10
 * Time: 19:54
 */
class notification extends Controller
{
    private $notification;

    function __construct()
    {
        parent::__construct();
        $this->notification = new notificationModel();
    }

    function create()
    {
        $data = postData();

        //?  给数组对象增加一个属性，再添加到mongoDB中会增加两条数据
        //$data["state"] = 0;

        $data = array_merge($data, array("state" => 0));
        $result = $this->notification->save('notifications', $data);
        echo $this->json->encode($result);
    }


    function edit()
    {
        $data = postData();
        $result = $this->notification->save('notifications', $data);
        echo $this->json->encode($result);
    }

    function get_byid()
    {
        $where = array("_id" => new MongoId($_GET["id"]));
        $result = $this->notification->findOne('notifications', $where);
        echo $this->json->encode($result);
    }

    //查询所有菜单
    function get_byuser()
    {
        $where = array("uid" => $_GET["uid"], "state" => 0);
        $result = $this->notification->find('notifications', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    //获取未读消息总数
    function get_count_byuser()
    {
        $where = array("uid" => $_GET["uid"], "state" => 0);
        $result = $this->notification->count('notifications', $where);
        echo $this->json->encode($result);
    }

    function set_readed()
    {
        $data = postData();
        $where = array("uid" => $_GET["uid"], "state" => 0);
        $ids = array();
        foreach ($data as $id) {
            $ids[] = new Mongoid($id);
        }

        $where["_id"] = array('$in' => $ids);
        $newData = array("state" => 1);

        $result = $this->notification->update('notifications', $newData, $where);
        echo $this->json->encode($result);
    }

}