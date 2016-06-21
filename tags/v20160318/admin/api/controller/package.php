<?php

/**
 * User: fengxiaofei
 * Date: 2016/2/26
 * Time: 16:04
 */
class package extends Controller
{
    private $package;

    function __construct()
    {
        parent::__construct();
        $this->package = new packageModel();
    }

    function create()
    {
        $data = postData();
        $result = $this->package->save('packages', $data);
        echo $this->json->encode($result);
    }

    function get_packages()
    {
        $state = $_GET["state"];

        $where = array("created_time" => array('$exists' => true));
        if (isset($state)) {
            $where["state"] = (int)$state;
        }

        $condition = getPageLimit();
        $condition["sort"] = array("created_time" => -1);

        $result = $this->package->find('packages', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    function edit()
    {
        $data = postData();

        if (isset($data["tracks"]) && count($data["tracks"]) > 0) {
            for ($i = 0; $i < count($data["tracks"]); $i++) {
                if (!isset($data["tracks"][$i]["time"])) {
                    $data["tracks"][$i][time] = time();
                }
            }
        }

        $result = $this->package->save('packages', $data);
        echo $this->json->encode($result);
    }

}