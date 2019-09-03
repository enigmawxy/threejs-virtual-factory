# 使用Three.js开发的虚拟工厂
========

## 安装运行
先决条件：安装运行Parse-Server

1、采用Parse方案，后台使用MongoDB， 关于安装运行参见[这里](https://github.com/parse-community/parse-server)

2、采用Parse-Dashboard管理MongoDB数据库， 安装运行参见[这里](https://github.com/parse-community/parse-dashboard)

克隆仓库并运行

```
npm install
```

## 运行
运行服务器端
```
node app/server.js
```

运行客户端

```
npm run server
```

# 已知的问题

1、没有区分个人的作品和组的作品，支持用户注册/登录


## 断线重连机制

1、客户端刷新就会自动断开并重新连接，这从一定程度可以认为不会造成什么大问题，暂时可以这么处理。


## 场景对象持久化问题

3、服务端修改：重写Server.js的 getInitCommands方法

4、新建操作数据库的JS类：index.js
