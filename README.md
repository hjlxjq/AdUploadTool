# 刷新广告常量数据到mysql

1. 复制各项目的xml表到本项目的/xml目录下

2. 数据库配置文件在/config下

3. 执行顺序

```
    env=${env} node ./tools/init_db.js // 初始化数据库建表, env为local本地，product正式，test测试

    env=${env} node index ${project} // 刷新项目project到数据库，例如刷新word项目到数据命令： env=local node index.js word
