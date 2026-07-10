## 克隆

```bash
git clone --recurse-submodules git@git.woa.com:med-agent/med-agent-mono.git
```

## 初始化子模块

```bash
# 初始化并拉取所有子模块
git submodule update --init --recursive
```

## 更新子仓

```bash
# 把所有子仓拉到各自远端分支的最新
git submodule update --remote --merge
