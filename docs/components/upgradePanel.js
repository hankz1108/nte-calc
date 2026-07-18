window.NTE = window.NTE || {};
window.NTE.components = window.NTE.components || {};

// 千分位格式化（root app 與元件共用）
window.NTE.fmt = (n) => Number(n || 0).toLocaleString('en-US');

/*
 * UpgradePanel：角色 / 弧盤共用的「升級組別」面板。
 *  - panel：index.html 中 makeUpgradeModule() 產生的模組
 *    （groups / results / addGroup / removeGroup / clampGroup）。
 *  - fields：每組結果要顯示的欄位 [{ key, label, cls }]，cls 為文字顏色 class（選填）。
 */
window.NTE.components.UpgradePanel = {
  props: {
    panel: { type: Object, required: true },
    fields: { type: Array, required: true },
    countLabel: { type: String, default: '數量' },
    emptyText: { type: String, default: '尚未新增組別，點下方按鈕新增。' },
    addLabel: { type: String, default: '＋ 新增組別' },
    minLevel: { type: Number, required: true },
    maxLevel: { type: Number, required: true },
  },
  methods: {
    fmt: window.NTE.fmt,
  },
  template: /* html */ `
    <section>
      <div v-if="panel.groups.length === 0" class="card bg-base-100 shadow-sm">
        <div class="card-body p-4 sm:p-5 text-sm text-base-content/50 text-center">
          {{ emptyText }}
        </div>
      </div>
      <div class="space-y-4">
        <div v-for="(g, idx) in panel.groups" :key="g.id" class="card bg-base-100 shadow-sm">
          <div class="card-body p-4 sm:p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-base">第 {{ idx + 1 }} 組</h3>
              <button
                class="btn btn-ghost btn-sm text-error"
                @click="panel.removeGroup(idx)"
                title="刪除此組">
                ✕ 刪除
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <!-- 輸入區 -->
              <div class="lg:col-span-5 grid grid-cols-3 gap-2">
                <label class="form-control w-full min-w-0">
                  <div class="label py-1"><span class="label-text text-xs">現有等級</span></div>
                  <input type="number" class="input input-bordered input-md sm:input-sm w-full text-base"
                    :min="minLevel" :max="maxLevel" step="1"
                    v-model.number="g.current" @change="panel.clampGroup(g)" />
                </label>
                <label class="form-control w-full min-w-0">
                  <div class="label py-1"><span class="label-text text-xs">目標等級</span></div>
                  <input type="number" class="input input-bordered input-md sm:input-sm w-full text-base"
                    :min="minLevel" :max="maxLevel" step="1"
                    v-model.number="g.target" @change="panel.clampGroup(g)" />
                </label>
                <label class="form-control w-full min-w-0">
                  <div class="label py-1"><span class="label-text text-xs">{{ countLabel }}</span></div>
                  <input type="number" class="input input-bordered input-md sm:input-sm w-full text-base"
                    min="1" step="1"
                    v-model.number="g.count" @change="panel.clampGroup(g)" />
                </label>
              </div>

              <!-- 該組結果 -->
              <div class="lg:col-span-7">
                <div v-if="panel.results[idx].valid" class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  <div v-for="f in fields" :key="f.key"
                    class="flex justify-between gap-1 bg-base-200 rounded px-2 py-1 min-w-0">
                    <span :class="f.cls || 'text-base-content/70'">{{ f.label }}</span>
                    <span class="font-semibold break-all text-right" :class="f.cls">{{ fmt(panel.results[idx][f.key]) }}</span>
                  </div>
                </div>
                <div v-else class="alert alert-warning py-2 text-xs">
                  目標等級需大於現有等級（{{ minLevel }}–{{ maxLevel }} 的整數）
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-outline mt-4 w-full sm:w-auto" @click="panel.addGroup()">
        {{ addLabel }}
      </button>
    </section>
  `,
};
