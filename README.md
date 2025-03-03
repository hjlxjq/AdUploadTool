# 刷新广告常量数据到 mysql

1. 复制各项目的xml表到本项目的 /xml 目录下

2. 数据库配置文件在 /config 下

3. 执行顺序

```
    env=${env} node ./tools/init_db.js // 初始化数据库建表, env为local本地，product正式，test测试

    env=${env} node index ${project} // 刷新项目project到数据库，例如刷新word项目到数据命令： env=local node index.js word
```

4. 阶段导入流程

    - 更新上传 xml 表 --- 非常重要

    - 线上导出通用配置 mysql 数据库

    ```
    mysqldump -h 35.202.106.22 -uhujianlong -phujianlong@talefun --set-gtid-purged=OFF -t --tables talefun_ad adChannel adType nativeTmpl productGroup nativeShop > baseTalefunAd-test.sql

    mysqldump -h 34.94.165.8 -uaddispatch_user -p --set-gtid-purged=OFF -t --tables talefun_ad adChannel adType nativeTmpl productGroup nativeShop > baseTalefunAd-test.sql

    password: talefun@#$ADdispatcher
    ```

    - 清空本地数据库
    
    ```
    node ./tools/init_db.js
    ```

    -本地导入 线上导出通用配置 mysql 数据库
    
    ```
    mysql -uroot -p823234 -f talefun_ad < baseTalefunAd-test.sql
    ```
    
    - 本地导入通用配置
    
    ```
    node talefunCom.js <project>
    ```

    - 本地导出通用配置
    
    ```
    mysqldump -uroot -p823234 -t talefun_ad --skip-extended-insert --ignore-table=talefun_ad.user --ignore-table=talefun_ad.userAuth --ignore-table=talefun_ad.nationDefine --ignore-table=talefun_ad.baseConfig > talefunAd-com.sql
    ```

    - 线上导入通用配置
    
    ```
    mysql -h 35.202.106.22 -uhujianlong -phujianlong@talefun -f talefun_ad < talefunAd-com.sql

    mysql -h 34.94.165.8 -uaddispatch_user -p -f talefun_ad < talefunAd-com.sql

    password: talefun@#$ADdispatcher
    ```

    - 本地导入 阶段导入的应用
    
    ```
    node index.js <project>
    ```

    - 本地导出阶段导入的应用
    
    ```
    mysqldump -uroot -p823234 -t talefun_ad --ignore-table=talefun_ad.user --ignore-table=talefun_ad.userAuth --ignore-table=talefun_ad.nationDefine --ignore-table=talefun_ad.baseConfig --ignore-table=talefun_ad.appConfig --ignore-table=talefun_ad.adChannel --ignore-table=talefun_ad.adType --ignore-table=talefun_ad.nativeTmpl --ignore-table=talefun_ad.productGroup --ignore-table=talefun_ad.nativeShop > talefunAd.sql
    ```

    - 线上导入阶段导入的应用
    
    ```
    mysql -h 35.202.106.22 -uhujianlong -phujianlong@talefun -f talefun_ad < talefunAd.sql

    mysql -h 34.94.165.8 -uaddispatch_user -p -f talefun_ad < talefunAd.sql

    password: talefun@#$ADdispatcher
    ```
