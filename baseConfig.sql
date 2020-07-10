-- MySQL dump 10.13  Distrib 5.7.24, for macos10.14 (x86_64)
--
-- Host: localhost    Database: talefun_ad
-- ------------------------------------------------------
-- Server version	5.7.24-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `baseConfig`
--

DROP TABLE IF EXISTS `baseConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `baseConfig` (
  `id` char(36) NOT NULL,
  `key` varchar(50) NOT NULL,
  `value` varchar(100) NOT NULL,
  `description` varchar(150) NOT NULL,
  `test` tinyint(1) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baseConfig`
--

LOCK TABLES `baseConfig` WRITE;
/*!40000 ALTER TABLE `baseConfig` DISABLE KEYS */;
INSERT INTO `baseConfig` VALUES ('052860c3-de00-4d54-9d4c-6277a8265ac8',' config042 ','0.5',' 插屏前的遮罩跳转广告的时间 ',0,1,'2020-07-10 11:13:04','2020-07-10 11:13:04'),('081910be-c157-40ec-b7bb-6d61d2e3dcd8',' discardBanner ','1800',' banner失效时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('09fe0aa0-3a02-4e73-9e20-46c80fee87db',' config041 ','',' prediction打点事件名列表,  \";\"分割 ',0,1,'2020-07-10 11:13:04','2020-07-10 11:13:04'),('12ad92c6-98d6-431b-954e-3f04ea83db00',' InterstitialCoverTime ','1.5',' 插屏前的遮罩持续时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('13714417-4cae-4b03-a370-d5890f35338f',' config001 ','1800',' 用户多久之后算是老用户 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('1510021a-50c3-410f-9d3d-6aebd7d1ff05',' interstitialCD ','1',' 插屏播放间隔(调用展示插屏的次数)(最好配置为0,间隔交由游戏控制) ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('194712cc-168f-457e-9ecc-d0091a27cb35',' config050 ','',' 服务条款说明地址',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('258752e2-5062-4b6d-a214-2666449b0346',' config045 ','1',' 控制ecpm 需要开几次方 ',0,1,'2020-07-10 11:13:04','2020-07-10 11:13:04'),('2abce188-b122-490b-9517-cc8f7bbb225f',' delayToChangeText ','5',' native中的title和body内容互换间隔 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('2ce2a436-55d0-424e-8ebf-111d53c560d4',' config003 ','3',' 控制native menu点击范围(老用户) ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('3280a65e-8fbd-4258-8bb5-f39748d2af94',' config061 ','0',' 激励视频加载成功是否加载更多广告, \"0\"不加载更多,\"1\"加载更多 ',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('3b1d4c9e-590a-404c-bccb-67b1bf1dfb30',' interstitialTimeCD ','0',' 插屏播放时间间隔(最好配置为0,间隔交由游戏控制) ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('3dd2f4b6-027a-429e-a7f7-fc385c62be26',' config004 ','3',' 控制native 插屏点击范围(新用户) ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('4330a7ed-7901-4141-87cd-c804a6b061e9',' config047 ','0',' 控制显示弹窗的类型, \"1\"是显示小弹窗; \"2\"是显示全屏弹窗; \"3\"没有年龄选择框,只有确认按钮; \"4\"没有年龄选择框,两个按钮,文案包括\"OK\"; \"5\"没有年龄选择框,两个按钮,文案包括\"Accept\" ',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('488276d2-abe5-472e-992a-71b33b6972a6',' config002 ','3',' 控制native menu点击范围(新用户) ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('4c27011a-999f-4970-b0ea-4aca5dbc27a7',' discardRewardVideo ','1800',' 激励视频失效时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('5387c4dc-6183-42b9-a18a-ca7139abc4d9',' bannerTimeCD ','30',' banner展示多久之后更换一条 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('54087113-a7d0-4f8f-8a05-da09c8eb1fa6',' config005 ','3',' 控制native 插屏点击范围(老用户) ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('5938f40a-85c1-439c-b5a4-8f82648bc62e',' delayToNextCache ','10',' 广告重试间隔 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('5a61a435-5483-49c0-9ea2-0e76efe6a127',' nativeTemplateId ','1',' 控制native banner的模板 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('65447459-9c33-4fcb-93b6-9cdc68c4f086',' config040 ','false',' prediction重复打点开关 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('7cf53c6e-f0e9-4914-a0c5-bbcfe5dedd87',' config046 ','1',' 控制ecpm 开方后乘以的倍数 ',0,1,'2020-07-10 11:13:04','2020-07-10 11:13:04'),('83c23581-4ea1-4f28-b402-5039d0bc730e',' discardNative ','1800',' native失效时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('8ac568da-9f9b-4bd1-900b-ad2828c9d13a',' aolBannerRefreshTime ','30','  banner刷新间隔 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('92a732f3-c3a9-42b8-a91b-0f482a907ef1',' interstitialNPV ','-1',' 插屏中插入视频的间隔 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('92a7f980-2bc9-4dc5-909d-4935f98b07bb',' bannerRefreshTime ','30',' banner刷新间隔 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('95970a44-4c16-4161-b021-917c19fb3287',' nativeRefreshInterval ','1',' menu 和 ingame 刷新展示N次刷新',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('9667b060-2553-452d-84fb-2efa88f017fb',' discardVideo ','1800',' 视频失效时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('a1e6248d-5468-4f4e-9004-0da9c6ffdd83',' config044 ','false',' 控制是否打unity价格回传的点 ',0,1,'2020-07-10 11:13:04','2020-07-10 11:13:04'),('a5ab934e-3b95-41f0-9c2e-d904774ec388',' videoLoadWaitingTime ','10',' 视频类广告加载超时时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('a6a7afb3-b27f-4cd9-a091-6122f186c0d3',' discardMenu ','1800',' menu失效时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('a6c33e28-ac24-435b-b817-fb9451185b9a',' adLoadWaitingTime ','5',' 插屏加载超时时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('a6c6ac84-f44e-42c8-a296-f23772955e3f',' config051 ','',' gdpr隐私说明地址',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('a74a3899-bd89-4eb1-93fb-9ca75edafdc3',' nativeAdsCloseTime ','3',' native插屏展示后多级可关闭 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('bc343d5e-cf27-43b4-b22c-4d3227c9512d',' config048 ','false',' 开启GDPR弹窗, \"true\"显示弹窗,\"false\"是不开启弹窗 ',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('c0f60d28-efb8-4e07-87fa-4c2332803da7',' nativeMenuTimeCD ','0',' menu多久展示一次 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('c3215b6b-e943-4723-8680-b59f444423df',' tryCacheTimes ','0',' 广告重试次数 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('d2dfbaba-7dc0-4357-949f-f1b8ca564e1f',' config060 ','0',' 插屏加载成功是否加载更多广告, \"0\"不加载更多,\"1\"加载更多 ',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('d3fa29a5-d4b2-4162-9b0e-32657a721005',' config052 ','',' 用户价值打点配置,  \";\"分割,例\"1;5;15\"则第1,5,15在同一天价值分别达到1,5,15时打一个点',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('e1716dfe-f74c-4b87-9cdf-2c70052d41bd',' discardInterstitial ','1800',' 插屏失效时间 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('e1d7571c-5c37-4fe2-be0e-0b3da285db70',' loadTimeCD ','0',' 两次加载需要的间隔 ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('e37c5918-4083-4d4c-8cb8-b4a35885c4fe',' loadVideoMaxTime ','30',' 视频或激励视频加载超时时间(废弃) ',0,1,'2020-07-10 11:09:43','2020-07-10 11:09:43'),('ecb87b6b-a115-4278-bc6f-dd2ec52093a0',' shopUrl ','',' 商店地址 ',0,1,'2020-07-10 11:14:21','2020-07-10 11:14:21'),('f2f7cbb3-7638-443b-9886-9874bf13e953',' config043 ','',' 版本更新弹窗配置 ',0,1,'2020-07-10 11:13:04','2020-07-10 11:13:04');
/*!40000 ALTER TABLE `baseConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'talefun_ad'
--

--
-- Dumping routines for database 'talefun_ad'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-10 11:57:31
