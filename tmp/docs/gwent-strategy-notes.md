# 巫师三昆特牌出牌攻略调研与本项目落地映射

> 目的：调研巫师三《昆特牌》公认的进阶出牌策略，逐条评估能否用于本项目（章鱼牌）的自动出牌 AI，
> 并通过「hard 随机卡牌 + 100 场对比」验证胜率是否提升，有提升才改代码。
> 参考来源：Seven Swords《How to Win Every Gwent Match》、NGA 卡差理论、B 站昆特派、3DM / 游戏之家 pass 时机专题等。

## 一、昆特牌通用核心策略（调研结论）

### G1. 三局两胜是资源博弈，不是每局都要赢
- 只需赢 2 局。可以主动放弃一局，诱使对手过度投入，把强牌/手牌留到关键局。
- 卡牌经济（card economy）往往胜过单纯堆数值。

### G2. 卡差（Card Advantage）是最核心资源
- 开局手牌相等，谁在后续局手牌更多，谁就能在对手 pass 后继续加分、拿到「最后一手」。
- 输掉第一局往往意味着你保住了手牌数量优势 → 用它赢下二、三局。

### G3. Pass（停手）时机
- 对手在「燃烧」强牌时，尽早 pass，别陪着一起耗。
- 只有在「能控场」或「能逼对手多消耗一张牌」时才继续加牌。
- 领先足够多、对手一张牌追不回来时，果断 pass 锁定本局（少花牌、留卡差）。
- 数值上已经无法反超本局时，不要硬填，直接 pass 保牌。

### G4. 间谍 / 过牌引擎（本项目对应「出使」抽牌）
- 间谍牌给对手加分但让自己抽牌，是获取卡差的关键。第一局优先打，滚出资源。
- 本项目「出使」= 打出后抽牌，机制上等价于间谍：早打价值高、决胜局价值低。

### G5. 决胜局（第三局）倾注
- 第三局是英雄牌、控制牌、卡差兑现的时刻，前两局应尽量保留这些资源。

### G6. 控制/清除牌（对应「奇策」最高战力摧毁、时局牌/天气）
- 清除类牌要在净收益足够（能点掉对手大牌 / 削弱密集行列）时才用，避免亏损打出。

---

## 二、逐条映射到本项目 AI，并给出可验证假设

本项目 AI 决策集中在 `shared/core/battle.js`：
- `evaluateAdvancedPass` / `analyzeDocumentTurnV2`：pass 时机。
- `resolvePassTuning(cfg)`：pass 相关可调参数（`expectedCatchPerCard / passLeadMin / minCardsToCatch / unconditionalPassLead / passCostFloor`），
  **可通过 `cfg.tuning` 传入，无需改核心代码即可对比**。
- `scoreAiCandidateAdvanced` / `scoreDocumentActionV2`：出牌打分。
- `futureCardValue` / `resourceCostForCard`：资源/保留价值。

对比方法：`scripts/simulate-ai-matches.js` 的 `runConfigComparison`（成对固定种子、交替先后手、hard 随机卡牌），
candidate 用新策略参数 / baseline 用旧策略，跑 100 场比较胜率。旧策略基线始终保留。

| 编号 | 对应攻略 | 本项目落地假设 | 落地方式 |
|------|----------|----------------|----------|
| S1 | G3 领先果断 pass 保卡差 | 现阈值 `passLeadMin/minCardsToCatch/unconditionalPassLead` 偏保守，适当调低可更早锁局、留卡差 | `cfg.tuning` 参数对比 |
| S2 | G3 无法反超就 pass | 本局数值上不可能翻盘时更早 pass 保牌（`passCostFloor` / 不可达判定） | `cfg.tuning` 参数对比 |
| S3 | G2 卡差权重 | 出牌打分中 `handDeltaWeight`（手牌差权重）偏低，提升可更重视留牌 | 代码开关（`ADVANCED_AI` 可被 cfg 覆盖） |
| S4 | G4 出使/间谍早打 | 首局「出使」抽牌价值加成可上调，决胜局更压制 | 代码开关 |
| S5 | G5 决胜局倾注 | 前两局对英雄/号令/集贤等 tempo 牌的保留惩罚加强 | 代码开关 |
| S6 | G1 放弃第一局换卡差 | 首局落后且卡差不亏时更倾向 dry-pass 让对手多耗 | `cfg.tuning` + 代码开关 |

> 说明：本项目单机与联机共用 `battle.js` 决策，改动后按项目规则同步 PVP 核心与云函数。
> 为保证「保留旧策略基线 + 公平对比」，把新策略做成由 `cfg.strategy`/`cfg.tuning` 控制的分支，
> 对比通过后再决定是否设为正式默认。

---

## 三、验证记录（逐条填写）

（在实验过程中逐条记录：新策略参数、100 场结果 新胜/旧胜/平、胜率、是否采用）
</content>
