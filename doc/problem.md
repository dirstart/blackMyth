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


## electron 打包错误
An unhandled error has occurred inside Forge:
Failed to install modules: ["electron-compile","electron-squirrel-startup"]

With output: Exited with status 1
Error: Failed to install modules: ["electron-compile","electron-squirrel-startup"]

> 还是不用  pnpm 了，使用  npm 吧。


## 打包如果希望不进行混淆，能够看到具体打包结果。发现 electron-forge 不支持制定 config.test 文件啊。

> 顺便发现了一个问题。【TRAE】由于联网主要是查询国内 CSDN 的网站。所以相关的回答质量较低。（仅限于此类问题回答不好）


## 修改了 renderer 结构后，打包后找不到内容了
https://github.com/electron/forge/issues/3902
> 这个 issue 下面说，this might be much easier too. i did face lots of errors many years ago with electron-forge fwiw
这也可能会容易得多。多年前，我在使用 Electron-Forge FWIW 时确实遇到了很多错误

> 也许我应该使用 electron-vite，而不是 electron-forge。

https://github.com/electron/forge/issues/3198

@Sandeep-android-2000 bdw, u can just use https://electron-vite.org/guide/#scaffolding-your-first-electron-vite-project instead to not worry about all this. it supports releases too i think - https://electron-vite.org/guide/distribution
BDW，您可以改用 https://electron-vite.org/guide/#scaffolding-your-first-electron-vite-project 而不必担心这一切。我认为它也支持发布 - https://electron-vite.org/guide/distribution
