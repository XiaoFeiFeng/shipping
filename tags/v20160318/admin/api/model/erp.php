<?php
/**
 * Created by 吴小勇.
 * User: Administrator
 * Date: 2016/2/18
 * Time: 16:44
 */
class erpModel extends Model{
    /**
     * 构造函数
     */
    function __construct()
    {
        parent::__construct("myb"); //定义数据库
    }
}