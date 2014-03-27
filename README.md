#说明
基于Node.js MongoDB Bootstrap
目前是alpha中的alpha
##路由
###已完成：
/ - index

/login - 登陆界面

/logout - 退出

/reg - 注册界面

###待加入：
/user - 全部用户信息页面

/user/setting - 用户信息设置

/user/find - 用户查找

/user/USERNAME - 个人主页

/FORUMNAME - 每个论坛板块的页面

/FORUMNAME/THREADID - 每个帖子的页面

## 数据库
基于MongoDB

###已完成
####users
保存用户信息
* id
* passwd
* email
* name 未完成

####threads
保存帖子信息
* threadTitle
* threadContent
* threadOwner

* threadID 未完成

###待加入
####Forums
保存板块信息
* forumName
* forumEName
* forumID
* forumDescribe

####ThreadResponse
保存回复信息
* parentID
* post
* postTitle
* postContent
* postOwner

