# 已知的问题

1、没有区分个人的作品和组的作品，支持用户注册/登录


## 断线重连机制

1、客户端刷新就会自动断开并重新连接，这从一定程度可以认为不会造成什么大问题，暂时可以这么处理。


## 场景对象持久化问题

1、采用Parse方案，后台使用MongoDB， 关于安装运行参见[这里](https://github.com/parse-community/parse-server)

2、采用Parse-Dashboard管理MongoDB数据库， 安装运行参见[这里](https://github.com/parse-community/parse-dashboard)

3、服务端修改：重写Server.js的 getInitCommands方法

4、新建操作数据库的JS类：index.js


#Real-time Collaboration Application in Three.js
========
### [Running Demo](http://storage.googleapis.com/hecodes/app/index.html)

### Accompanying blog post [here](http://hecodes.com/2016/08/building-real-time-collaboration-applications-three-js)

## Installation
Clone repository and run

```
npm install
```

## Usage
Run server
```
node app/server.js
```

Run client

```
npm run server
```
