<?php
//参数设置
$oid = $_GET['oid'];
$coding = $_GET['coding'];
$post_data = array();
$post_data["customer"] = '6C7DB30563D660047634979BF7BBC0C4';     //实时快递查询接口的公司编号
$key= 'fHzTcuaq6391' ;                                            //实时快递查询接口的授权密匙
$post_data["param"] = '{"com":"'.$coding.'","num":"'.$oid.'"}';

$url='http://poll.kuaidi100.com/poll/query.do';
$post_data["sign"] = md5($post_data["param"].$key.$post_data["customer"]);
$post_data["sign"] = strtoupper($post_data["sign"]);
$o=""; 
foreach ($post_data as $k=>$v)
{
    $o.= "$k=".urlencode($v)."&";        //默认UTF-8编码格式
}
$post_data=substr($o,0,-1);
$ch = curl_init();
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    //curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//接收结果为字符串
    $result = curl_exec($ch);
    $data = str_replace("\&quot;",'"',$result );
    $data = json_decode($data,true);



?>