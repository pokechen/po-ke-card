# 脚本说明

## `compress-card-icons.js`

用于批量压缩微信小游戏卡牌图片。

默认处理目录：

```bash
po-ke-card-wechat-game/assets/card-icons
```

默认行为：

- 将 `png/jpg/jpeg/webp` 压缩为 `webp`
- 最大尺寸限制为 `360x480`
- WebP 质量为 `72`
- 只在压缩后体积更小时写入
- 默认原地压缩时会自动更新以下引用文件中的 `imageUrl`：
  - `po-ke-card-wechat-game/js/data/zhangyu_cards.js`
  - `po-ke-card-wechat-game/assets/card-icons/card-image-map.json`

## 首次安装依赖

在仓库根目录执行：

```bash
npm install
```

## 调试输出模式

命令后直接带上原始图片文件或图片目录路径时，脚本会：

- 不修改原文件
- 不更新卡牌数据引用
- 在输入路径同目录下自动创建 `compress-icons` 目录
- 只把压缩后体积更小的 `webp` 文件写入 `compress-icons`
- 传入目录时，会在该目录生成 `compress-card-icons-processed.json`，记录已经处理过的图片文件名；如果 `compress-icons` 中已存在同名 WebP，也会视为已处理并补写记录，后续重复执行时默认只处理新增图片

### 调试单张图片

```bash
npm run compress:wechat-card-icons -- po-ke-card-wechat-game/assets/card-icons/周瑜.webp
```

输出示例：

```bash
po-ke-card-wechat-game/assets/card-icons/compress-icons/周瑜.webp
```

### 调试整个目录

如果要调试整个卡牌图片目录，执行：

```bash
npm run compress:wechat-card-icons -- po-ke-card-wechat-game/assets/card-icons
```

输出目录：

```bash
po-ke-card-wechat-game/assets/card-icons/compress-icons
```

### 调试时只预览，不写文件

```bash
npm run compress:wechat-card-icons -- po-ke-card-wechat-game/assets/card-icons/周瑜.webp --dry-run
```

## 原地压缩模式

在仓库根目录执行。

### 预览压缩效果，不修改文件

```bash
npm run compress:wechat-card-icons -- --dry-run
```

### 执行默认原地压缩

```bash
npm run compress:wechat-card-icons
```

### 压得更小

```bash
npm run compress:wechat-card-icons -- --quality=60
```

### 自定义最大尺寸

```bash
npm run compress:wechat-card-icons -- --width=360 --height=480
```

### 转成 WebP 后删除原 PNG/JPG

确认游戏表现正常后再执行：

```bash
npm run compress:wechat-card-icons -- --delete-original
```

### 只生成图片，不更新引用

```bash
npm run compress:wechat-card-icons -- --no-update-refs
```

## 参数说明

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `输入路径` | - | 可传单张图片或图片目录；传入后进入调试输出模式 |
| `--dir=<path>` | `po-ke-card-wechat-game/assets/card-icons` | 原地压缩模式的图片目录 |
| `--out-dir=<path>` | 输入路径同目录下的 `compress-icons` | 自定义调试输出目录 |
| `--width=<number>` | `360` | 最大宽度 |
| `--height=<number>` | `480` | 最大高度 |
| `--quality=<1-100>` | `72` | WebP 质量，越低体积越小 |
| `--effort=<0-6>` | `6` | WebP 压缩强度，越高越慢但通常更小 |
| `--dry-run` | - | 只预览，不写文件，也不会更新处理记录 |
| `--force` | - | 即使压缩后更大也覆盖；目录增量模式下会忽略已处理记录 |
| `--delete-original` | - | 更新引用后删除原 PNG/JPG，仅原地压缩模式有效 |
| `--no-update-refs` | - | 不更新卡牌数据引用 |

## 建议

- 调试单张图片时，优先使用“调试输出模式”。
- 日常正式压缩前，先执行 `--dry-run` 看压缩收益。
- 卡牌图建议单张控制在 `30KB - 80KB`。
- 如需上传 CloudBase，建议上传压缩后的 `webp` 文件。
- 删除原图前，先在微信开发者工具里确认卡牌图显示正常。
