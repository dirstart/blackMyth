1.pnpm 安装了错误的 electron 包，报错 electron 安装失败。
直接删除 node_modules 无效。
需要清除 pnpm 的全局存储。

## 清除 pnpm 的全局缓存
```
# 清除未被引用的包（包括错误的 electron）
pnpm store prune

# 强制删除所有存储内容（谨慎使用！会清除所有缓存的依赖）
pnpm store prune --force
```

## 删除本地项目残留
```
# 删除 node_modules 和 lock 文件
rm -rf node_modules pnpm-lock.yaml

# 可选：清除 npm 缓存（某些情况下 electron 会缓存到这里）
npm cache clean --force
```

报错：
Electron failed to install correctly, please delete node_modules/electron and try installing again

解决方案
pnpm approve-builds

electron的安装需要以下步骤：
### electron 的特殊性
1.下载预编译的二进制文件
2.可能触发 postinstall 脚本，防止恶意包执行

### pnpm 的安全策略
pnpm 默认禁止包执行。
因此需要手动批准。
```
pnpm approve-builds
```
