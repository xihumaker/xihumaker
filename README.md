西湖创客汇微信服务号
==============

上线部署步骤：

* 1.将/config.js文件下面的 xihumaker.jios.org 修改为：115.29.18.213
* 2.将/menu.json文件下面的 xihumaker.jios.org 修改为：115.29.18.213
* 3.将/routes.js文件下面的微信接入配置切换成产品模式
* 4.将/config.js文件下面的 QINIU_Bucket_Name 修改为xihumaker-online
* 5.将/public/js/createProject.js文件下面的 domain 修改为 http://xihumaker-online.qiniudn.com/
