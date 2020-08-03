# 刷新广告常量数据到mysql

1. 复制各项目的xml表到本项目的/xml目录下

2. 数据库配置文件在/config下

3. 执行顺序

```
    env=${env} node ./tools/init_db.js // 初始化数据库建表, env为local本地，product正式，test测试

    env=${env} node index ${project} // 刷新项目project到数据库，例如刷新word项目到数据命令： env=local node index.js word
```

4. 阶段导入流程

    - 更新上传 xml表 --- 非常重要

    - 线上导出通用配置 mysql 数据库

    ```
    mysqldump -h 35.202.106.22 -uhujianlong -phujianlong@talefun --set-gtid-purged=OFF -t --tables talefun_ad adChannel adType nativeTmpl productGroup nativeShop packParam > baseTalefunAd-test.sql
    ```

    - 清空本地数据库
    
    ```
    node ./tools/init_db.js
    ```

    -本地导入 线上导出通用配置 mysql 数据库
    
    ```
    mysql -uroot -p823234 -f talefun_ad <  baseTalefunAd-test.sql
    ```
    
    - 本地导入通用配置
    
    ```
    <!-- index.js -->
    await readChannelAndType(XMLDir, project);
    await readNativeTmpl(XMLDir, project);
    await readProductGroup(DefineDir);

    <!-- 导入需要阶段性导入的应用的通用配置 -->
    node index.js <project>
    ```

    - 本地导出通用配置
    
    ```
    mysqldump -uroot -p823234 -t talefun_ad --skip-extended-insert --ignore-table=talefun_ad.user --ignore-table=talefun_ad.userAuth > talefunAd-com.sql
    ```

    - 线上导入通用配置
    
    ```
    mysql -h 35.202.106.22 -uhujianlong -phujianlong@talefun -f talefun_ad < talefunAd-com.sql
    ```

    - 本地导入 阶段导入的应用
    
    ```
    node index.js <project>
    ```

    - 本地导出阶段导入的应用
    
    ```
    mysqldump -uroot -p823234 -t talefun_ad --ignore-table=talefun_ad.user --ignore-table=talefun_ad.userAuth --ignore-table=talefun_ad.nationDefine --ignore-table=talefun_ad.baseConfig > talefunAd.sql
    ```

    - 线上导入阶段导入的应用
    
    ```
    mysql -h 35.202.106.22 -uhujianlong -phujianlong@talefun -f talefun_ad < talefunAd.sql
    ```
