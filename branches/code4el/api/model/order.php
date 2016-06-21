<?php

/**
 * User: fengxiaofei
 * Date: 2016/1/29
 * Time: 10:15
 */
class orderModel extends Model
{
    /**
     * 构造函数
     */
    function __construct()
    {
        parent::__construct("shipping");
    }

    function randomCode()
    {
        $number = "hls";
        for ($i = 0; $i < 12; $i++) {
            $number .= rand(0, 9);
        }
        return $number;
    }

}