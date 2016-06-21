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

    

    //根据type查文章
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


    function edit_one_news()
    {
        $data = postData();
        $result = $this->news->save('news', $data);
        echo $this->json->encode($result);
    }

    //删除新闻
    function remove_one_news()
    {
        $result = $this->news->removeById('news');
        echo $this->json->encode($result);
    }

}