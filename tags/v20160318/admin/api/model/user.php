<?php

/**
 * User: 冯晓飞
 * Date: 2016/1/15
 * Time: 17:33
 */
class userModel extends Model
{
    /**
     * 构造函数
     */
    function __construct()
    {
        parent::__construct("admin");
    }


    function sendEmail($to, $content)
    {
        try {
            include('./lib/util/smtp.php');
            $smtpserver = "smtp.163.com";
            $smtpserverport = 25;
            $smtpusermail = "fxphotos@163.com";
            $smtpuser = "fxphotos@163.com";//SMTP服务器的用户帐号
            $smtppass = "flyyouknow123";//SMTP服务器的用户密码
            $mailsubject = "易联物流邮箱验证";
            $mailtype = "HTML";
            $smtpemailto = $to;

            $smtp = new smtp($smtpserver, $smtpserverport, true, $smtpuser, $smtppass);
            //是否显示发送的调试信息
            $smtp->debug = false;

            $state = $smtp->sendmail($smtpemailto, $smtpusermail, $mailsubject, $content, $mailtype);

            $result = array("success" => true, "data" => $state);


        } catch (Exception $e) {
            $result = array("success" => false, "error" => $e);
        }

        return $result;
    }
}