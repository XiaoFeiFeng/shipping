<?php
/**
 * Created by 吴小勇.
 * User: Administrator
 * Date: 2016/2/18
 * Time: 16:44
 */
class erp extends Controller{
    function __construct()
    {
        parent::__construct();
        $this->model = new erpModel();
    }

    //获取用户信息
    function users(){
        $this->model->find('users');
    }

    //
    function help_category_list(){
        $where = array();
        $result = $this->model->find('help_category', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    function edit_help_category(){
        $data = postData();
        $result = $this->model->save('help_category', $data);
        echo $this->json->encode($result);
    }

    function del_help_category(){
        $result = $this->model->removeById('help_category');
        echo $this->json->encode($result);
    }



    function help_article_list(){

        if (isset($_GET["id"]) && $_GET["id"] !== 'undefined') {
            $where['category_id'] = $_GET['id'];
        }
        $result = $this->model->find('help_articles', $where, getPageLimit());
        echo $this->json->encode($result);


    }


    function edit_help_article(){
        $data = postData();
        if (isset($_GET['category_id']) && !isset($data['title'])) exit; //两次请求会添加两条的bug
        $result = $this->model->save('help_articles', $data);
        echo $this->json->encode($result);
    }

    function del_article(){
        $result = $this->model->removeById('help_articles');
        echo $this->json->encode($result);
    }

    //根据id查出记录
    function get_article(){
        $result = $this->model->findOne('help_articles',array('_id' => new MongoId($_GET['id'])));
        echo $this->json->encode($result);
    }


    function users_lists(){
        $where = array();
        $condition = getPageLimit();
        $condition['sort'] = array('_id'=>-1);
        $result = $this->model->find('users', $where, $condition);
        foreach($result['data'] as $key => $item){


            $infoData = $this->model->db->findOne('user_infos',array('user_ObjectId'=>new MongoId($item['_id']->{'$id'})));


            $result['data'][$key]['tel'] = $infoData['tel'];

        }
        echo $this->json->encode($result);
    }


    function erp_container_lists(){
        $where = array();
        $condition = getPageLimit();
        $condition['sort'] = array('_id'=>-1);
        $result = $this->model->find('erp_container', $where, $condition);
        foreach($result['data'] as $key => $item){
            $userData = $this->model->db->findOne('users',array('_id'=>new MongoId($item['user_ObjectId']->{'$id'})));
            $result['data'][$key]['name'] = $userData['name'];
            $result['data'][$key]['username'] = $userData['username'];
            $result['data'][$key]['login_type'] = $userData['login_type'];
            $result['data'][$key]['email'] = $userData['email'];
        }
        echo $this->json->encode($result);
    }

    function del_container(){

        echo $_GET['id'];
        //删除容器的步骤

        $result = $this->logistic->removeById('logistics_channels');
        echo $this->json->encode($result);

    }

    //用户消费记录
    function user_qb(){
        $where = array('user_id'=>$_GET['uid']);
        $result = $this->model->find('erp_renew_orders', $where, getPageLimit());
        echo $this->json->encode($result);
    }

}