window.NTE = window.NTE || {};

/*
 * LEVEL_DATA：以「等級」為 key。
 *  - exp：從上個等級升到「該等級」所需的經驗（單級增量）。
 *    某段升級所需經驗 = 逐級加總 exp（現有+1 ~ 目標）。例：1→3 = 300 + 450 = 750。
 *  - 突破素材（幻妄材料 / BOSS材料 / 甲硬幣）掛在「抵達等級」上：
 *    因為「超過某等級」才消耗突破素材，例如 20→21（抵達 21）才付「20 級突破」。
 *    故突破素材分別掛在 21 / 31 / 41 / 51 / 61 / 71。
 *  - 幻妄材料分成綠 / 藍 / 紫三種等級，分別記為 幻妄綠 / 幻妄藍 / 幻妄紫，需分開計算與顯示。
 */
window.NTE.LEVEL_DATA = {
  1:  { exp: 0 },
  2:  { exp: 300 },
  3:  { exp: 450 },
  4:  { exp: 630 },
  5:  { exp: 880 },
  6:  { exp: 1190 },
  7:  { exp: 1610 },
  8:  { exp: 2090 },
  9:  { exp: 2720 },
  10: { exp: 3400 },
  11: { exp: 4250 },
  12: { exp: 5100 },
  13: { exp: 6120 },
  14: { exp: 7040 },
  15: { exp: 8100 },
  16: { exp: 9320 },
  17: { exp: 10250 },
  18: { exp: 11280 },
  19: { exp: 12410 },
  20: { exp: 13650 },
  21: { exp: 15020, 幻妄綠: 5,  BOSS材料: 0,  甲硬幣: 25000 },   // 超過 20 級突破
  22: { exp: 16220 },
  23: { exp: 17520 },
  24: { exp: 18920 },
  25: { exp: 20430 },
  26: { exp: 22060 },
  27: { exp: 23380 },
  28: { exp: 24780 },
  29: { exp: 26270 },
  30: { exp: 27850 },
  31: { exp: 29520, 幻妄綠: 12, BOSS材料: 2,  甲硬幣: 50000 },   // 超過 30 級突破
  32: { exp: 31000 },
  33: { exp: 32550 },
  34: { exp: 34180 },
  35: { exp: 35890 },
  36: { exp: 37680 },
  37: { exp: 39560 },
  38: { exp: 41540 },
  39: { exp: 43620 },
  40: { exp: 45800 },
  41: { exp: 49090, 幻妄藍: 6,  BOSS材料: 8,  甲硬幣: 75000 },   // 超過 40 級突破
  42: { exp: 50490 },
  43: { exp: 53010 },
  44: { exp: 55660 },
  45: { exp: 58440 },
  46: { exp: 61360 },
  47: { exp: 64430 },
  48: { exp: 67650 },
  49: { exp: 71030 },
  50: { exp: 74580 },
  51: { exp: 78310, 幻妄藍: 12, BOSS材料: 16, 甲硬幣: 100000 },  // 超過 50 級突破
  52: { exp: 82230 },
  53: { exp: 86340 },
  54: { exp: 90660 },
  55: { exp: 95190 },
  56: { exp: 99950 },
  57: { exp: 104950 },
  58: { exp: 110200 },
  59: { exp: 115710 },
  60: { exp: 121500 },
  61: { exp: 127580, 幻妄紫: 6,  BOSS材料: 24, 甲硬幣: 125000 }, // 超過 60 級突破
  62: { exp: 133960 },
  63: { exp: 140660 },
  64: { exp: 147690 },
  65: { exp: 155070 },
  66: { exp: 162820 },
  67: { exp: 170960 },
  68: { exp: 179510 },
  69: { exp: 188490 },
  70: { exp: 197910 },
  71: { exp: 207810, 幻妄紫: 9,  BOSS材料: 36, 甲硬幣: 150000 }, // 超過 70 級突破
  72: { exp: 218200 },
  73: { exp: 229110 },
  74: { exp: 240570 },
  75: { exp: 252600 },
  76: { exp: 265230 },
  77: { exp: 278490 },
  78: { exp: 292410 },
  79: { exp: 307030 },
  80: { exp: 322380 },
};

// 攻略本與等級上限相關常數
window.NTE.EXP_PER_BOOK = 20000;   // 一本攻略本提供的經驗
window.NTE.COIN_PER_BOOK = 5000;   // 使用一本攻略本連帶消耗的甲硬幣
window.NTE.MIN_LEVEL = 1;
window.NTE.MAX_LEVEL = 80;

/*
 * calcOne(current, target)：計算「單一角色」從 current 升到 target 所需素材。
 * 回傳欄位：
 *  exp            所需經驗（累計相減）
 *  books          攻略本數（無條件進位整本）
 *  coinFromBooks  升級消耗甲硬幣（books × 5000）
 *  coinFromBreak  突破消耗甲硬幣
 *  coinTotal      甲硬幣總量
 *  幻妄綠 / 幻妄藍 / 幻妄紫 / BOSS材料
 */
window.NTE.calcOne = function (current, target) {
  const { LEVEL_DATA, EXP_PER_BOOK, COIN_PER_BOOK } = window.NTE;

  const empty = {
    exp: 0, books: 0, coinFromBooks: 0, coinFromBreak: 0,
    coinTotal: 0, 幻妄綠: 0, 幻妄藍: 0, 幻妄紫: 0, BOSS材料: 0,
  };

  // 目標必須高於現有，否則不需任何素材
  if (!Number.isFinite(current) || !Number.isFinite(target) || target <= current) {
    return empty;
  }
  if (!LEVEL_DATA[current] || !LEVEL_DATA[target]) {
    return empty;
  }

  // 經驗：逐級加總（現有+1 ~ 目標）；同一迴圈累加「抵達」該級的突破素材
  let exp = 0;
  let 幻妄綠 = 0;
  let 幻妄藍 = 0;
  let 幻妄紫 = 0;
  let BOSS材料 = 0;
  let coinFromBreak = 0;
  for (let lv = current + 1; lv <= target; lv++) {
    const d = LEVEL_DATA[lv];
    if (!d) continue;
    exp += d.exp || 0;
    幻妄綠 += d.幻妄綠 || 0;
    幻妄藍 += d.幻妄藍 || 0;
    幻妄紫 += d.幻妄紫 || 0;
    BOSS材料 += d.BOSS材料 || 0;
    coinFromBreak += d.甲硬幣 || 0;
  }

  const books = Math.ceil(exp / EXP_PER_BOOK);
  const coinFromBooks = books * COIN_PER_BOOK;

  return {
    exp,
    books,
    coinFromBooks,
    coinFromBreak,
    coinTotal: coinFromBooks + coinFromBreak,
    幻妄綠,
    幻妄藍,
    幻妄紫,
    BOSS材料,
  };
};
