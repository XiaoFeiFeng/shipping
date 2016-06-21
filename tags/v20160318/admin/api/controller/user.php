<?php

/**
 * User: 冯晓飞
 * Date: 2016/1/15
 * Time: 13:54
 */
class user extends Controller
{

    private $user;

    function __construct()
    {
        parent::__construct();
        $this->user = new userModel();
    }
//region admin user
    //查找所有用户
    function get_user()
    {
        $where = array('used' => true, "_id" => new MongoId($_GET["id"]));
        $result = $this->user->findOne('users', $where);
        echo $this->json->encode($result);
    }

    //根据qqid去查询用户
    function get_user_name()
    {

        $result = $this->user->findOne('users', array('qqid' => $_GET['qqid']));
        echo $this->json->encode($result);
    }

    //根据aliId去查询用户
    function get_user_ali()
    {

        $result = $this->user->findOne('users', array('aliId' => $_GET['aliId']));
        echo $this->json->encode($result);
    }

    //微信登陆，根据random去查询weixin表的用户
    function get_weixin()
    {
        $result = $this->user->findOne('weixin', array('random' => $_GET['random']));
        echo $this->json->encode($result);
    }

    //微信登陆，根据wechatid去查询users表的用户
    function get_users_weixin()
    {
        $result = $this->user->findOne('users', array('wechatid' => $_GET['wechatid']));
        echo $this->json->encode($result);
    }

    //查找所有用户
    function get_users()
    {
        $where = array('used' => true);
        $sort = array('sort' => -1);
        $result = $this->user->find('users', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    //添加用户
    function add_user()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    //编辑用户
    function edit_user()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    //删除用户
    function remove_user()
    {
        $result = $this->user->removeById('users');
        echo $this->json->encode($result);
    }

    //根据random去删除weixin表下的记录
    function remove_weixin()
    {
        $where = array("random" => $_GET['random']);
        $result = $this->user->remove('weixin', $where);
        echo $this->json->encode($result);
    }

    //批量删除用户
    function remove_users()
    {
        $ids = array();
        foreach (postData() as $v) {
            $ids[] = new MongoId($v);
        }
        $where = array("_id" => array('$in' => $ids));
        $result = $this->user->remove('users', $where);
        echo $this->json->encode($result);
    }

    //修改角色信息
    function push_role()
    {
        $where = array('_id' => new MongoId($_GET["id"]));
        $data = postData();
        $result = $this->user->push("users", $where, $data);
        echo $this->json->encode($result);
    }
//endregion


//region web user
    //用户注册
    function register()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    //验证用户名是否存在
    function checkAccount()
    {
        $name = $_GET["name"];
        $where = array('name' => $name);
        $result = $this->user->find("users", $where);
        echo $this->json->encode($result);
    }

    //修改密码
    function pass_change()
    {
        $params = postData();
        $name = $params["name"];
        $oldPass = $params["oldpass"];
        $newPass = $params["newpass"];

        $checkimg = $_SESSION["checkimg"];
        if (strtolower($params["checkimg"]) != strtolower($_SESSION["checkimg"])) {
            $this->outError("验证码错误.");
            exit;
        }

        if (is_null($name) || empty($name) || is_null($oldPass) || empty($oldPass) || is_null($newPass) || empty($newPass)) {
            $result = $this->user->paramsErr();
            echo $this->json->encode($result);
            exit;
        }

        $where = array('name' => $name, "password" => $oldPass);

        $result = $this->user->findOne("users", $where);

        if ($result["success"]) {
            if (is_array($result["data"])) {
                $newData = $result["data"];
                $newData["password"] = $newPass;
                $where = array('_id' => new MongoId($newData["_id"]));
                $result = $this->user->update('users', $newData, $where);
            } else {
                $result["success"] = false;
                $result["error"] = "原密码错误!";
            }
        }

        echo $this->json->encode($result);
    }

    //忘记密码，重置密码
    function pass_reset()
    {

        $params = postData();
        $name = $params["name"];
        $tel = $params["telephone"];

        if (is_null($name) || empty($name) || is_null($tel) || empty($tel)) {
            $result = $this->user->paramsErr();
            echo $this->json->encode($result);
            exit;
        }

        $where = array('name' => $name, "telephone" => $tel);

        $result = $this->user->findOne("users", $where);
        if ($result["success"] && is_array($result["data"])) {
            $newData = $result["data"];
            $password = $this->create_password();

            $newData["password"] = md5($password);
            $where = array('_id' => new MongoId($newData["_id"]));

            $result = $this->user->update('users', $newData, $where);

            if ($result["success"]) {
                $result["data"] = $password;
                //SendMsg
            }
        }

        echo $this->json->encode($result);
    }

    //生成随机密码
    function create_password($pw_length = 8)
    {
        $randpwd = '';
        for ($i = 0; $i < $pw_length; $i++) {
            $randpwd .= chr(mt_rand(33, 126));
        }
        return $randpwd;
    }

    //验证邮箱地址
    function email_check()
    {
        $data = postData();
        $checkimg = $_SESSION["checkimg"];

        if (strtolower($data["checkimg"]) != strtolower($_SESSION["checkimg"])) {
            $this->outError("验证码错误.");
            exit;
        }

        $key = $this->user->redis_get(CFG_REDIS_ENCRYPT);
        $email = $data["email"];

        $params = "id=" . $data['_id'] . "&email=" . $data['email'] . "&name=" . $data["name"] . "&time=" . time();
        $encrypt = encrypt($params, $key);
        $encrypt = urlencode($encrypt);
        $url = "http://127.0.0.1/shipping/user.html#/user/emailchecked?&p=" . $encrypt;

        $content = "<div>点击以下连接进行验证 <a href = '" . $url . "' > 验证邮箱地址</a> </div> ";
        $this->user->sendEmail($email, $content);
        $this->outSuccessData("");
    }

    function email_decrypt()
    {
        $params = postData();
        $key = $this->user->redis_get(CFG_REDIS_ENCRYPT);
        $decrypt = decrypt($params[p], $key);
        $this->outSuccessData($decrypt);
    }

    function email_check_submit()
    {
        $data = postData();
        $where = array("_id" => new MongoId($data["id"]));
        $user = array("email" => $data["email"], "emailchecked" => true);
        $result = $this->user->update("users", $user, $where);
        echo $this->json->encode($result);
    }

    function tel_check()
    {
        $data = postData();
        $where = array("_id" => new MongoId($data["id"]));
        $user = array("telephone" => $data["telephone"], "telchecked" => true);
        $result = $this->user->update("users", $user, $where);
        echo $this->json->encode($result);
    }

    function check_session()
    {
        $user = $_SESSION["user"];
        if (is_null($user)) {
            $this->outError("用户未登录");
        } else {
            $this->outSuccessData($user);
        }
    }

    function login()
    {

        $data = postData();
//        $checkimg = $_SESSION["checkimg"];
//
//        if (strtolower($data["checkimg"]) != strtolower($_SESSION["checkimg"])) {
//            $this->outError("验证码错误 . ");
//            exit;
//        }

        $user = $this->user->findOne("users", array("name" => $data['name'], 'password' => $data['password']));
        if (!$user["success"]) {
            $this->outData($user);
            exit;
        }
        if (is_null($user["data"])) {
            $this->outError("用户名或密码错误 . ");
            exit;
        }

        $user_id = $user['data']['_id']->{'$id'};

        $where = array('code' => array('$in' => $user['data']['roles']));


        $roles = $this->user->find('roles', $where, array());

        if (!$roles["success"]) {
            $this->outData($roles);
            exit;
        }
        if ($roles["count"] == 0) {
            $this->outError("用户权限异常");
            exit;
        }

        $permissions = array();
        foreach ($roles["data"] as $value) {
            $permissions = array_merge($value['permissions'], $permissions);
        }
        $permissions = array_unique($permissions);

        $this->user->redis_set(CFG_REDIS_PERMISSIONS_KEY . $user_id, json_encode($permissions));

        $tempUser = $user['data'];
        $tempUser["permissions"] = $permissions;

        $_SESSION['user'] = $tempUser;
        setCookie('LOGINTIME', time(), time() + 120 + 8 * 60 * 60, '/shipping');

        $this->outSuccessData($tempUser);
    }
//endregion

}