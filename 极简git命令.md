常规操作命令：

第一次把远程仓库拉取到本地
- git clone

每天开工要做：
- git pull   //先把同事的最新代码拉下来
- git checkout -b   //建立一个属于自己的分支并切换进去
- git add .    //改动的代码放进去“暂存区”
- git commit -m “添加提交说明”        //提交到本地仓库
- git push origin 新分支名     //推到远程，让同事能看到


快速查看状态
- git status     //看哪些文件被改了，还没提交
- git log --online    //一行一个版本，快速浏览历史

临时切换分支、或者回滚
- git checkout 分支名    //跳到别的分支
- git checkout -- 文件名   //把改错的文件一键还原成上次提交的样子

忘记拉代码导致冲突？先stash 再pull
- git stash    //把当前改进塞进口袋
- git pull   拉取最新代码
- gitstash pop   再把口袋里面的改动放出来，手动解决冲突即可
