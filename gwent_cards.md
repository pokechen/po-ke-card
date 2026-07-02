# 《巫师3》昆特牌卡牌与规则资料
- 生成时间：2026-06-30T14:37:29
- 卡牌副本数：254；唯一基础牌名：180
- 覆盖：Base game、Hearts of Stone、Blood and Wine；包含 Northern Realms、Nilfgaardian Empire、Scoia'tael、Monsters、Skellige、Neutral。
- 数据源：见 `gwent_cards.json` 的 `sources` 字段。
## 规则摘要
### 组牌
每名玩家选择一个阵营和一张该阵营领袖牌；卡组由本阵营单位牌、Neutral 中立牌、Weather/Special 特殊牌组成。巫师3原规则要求至少 22 张单位牌，特殊牌通常最多 10 张。
### 对局
一局三回合，两胜者获胜；开局抽 10 张手牌，之后通常不自动补牌。玩家轮流打出一张牌或选择放弃本回合。双方都放弃后结算当前回合总战力。
### 战场行
战场分 Close/Melee 近战、Ranged 远程、Siege 攻城三行。单位牌只能打到允许的行，Agile 可选择近战或远程。
### 天气
Biting Frost 影响近战，Impenetrable Fog 影响远程，Torrential Rain 影响攻城，Skellige Storm 影响远程和攻城；被影响的非英雄单位基础战力按 1 计算，Clear Weather 清除天气。
### 常见能力
- **Hero**：不受天气、特殊牌和大多数能力影响。
- **Spy**：打到对方场上并计入对方分数，自己抽 2 张牌。
- **Medic**：从己方弃牌堆复活一张非英雄单位牌。
- **Tight Bond**：同名同能力单位在同一行时按数量倍增。
- **Morale Boost**：同一行其它非英雄单位 +1。
- **Muster**：打出同名牌或关联牌。
- **Scorch**：烧毁满足条件的最高战力非英雄牌。
- **Commanders Horn**：指定己方一行战力翻倍。
- **Berserker/Mardroeme**：Mardroeme 可让同一行 Berserker 转化为更高战力单位。

### 阵营被动
- **Northern Realms**：赢得一个回合后抽 1 张牌。
- **Nilfgaardian Empire**：平局时由尼弗迦德获胜；双方都是尼弗迦德时仍为平局。
- **Scoia'tael**：可决定谁先手；本小程序中默认为松鼠党玩家先手可控。
- **Monsters**：每回合结束后随机保留 1 张单位牌到下一回合。
- **Skellige**：第 3 回合开始时从弃牌堆随机复活 2 张非英雄单位牌。

## 数据统计
- 按阵营：{'Nilfgaardian Empire': 42, 'Monsters': 46, 'Northern Realms': 43, "Scoia'tael": 43, 'Neutral': 40, 'Skellige': 40}
- 按扩展：{'Base game': 199, 'Hearts of Stone': 12, 'Blood and Wine': 43}
- 按类型：{'unit': 180, 'weather': 15, 'hero': 25, 'special': 12, 'leader': 22}

## 卡牌清单

### Northern Realms（43 张副本）
| 卡牌 | 扩展 | 类型 | 行 | 战力 | 能力 | 获取 |
|---|---|---|---|---:|---|---|
| Ballista (1 of 2) | Base game | unit | siege | 6 | - | Base Deck；Base Deck；Included at start of game |
| Ballista (2 of 2) | Base game | unit | siege | 6 | - | Base Deck；Base Deck；Included at start of game (bug: sometimes you start with just one) |
| Blue Stripes Commando (1 of 3) | Base game | unit | melee | 4 | Tight Bond | Base Deck；Base Deck；Included at start of game |
| Blue Stripes Commando (2 of 3) | Base game | unit | melee | 4 | Tight Bond | Base Deck；Base Deck；Included at start of game |
| Blue Stripes Commando (3 of 3) | Base game | unit | melee | 4 | Tight Bond | White Orchard；Buy from Trader；White Orchard Tavern, Innkeeperess (or Trader outside) |
| Catapult (1 of 2) | Base game | unit | siege | 8 | Tight Bond | White Orchard；Buy from Trader；White Orchard Tavern, Innkeeperess (or Trader outside) |
| Catapult (2 of 2) | Base game | unit | siege | 8 | Tight Bond | Novigrad；Buy from Trader；Passiflora, Marquise Serenity |
| Crinfrid Reavers Dragon Hunter (1 of 3) | Base game | unit | ranged | 5 | Tight Bond | White Orchard；Buy from Trader；White Orchard Tavern, Innkeeperess (or Trader outside) |
| Crinfrid Reavers Dragon Hunter (2 of 3) | Base game | unit | ranged | 5 | Tight Bond | Velen；Buy from Trader；Claywich Village, Trader (first rescue at persons in distress marker on the large island to the east of Oreton) |
| Crinfrid Reavers Dragon Hunter (3 of 3) | Base game | unit | ranged | 5 | Tight Bond | Velen；Buy from Trader；Midcopse, Shopkeeper |
| Dethmold | Base game | unit | ranged | 6 | - | Base Deck；Base Deck；Included at start of game |
| Dun Banner Medic | Base game | unit | siege | 5 | Medic | Base Deck；Base Deck；Included at start of game |
| Esterad Thyssen | Base game | hero | melee | 10 | Hero | Novigrad；Gwent Quest；Gwent: Big City Players, Bathhouse, Sigismund Dijkstra OR automatically received if he dies |
| Foltest: King of Temeria | Base game | leader | - |  | Pick an Impenetrable Fog card from your deck and play it instantly. | Base Deck；Base Deck；Included at start of game |
| Foltest: Lord Commander of the North | Base game | leader | - |  | Clear any weather effects (resulting from Biting Frost, Torrential Rain or Impenetrable Fog cards) in play. | White Orchard；Buy from Trader；White Orchard Tavern, Innkeeperess (or Trader outside) |
| Foltest: The Siegemaster | Base game | leader | - |  | Commander's Horn | Palace of Vizima；Win from NPC；Vizima Palace Couryard, Nilfgaardian Nobleman |
| Foltest: The Steel-Forged | Base game | leader | - |  | Destroy your enemy's strongest Siege unit(s) if the combined strength of all his or her Siege units is 10 or more. | Novigrad；Secondary Quest；High Stakes, Passiflora, Bernard Tulle |
| John Natalis | Base game | hero | melee | 10 | Hero | Novigrad；Secondary Quest OR Loot；A Dangerous Game, Golden Sturgeon Tavern, Ravvy OR Prison Warden body during The Great Escape |
| Kaedweni Siege Expert (1 of 3) | Base game | unit | siege | 1 | Morale Boost | Base Deck；Base Deck；Included at start of game |
| Kaedweni Siege Expert (2 of 3) | Base game | unit | siege | 1 | Morale Boost | Base Deck；Base Deck；Included at start of game |
| Kaedweni Siege Expert (3 of 3) | Base game | unit | siege | 1 | Morale Boost | Base Deck；Base Deck；Included at start of game |
| Keira Metz | Base game | unit | ranged | 5 | - | Base Deck；Base Deck；Included at start of game |
| Philippa Eilhart | Base game | hero | ranged | 10 | Hero | Random；Win from NPC；Randomly earned |
| Poor Fucking Infantry (1 of 4) | Base game | unit | melee | 1 | Tight Bond | Base Deck；Base Deck；Included at start of game |
| Poor Fucking Infantry (2 of 4) | Base game | unit | melee | 1 | Tight Bond | Base Deck；Base Deck；Included at start of game |
| Poor Fucking Infantry (3 of 4) | Base game | unit | melee | 1 | Tight Bond | Velen；Buy from Trader；Lindenvale, Merchant |
| Poor Fucking Infantry (4 of 4) | Base game | unit | melee | 1 | Tight Bond | Velen；Buy from Trader；Midcopse, Shopkeeper |
| Prince Stennis | Base game | unit | melee | 5 | Spy | Base Deck；Base Deck；Included at start of game |
| Redanian Foot Soldier (1 of 2) | Base game | unit | melee | 1 | - | Base Deck；Base Deck；Included at start of game |
| Redanian Foot Soldier (2 of 2) | Base game | unit | melee | 1 | - | Base Deck；Base Deck；Included at start of game |
| Sabrina Glevissig | Base game | unit | ranged | 4 | - | Base Deck；Base Deck；Included at start of game |
| Sheldon Skaggs | Base game | unit | ranged | 4 | - | Base Deck；Base Deck；Included at start of game |
| Siege Tower | Base game | unit | siege | 6 | - | Random；Win from NPC；Randomly earned |
| Siegfried of Denesle | Base game | unit | melee | 5 | - | Base Deck；Base Deck；Included at start of game |
| Sigismund Dijkstra | Base game | unit | melee | 4 | Spy | Velen；Gwent Quest OR Loot；Gwent: Velen Players, Crow's Perch, Phillip Strenger (Bloody Baron) OR search Baron's office (has objective) |
| Síle de Tansarville | Base game | unit | ranged | 5 | - | Base Deck；Base Deck；Included at start of game |
| Thaler | Base game | unit | siege | 1 | Spy | Skellige；Buy from Trader；Ard Skellig, Arinbjorn, Innkeeper |
| Trebuchet (1 of 2) | Base game | unit | siege | 6 | - | Base Deck；Base Deck；Included at start of game |
| Trebuchet (2 of 2) | Base game | unit | siege | 6 | - | Base Deck；Base Deck；Included at start of game |
| Vernon Roche | Base game | hero | melee | 10 | Hero | Velen；Gwent Quest；Gwent: Velen Players, Midcopse, Haddy |
| Ves | Base game | unit | melee | 5 | - | Base Deck；Base Deck；Included at start of game |
| Yarpen Zigrin | Base game | unit | melee | 1 | - | Base Deck；Base Deck；Included at start of game |
| Foltest: Son of Medell | Hearts of Stone | leader | - |  | Destroy your enemy's strongest Ranged Combat unit(s) if the combined strength of all his or her Ranged Combat units is 10 or more. | Novigrad (Gustfields)；Buy from Trader；Circus Camp near Carsten, Merchant |

### Nilfgaardian Empire（42 张副本）
| 卡牌 | 扩展 | 类型 | 行 | 战力 | 能力 | 获取 |
|---|---|---|---|---:|---|---|
| Albrich | Base game | unit | ranged | 2 | - | Velen；Buy from Trader；Crow's Perch, Trader |
| Assire var Anahid | Base game | unit | ranged | 6 | - | Random；Win from NPC；Randomly earned |
| Black Infantry Archer (1 of 2) | Base game | unit | ranged | 10 | - | Velen；Buy from Trader；Claywich Village, Trader (first rescue at persons in distress marker on the large island to the east of Oreton) |
| Black Infantry Archer (2 of 2) | Base game | unit | ranged | 10 | - | Velen；Buy from Trader；Lindenvale, Merchant |
| Cahir Mawr Dyffryn aep Ceallach | Base game | unit | melee | 6 | - | Random；Win from NPC；Randomly earned |
| Cynthia | Base game | unit | ranged | 4 | - | Velen；Buy from Trader；Crow's Perch, Quartermaster's Baron's Store |
| Emhyr var Emreis: Emperor of Nilfgaard | Base game | leader | - |  | Look at 3 random cards from your opponent's hand. | Velen；Buy from Trader；Inn at the Crossroads, Innkeeper |
| Emhyr var Emreis: His Imperial Majesty | Base game | leader | - |  | Pick a Torrential Rain card from your deck and play it instantly. | Base Deck；Base Deck；Included at start of game |
| Emhyr var Emreis: The Relentless | Base game | leader | - |  | Draw a card from your opponent's discard pile. | Novigrad；Secondary Quest；High Stakes, Passiflora, Sasha |
| Emhyr var Emreis: The White Flame | Base game | leader | - |  | Cancel your opponent's Leader Ability. | Skellige；Gwent Quest；Gwent: Skellige Style, reward for completing the quest |
| Etolian Auxiliary Archers (1 of 2) | Base game | unit | ranged | 1 | Medic | Velen；Buy from Trader；Lindenvale, Merchant |
| Etolian Auxiliary Archers (2 of 2) | Base game | unit | ranged | 1 | Medic | Velen；Buy from Trader；Claywich Village, Trader (first rescue at persons in distress marker on the large island to the east of Oreton) |
| Fringilla Vigo | Base game | unit | ranged | 6 | - | Novigrad；Secondary Quest OR Loot；A Dangerous Game, Hierarch Square, Caesar Bilzen's house OR Prison Warden body during The Great Escape |
| Heavy Zerrikanian Fire Scorpion | Base game | unit | siege | 10 | - | Velen；Buy from Trader；Lindenvale, Merchant |
| Impera Brigade Guard (1 of 4) | Base game | unit | melee | 3 | Tight Bond | Velen；Buy from Trader；Crow's Perch, Trader |
| Impera Brigade Guard (2 of 4) | Base game | unit | melee | 3 | Tight Bond | Velen；Buy from Trader；Inn at the Crossroads, Innkeeper |
| Impera Brigade Guard (3 of 4) | Base game | unit | melee | 3 | Tight Bond | Novigrad (Gustfields)；Buy from Trader；Seven Cats Inn, Innkeeper |
| Impera Brigade Guard (4 of 4) | Base game | unit | melee | 3 | Tight Bond | Novigrad (Grassy Knoll)；Buy from Trader；Cunny of the Goose, Innkeeper |
| Letho of Gulet | Base game | hero | melee | 10 | Hero | Velen；Gwent Quest；Gwent: Velen Players, Oreton, Boatwright |
| Menno Coehoorn | Base game | hero | melee | 10 | Medic, Hero | Velen；Gwent Quest；Gwent: Playing Innkeeps, Inn at the Crossroads, Innkeeper |
| Morteisen | Base game | unit | melee | 3 | - | Velen；Buy from Trader；Midcopse, Shopkeeper |
| Morvran Voorhis | Base game | hero | siege | 10 | Hero | Novigrad；Gwent Quest；Gwent: Big City Players, Passiflora, Marquise Serenity |
| Nausicaa Cavalry Rider (1 of 3) | Base game | unit | melee | 2 | Tight Bond | Velen；Buy from Trader；Crow's Perch, Quartermaster's Baron's Store |
| Nausicaa Cavalry Rider (2 of 3) | Base game | unit | melee | 2 | Tight Bond | Velen；Buy from Trader；Inn at the Crossroads, Innkeeper |
| Nausicaa Cavalry Rider (3 of 3) | Base game | unit | melee | 2 | Tight Bond | Velen；Buy from Trader；Crow's Perch, Trader |
| Puttkammer | Base game | unit | ranged | 3 | - | Velen；Buy from Trader；Claywich Village, Trader (first rescue at persons in distress marker on the large island to the east of Oreton) |
| Rainfarn | Base game | unit | melee | 4 | - | Velen；Buy from Trader；Lindenvale, Merchant |
| Renuald aep Matsen | Base game | unit | ranged | 5 | - | Random；Win from NPC；Randomly earned |
| Rotten Mangonel | Base game | unit | siege | 3 | - | Random；Win from NPC；Randomly earned |
| Shilard Fitz-Oesterlen | Base game | unit | melee | 7 | Spy | Random；Win from NPC；Randomly earned |
| Siege Engineer | Base game | unit | siege | 6 | - | Velen；Buy from Trader；Inn at the Crossroads, Innkeeper |
| Siege Technician | Base game | unit | siege | 0 | Medic | Novigrad；Buy from Trader；Golden Sturgeon, Innkeeper |
| Stefan Skellen | Base game | unit | melee | 9 | Spy | Random；Win from NPC；Randomly earned |
| Sweers | Base game | unit | ranged | 2 | - | Velen；Buy from Trader；Claywich Village, Trader (first rescue at persons in distress marker on the large island to the east of Oreton) |
| Tibor Eggebracht | Base game | hero | ranged | 10 | Hero | Novigrad；Gwent Quest OR Loot；Gwent: Playing Innkeeps, Kingfisher Inn, Olivier OR Kingfisher Inn, room next to the bar (has objective) |
| Vanhemar | Base game | unit | ranged | 4 | - | Random；Win from NPC；Randomly earned |
| Vattier de Rideaux | Base game | unit | melee | 4 | Spy | Random；Win from NPC；Randomly earned |
| Vreemde | Base game | unit | melee | 2 | - | Random；Win from NPC；Randomly earned |
| Young Emissary (1 of 2) | Base game | unit | melee | 5 | Tight Bond | Novigrad (Grassy Knoll)；Buy from Trader；Cunny of the Goose, Innkeeper |
| Young Emissary (2 of 2) | Base game | unit | melee | 5 | Tight Bond | Novigrad (Gustfields)；Buy from Trader；Seven Cats Inn, Innkeeper |
| Zerrikanian Fire Scorpion | Base game | unit | siege | 5 | - | Velen；Buy from Trader；Crow's Perch, Trader |
| Emhyr var Emreis: Invader of the North | Hearts of Stone | leader | - |  | Abilities that restore a unit to the battlefield restore a randomly-chosen unit. Affects both players. | Novigrad (Gustfields)；Buy from Trader；Circus Camp near Carsten, Merchant |

### Scoia'tael（43 张副本）
| 卡牌 | 扩展 | 类型 | 行 | 战力 | 能力 | 获取 |
|---|---|---|---|---:|---|---|
| Barclay Els | Base game | unit | melee/ranged | 6 | Agile | Novigrad；Buy from Trader；Golden Sturgeon, Innkeeper |
| Ciaran aep Easnillien | Base game | unit | melee/ranged | 3 | Agile | Random；Win from NPC；Randomly earned |
| Dennis Cranmer | Base game | unit | melee | 6 | - | Random；Win from NPC；Randomly earned |
| Dol Blathanna Archer | Base game | unit | ranged | 4 | - | Novigrad；Buy from Trader；Passiflora, Marquise Serenity |
| Dol Blathanna Scout (1 of 3) | Base game | unit | melee/ranged | 6 | Agile | Random；Win from NPC；Randomly earned |
| Dol Blathanna Scout (2 of 3) | Base game | unit | melee/ranged | 6 | Agile | Random；Win from NPC；Randomly earned |
| Dol Blathanna Scout (3 of 3) | Base game | unit | melee/ranged | 6 | Agile | Novigrad；Buy from Trader；Golden Sturgeon, Innkeeper |
| Dwarven Skirmisher (1 of 3) | Base game | unit | melee | 3 | Muster | Random；Win from NPC；Randomly earned |
| Dwarven Skirmisher (2 of 3) | Base game | unit | melee | 3 | Muster | Random；Win from NPC；Randomly earned |
| Dwarven Skirmisher (3 of 3) | Base game | unit | melee | 3 | Muster | Novigrad (Oxenfurt)；Buy from Trader；Oxenfurt, The Alchemy Inn, Stjepan OR Randomly earned |
| Eithné | Base game | hero | ranged | 10 | Hero | Novigrad；Gwent Quest；Gwent: Old Pals, Rosemary and Thyme, Zoltan |
| Elven Skirmisher (1 of 3) | Base game | unit | ranged | 2 | Muster | Skellige；Buy from Trader；An Skellig, Urialla Village, Innkeeper |
| Elven Skirmisher (2 of 3) | Base game | unit | ranged | 2 | Muster | Random；Win from NPC；Randomly earned |
| Elven Skirmisher (3 of 3) | Base game | unit | ranged | 2 | Muster | Random；Win from NPC；Randomly earned |
| Filavandrel aen Fidhail | Base game | unit | melee/ranged | 6 | Agile | Random；Win from NPC；Randomly earned |
| Francesca Findabair: Daisy of the Valley | Base game | leader | - |  | Draw an extra card at the beginning of the battle. | Novigrad (Grassy Knoll)；Buy from Trader；Cunny of the Goose, Innkeeper |
| Francesca Findabair: Pureblood Elf | Base game | leader | - |  | Pick a Biting Frost card from your deck and play it instantly. | Base Deck；Base Deck；Included at start of game |
| Francesca Findabair: Queen of Dol Blathanna | Base game | leader | - |  | Destroy your enemy's Close Combat unit(s) if the combined strength of all his or her Close Combat units is 10 or more. | Novigrad；Secondary Quest；High Stakes, Passiflora, Finneas |
| Francesca Findabair: The Beautiful | Base game | leader | - |  | Commander's Horn | Novigrad；Gwent Quest；Gwent: Big City Players, reward for completing the quest |
| Havekar Healer (1 of 3) | Base game | unit | ranged | 0 | Medic | Random；Win from NPC；Randomly earned |
| Havekar Healer (2 of 3) | Base game | unit | ranged | 0 | Medic | Novigrad (Grassy Knoll)；Buy from Trader；Cunny of the Goose, Innkeeper |
| Havekar Healer (3 of 3) | Base game | unit | ranged | 0 | Medic | Novigrad；Buy from Trader；Kingfisher Inn, Olivier OR Innkeep |
| Havekar Smuggler (1 of 3) | Base game | unit | melee | 5 | Muster | Novigrad (Gustfields)；Buy from Trader；Seven Cats Inn, Innkeeper |
| Havekar Smuggler (2 of 3) | Base game | unit | melee | 5 | Muster | Random；Win from NPC；Randomly earned |
| Havekar Smuggler (3 of 3) | Base game | unit | melee | 5 | Muster | Novigrad；Buy from Trader；Kingfisher Inn, Olivier OR Innkeep |
| Ida Emean aep Sivney | Base game | unit | ranged | 6 | - | Random；Win from NPC；Randomly earned |
| Iorveth | Base game | hero | ranged | 10 | Hero | Skellige；Secondary Quest；Shock Therapy, Ard Skellig, Gedyneith |
| Isengrim Faoiltiarna | Base game | hero | melee | 10 | Morale Boost, Hero | Novigrad；Secondary Quest OR Loot；A Dangerous Game, Zed's home OR Prison Warden body during The Great Escape |
| Mahakaman Defender (1 of 5) | Base game | unit | melee | 5 | Muster | Novigrad；Buy from Trader；Kingfisher Inn, Olivier OR Innkeep |
| Mahakaman Defender (2 of 5) | Base game | unit | melee | 5 | Muster | Novigrad；Buy from Trader；Golden Sturgeon, Innkeeper |
| Mahakaman Defender (3 of 5) | Base game | unit | melee | 5 | Muster | Novigrad (Gustfields)；Buy from Trader；Seven Cats Inn, Innkeeper |
| Mahakaman Defender (4 of 5) | Base game | unit | melee | 5 | Muster | Novigrad (Oxenfurt)；Buy from Trader；Oxenfurt, The Alchemy Inn, Stjepan |
| Mahakaman Defender (5 of 5) | Base game | unit | melee | 5 | Muster | Novigrad；Buy from Trader；Passiflora, Marquise Serenity |
| Milva | Base game | unit | ranged | 10 | Morale Boost | Novigrad (Gustfields)；Secondary Quest；A Matter of Life and Death, Vegelbud Estate, Vladimir de Cret (first round) |
| Riordain | Base game | unit | ranged | 1 | - | Random；Win from NPC；Randomly earned |
| Saesenthessis | Base game | hero | ranged | 10 | Hero | Novigrad (Gustfields)；Gwent Quest OR Loot；Gwent: Old Pals, Temerian Resistance Camp, Vernon Roche OR box located at Roche's hideout (has objective) |
| Toruviel | Base game | unit | ranged | 2 | - | Random；Win from NPC；Randomly earned |
| Vrihedd Brigade Recruit | Base game | unit | ranged | 4 | - | Random；Win from NPC；Randomly earned |
| Vrihedd Brigade Veteran (1 of 2) | Base game | unit | melee/ranged | 5 | Agile | Novigrad (Oxenfurt)；Buy from Trader；Oxenfurt, The Alchemy Inn, Stjepan |
| Vrihedd Brigade Veteran (2 of 2) | Base game | unit | melee/ranged | 5 | Agile | Novigrad；Buy from Trader；Kingfisher Inn, Olivier OR Innkeep |
| Yaevinn | Base game | unit | melee/ranged | 6 | Agile | Skellige；Gwent Quest；Gwent: Skellige Style, Ard Skellig, Kaer Trolde Harbor, Sjusta the Tailor |
| Francesca Findabair: Hope of the Aen Seidhe | Hearts of Stone | leader | - |  | Agile | Novigrad (Brunwich)；Buy from Trader；Upper Mill, Dulla kh'Amanni |
| Schirrú | Hearts of Stone | unit | siege | 8 | Scorch | Novigrad (Gustfields)；Win from NPC；Circus Camp near Carsten, Merchant |

### Monsters（46 张副本）
| 卡牌 | 扩展 | 类型 | 行 | 战力 | 能力 | 获取 |
|---|---|---|---|---:|---|---|
| Arachas (1 of 3) | Base game | unit | melee | 4 | Muster | Skellige；Buy from Trader；Ard Skellig, Arinbjorn, Innkeeper |
| Arachas (2 of 3) | Base game | unit | melee | 4 | Muster | Skellige；Buy from Trader；An Skellig, Urialla Village, Innkeeper |
| Arachas (3 of 3) | Base game | unit | melee | 4 | Muster | Skellige；Buy from Trader；Spikeroog, Svorlag, Innkeeper |
| Arachas Behemoth | Base game | unit | siege | 6 | Muster | Random；Win from NPC；Randomly earned |
| Botchling | Base game | unit | melee | 4 | - | Skellige；Buy from Trader；Ard Skellig, Kaer Trolde Harbor, New Port Inn, Innkeeper |
| Celaeno Harpy | Base game | unit | melee/ranged | 2 | Agile | Random；Win from NPC；Randomly earned |
| Cockatrice | Base game | unit | ranged | 2 | - | Random；Win from NPC；Randomly earned |
| Crone: Brewess | Base game | unit | melee | 6 | Muster | Random；Win from NPC；Randomly earned |
| Crone: Weavess | Base game | unit | melee | 6 | Muster | Velen；Gwent Quest；Gwent: Velen Players, Benek, Old Sage |
| Crone: Whispess | Base game | unit | melee | 6 | Muster | Skellige；Buy from Trader；Ard Skellig, Arinbjorn, Innkeeper |
| Draug | Base game | hero | melee | 10 | Hero | Skellige；Gwent Quest；Gwent: Skellige Style, Ard Skellig, Kaer Trolde, Crach an Craite OR automatically received (if not played before On Thin Ice starts) |
| Earth Elemental | Base game | unit | siege | 6 | - | Skellige；Buy from Trader；Ard Skellig, Kaer Trolde Harbor, New Port Inn, Innkeeper |
| Endrega | Base game | unit | ranged | 2 | - | Random；Win from NPC；Randomly earned |
| Eredin: Bringer of Death | Base game | leader | - |  | Restore a card from your discard pile to your hand. | Novigrad；Secondary Quest；High Stakes, Passiflora, Count Tybalt |
| Eredin: Commander of the Red Riders | Base game | leader | - |  | Commander's Horn | Base Deck；Buy from Trader；Ard Skellig, Kaer Trolde Harbor, New Port Inn, Innkeeper OR Included at start of game |
| Eredin: Destroyer of Worlds | Base game | leader | - |  | Discard 2 cards and draw 1 card of your choice from your deck. | Velen；Secondary Quest；Gwent: Velen Players, reward for completing the quest |
| Eredin: King of the Wild Hunt | Base game | leader | - |  | Pick any weather card from your deck and play it instantly. | Skellige；Base Deck；Included at start of game OR Kaer Trolde Harbor, New Port Inn, Innkeeper |
| Fiend | Base game | unit | melee | 6 | - | Skellige；Buy from Trader；Ard Skellig, Arinbjorn, Innkeeper |
| Fire Elemental | Base game | unit | siege | 6 | - | Random；Win from NPC；Randomly earned |
| Foglet | Base game | unit | melee | 2 | - | Skellige；Buy from Trader；Spikeroog, Svorlag, Innkeeper |
| Forktail | Base game | unit | melee | 5 | - | Random；Win from NPC；Randomly earned |
| Frightener | Base game | unit | melee | 5 | - | Random；Win from NPC；Randomly earned |
| Gargoyle | Base game | unit | ranged | 2 | - | Random；Win from NPC；Randomly earned |
| Ghoul (1 of 3) | Base game | unit | melee | 1 | Muster | Skellige；Buy from Trader；Faroe, Harviken tavern, Innkeeper |
| Ghoul (2 of 3) | Base game | unit | melee | 1 | Muster | Random；Win from NPC；Randomly earned |
| Ghoul (3 of 3) | Base game | unit | melee | 1 | Muster | Random；Win from NPC；Randomly earned |
| Grave Hag | Base game | unit | ranged | 5 | - | Random；Win from NPC；Randomly earned |
| Griffin | Base game | unit | melee | 5 | - | Random；Win from NPC；Randomly earned |
| Harpy | Base game | unit | melee/ranged | 2 | Agile | Skellige；Buy from Trader；Faroe, Harviken tavern, Innkeeper |
| Ice Giant | Base game | unit | siege | 5 | - | Skellige；Buy from Trader；Spikeroog, Svorlag, Innkeeper |
| Imlerith | Base game | hero | melee | 10 | Hero | Random；Win from NPC；Randomly earned |
| Kayran | Base game | hero | melee/ranged | 8 | Morale Boost, Agile, Hero | Random；Win from NPC；Randomly earned |
| Leshen | Base game | hero | ranged | 10 | Hero | Skellige；Gwent Quest；Gwent: Skellige Style, Ard Skellig, Gedyneith, Ermion |
| Nekker (1 of 3) | Base game | unit | melee | 2 | Muster | Skellige；Secondary Quest；Following the Thread, Faroe, Trottheim, loot Hammonds corpse |
| Nekker (2 of 3) | Base game | unit | melee | 2 | Muster | Skellige；Buy from Trader；Faroe, Harviken tavern, Innkeeper |
| Nekker (3 of 3) | Base game | unit | melee | 2 | Muster | Random；Win from NPC；Randomly earned |
| Plague Maiden | Base game | unit | melee | 5 | - | Random；Win from NPC；Randomly earned |
| Vampire: Bruxa | Base game | unit | melee | 4 | Muster | Novigrad (Gustfields)；Secondary Quest；A Matter of Life and Death, Vegelbud Estate, Gomo Seeling (second round) |
| Vampire: Ekimmara | Base game | unit | melee | 4 | Muster | Skellige；Buy from Trader；Spikeroog, Svorlag, Innkeeper |
| Vampire: Fleder | Base game | unit | melee | 4 | Muster | Skellige；Buy from Trader；Faroe, Harviken tavern, Innkeeper |
| Vampire: Garkain | Base game | unit | melee | 4 | Muster | Random；Win from NPC；Randomly earned |
| Vampire: Katakan | Base game | unit | melee | 5 | Muster | Skellige；Gwent Quest OR Loot；Gwent: Skellige Style, Ard Skellig, Kaer Muire, Jarl Madman Lugos OR search Lugos' room (has objective) |
| Werewolf | Base game | unit | melee | 5 | - | Skellige；Buy from Trader；An Skellig, Urialla Village, Innkeeper |
| Wyvern | Base game | unit | ranged | 2 | - | Random；Win from NPC；Randomly earned |
| Eredin Bréacc Glas: The Treacherous | Hearts of Stone | leader | - |  | Doubles strength of all spies. | Novigrad (Brunwich)；Buy from Trader；Upper Mill, Dulla kh'Amanni |
| Toad | Hearts of Stone | unit | ranged | 7 | Scorch | Novigrad (Oxenfurt)；Win from NPC；Olgierd von Everec OR on the table in The Alchemy inn |

### Skellige（40 张副本）
| 卡牌 | 扩展 | 类型 | 行 | 战力 | 能力 | 获取 |
|---|---|---|---|---:|---|---|
| Berserker | Blood and Wine | unit | melee | 4 | Berserker | Toussaint；Base Deck；Received from Count Monnier |
| Birna Bran | Blood and Wine | unit | melee | 2 | Medic | Toussaint；Base Deck；Received from Count Monnier |
| Blueboy Lugos | Blood and Wine | unit | melee | 6 | - | Toussaint；Base Deck；Received from Count Monnier |
| Clan Heymaey Skald | Blood and Wine | unit | melee | 4 | - | Toussaint；Base Deck；Received from Count Monnier |
| Clan Tordarroch Armorsmith | Blood and Wine | unit | melee | 4 | - | Toussaint；Base Deck；Received from Count Monnier |
| Clan an Craite Warrior (1 of 3) | Blood and Wine | unit | melee | 6 | Tight Bond | Toussaint；Base Deck；Received from Count Monnier |
| Clan an Craite Warrior (2 of 3) | Blood and Wine | unit | melee | 6 | Tight Bond | Toussaint；Base Deck；Received from Count Monnier |
| Clan an Craite Warrior (3 of 3) | Blood and Wine | unit | melee | 6 | Tight Bond | Toussaint；Base Deck；Received from Count Monnier |
| Crach an Craite | Blood and Wine | leader | - |  | Shuffle all cards from each player's graveyard back into their decks. | Toussaint；Base Deck；Received from Count Monnier |
| Donar an Hindar | Blood and Wine | unit | melee | 4 | - | Toussaint；Base Deck；Received from Count Monnier |
| Hjalmar | Blood and Wine | hero | ranged | 10 | Hero | Toussaint；Base Deck；Received from Count Monnier |
| Holger Blackhand | Blood and Wine | unit | siege | 4 | - | Toussaint；Base Deck；Received from Count Monnier |
| Madman Lugos | Blood and Wine | unit | melee | 6 | - | Toussaint；Base Deck；Received from Count Monnier |
| Svanrige | Blood and Wine | unit | melee | 4 | - | Toussaint；Base Deck；Received from Count Monnier |
| Udalryk | Blood and Wine | unit | melee | 4 | - | Toussaint；Base Deck；Received from Count Monnier |
| Clan Brokvar Archer (1 of 3) | Blood and Wine | unit | ranged | 6 | - | Toussaint；Base Deck；Received from Count Monnier |
| Clan Brokvar Archer (2 of 3) | Blood and Wine | unit | ranged | 6 | - | Toussaint；Base Deck；Received from Count Monnier |
| Clan Brokvar Archer (3 of 3) | Blood and Wine | unit | ranged | 6 | - | Toussaint；Win from NPC；Castel Ravello Vineyard, Herbalist |
| Clan Drummond Shield Maiden (1 of 3) | Blood and Wine | unit | melee | 4 | Tight Bond | Toussaint；Base Deck；Received from Count Monnier |
| Clan Drummond Shield Maiden (2 of 3) | Blood and Wine | unit | melee | 4 | Tight Bond | Toussaint；Win from NPC；The Cockatrice Inn, Innkeep |
| Clan Drummond Shield Maiden (3 of 3) | Blood and Wine | unit | melee | 4 | Tight Bond | Toussaint；Win from NPC；Francollarts, Armorer |
| Light Longship (1 of 3) | Blood and Wine | unit | ranged | 4 | Muster | Toussaint；Base Deck；Received from Count Monnier |
| Light Longship (2 of 3) | Blood and Wine | unit | ranged | 4 | Muster | Toussaint；Base Deck；Received from Count Monnier |
| Light Longship (3 of 3) | Blood and Wine | unit | ranged | 4 | Muster | Toussaint；Win from NPC；Beauclair, Hauteville, Perfumery, Merchant |
| Mardroeme (1 of 3) | Blood and Wine | special | - |  | Berserker | Toussaint；Base Deck；Received from Count Monnier |
| Mardroeme (2 of 3) | Blood and Wine | special | - |  | Berserker | Toussaint；Win from NPC；Beauclair Port, The Belles of Beauclair, Madame Isabelle |
| Mardroeme (3 of 3) | Blood and Wine | special | - |  | Berserker | Toussaint；Win from NPC；Beauclair, Hauteville, Herb Store, Herbalist |
| War Longship (1 of 3) | Blood and Wine | unit | siege | 6 | Tight Bond | Toussaint；Base Deck；Received from Count Monnier |
| War Longship (2 of 3) | Blood and Wine | unit | siege | 6 | Tight Bond | Toussaint；Base Deck；Received from Count Monnier |
| War Longship (3 of 3) | Blood and Wine | unit | siege | 6 | Tight Bond | Toussaint；Win from NPC；Tourney Grounds, Innkeep |
| Young Berserker (1 of 3) | Blood and Wine | unit | ranged | 2 | Berserker | Toussaint；Base Deck；Received from Count Monnier |
| Young Berserker (2 of 3) | Blood and Wine | unit | ranged | 2 | Berserker | Toussaint；Win from NPC；Tourney Grounds, Blacksmith |
| Young Berserker (3 of 3) | Blood and Wine | unit | ranged | 2 | Berserker | Toussaint；Win from NPC；Beauclair, Tailor's Workshop, Pierre |
| Cerys | Blood and Wine | hero | melee | 10 | Summon Shield Maidens, Hero | Toussaint；Win From NPC；The Barrel and Bung Inn, Innkeep |
| Clan Dimun Pirate | Blood and Wine | unit | ranged | 6 | Scorch | Toussaint；Win From NPC；Beauclair, Hauteville, Dupont & Sons, Merchant |
| Draig Bon-Dhu | Blood and Wine | unit | siege | 2 | Commander's Horn | Toussaint；Win From NPC；The Pheasantry, Innkeep |
| Ermion | Blood and Wine | hero | ranged | 8 | Mardroeme, Hero | Toussaint；Win From NPC；Francollarts, Innkeep |
| Kambi | Blood and Wine | unit | melee | 0 | Summon Avenger | Toussaint；Win From NPC；Francollarts, Innkeep |
| King Bran | Blood and Wine | leader | - |  | Units only lose half their strength in bad weather conditions. | Toussaint；Win From NPC；Beauclair, Ducal Camerlengo |
| Olaf | Blood and Wine | unit | melee/ranged | 12 | Morale Boost, Agile | Toussaint；Win From NPC；Beauclair, The Adder and Jewels Winery, Sommelier |

### Neutral（40 张副本）
| 卡牌 | 扩展 | 类型 | 行 | 战力 | 能力 | 获取 |
|---|---|---|---|---:|---|---|
| Biting Frost (1 of 3) | Base game | weather | - |  | - | Base Deck；Base Deck；Included at start of game |
| Biting Frost (2 of 3) | Base game | weather | - |  | - | Base Deck；Base Deck；Included at start of game |
| Biting Frost (3 of 3) | Base game | weather | - |  | - | Random；Win from NPC；Randomly earned |
| Cirilla Fiona Elen Riannon | Base game | hero | melee | 15 | Hero | Novigrad (Grassy Knoll)；Gwent Quest；Gwent: Big City Players, Novigrad Forest Camp, Scoia'Tael merchant |
| Clear Weather (1 of 3) | Base game | weather | - |  | - | Base Deck；Base Deck；Included at start of game |
| Clear Weather (2 of 3) | Base game | weather | - |  | - | Random；Win from NPC；Included at start of game OR Randomly earned |
| Clear Weather (3 of 3) | Base game | weather | - |  | - | Random；Win from NPC；Included at start of game OR Randomly earned |
| Commander's Horn (1 of 3) | Base game | special | - |  | Commander's Horn | Velen；Buy from Trader；Inn at the Crossroads, Innkeeper (can appear a 2nd time after inventory refresh) |
| Commander's Horn (2 of 3) | Base game | special | - |  | Commander's Horn | Novigrad；Buy from Trader；Passiflora, Marquise Serenity (note: card could be missing) |
| Commander's Horn (3 of 3) | Base game | special | - |  | Commander's Horn | Novigrad (Oxenfurt)；Buy from Trader；Oxenfurt, The Alchemy Inn, Stjepan |
| Dandelion | Base game | unit | melee | 2 | Commander's Horn | Novigrad (Gustfields)；Secondary Quest；A Matter of Life and Death, Vegelbud Estate, Marius Florin (final round) |
| Decoy (1 of 3) | Base game | special | - |  | - | White Orchard；Buy from Trader；White Orchard Tavern, Innkeeperess (or Trader outside after prologue) |
| Decoy (2 of 3) | Base game | special | - |  | - | Velen；Buy from Trader；Crow's Perch, Quartermaster's Baron's Store (can appear a 2nd time after inventory refresh) |
| Decoy (3 of 3) | Base game | special | - |  | - | Novigrad (Gustfields)；Buy from Trader；Seven Cats Inn, Innkeeper (note: card could be missing) |
| Emiel Regis Rohellec Terzieff | Base game | unit | melee | 5 | - | Random；Win from NPC；Randomly earned |
| Geralt of Rivia | Base game | hero | melee | 15 | Hero | Novigrad；Gwent Quest OR Loot；Gwent: Old Pals OR Gwent: Play Thaler, The Seven Cats Inn, Thaler OR Seven Cats Inn, top of a crate at the end of the side dining hall (no objective, use witcher senses) |
| Impenetrable Fog (1 of 3) | Base game | weather | - |  | - | Base Deck；Base Deck；Included at start of game |
| Impenetrable Fog (2 of 3) | Base game | weather | - |  | - | Base Deck；Base Deck；Included at start of game |
| Impenetrable Fog (3 of 3) | Base game | weather | - |  | - | Random；Win from NPC；Randomly earned |
| Mysterious Elf | Base game | hero | melee | 0 | Spy, Hero | Skellige；Gwent Quest；Gwent: Skellige Style, Ard Skellig, Gedyneith, Gremist |
| Scorch (1 of 3) | Base game | special | - |  | - | Novigrad (Grassy Knoll)；Buy from Trader；Cunny of the Goose, Innkeeper |
| Scorch (2 of 3) | Base game | special | - |  | - | Skellige；Buy from Trader；Ard Skellig, Kaer Trolde Harbor, New Port Inn, Innkeeper (can appear a 2nd time after inventory refresh) |
| Scorch (3 of 3) | Base game | special | - |  | - | Skellige；Buy from Trader；An Skellig, Urialla Village, Innkeeper (note: card could be missing) |
| Torrential Rain (1 of 3) | Base game | weather | - |  | - | Base Deck；Base Deck；Included at start of game |
| Torrential Rain (2 of 3) | Base game | weather | - |  | - | Random；Win from NPC；Included at start of game OR Randomly earned |
| Torrential Rain (3 of 3) | Base game | weather | - |  | - | Random；Win from NPC；Included at start of game OR Randomly earned |
| Triss Merigold | Base game | hero | melee | 7 | Hero | Novigrad；Gwent Quest OR Loot；Gwent: Old Pals, The Nowhere Inn OR at Kaer Morhen, Lambert OR find at Kaer Morhen (has objective) |
| Vesemir | Base game | unit | melee | 6 | - | Novigrad；Gwent Quest；Gwent: Big City Players, Hierarch Square, Bank of Vivaldi, Vimme Vivaldi |
| Villentretenmerth | Base game | unit | melee | 7 | Scorch | Random；Win from NPC；Randomly earned |
| Yennefer of Vengerberg | Base game | hero | ranged | 7 | Medic, Hero | Novigrad (Oxenfurt)；Gwent Quest；Gwent: Playing Innkeeps, Oxenfurt, The Alchemy Inn, Stjepan |
| Zoltan Chivay | Base game | unit | melee | 5 | - | White Orchard；Win from Gwent Teacher；White Orchard Tavern, Aldert Geert OR found under the Hanged Man's Tree after prologue |
| Cow | Hearts of Stone | unit | ranged | 0 | Summon Bovine Defense Force | Novigrad (Brunwich)；Loot；Brunwich, Barn, Top floor |
| Gaunter O'Dimm: Darkness (1 of 3) | Hearts of Stone | unit | ranged | 4 | Muster | Novigrad (Brunwich)；Buy from Trader；Upper Mill, Dulla kh'Amanni |
| Gaunter O'Dimm: Darkness (2 of 3) | Hearts of Stone | unit | ranged | 4 | Muster | Novigrad (Gustfields)；Buy from Trader；Circus Camp near Carsten, Merchant |
| Gaunter O'Dimm: Darkness (3 of 3) | Hearts of Stone | unit | ranged | 4 | Muster | Novigrad (Gustfields)；Buy from Trader；Circus Camp near Carsten, Merchant |
| Gaunter O'Dimm | Hearts of Stone | unit | siege | 2 | Muster | Novigrad (Oxenfurt)；Win from NPC；Open Sesame!, Borsodi Brothers' Auction House, Robert Hilbert |
| Olgierd von Everec | Hearts of Stone | hero | melee/ranged | 6 | Morale Boost, Agile, Hero | Novigrad (Oxenfurt)；Win from NPC OR Loot；Shani OR second floor of Shani's Clinic in Oxenfurt |
| Skellige Storm (1 of 3) | Blood and Wine | weather | ranged/siege |  | - | Toussaint；Win From NPC；Tourney Grounds, Armorer |
| Skellige Storm (2 of 3) | Blood and Wine | weather | ranged/siege |  | - | Toussaint；Win From NPC；Tourney Grounds, Barber |
| Skellige Storm (3 of 3) | Blood and Wine | weather | ranged/siege |  | - | Toussaint；Win From NPC；Beauclair Port, Butcher |
