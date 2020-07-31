-- MySQL dump 10.13  Distrib 5.7.24, for macos10.14 (x86_64)
--
-- Host: 35.202.106.22    Database: talefun_ad
-- ------------------------------------------------------
-- Server version	5.7.25-google-log

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
-- Dumping data for table `baseConfig`
--

LOCK TABLES `baseConfig` WRITE;
/*!40000 ALTER TABLE `baseConfig` DISABLE KEYS */;
INSERT INTO `baseConfig` VALUES ('0262b576-fbaf-48b3-b437-0ee77ad1d191','config040','false','prediction重复打点开关',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('066a0227-43e2-40fc-9e2f-4c7a488adf12','tryCacheTimes','0','广告重试次数',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('07d58ccd-cecf-4602-bf4d-32c6f910d98d','config045','1','控制ecpm需要开几次方',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('13ce86af-aa01-4d4f-ab1f-2e8474d9d213','delayToNextCache','10','广告重试间隔',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('1a29fcf1-78e3-4b44-b550-269bb4d7474b','nativeRefreshInterval','1','menu和ingame刷新展示N次刷新',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('313ed0f3-7482-4a3c-9e88-edd1a6efb725','bannerTimeCD','30','banner展示多久之后更换一条',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('3713230f-01ce-44ae-a033-12bd47759692','config048','false','开启GDPR弹窗,\"true\"显示弹窗,\"false\"是不开启弹窗',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('3d0e632f-0798-4a09-9bb3-84dff1211ec6','delayToChangeText','5','native中的title和body内容互换间隔',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('3dc6a6b6-13dd-43cf-a57b-821f8228c49e','discardRewardVideo','1800','激励视频失效时间',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('49464f1f-6d42-47ef-9af5-8c834e414ea0','shopUrl','','商店地址',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('4fcd6dbd-27c1-4a28-8148-38cb19f8f42c','config001','1800','用户多久之后算是老用户',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('537dd397-5f69-47e1-a654-95494ae1be26','config061','0','激励视频加载成功是否加载更多广告,\"0\"不加载更多,\"1\"加载更多',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('5c595fb6-6b3b-4916-ab5c-41e25093504a','config002','3','控制nativemenu点击范围(新用户)',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('5d07ddce-7a46-4c9f-a2d2-d74eff4af600','config052','','用户价值打点配置,\";\"分割,例\"1;5;15\"则第1,5,15在同一天价值分别达到1,5,15时打一个点',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('5f856fad-a3df-441b-8097-e1c82543180a','interstitialTimeCD','0','插屏播放时间间隔(最好配置为0,间隔交由游戏控制)',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('61e82308-12e0-4cd6-9f42-fd6a93227fef','interstitialCD','1','插屏播放间隔(调用展示插屏的次数)(最好配置为0,间隔交由游戏控制)',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('6275e2af-f520-4e47-a80b-e5ff724f7ab1','loadVideoMaxTime','30','视频或激励视频加载超时时间(废弃)',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('634ecee0-3909-4b5e-a347-bdd55ba34583','config041','','prediction打点事件名列表,\";\"分割',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('79c5e4f3-a0ac-4304-9466-4bab42454459','nativeMenuTimeCD','0','menu多久展示一次',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('8372eb9a-e648-444a-ad7b-1e657f536aa5','config005','3','控制native插屏点击范围(老用户)',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('8f1c4f3b-8388-4887-b633-36a107dbf6c7','config042','0.5','插屏前的遮罩跳转广告的时间',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('9981e89c-4df3-41d5-8780-b257dc27a0fd','config046','1','控制ecpm开方后乘以的倍数',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('a13f8ac9-305b-4d19-ace4-e9f54dcd7fa7','nativeAdsCloseTime','3','native插屏展示后多级可关闭',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('a221b608-0a83-4132-a89c-74363e2a65dc','discardNative','1800','native失效时间',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('a2ad8da0-131d-42ce-841f-d3732906e9e5','bannerRefreshTime','30','banner刷新间隔',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('a759c117-dadf-4e7e-84f4-fe22776b7e13','loadTimeCD','0','两次加载需要的间隔',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('bc989cfb-2025-4306-9bd3-f91a6e3750cb','config050','','服务条款说明地址',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('be506449-0430-4936-8911-d78f313ddf78','config043','0','版本更新弹窗配置',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('c4acbf7f-1ebb-4947-b643-b4478053075c','config047','0','控制显示弹窗的类型,\"1\"是显示小弹窗;\"2\"是显示全屏弹窗;\"3\"没有年龄选择框,只有确认按钮;\"4\"没有年龄选择框,两个按钮,文案包括\"OK\";\"5\"没有年龄选择框,两个按钮,文案包括\"Accept\"',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('c68abdff-ee62-4e3f-9eb0-d266e30d7360','config051','','gdpr隐私说明地址',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('ce406cb5-c122-4a7e-b736-958e7ee26851','discardBanner','1800','banner失效时间',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('d4860e76-9f9e-4e1f-b177-bdb1e0327389','discardVideo','1800','视频失效时间',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('d98a2671-515e-4400-80da-241089545655','InterstitialCoverTime','1.5','插屏前的遮罩持续时间',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('dec78d79-15b6-48c5-85ea-d6963ae569ee','config060','0','插屏加载成功是否加载更多广告,\"0\"不加载更多,\"1\"加载更多',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('ded4741c-a537-4c96-a64f-77fe5a162435','discardInterstitial','1800','插屏失效时间',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('e0dc2a36-7d18-4067-a481-b5061114c486','config044','false','控制是否打unity价格回传的点',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('e3a576f8-55a1-4fcb-ac5e-35d277181923','config004','3','控制native插屏点击范围(新用户)',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('e3f952b9-41bf-484d-833e-f695e75420e2','nativeTemplateId','1','控制nativebanner的模板',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('e68805b0-3fb9-42f4-8b57-dfd818767a4d','videoLoadWaitingTime','10','视频类广告加载超时时间',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('eabb144d-72df-4c7f-9fe6-e765ed01f6f2','config003','3','控制nativemenu点击范围(老用户)',0,1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('ec333775-96dd-43dc-8881-591c54be217a','interstitialNPV','-1','插屏中插入视频的间隔',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('f3a33c7c-3cdf-4fd9-bd77-1d29a9f9b8da','discardMenu','1800','menu失效时间',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('f56857b4-e5f2-4302-9958-3d024512084f','adLoadWaitingTime','5','插屏加载超时时间',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('f98bfbfa-612d-46dc-9aa7-4855f7b6049f','aolBannerRefreshTime','30','banner刷新间隔',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22');
/*!40000 ALTER TABLE `baseConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `adChannel`
--

LOCK TABLES `adChannel` WRITE;
/*!40000 ALTER TABLE `adChannel` DISABLE KEYS */;
INSERT INTO `adChannel` VALUES ('0acf1c4e-7bc7-4482-9472-6060e5b6084e','facebook',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('2c39a09c-9438-42da-8f2e-cee1ce123a89','vungle',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('2ea7581c-f2e8-47af-b2e9-e458382a59ac','tapjoy',NULL,NULL,NULL,0,1,'2020-07-30 20:25:18','2020-07-30 20:25:18'),('4d01f626-cf21-4491-bc9d-0ae38fa978ea','fullfbhb',NULL,NULL,NULL,0,1,'2020-07-30 20:25:21','2020-07-30 20:25:21'),('561b503e-fe05-478e-a12e-0ad5f7db9a9c','fyber',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('63696309-5ceb-4709-ab8a-11355bdcc65d','admob-mediation',NULL,NULL,NULL,0,1,'2020-07-30 20:25:57','2020-07-30 20:25:57'),('695a74e2-9f2b-49e8-9bf9-c2cbd5e4c138','mopub',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('7a1ea1b8-5432-429f-95e0-5cdf8f019214','unity',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('9a0408d4-2687-40b6-a1db-aa8616ac1f94','helium',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('a930b818-6acf-4511-bd53-7da5a7ba248e','ironsource',NULL,NULL,NULL,0,1,'2020-07-30 20:25:18','2020-07-30 20:25:18'),('ab8bcb76-33ee-4470-8fec-862090115921','chartboost',NULL,NULL,NULL,0,1,'2020-07-30 20:25:54','2020-07-30 20:25:54'),('aefd5d30-6c97-4055-bf14-03ec8cc578aa','admob',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('d653710f-d2a9-4cc9-a2b6-c9709db3ad22','applovin',NULL,NULL,NULL,0,1,'2020-07-30 20:25:20','2020-07-30 20:25:20'),('e4d3cb94-651e-4e68-b97d-45859b82309b','fullfacebook',NULL,NULL,NULL,0,1,'2020-07-30 20:25:17','2020-07-30 20:25:17'),('f4e704f8-aca8-4795-b071-15703fe56ce9','fbhb',NULL,NULL,NULL,0,1,'2020-07-30 20:25:20','2020-07-30 20:25:20'),('fb7d2aa0-6778-49dd-af7d-786ea2071a26','tiktok',NULL,NULL,NULL,0,1,'2020-07-30 20:25:21','2020-07-30 20:25:21');
/*!40000 ALTER TABLE `adChannel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `adType`
--

LOCK TABLES `adType` WRITE;
/*!40000 ALTER TABLE `adType` DISABLE KEYS */;
INSERT INTO `adType` VALUES ('0ef6ba7f-2926-4bda-9da7-e2ee5c251463','interstitial','插屏',0,1,'2020-07-30 20:25:11','2020-07-30 20:25:11'),('474f99bf-b8cc-414c-8630-aae90db8491e','native_menu','native_menu',0,1,'2020-07-30 20:25:50','2020-07-30 20:25:50'),('8155d8d8-3a18-45b4-82e7-358061fdab51','native','原生',0,1,'2020-07-30 20:25:11','2020-07-30 20:25:11'),('94abe93f-6fa2-43d8-9b8c-1ac2bcb23c8a','open','open',0,1,'2020-07-30 20:25:11','2020-07-30 20:25:11'),('952750ee-3c29-4308-8197-704cb617e0db','banner','横幅',0,1,'2020-07-30 20:25:11','2020-07-30 20:25:11'),('a47d0232-45e6-4f74-a306-14735764d1f4','ingame','ingame',0,1,'2020-07-30 20:25:50','2020-07-30 20:25:50'),('c3991da4-a688-456e-8fa7-e9e984f7719a','rewardvideo','激励视频',0,1,'2020-07-30 20:25:11','2020-07-30 20:25:11');
/*!40000 ALTER TABLE `adType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `adChannelMap`
--

LOCK TABLES `adChannelMap` WRITE;
/*!40000 ALTER TABLE `adChannelMap` DISABLE KEYS */;
/*!40000 ALTER TABLE `adChannelMap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nativeTmpl`
--

LOCK TABLES `nativeTmpl` WRITE;
/*!40000 ALTER TABLE `nativeTmpl` DISABLE KEYS */;
INSERT INTO `nativeTmpl` VALUES ('10a1d241-ac7b-435c-b87e-58fdecad9c23','7','http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('2c10bd63-725d-4d75-abe0-1e00bf2c6000','14','http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('3dea3fbd-353e-4b2f-8c1c-39591669c174','6','http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg',0,1,'2020-07-30 20:25:57','2020-07-30 20:25:57'),('995bfdca-c325-4dc2-ad83-e82831187535','8','http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg',0,1,'2020-07-30 20:25:22','2020-07-30 20:25:22'),('e0e4278b-b87d-40a9-968d-f5de205da2ca','5','http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg',0,1,'2020-07-30 20:25:57','2020-07-30 20:25:57'),('e3b86124-5eec-4827-bcdb-298a32887216','13','http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg',0,1,'2020-07-30 20:25:57','2020-07-30 20:25:57'),('e5da0586-caf2-4534-b0a6-506399c4261f','15','http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg',0,1,'2020-07-30 20:25:57','2020-07-30 20:25:57');
/*!40000 ALTER TABLE `nativeTmpl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `productGroup`
--

LOCK TABLES `productGroup` WRITE;
/*!40000 ALTER TABLE `productGroup` DISABLE KEYS */;
INSERT INTO `productGroup` VALUES ('59121808-abb1-4d16-8066-7da5057a2a0d','Word Cross','Word Cross 项目组',1,'2020-07-30 20:31:32','2020-07-30 20:31:32'),('6d8a7a84-115b-414b-a793-c2ef300e27cb','fuzhou','fuzhou 项目组',1,'2020-07-30 20:25:23','2020-07-30 20:25:23'),('a56171c6-9d98-4ac4-bf0e-2f1bc57ad39d','老纸牌','老纸牌 项目组',1,'2020-07-30 20:31:32','2020-07-30 20:31:32');
/*!40000 ALTER TABLE `productGroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `nativeShop`
--

LOCK TABLES `nativeShop` WRITE;
/*!40000 ALTER TABLE `nativeShop` DISABLE KEYS */;
/*!40000 ALTER TABLE `nativeShop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `packParam`
--

LOCK TABLES `packParam` WRITE;
/*!40000 ALTER TABLE `packParam` DISABLE KEYS */;
/*!40000 ALTER TABLE `packParam` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-31 14:47:38
