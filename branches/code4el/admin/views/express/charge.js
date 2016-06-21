/**
 * Created by admin on 2016/4/15.
 */
"use strict";
define([""], function () {
    angular.module('expressChargeModule', [])
        .controller('expressChargeCtrl', ['$scope', '$request', '$ui', function ($scope, $request, $ui) {
            //快递100api所支持的快递公司以及对应的公司代号
            $scope.code = [
                {companyName:'公司名称',coding:'公司编码'},
                {companyName:'邮政包裹/平邮',coding:'youzhengguonei'},
                {companyName:'国际包裹',coding:'youzhengguoji'},
                {companyName:'EMS',coding:'EMS'},
                {companyName:'EMS-国际件',coding:'emsguoji'},
                {companyName:'EMS-国际件-英文结果',coding:'emsinten'},
                {companyName:'北京EMS',coding:'bjemstckj'},
                {scompanyName:'顺丰',coding:'shunfeng'},
                {companyName:'申通',coding:'shentong'},
                {companyName:'圆通',coding:'yuantong'},
                {companyName:'中通',coding:'zhongtong'},
                {companyName:'汇通',coding:'huitongkuaidi'},
                {companyName:'韵达',coding:'yunda'},
                {companyName:'宅急送',coding:'zhaijisong'},
                {companyName:'天天',coding:'tiantian'},
                {companyName:'德邦',coding:'debangwuliu'},
                {companyName:'国通',coding:'guotongkuaidi'},
                {companyName:'增益',coding:'zengyisudi'},
                {companyName:'速尔',coding:'suer'},
                {companyName:'中铁物流',coding:'ztky'},
                {companyName:'中铁快运',coding:'zhongtiewuliu'},
                {companyName:'能达',coding:'ganzhongnengda'},
                {companyName:'优速',coding:'youshuwuliu'},
                {companyName:'全峰',coding:'quanfengkuaidi'},
                {companyName:'京东',coding:'jd'},
                {companyName:'FedEx-国际',coding:'fedex'},
                {companyName:'FedEx-美国',coding:'fedexus'},
                {companyName:'DHL全球件',coding:'dhlen'},
                {companyName:'DHL',coding:'dhl'},
                {companyName:'DHL-德国',coding:'dhlde'},
                {companyName:'TNT全球件',coding:'tnten'},
                {companyName:'TNT',coding:'tnt'},
                {companyName:'UPS全球件',coding:'upsen'},
                {companyName:'UPS',coding:'ups'},
                {companyName:'USPS',coding:'usps'},
                {companyName:'DPD',coding:'dpd'},
                {companyName:'DPD Germany',coding:'dpdgermany'},
                {companyName:'dpdgermany',coding:'dpdpoland'},
                {companyName:'DPD UK',coding:'dpduk'},
                {companyName:'GLS',coding:'gls'},
                {companyName:'Toll',coding:'Toll'},
                {companyName:'Toll Priority(Toll Online)',coding:'tollpriority'},
                {companyName:'Aramex',coding:'aramex'},
                {companyName:'DPEX',coding:'dpex'},
                {companyName:'宅急便',coding:'zhaijibian'},
                {companyName:'黑猫雅玛多',coding:'yamato'},
                {companyName:'香港邮政(HongKong Post)',coding:'hkpost'},
                {companyName:'英国大包、EMS（Parcel Force）',coding:'parcelforce'},
                {companyName:'英国小包（Royal Mail）',coding:'royalmail'},
                {companyName:'澳大利亚邮政-英文',coding:'auspost'},
                {companyName:'加拿大邮政-英文版',coding:'canpost'},
                {companyName:'一统飞鸿',coding:'yitongfeihong'},
                {companyName:'如风达',coding:'rufengda'},
                {companyName:'海红网送',coding:'haihongwangsong'},
                {companyName:'通和天下',coding:'tonghetianxia'},
                {companyName:'郑州建华',coding:'zhengzhoujianhua'},
                {companyName:'红马甲',coding:'sxhongmajia'},
                {companyName:'芝麻开门',coding:'zhimakaimen'},
                {companyName:'乐捷递',coding:'lejiedi'},
                {companyName:'立即送',coding:'lijisong'},
                {companyName:'银捷',coding:'yinjiesudi'},
                {companyName:'门对门',coding:'menduimen'},
                {companyName:'河北建华',coding:'hebeijianhua'},
                {companyName:'微特派',coding:'weitepai'},
                {companyName:'风行天下',coding:'fengxingtianxia'},
                {companyName:'尚橙',coding:'shangcheng'},
                {companyName:'新蛋奥硕',coding:'neweggozzo'},
                {companyName:'鑫飞鸿',coding:'xinhongyukuaidi'},
                {companyName:'全一',coding:'quanyikuaidi'},
                {companyName:'彪记',coding:'biaojikuaidi'},
                {companyName:'星晨急便',coding:'xingchengjibian'},
                {companyName:'亚风',coding:'yafengsudi'},
                {companyName:'源伟丰',coding:'yuanweifeng'},
                {companyName:'全日通',coding:'quanritongkuaidi'},
                {companyName:'安信达',coding:'anxindakuaixi'},
                {companyName:'民航',coding:'minghangkuaidi'},
                {companyName:'凤凰',coding:'fenghuangkuaidi'},
                {companyName:'京广',coding:'jinguangsudikuaijian'},
                {companyName:'配思货运',coding:'peisihuoyunkuaidi'},
                {companyName:'AAE-中国件',coding:'aae'},
                {companyName:'大田',coding:'datianwuliu'},
                {companyName:'新邦',coding:'xinbangwuliu'},
                {companyName:'龙邦',coding:'longbanwuliu'},
                {companyName:'一邦',coding:'yibangwuliu'},
                {companyName:'联昊通',coding:'lianhaowuliu'},
                {companyName:'广东邮政',coding:'guangdongyouzhengwuliu'},
                {companyName:'中邮',coding:'zhongyouwuliu'},
                {companyName:'天地华宇',coding:'tiandihuayu'},
                {companyName:'盛辉',coding:'shenghuiwuliu'},
                {companyName:'长宇',coding:'changyuwuliu'},
                {companyName:'飞康达',coding:'feikangda'},
                {companyName:'元智捷诚',coding:'yuanzhijiecheng'},
                {companyName:'万家',coding:'wanjiawuliu'},
                {companyName:'远成',coding:'yuanchengwuliu'},
                {companyName:'信丰',coding:'xinfengwuliu'},
                {companyName:'文捷航空',coding:'wenjiesudi'},
                {companyName:'全晨',coding:'quanchenkuaidi'},
                {companyName:'佳怡',coding:'jiayiwuliu'},
                {companyName:'快捷',coding:'kuaijiesudi'},
                {companyName:'D速',coding:'dsukuaidi'},
                {companyName:'全际通',coding:'quanjitong'},
                {companyName:'能达',coding:'ganzhongnengda'},
                {companyName:'青岛安捷',coding:'anjiekuaidi'},
                {companyName:'越丰',coding:'yuefengwuliu'},
                {companyName:'DPEX',coding:'dpex'},
                {companyName:'急先达',coding:'jixianda'},
                {companyName:'百福东方',coding:'baifudongfang'},
                {companyName:'BHT',coding:'bht'},
                {companyName:'伍圆',coding:'wuyuansudi'},
                {companyName:'蓝镖',coding:'lanbiaokuaidi'},
                {companyName:'COE',coding:'coe'},
                {companyName:'南京100',coding:'nanjing'},
                {companyName:'恒路',coding:'hengluwuliu'},
                {companyName:'金大',coding:'jindawuliu'},
                {companyName:'华夏龙',coding:'huaxialongwuliu'},
                {companyName:'运通中港',coding:'yuntongkuaidi'},
                {companyName:'佳吉',coding:'jiajiwuliu'},
                {companyName:'盛丰',coding:'shengfengwuliu'},
                {companyName:'源安达',coding:'yuananda'},
                {companyName:'加运美',coding:'jiayunmeiwuliu'},
                {companyName:'万象',coding:'wanxiangwuliu'},
                {companyName:'宏品',coding:'hongpinwuliu'},
                {companyName:'上大',coding:'shangda'},
                {companyName:'中铁',coding:'zhongtiewuliu'},
                {companyName:'原飞航',coding:'yuanfeihangwuliu'},
                {companyName:'海外环球',coding:'haiwaihuanqiu'},
                {companyName:'三态',coding:'santaisudi'},
                {companyName:'晋越',coding:'jinyuekuaidi'},
                {companyName:'联邦',coding:'lianbangkuaidi'},
                {companyName:'飞快达',coding:'feikuaida'},
                {companyName:'乐捷递',coding:'lejiedi'},
                {companyName:'忠信达',coding:'zhongxinda'},
                {companyName:'海红网送',coding:'haihongwangsong'},
                {companyName:'海红网送',coding:'haihongwangsong'},
                {companyName:'共速达',coding:'gongsuda'},
                {companyName:'嘉里大通',coding:'jialidatong'},
                {companyName:'OCS',coding:'ocs'},
                {companyName:'USPS',coding:'usps'},
                {companyName:'美国',coding:'meiguokuaidi'},
                {companyName:'成都立即送',coding:'lijisong'},
                {companyName:'银捷',coding:'yinjiesudi'},
                {companyName:'微特派',coding:'weitepai'},
                {companyName:'通和天下',coding:'tonghetianxia'},
                {companyName:'康力',coding:'kangliwuliu'},
                {companyName:'跨越',coding:'kuayue'},
                {companyName:'海盟',coding:'haimengsudi'},
                {companyName:'圣安',coding:'shenganwuliu'},
                {companyName:'中速',coding:'zhongsukuaidi'},
                {companyName:'OnTrac',coding:'ontrac'},
                {companyName:'七天连锁',coding:'sevendays'},
                {companyName:'明亮',coding:'mingliangwuliu'},
                {companyName:'华企',coding:'huaqikuaiyun'},
                {companyName:'城市100',coding:'city100'},
                {companyName:'穗佳',coding:'suijiawuliu'},
                {companyName:'飞豹',coding:'feibaokuaidi'},
                {companyName:'传喜',coding:'chuanxiwuliu'},
                {companyName:'捷特',coding:'jietekuaidi'},
                {companyName:'隆浪',coding:'longlangkuaidi'},
                {companyName:'EMS-英文',coding:'emsen'},
                {companyName:'中天万运',coding:'zhongtianwanyun'},
                {companyName:'邦送',coding:'bangsongwuliu'},
                {companyName:'澳大利亚(Australia Post)',coding:'auspost'},
                {companyName:'加拿大(Canada Post)',coding:'canpost'},
                {companyName:'加拿大邮政',coding:'canpostfr'},
                {companyName:'顺丰-美国件',coding:'shunfengen'},
                {companyName:'汇强',coding:'huiqiangkuaidi'},
                {companyName:'希优特',coding:'xiyoutekuaidi'},
                {companyName:'昊盛',coding:'haoshengwuliu'},
                {companyName:'尚橙',coding:'shangcheng'},
                {companyName:'亿领',coding:'yilingsuyun'},
                {companyName:'大洋',coding:'dayangwuliu'},
                {companyName:'递达',coding:'didasuyun'},
                {companyName:'易通达',coding:'yitongda'},
                {companyName:'邮必佳',coding:'youbijia'},
                {companyName:'亿顺航',coding:'yishunhang'},
                {companyName:'飞狐',coding:'feihukuaidi'},
                {companyName:'潇湘晨报',coding:'xiaoxiangchenbao'},
                {companyName:'巴伦支',coding:'balunzhi'},
                {companyName:'闽盛',coding:'minshengkuaidi'},
                {companyName:'佳惠尔',coding:'syjiahuier'},
                {companyName:'上海快通',coding:'shanghaikuaitong'},
                {companyName:'北青小红帽',coding:'xiaohongmao'},
                {companyName:'GSM',coding:'gsm'},
                {companyName:'安能',coding:'annengwuliu'},
                {companyName:'KCS',coding:'kcs'},
                {companyName:'City-Link',coding:'citylink'},
                {companyName:'店通',coding:'diantongkuaidi'},
                {companyName:'凡宇',coding:'fanyukuaidi'},
                {companyName:'平安达腾飞',coding:'pingandatengfei'},
                {companyName:'广东通路',coding:'guangdongtonglu'},
                {companyName:'中睿',coding:'zhongruisudi'},
                {companyName:'快达',coding:'kuaidawuliu'},
                {companyName:'佳吉',coding:'jiajikuaidi'},
                {companyName:'ADP国际',coding:'adp'},
                {companyName:'颿达国际',coding:'fardarww'},
                {companyName:'颿达国际-英文',coding:'fandaguoji'},
                {companyName:'林道国际',coding:'shlindao'},
                {companyName:'中外运-中文',coding:'sinoex'},
                {companyName:'中外运',coding:'zhongwaiyun'},
                {companyName:'深圳德创',coding:'dechuangwuliu'},
                {companyName:'林道国际-英文',coding:'ldxpres'},
                {companyName:'瑞典（Sweden Post）',coding:'ruidianyouzheng'},
                {companyName:'PostNord(Posten AB)',coding:'postenab'},
                {companyName:'偌亚奥国际',coding:'nuoyaao'},
                {companyName:'城际',coding:'chengjisudi'},
                {companyName:'祥龙运通',coding:'xianglongyuntong'},
                {companyName:'品速心达',coding:'pinsuxinda'},
                {companyName:'宇鑫',coding:'yuxinwuliu'},
                {companyName:'陪行',coding:'peixingwuliu'},
                {companyName:'户通',coding:'hutongwuliu'},
                {companyName:'西安城联',coding:'xianchengliansudi'},
                {companyName:'煜嘉',coding:'yujiawuliu'},
                {companyName:'一柒国际',coding:'yiqiguojiwuliu'},
                {companyName:'Fedex-国际件-中文',coding:'fedexcn'},
                {companyName:'联邦-英文',coding:'lianbangkuaidien'},
                {companyName:'中通（带电话）',coding:'zhongtongphone'},
                {companyName:'赛澳递for买卖宝',coding:'saiaodimmb'},
                {companyName:'上海无疆for买卖宝',coding:'上海无疆for买卖宝'},
                {companyName:'新加坡小包(Singapore Post)',coding:'singpost'},
                {companyName:'音素',coding:'yinsu'},
                {companyName:'南方传媒',coding:'ndwl'},
                {companyName:'速呈宅配',coding:'sucheng'},
                {companyName:'创一',coding:'chuangyi'},
                {companyName:'云南滇驿',coding:'dianyi'},
                {companyName:'重庆星程',coding:'cqxingcheng'},
                {companyName:'四川星程',coding:'scxingcheng'},
                {companyName:'贵州星程',coding:'gzxingcheng'},
                {companyName:'Gati-英文',coding:'gatien'},
                {companyName:'Gati-中文',coding:'gaticn'},
                {companyName:'jcex',coding:'jcex'},
                {companyName:'派尔',coding:'peex'},
                {companyName:'凯信达',coding:'kxda'},
                {companyName:'安达信',coding:'advancing'},
                {companyName:'汇文',coding:'huiwen'},
                {companyName:'亿翔',coding:'yxexpress'},
                {companyName:'东红',coding:'donghong'},
                {companyName:'飞远配送',coding:'feiyuanvipshop'},
                {companyName:'好运来',coding:'hlyex'},
                {companyName:'四川快优达',coding:'kuaiyouda'},
                {companyName:'日昱',coding:'riyuwuliu'},
                {companyName:'速通',coding:'sutongwuliu'},
                {companyName:'晟邦',coding:'nanjingshengbang'},
                {companyName:'爱尔兰(An Post)',coding:'anposten'},
                {companyName:'日本（Japan Post）',coding:'japanposten'},
                {companyName:'丹麦(Post Denmark)',coding:'postdanmarken'},
                {companyName:'巴西(Brazil Post/Correios)',coding:'brazilposten'},
                {companyName:'荷兰挂号信(PostNL international registered mail)',coding:'postnlcn'},
                {companyName:'荷兰挂号信(PostNL international registered mail)',coding:'postnl'},
                {companyName:'乌克兰EMS-中文(EMS Ukraine)',coding:'emsukrainecn'},
                {companyName:'乌克兰EMS(EMS Ukraine)',coding:'emsukraine'},
                {companyName:'乌克兰邮政包裹',coding:'ukrpostcn'},
                {companyName:'乌克兰小包、大包(UkrPost)',coding:'ukrpost'},
                {companyName:'海红for买卖宝',coding:'haihongmmb'},
                {companyName:'FedEx-英国件（FedEx UK)',coding:'fedexuk'},
                {companyName:'FedEx-英国件',coding:'fedexukcn'},
                {companyName:'叮咚',coding:'dingdong'},
                {companyName:'UPS Freight',coding:'upsfreight'},
                {companyName:'ABF',coding:'abf'},
                {companyName:'Purolator',coding:'purolator'},
                {companyName:'比利时（Bpost）',coding:'bpost'},
                {companyName:'比利时国际(Bpost international)',coding:'bpostinter'},
                {companyName:'LaserShip',coding:'lasership'},
                {companyName:'YODEL',coding:'yodel'},
                {companyName:'DHL-荷兰（DHL Netherlands）',coding:'dhlnetherlands'},
                {companyName:'MyHermes',coding:'myhermes'},
                {companyName:'DPD Germany',coding:'dpdgermany'},
                {companyName:'法国大包、EMS-法文（Chronopost France）',coding:'chronopostfra'},
                {companyName:'Selektvracht',coding:'selektvracht'},
                {companyName:'蓝弧',coding:'lanhukuaidi'},
                {companyName:'比利时(Belgium Post)',coding:'belgiumpost'},
                {companyName:'UPS Mail Innovations',coding:'upsmailinno'},
                {companyName:'挪威（Posten Norge）',coding:'postennorge'},
                {companyName:'瑞士邮政',coding:'swisspostcn'},
                {companyName:'瑞士(Swiss Post)',coding:'swisspost'},
                {companyName:'英国邮政小包',coding:'royalmailcn'},
                {companyName:'DHL Benelux',coding:'dhlbenelux'},
                {companyName:'DHL Benelux',coding:'novaposhta'},
                {companyName:'DHL-波兰（DHL Poland）',coding:'dhlpoland'},
                {companyName:'Estes',coding:'estes'},
                {companyName:'TNT UK',coding:'tntuk'},
                {companyName:'Deltec Courier',coding:'deltec'},
                {companyName:'OPEK',coding:'opek'},
                {companyName:'DPD Poland',coding:'dpdpoland'},
                {companyName:'Italy SDA',coding:'italysad'},
                {companyName:'MRW',coding:'mrw'},
                {companyName:'Chronopost Portugal',coding:'chronopostport'},
                {companyName:'西班牙(Correos de Espa?a)',coding:'correosdees'},
                {companyName:'Direct Link',coding:'directlink'},
                {companyName:'ELTA Hellenic Post',coding:'eltahell'},
                {companyName:'捷克（?eská po?ta）',coding:'ceskaposta'},
                {companyName:'Siodemka',coding:'siodemka'},
                {companyName:'International Seur',coding:'seur'},
                {companyName:'久易',coding:'jiuyicn'},
                {companyName:'克罗地亚（Hrvatska Posta）',coding:'hrvatska'},
                {companyName:'保加利亚（Bulgarian Posts）',coding:'bulgarian'},
                {companyName:'Portugal Seur',coding:'portugalseur'},
                {companyName:'EC-Firstclass',coding:'ecfirstclass'},
                {companyName:'DTDC India',coding:'dtdcindia'},
                {companyName:'Safexpress',coding:'safexpress'},
                {companyName:'韩国（Korea Post）',coding:'koreapost'},
                {companyName:'TNT Australia',coding:'tntau'},
                {companyName:'泰国（Thailand Thai Post）',coding:'thailand'},
                {companyName:'SkyNet Malaysia',coding:'skynetmalaysia'},
                {companyName:'马来西亚小包（Malaysia Post(Registered)）',coding:'malaysiapost'},
                {companyName:'马来西亚大包、EMS（Malaysia Post(parcel,EMS)）',coding:'malaysiaems'},
                {companyName:'沙特阿拉伯(Saudi Post)',coding:'saudipost'},
                {companyName:'南非（South African Post Office）',coding:'southafrican'},
                {companyName:'OCA Argentina',coding:'ocaargen'},
                {companyName:'尼日利亚(Nigerian Postal)',coding:'nigerianpost'},
                {companyName:'智利(Correos Chile)',coding:'chile'},
                {companyName:'以色列(Israel Post)',coding:'israelpost'},
                {companyName:'Estafeta',coding:'estafeta'},
                {companyName:'港快',coding:'gdkd'},
                {companyName:'墨西哥（Correos de Mexico）',coding:'mexico'},
                {companyName:'罗马尼亚（Posta Romanian）',coding:'romanian'},
                {companyName:'TNT Italy',coding:'tntitaly'},
                {companyName:'Mexico Multipack',coding:'multipack'},
                {companyName:'葡萄牙（Portugal CTT）',coding:'portugalctt'},
                {companyName:'Interlink Express',coding:'interlink'},
                {companyName:'DPD UK',coding:'dpduk'},
                {companyName:'华航',coding:'hzpl'},
                {companyName:'Gati-KWE',coding:'gatikwe'},
                {companyName:'Red Express',coding:'redexpress'},
                {companyName:'Mexico Senda Express',coding:'mexicodenda'},
                {companyName:'TCI XPS',coding:'tcixps'},
                {companyName:'高铁',coding:'hre'},
                {companyName:'新加坡EMS、大包(Singapore Speedpost)',coding:'speedpost'},
                {companyName:'EMS-国际件-英文',coding:'emsinten'},
                {companyName:'Asendia USA',coding:'asendiausa'},
                {companyName:'法国大包、EMS-英文(Chronopost France)',coding:'chronopostfren'},
                {companyName:'意大利(Poste Italiane)',coding:'italiane'},
                {companyName:'冠达',coding:'gda'},
                {companyName:'出口易',coding:'chukou1'},
                {companyName:'黄马甲',coding:'huangmajia'},
                {companyName:'新干线',coding:'anlexpress'},
                {companyName:'飞洋',coding:'shipgce'},
                {companyName:'贝海国际',coding:'xlobo'},
                {companyName:'阿联酋(Emirates Post)',coding:'emirates'},
                {companyName:'新顺丰（NSF）',coding:'nsf'},
                {companyName:'巴基斯坦(Pakistan Post)',coding:'pakistan'},
                {companyName:'世运',coding:'shiyunkuaidi'},
                {companyName:'合众(UCS）',coding:'ucs'},
                {companyName:'阿富汗(Afghan Post)',coding:'afghan'},
                {companyName:'白俄罗斯(Belpochta)',coding:'belpost'},
                {companyName:'全通',coding:'quantwl'},
                {companyName:'EFS Post',coding:'efs'},
                {companyName:'EFS Post',coding:'tntpostcn'},
                {companyName:'英脉',coding:'gml'},
                {companyName:'广通',coding:'gtongsudi'},
                {companyName:'东瀚',coding:'donghanwl'},
                {companyName:'rpx',coding:'rpx'},
                {companyName:'日日顺',coding:'rrs'},
                {companyName:'华通',coding:'htongexpress'},
                {companyName:'吉尔吉斯斯坦(Kyrgyz Post)',coding:'kyrgyzpost'},
                {companyName:'拉脱维亚(Latvijas Pasts)',coding:'latvia'},
                {companyName:'黎巴嫩(Liban Post)',coding:'libanpost'},
                {companyName:'立陶宛（Lietuvos pa?tas）',coding:'lithuania'},
                {companyName:'马尔代夫(Maldives Post)',coding:'maldives'},
                {companyName:'马耳他（Malta Post）',coding:'malta'},
                {companyName:'新西兰（New Zealand Post）',coding:'newzealand'},
                {companyName:'孟加拉国(EMS)',coding:'bangladesh'},
                {companyName:'塞尔维亚(PE Post of Serbia)',coding:'serbia'},
                {companyName:'塞浦路斯(Cyprus Post)',coding:'cypruspost'},
                {companyName:'突尼斯EMS(Rapid-Poste)',coding:'tunisia'},
                {companyName:'乌兹别克斯坦(Post of Uzbekistan)',coding:'uzbekistan'},
                {companyName:'新喀里多尼亚[法国](New Caledonia)',coding:'caledonia'},
                {companyName:'叙利亚(Syrian Post)',coding:'republic'},
                {companyName:'亚美尼亚(Haypost-Armenian Postal)',coding:'haypost'},
                {companyName:'也门(Yemen Post)',coding:'yemen'},
                {companyName:'印度(India Post)',coding:'india'},
                {companyName:'英国(大包,EMS)',coding:'england'},
                {companyName:'约旦(Jordan Post)',coding:'jordan'},
                {companyName:'越南小包(Vietnam Posts)',coding:'vietnam'},
                {companyName:'黑山(Po?ta Crne Gore)',coding:'montenegro'},
                {companyName:'哥斯达黎加(Correos de Costa Rica)',coding:'correos'},
                {companyName:'西安喜来',coding:'xilaikd'},
                {companyName:'格陵兰[丹麦]（TELE Greenland A/S）',coding:'greenland'},
                {companyName:'菲律宾（Philippine Postal）',coding:'phlpost'},
                {companyName:'厄瓜多尔(Correos del Ecuador)',coding:'ecuador'},
                {companyName:'冰岛(Iceland Post)',coding:'iceland'},
                {companyName:'波兰小包(Poczta Polska)',coding:'emonitoring'},
                {companyName:'阿尔巴尼亚(Posta shqipatre)',coding:'albania'},
                {companyName:'阿鲁巴[荷兰]（Post Aruba）',coding:'aruba'},
                {companyName:'埃及（Egypt Post）',coding:'egypt'},
                {companyName:'爱尔兰(An Post)',coding:'ireland'},
                {companyName:'爱沙尼亚(Eesti Post)',coding:'omniva'},
                {companyName:'云豹国际货运',coding:'leopard'},
                {companyName:'中外运空运',coding:'sinoairinex'},
                {companyName:'上海昊宏国际货物',coding:'hyk'},
                {companyName:'城晓国际',coding:'ckeex'},
                {companyName:'匈牙利（Magyar Posta）',coding:'hungary'},
                {companyName:'澳门(Macau Post)',coding:'macao'},
                {companyName:'台湾（中华邮政）',coding:'postserv'},
                {companyName:'快淘',coding:'kuaitao'},
                {companyName:'秘鲁(SERPOST)',coding:'peru'},
                {companyName:'印度尼西亚EMS(Pos Indonesia-EMS)',coding:'indonesia'},
                {companyName:'哈萨克斯坦(Kazpost)',coding:'kazpost'},
                {companyName:'立白宝凯',coding:'lbbk'},
                {companyName:'百千诚',coding:'bqcwl'},
                {companyName:'皇家',coding:'pfcexpress'},
                {companyName:'法国(La Poste)',coding:'csuivi'},
                {companyName:'奥地利(Austrian Post)',coding:'austria'},
                {companyName:'乌克兰小包、大包(UkrPoshta)',coding:'ukraine'},
                {companyName:'乌干达(Posta Uganda)',coding:'uganda'},
                {companyName:'阿塞拜疆EMS(EMS AzerExpressPost)',coding:'azerbaijan'},
                {companyName:'芬兰(Itella Posti Oy)',coding:'finland'},
                {companyName:'斯洛伐克(Slovenská Posta)',coding:'slovak'},
                {companyName:'埃塞俄比亚(Ethiopian postal)',coding:'ethiopia'},
                {companyName:'卢森堡(Luxembourg Post)',coding:'luxembourg'},
                {companyName:'毛里求斯(Mauritius Post)',coding:'mauritius'},
                {companyName:'文莱(Brunei Postal)',coding:'brunei'},
                {companyName:'Quantium',coding:'quantium'},
                {companyName:'坦桑尼亚(Tanzania Posts)',coding:'tanzania'},
                {companyName:'阿曼(Oman Post)',coding:'oman'},
                {companyName:'直布罗陀[英国]( Royal Gibraltar Post)',coding:'gibraltar'},
                {companyName:'博源恒通',coding:'byht'},
                {companyName:'安迅',coding:'anxl'},
                {companyName:'达方',coding:'dfpost'},
                {companyName:'兰州伙伴',coding:'huoban'},
                {companyName:'天纵',coding:'tianzong'},
                {companyName:'波黑(JP BH Posta)',coding:'bohei'},
                {companyName:'玻利维亚',coding:'bolivia'},
                {companyName:'柬埔寨(Cambodia Post)',coding:'cambodia'},
                {companyName:'巴林(Bahrain Post)',coding:'bahrain'},
                {companyName:'卢旺达(Rwanda i-posita)',coding:'rwanda'},
                {companyName:'莱索托(Lesotho Post)',coding:'lesotho'},
                {companyName:'肯尼亚(POSTA KENYA)',coding:'kenya'},
                {companyName:'喀麦隆(CAMPOST)',coding:'cameroon'},
                {companyName:'伯利兹(Belize Postal)',coding:'belize'},
                {companyName:'巴拉圭(Correo Paraguayo)',coding:'paraguay'},
                {companyName:'十方通',coding:'sfift'},
                {companyName:'飞鹰',coding:'hnfy'},
                {companyName:'UPS i-parcle',coding:'iparcel'},
                {companyName:'鑫锐达',coding:'bjxsrd'},
                {companyName:'麦力',coding:'mailikuaidi'},
                {companyName:'瑞丰',coding:'rfsd'},
                {companyName:'美联',coding:'letseml'},
                {companyName:'CNPEX中邮',coding:'cnpex'},
                {companyName:'鑫世锐达',coding:'xsrd'},
                {companyName:'同舟行',coding:'chinatzx'},
                {companyName:'秦邦',coding:'qbexpress'},
                {companyName:'大达',coding:'idada'},
                {companyName:'skynet',coding:'skynet'},
                {companyName:'红马',coding:'nedahm'},
                {companyName:'云南中诚',coding:'czwlyn'},
                {companyName:'万博',coding:'wanboex'},
                {companyName:'腾达',coding:'nntengda'},
                {companyName:'UBI Australia',coding:'gotoubi'},
                {companyName:'郑州速捷',coding:'sujievip'},
                {companyName:'ECMS Express',coding:'ecmsglobal'},
                {companyName:'速派(FastGo)',coding:'fastgo'},
                {companyName:'易客满',coding:'ecmscn'},
                {companyName:'俄顺达',coding:'eshunda'},
                {companyName:'广东速腾',coding:'suteng'},
                {companyName:'新鹏',coding:'gdxp'},
                {companyName:'美国韵达',coding:'yundaexus'},
                {companyName:'深圳DPEX',coding:'szdpex'},
                {companyName:'百世',coding:'baishiwuliu'},
                {companyName:'荷兰包裹(PostNL International Parcels)',coding:'postnlpacle'},
                {companyName:'乐天',coding:'ltexp'},
                {companyName:'智通',coding:'ztong'},
                {companyName:'鑫通宝',coding:'xtb'},
                {companyName:'airpak expresss',coding:'airpak'},
                {companyName:'荷兰邮政-中国件',coding:'postnlchina'},
                {companyName:'法国小包（colissimo）',coding:'colissimo'},
                {companyName:'PCA Express',coding:'pcaexpress'},
                {companyName:'韩润',coding:'hanrun'},
                {companyName:'中远e环球',coding:'cosco'},
                {companyName:'顺达',coding:'sundarexpress'},
                {companyName:'捷记方舟',coding:'ajexpress'},
                {companyName:'方舟',coding:'arkexpress'},
                {companyName:'明大',coding:'明大'},
                {companyName:'长江国际',coding:'changjiang'},
                {companyName:'八达通',coding:'bdatong'},
                {companyName:'美国申通',coding:'stoexpress'},
                {companyName:'泛捷国际',coding:'epanex'},
                {companyName:'顺捷丰达',coding:'shunjiefengda'},
                {companyName:'华赫',coding:'nmhuahe'},
                {companyName:'德国(Deutsche Post)',coding:'deutschepost'},
                {companyName:'百腾',coding:'baitengwuliu'},
                {companyName:'品骏',coding:'pjbest'},
                {companyName:'全速通',coding:'quansutong'},
                {companyName:'中技',coding:'zhongjiwuliu'},
                {companyName:'九曳供应链',coding:'jiuyescm'},
                {companyName:'天翼',coding:'tykd'},
                {companyName:'德意思',coding:'dabei'},
                {companyName:'城际',coding:'chengji'},
                {companyName:'程光',coding:'chengguangkuaidi'},
                {companyName:'佐川急便',coding:'sagawa'},
                {companyName:'蓝天',coding:'lantiankuaidi'},
                {companyName:'永昌',coding:'yongchangwuliu'},
                {companyName:'笨鸟海淘',coding:'birdex'},
                {companyName:'一正达',coding:'yizhengdasuyun'},
                {companyName:'京东订单',coding:'jdorder'},
                {companyName:'优配',coding:'sdyoupei'},
                {companyName:'TRAKPAK',coding:'trakpak'},
                {companyName:'GTS',coding:'gts'},
                {companyName:'AOL澳通',coding:'aolau'},
                {companyName:'宜送',coding:'yiex'},
                {companyName:'通达兴',coding:'tongdaxing'},
                {companyName:'香港(HongKong Post)英文',coding:'hkposten'},
                {companyName:'苏宁订单',coding:'suningorder'},
                {companyName:'飞力士',coding:'flysman'},
                {companyName:'转运四方',coding:'zhuanyunsifang'},
                {companyName:'logen路坚',coding:'ilogen'},
                {companyName:'成都东骏',coding:'dongjun'},
                {companyName:'日本郵便',coding:'japanpost'},
                {companyName:'佳家通货运',coding:'jiajiatong56'},
                {companyName:'吉日优派',coding:'jrypex'},
                {companyName:'西安胜峰',coding:'xaetc'},
                {companyName:'CJ',coding:'doortodoor'},
                {companyName:'信天捷',coding:'xintianjie'},
                {companyName:'泰国138国际',coding:'sd138'},
                {companyName:'猴急送',coding:'hjs'},
                {companyName:'全信通',coding:'quanxintong'},
                {companyName:'amazon-国际订单',coding:'amusorder'},
                {companyName:'骏丰国际',coding:'junfengguoji'},
                {companyName:'货运皇',coding:'kingfreight'},
                {companyName:'速必达',coding:'subida'},
                {companyName:'特急便',coding:'sucmj'},
                {companyName:'亚马逊中国',coding:'yamaxunwuliu'},
                {companyName:'锦程',coding:'jinchengwuliu'},
                {companyName:'景光',coding:'jgwl'},
                {companyName:'御风',coding:'yufeng'},
                {companyName:'至诚通达',coding:'zhichengtongda'},
                {companyName:'日益通',coding:'rytsd'},
                {companyName:'航宇',coding:'hangyu'},
                {companyName:'急顺通',coding:'pzhjst'},
                {companyName:'优速通达',coding:'yousutongda'},
                {companyName:'秦远',coding:'qinyuan'},
                {companyName:'澳邮中国',coding:'auexpress'},
                {companyName:'众辉达',coding:'zhdwl'},
                {companyName:'飞邦',coding:'fbkd'},
                {companyName:'华达',coding:'huada'},
                {companyName:'FOX GLOBAL EXPRESS',coding:'fox'},
                {companyName:'环球',coding:'huanqiu'},
                {companyName:'辉联',coding:'huilian'},
                {companyName:'A2U',coding:'a2u'},
                {companyName:'UEQ',coding:'ueq'},
                {companyName:'中加国际',coding:'scic'},
                {companyName:'易达通',coding:'yidatong'},
                {companyName:'宜送',coding:'yisong'},
                {companyName:'捷网俄全通',coding:'ruexp'},
                {companyName:'华通务达',coding:'htwd'},
                {companyName:'申必达',coding:'speedoex'},
                {companyName:'联运',coding:'lianyun'},
                {companyName:'捷安达',coding:'jieanda'},
                {companyName:'SHL畅灵国际',coding:'shlexp'},
                {companyName:'EWE全球',coding:'ewe'},
                {companyName:'全球',coding:'abcglobal'},
                {companyName:'芒果',coding:'mangguo'},
                {companyName:'金海淘',coding:'goldhaitao'},
                {companyName:'极光',coding:'jiguang'},
                {companyName:'富腾达国际',coding:'ftd'},
                {companyName:'DCS',coding:'dcs'},
                {companyName:'成达国际',coding:'chengda'},
                {companyName:'中环',coding:'zhonghuan'},
                {companyName:'顺邦国际',coding:'shunbang'},
                {companyName:'启辰国际',coding:'qichen'},
                {companyName:'澳货通',coding:'auex'},
                {companyName:'澳速',coding:'aosu'},
                {companyName:'澳世',coding:'disifang'},

            ]
            $scope.expressInfo = false;
            $scope.expressResults = [];
            $scope.query = function () {
                if(!$scope.oid){
                    $ui.notify('请输入运单号', '提示', function () {

                    });
                    return;
                }else{
                    $scope.results = [];
                    $request.get('api/?model=order&action=intelligent_inquiry&oid='+$scope.oid,
                        function (response) {
                            if(response.length > 1){
                                //用api的返回值（公司代号） 从$scope.result里找出该代号对应的公司名称
                                for(var i=0; i<response.length; i++){
                                    for(var j=0;j<$scope.code.length; j++){
                                        if(response[i].comCode == $scope.code[j].coding){
                                            $scope.results.push({'companyName':$scope.code[j].companyName,'coding':$scope.code[j].coding});
                                        }
                                    }
                                }
                                $scope.noRecord = false;
                                $scope.expressInfo = false;
                            }else{
                                $ui.error('运单号不存在！', '查询错误', function () {

                                });
                            };

                        }, function (err) {
                            $ui.error(err);
                        });
                }

            }
            $scope.inquire = function(coding){

                $request.get('api//kuaidi100/query.php?oid='+$scope.oid+'&coding='+coding,
                    function(response){
                        if(response.result == false){
                            //查询没结果
                            $scope.noRecord = true;
                            $scope.expressInfo = false;
                        }else{
                            $scope.noRecord = false;
                            $scope.expressInfo = true;
                            $scope.expressResults = response.data;
                            console.log($scope.expressResults);
                        }
                    },function(err){
                        $ui.error(err);
                    })
            }
            $scope.tooltip = function(){
                $scope.noRecord = false;
            }

        }])
});