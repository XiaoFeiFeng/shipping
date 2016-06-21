<?php

/**
 * Created by PhpStorm.
 * User: WuRiWen
 * Date: 2016/3/21
 * Time: 21:18
 */
class news extends Controller
{
    private $news;

    function __construct()
    {
        parent::__construct();
        $this->news = new newsModel();
    }


    //查找所有新闻
    function get_all_news()
    {
        $where = array('type' => $_GET['type']);
        $result = $this->news->find('news', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    //根据id查新闻
    function get_one_news()
    {
        $where = array("_id" => new MongoId($_GET["id"]));
        $result = $this->news->findOne('news', $where);
        echo $this->json->encode($result);
    }

    function query_one_news()
    {
        $where = array($_GET['key'] => $_GET['value']);
        $result = $this->news->findOne('news', $where);
        echo $this->json->encode($result);
    }
    //编辑新闻
    function edit_one_news()
    {
        $data = postData();
        $data["created_time"] = time();
        $result = $this->news->save('news', $data);
        echo $this->json->encode($result);
    }

    //删除新闻
    function remove_one_news()
    {
        $result = $this->news->removeById('news');
        echo $this->json->encode($result);
    }

    function add_classify()
    {
        $data = postData();
        $result = $this->news->save('classify', $data);
        echo $this->json->encode($result);
    }

    function get_classify()
    {
        $where = array('type' => $_GET['type']);
        $result = $this->news->find('classify', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    function remove_one_classify()
    {
        $result = $this->news->removeById('classify');
        echo $this->json->encode($result);
    }

    function get_one_classify()
    {
        $where = array("_id" => new MongoId($_GET["id"]));
        $result = $this->news->findOne('classify', $where);
        echo $this->json->encode($result);
    }

    //自定义的条件查询
    function custom_query()
    {
        $where = array($_GET['key'] => $_GET['value']);
        $result = $this->news->find('classify', $where);
        echo $this->json->encode($result);
    }
    function custom_query_one()
    {
        $where = array($_GET['key'] => $_GET['value']);
        $result = $this->news->findOne('classify', $where);
        echo $this->json->encode($result);
    }

    //删除产品以及对应的详情记录
    function del_product(){
        $result1 = $this->news->removeById('classify');
        $where = array ("pid" => $_GET['id']);
        $result2 = $this->news->remove ('classify', $where);
        echo $this->json->encode($result2);
    }


}