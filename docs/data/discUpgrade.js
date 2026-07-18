window.NTE = window.NTE || {};

/*
 * 弧盤（武器）升級素材資料與計算。
 *
 * DISC_LEVEL_DATA：以「等級」為 key。
 *  - exp：從上個等級升到「該等級」所需的經驗（單級增量）。
 *    某段升級所需經驗 = 逐級加總 exp（現有+1 ~ 目標）。例：1→3 = 120 + 170 = 290。
 *  - 突破素材（罐頭 / 殘渣材料 / 甲硬幣）掛在「抵達等級」上：
 *    因為「超過某等級」才消耗突破素材，例如 20→21（抵達 21）才付「20 級突破」。
 *    故突破素材分別掛在 21 / 31 / 41 / 51 / 61 / 71。
 *  - 罐頭與殘渣材料皆分綠 / 藍 / 紫三種等級，分別記為 罐頭綠/罐頭藍/罐頭紫、
 *    殘渣綠/殘渣藍/殘渣紫，需分開計算與顯示。
 *  - 殘渣三色欄位名稱刻意沿用角色版（charUpgrade.js）的 殘渣綠/殘渣藍/殘渣紫，
 *    合併總計時才能與角色的殘渣相加。
 */
window.NTE.DISC_LEVEL_DATA = {
  1:  { exp: 0 },
  2:  { exp: 120 },
  3:  { exp: 170 },
  4:  { exp: 240 },
  5:  { exp: 330 },
  6:  { exp: 450 },
  7:  { exp: 610 },
  8:  { exp: 790 },
  9:  { exp: 1020 },
  10: { exp: 1280 },
  11: { exp: 1600 },
  12: { exp: 1920 },
  13: { exp: 2300 },
  14: { exp: 2640 },
  15: { exp: 3040 },
  16: { exp: 3500 },
  17: { exp: 3920 },
  18: { exp: 4390 },
  19: { exp: 4910 },
  20: { exp: 5500 },
  21: { exp: 6160,  罐頭綠: 4,  殘渣綠: 4,  甲硬幣: 20000 },   // 超過 20 級突破
  22: { exp: 6780 },
  23: { exp: 7460 },
  24: { exp: 8200 },
  25: { exp: 9020 },
  26: { exp: 9930 },
  27: { exp: 10720 },
  28: { exp: 11580 },
  29: { exp: 12510 },
  30: { exp: 13510 },
  31: { exp: 14590, 罐頭綠: 10, 殘渣綠: 10, 甲硬幣: 40000 },   // 超過 30 級突破
  32: { exp: 15610 },
  33: { exp: 16700 },
  34: { exp: 17870 },
  35: { exp: 19120 },
  36: { exp: 20460 },
  37: { exp: 21680 },
  38: { exp: 22980 },
  39: { exp: 24360 },
  40: { exp: 25830 },
  41: { exp: 27380, 罐頭藍: 6,  殘渣藍: 6,  甲硬幣: 60000 },   // 超過 40 級突破
  42: { exp: 28740 },
  43: { exp: 30180 },
  44: { exp: 31690 },
  45: { exp: 33270 },
  46: { exp: 34940 },
  47: { exp: 36680 },
  48: { exp: 38520 },
  49: { exp: 40440 },
  50: { exp: 42470 },
  51: { exp: 44590, 罐頭藍: 12, 殘渣藍: 12, 甲硬幣: 80000 },   // 超過 50 級突破
  52: { exp: 46820 },
  53: { exp: 49160 },
  54: { exp: 51610 },
  55: { exp: 54190 },
  56: { exp: 56900 },
  57: { exp: 59750 },
  58: { exp: 62740 },
  59: { exp: 65870 },
  60: { exp: 69170 },
  61: { exp: 72620, 罐頭紫: 6,  殘渣紫: 6,  甲硬幣: 100000 },  // 超過 60 級突破
  62: { exp: 76250 },
  63: { exp: 80070 },
  64: { exp: 84070 },
  65: { exp: 88280 },
  66: { exp: 92690 },
  67: { exp: 97320 },
  68: { exp: 102190 },
  69: { exp: 107300 },
  70: { exp: 112670 },
  71: { exp: 118300, 罐頭紫: 12, 殘渣紫: 12, 甲硬幣: 120000 }, // 超過 70 級突破
  72: { exp: 124220 },
  73: { exp: 130430 },
  74: { exp: 136950 },
  75: { exp: 143790 },
  76: { exp: 150980 },
  77: { exp: 158530 },
  78: { exp: 166460 },
  79: { exp: 174780 },
  80: { exp: 183520 },
};

// 染劑與等級上限相關常數（等級上下限沿用 charUpgrade.js 的 1 / 80）
window.NTE.EXP_PER_DYE = 10000;   // 一個染劑提供的經驗
window.NTE.COIN_PER_DYE = 3000;   // 使用一個染劑連帶消耗的甲硬幣

/*
 * calcOneDisc(current, target)：計算「單一弧盤」從 current 升到 target 所需素材。
 * 回傳欄位：
 *  exp           所需經驗（累計相減）
 *  dyes          染劑數（無條件進位整個）
 *  coinFromDyes  升級消耗甲硬幣（dyes × 3000）
 *  coinFromBreak 突破消耗甲硬幣
 *  coinTotal     甲硬幣總量
 *  罐頭綠 / 罐頭藍 / 罐頭紫
 *  殘渣綠 / 殘渣藍 / 殘渣紫
 */
window.NTE.calcOneDisc = function (current, target) {
  const { DISC_LEVEL_DATA, EXP_PER_DYE, COIN_PER_DYE } = window.NTE;

  const empty = {
    exp: 0, dyes: 0, coinFromDyes: 0, coinFromBreak: 0, coinTotal: 0,
    罐頭綠: 0, 罐頭藍: 0, 罐頭紫: 0, 殘渣綠: 0, 殘渣藍: 0, 殘渣紫: 0,
  };

  // 目標必須高於現有，否則不需任何素材
  if (!Number.isFinite(current) || !Number.isFinite(target) || target <= current) {
    return empty;
  }
  if (!DISC_LEVEL_DATA[current] || !DISC_LEVEL_DATA[target]) {
    return empty;
  }

  // 經驗：逐級加總（現有+1 ~ 目標）；同一迴圈累加「抵達」該級的突破素材
  let exp = 0;
  let 罐頭綠 = 0;
  let 罐頭藍 = 0;
  let 罐頭紫 = 0;
  let 殘渣綠 = 0;
  let 殘渣藍 = 0;
  let 殘渣紫 = 0;
  let coinFromBreak = 0;
  for (let lv = current + 1; lv <= target; lv++) {
    const d = DISC_LEVEL_DATA[lv];
    if (!d) continue;
    exp += d.exp || 0;
    罐頭綠 += d.罐頭綠 || 0;
    罐頭藍 += d.罐頭藍 || 0;
    罐頭紫 += d.罐頭紫 || 0;
    殘渣綠 += d.殘渣綠 || 0;
    殘渣藍 += d.殘渣藍 || 0;
    殘渣紫 += d.殘渣紫 || 0;
    coinFromBreak += d.甲硬幣 || 0;
  }

  const dyes = Math.ceil(exp / EXP_PER_DYE);
  const coinFromDyes = dyes * COIN_PER_DYE;

  return {
    exp,
    dyes,
    coinFromDyes,
    coinFromBreak,
    coinTotal: coinFromDyes + coinFromBreak,
    罐頭綠,
    罐頭藍,
    罐頭紫,
    殘渣綠,
    殘渣藍,
    殘渣紫,
  };
};
