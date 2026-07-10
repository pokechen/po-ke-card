#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const GAME_DIR = "po-ke-card-wechat-game";
const DEFAULT_ICON_DIR = `${GAME_DIR}/assets/card-icons`;
const DEFAULT_REF_FILES = [
  "po-ke-card-wechat-game/js/data/zhangyu_cards.js",
  "po-ke-card-wechat-game/assets/card-icons/card-image-map.json"
];
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const PROCESSED_FILE_NAME = "compress-card-icons-processed.json";

function parseArgs(argv) {
  const options = {
    inputPath: "",
    dir: DEFAULT_ICON_DIR,
    outDir: "",
    width: 360,
    height: 480,
    quality: 72,
    effort: 6,
    dryRun: false,
    force: false,
    deleteOriginal: false,
    updateRefs: true,
    updateRefsExplicit: false
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--delete-original") options.deleteOriginal = true;
    else if (arg === "--no-update-refs") {
      options.updateRefs = false;
      options.updateRefsExplicit = true;
    } else if (arg.startsWith("--dir=")) options.dir = arg.slice("--dir=".length);
    else if (arg.startsWith("--out-dir=")) options.outDir = arg.slice("--out-dir=".length);
    else if (arg.startsWith("--width=")) options.width = Number(arg.slice("--width=".length));
    else if (arg.startsWith("--height=")) options.height = Number(arg.slice("--height=".length));
    else if (arg.startsWith("--quality=")) options.quality = Number(arg.slice("--quality=".length));
    else if (arg.startsWith("--effort=")) options.effort = Number(arg.slice("--effort=".length));
    else if (arg.startsWith("-")) throw new Error(`未知参数：${arg}`);
    else if (!options.inputPath) options.inputPath = arg;
    else throw new Error(`只能传入一个输入文件或目录：${arg}`);
  }

  if ((options.inputPath || options.outDir) && !options.updateRefsExplicit) options.updateRefs = false;
  if (!Number.isInteger(options.width) || options.width <= 0) throw new Error("--width 必须是正整数");
  if (!Number.isInteger(options.height) || options.height <= 0) throw new Error("--height 必须是正整数");
  if (!Number.isInteger(options.quality) || options.quality < 1 || options.quality > 100) {
    throw new Error("--quality 必须是 1-100 的整数");
  }
  if (!Number.isInteger(options.effort) || options.effort < 0 || options.effort > 6) {
    throw new Error("--effort 必须是 0-6 的整数");
  }

  return options;
}

function printHelp() {
  console.log(`压缩微信小游戏卡牌图标为 WebP，并按需更新引用。

用法：
  npm run compress:wechat-card-icons
  npm run compress:wechat-card-icons -- --dry-run
  npm run compress:wechat-card-icons -- --quality=68 --width=360 --height=480
  npm run compress:wechat-card-icons -- po-ke-card-wechat-game/assets/card-icons/周瑜.webp
  npm run compress:wechat-card-icons -- po-ke-card-wechat-game/assets/card-icons

调试输出模式：
  命令后传入文件或目录路径时，不改原文件、不更新引用；压缩结果会写入输入路径同目录的 compress-icons 目录。

参数：
  --dir=<path>          图片目录，默认 ${DEFAULT_ICON_DIR}
  --out-dir=<path>      调试输出目录，默认输入路径同目录下的 compress-icons
  --width=<number>     最大宽度，默认 360
  --height=<number>    最大高度，默认 480
  --quality=<1-100>    WebP 质量，默认 72
  --effort=<0-6>       WebP 压缩强度，默认 6
  --dry-run            只预览，不写文件
  --force              即使压缩后更大也覆盖；目录增量模式下会忽略已处理记录
  --delete-original    转为 WebP 并更新引用后删除原 PNG/JPG，仅默认原地压缩模式有效
  --no-update-refs     不更新卡牌数据中的 imageUrl
`);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function relFromRoot(filePath) {
  return toPosix(path.relative(ROOT_DIR, filePath));
}

function relFromGame(filePath) {
  return toPosix(path.relative(path.join(ROOT_DIR, GAME_DIR), filePath));
}

function bytes(n) {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)}MB`;
  return `${(n / 1024).toFixed(1)}KB`;
}

function fileSize(filePath) {
  return fs.statSync(filePath).size;
}

function listImages(dir) {
  return fs.readdirSync(dir)
    .filter(name => IMAGE_EXTS.has(path.extname(name).toLowerCase()))
    .map(name => path.join(dir, name));
}

function resolveInput(options) {
  const sourcePath = path.resolve(ROOT_DIR, options.inputPath || options.dir);
  if (!fs.existsSync(sourcePath)) throw new Error(`输入路径不存在：${sourcePath}`);

  const stat = fs.statSync(sourcePath);
  if (stat.isDirectory()) {
    return {
      sourcePath,
      sourceDir: sourcePath,
      images: listImages(sourcePath),
      isDirectory: true
    };
  }

  if (!stat.isFile() || !IMAGE_EXTS.has(path.extname(sourcePath).toLowerCase())) {
    throw new Error(`输入路径不是支持的图片文件或目录：${sourcePath}`);
  }

  return {
    sourcePath,
    sourceDir: path.dirname(sourcePath),
    images: [sourcePath],
    isDirectory: false
  };
}

function resolveOutputDir(options, input) {
  if (!options.inputPath && !options.outDir) return "";
  return path.resolve(ROOT_DIR, options.outDir || path.join(input.sourceDir, "compress-icons"));
}

function createProcessedState(options, input) {
  if (!options.inputPath || !input.isDirectory) return null;

  const filePath = path.join(input.sourceDir, PROCESSED_FILE_NAME);
  if (!fs.existsSync(filePath)) {
    return { filePath, names: new Set(), changed: false, added: 0 };
  }

  const content = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(content);
  const files = Array.isArray(data) ? data : data.files;
  if (!Array.isArray(files) || files.some(name => typeof name !== "string")) {
    throw new Error(`处理记录文件格式错误：${relFromRoot(filePath)}`);
  }

  return { filePath, names: new Set(files), changed: false, added: 0 };
}

function processedName(input, inputPath) {
  return toPosix(path.relative(input.sourceDir, inputPath));
}

function markProcessed(state, name) {
  if (!state || state.names.has(name)) return;
  state.names.add(name);
  state.changed = true;
  state.added += 1;
}

function saveProcessedState(state, dryRun) {
  if (!state || dryRun || !state.changed) return;

  const files = Array.from(state.names).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  const content = `${JSON.stringify({
    version: 1,
    updatedAt: new Date().toISOString(),
    files
  }, null, 2)}\n`;
  fs.writeFileSync(state.filePath, content);
  console.log(`已更新处理记录：${relFromRoot(state.filePath)} (+${state.added})`);
}

function replaceAll(content, from, to) {
  return content.split(from).join(to);
}

function updateReferenceFiles(replacements, dryRun) {
  if (!replacements.length) return 0;

  let changedFiles = 0;
  for (const ref of DEFAULT_REF_FILES) {
    const filePath = path.join(ROOT_DIR, ref);
    if (!fs.existsSync(filePath)) continue;

    const oldContent = fs.readFileSync(filePath, "utf8");
    let newContent = oldContent;
    for (const { from, to } of replacements) {
      newContent = replaceAll(newContent, from, to);
    }

    if (newContent !== oldContent) {
      changedFiles += 1;
      if (!dryRun) fs.writeFileSync(filePath, newContent);
      console.log(`${dryRun ? "将更新" : "已更新"}引用：${ref}`);
    }
  }

  return changedFiles;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  let sharp;
  try {
    sharp = require("sharp");
  } catch (err) {
    console.error("缺少依赖 sharp，请先在仓库根目录执行：npm install");
    process.exitCode = 1;
    return;
  }

  const input = resolveInput(options);
  const outputDir = resolveOutputDir(options, input);
  const processedState = createProcessedState(options, input);
  const images = input.images;
  const replacements = [];
  let beforeTotal = 0;
  let afterTotal = 0;
  let written = 0;
  let skipped = 0;
  let processedSkipped = 0;
  let deleted = 0;

  if (outputDir && !options.dryRun) fs.mkdirSync(outputDir, { recursive: true });

  console.log(`输入路径：${relFromRoot(input.sourcePath)}`);
  if (outputDir) console.log(`输出目录：${relFromRoot(outputDir)}`);
  if (processedState) console.log(`处理记录：${relFromRoot(processedState.filePath)}，已记录 ${processedState.names.size} 个文件`);
  console.log(`处理参数：max=${options.width}x${options.height}, webp quality=${options.quality}, effort=${options.effort}`);

  for (const inputPath of images) {
    const ext = path.extname(inputPath).toLowerCase();
    const recordName = processedName(input, inputPath);
    const oldSize = fileSize(inputPath);
    beforeTotal += oldSize;

    const basePath = inputPath.slice(0, -ext.length);
    const outputPath = outputDir
      ? path.join(outputDir, `${path.basename(basePath)}.webp`)
      : (ext === ".webp" ? inputPath : `${basePath}.webp`);
    const tmpPath = `${outputPath}.tmp-${process.pid}.webp`;
    const oldRel = relFromRoot(inputPath);
    const newRel = relFromRoot(outputPath);
    const oldImageUrl = relFromGame(inputPath);
    const newImageUrl = relFromGame(outputPath);
    const existingOutputSize = fs.existsSync(outputPath) ? fileSize(outputPath) : Infinity;

    const isRecorded = processedState && processedState.names.has(recordName);
    const hasExistingOutput = processedState && Number.isFinite(existingOutputSize);
    if (processedState && !options.force && (isRecorded || hasExistingOutput)) {
      skipped += 1;
      processedSkipped += 1;
      afterTotal += Math.min(oldSize, existingOutputSize);
      if (!options.dryRun) markProcessed(processedState, recordName);
      console.log(`跳过：${oldRel}，${isRecorded ? "已在处理记录中" : "已存在压缩结果"}`);
      continue;
    }

    const pipeline = sharp(inputPath)
      .rotate()
      .resize({ width: options.width, height: options.height, fit: "inside", withoutEnlargement: true })
      .webp({ quality: options.quality, effort: options.effort });

    const candidateSize = options.dryRun
      ? (await pipeline.toBuffer()).length
      : await pipeline.toFile(tmpPath).then(() => fileSize(tmpPath));
    const shouldWrite = options.force || candidateSize < Math.min(oldSize, existingOutputSize);
    const usableOutputSize = shouldWrite ? candidateSize : existingOutputSize;
    const shouldUpdateRef = !outputDir && ext !== ".webp" && usableOutputSize < oldSize;

    if (shouldWrite) {
      written += 1;
      afterTotal += candidateSize;
      console.log(`${options.dryRun ? "将写入" : "已写入"}：${newRel} ${bytes(oldSize)} -> ${bytes(candidateSize)}`);
      if (!options.dryRun) fs.renameSync(tmpPath, outputPath);
    } else {
      skipped += 1;
      afterTotal += Math.min(oldSize, existingOutputSize);
      console.log(`跳过：${oldRel}，压缩收益不足 ${bytes(oldSize)} -> ${bytes(candidateSize)}`);
      if (!options.dryRun && fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }

    if (shouldUpdateRef) {
      replacements.push({ from: oldImageUrl, to: newImageUrl });
      if (options.deleteOriginal && !options.dryRun && outputPath !== inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
        deleted += 1;
      }
    }

    if (!options.dryRun) markProcessed(processedState, recordName);
  }

  const changedRefFiles = options.updateRefs ? updateReferenceFiles(replacements, options.dryRun) : 0;
  saveProcessedState(processedState, options.dryRun);

  console.log("\n完成：");
  console.log(`  扫描图片：${images.length}`);
  console.log(`  写入图片：${written}`);
  console.log(`  跳过图片：${skipped}`);
  if (processedState) console.log(`  已处理跳过：${processedSkipped}`);
  if (processedState) console.log(`  新增处理记录：${processedState.added}`);
  console.log(`  引用替换：${replacements.length}`);
  console.log(`  更新引用文件：${changedRefFiles}`);
  if (options.deleteOriginal) console.log(`  删除原图：${deleted}`);
  console.log(`  估算体积：${bytes(beforeTotal)} -> ${bytes(afterTotal)}`);
}

main().catch(err => {
  console.error(err && err.message ? err.message : err);
  process.exitCode = 1;
});
