<template>
  <div class="ai-panel">

    <div class="header">
      <div>
        <h1 class="title">Analyse IA des stocks</h1>
        <p class="subtitle">Prédiction de la demande et recommandations de réapprovisionnement</p>
      </div>
      <div class="last-analysis">
        <Bot :size="16" :color="TOKENS.teal" />
        <span class="muted-text">Dernière analyse</span>
        <!-- <span class="mono">09:45</span> -->
        <span class="mono">{{ lastAnalysis }}</span>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="stat-row">
      <StatCard :icon="Package" label="Produits analysés" :value="stats.total" :accent="TOKENS.teal" />
      <StatCard :icon="AlertTriangle" label="Produits à risque élevé" :value="stats.high" :accent="TOKENS.danger" />
      <StatCard :icon="TrendingUp" label="Demande moyenne prévue" :value="`+${stats.avgDemand}%`" :accent="TOKENS.gold" />
    </div>

    <div class="columns">
      <!-- Left column -->
      <div class="col-left">

        <!-- Recommendations -->
        <section style="padding: 0px;">
          <h2 class="section-title">RECOMMANDATIONS IA</h2>
          <div class="rec-list">
            <div class="rec-card" v-for="p in recommendations" :key="p.id">
              <div class="rec-left">
                <div class="dot" :style="{ background: RISK[p.risk].color }" />
                <div>
                  <div class="rec-title">
                    {{ p.name }} — demande {{ p.risk === 'high' ? 'élevée' : 'en croissance' }} (+{{ p.demand }}%)
                  </div>
                  <div class="rec-sub">
                    {{ p.restock > 0 ? `Commander ${p.restock} unités avant le ${p.deadline}.` : "Aucune action requise." }}
                  </div>
                </div>
              </div>
              <button v-if="p.restock > 0" class="btn" @click="selected = p">Réapprovisionner</button>
            </div>
          </div>
        </section>

        <!-- Demand table -->
        <section style="padding: 0px; margin-top: 0px;">
          <h2 class="section-title">PRÉDICTION DE LA DEMANDE</h2>
          <div class="table-card">
            <div class="table-head">
              <span>Produit</span><span>Stock actuel</span><span>Demande IA</span><span>Recommandation</span>
            </div>
            <!-- <div
              v-for="p in PRODUCTS"
              :key="p.id"
              class="row table-row"
              @click="selected = p"
            > -->
            <div
              v-for="p in products"
              :key="p.id"
              class="row table-row"
              @click="selected = p"
            >
              <div class="cell-name">
                <component :is="p.icon" :size="15" :color="TOKENS.muted" />
                <span class="cell-name-text">{{ p.name }}</span>
              </div>
              <span class="mono cell-stock">{{ p.stock }}</span>
              <div class="cell-demand">
                <DemandCells :value="p.demand" :color="RISK[p.risk].color" />
                <span class="mono" :style="{ fontSize: '12px', color: RISK[p.risk].color }">{{ p.demand }}%</span>
              </div>
              <span
                class="cell-badge"
                :style="{ background: RISK[p.risk].bg, color: RISK[p.risk].color }"
              >
                {{ p.restock > 0 ? `+${p.restock} unités` : "Stock suffisant" }}
              </span>
            </div>
          </div>
        </section>

        <!-- Trend chart -->
        <section style="padding: 0px; margin-top: 0px;">
          <h2 class="section-title">TENDANCE DE LA DEMANDE</h2>
          <div class="chart-card">
            <!-- <TrendChart :data="TREND" :tokens="TOKENS" /> -->
            <TrendChart :data="trends" :tokens="TOKENS" />
            <div class="legend">
              <span><span :style="{ color: TOKENS.teal }">●</span> Réel</span>
              <span><span :style="{ color: TOKENS.gold }">●</span> Prévu par l'IA</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Right column -->
      <div class="col-right">

        <!-- AI assistant -->
        <section class="panel">
          <div class="panel-head">
            <Bot :size="16" :color="TOKENS.teal" />
            <span class="panel-title">Assistant IA</span>
          </div>
          <p class="assistant-intro">Bonjour 👋 voici l'essentiel du jour :</p>
          <!-- <ul class="assistant-list">
            <li>Demande des panneaux solaires en hausse de 35%</li>
            <li>Ventes de batteries en croissance</li>
            <li>Demande des chargeurs en baisse</li>
          </ul>
          <div class="assistant-time">Généré aujourd'hui à 09:45</div> -->
          <ul class="assistant-list">
            <li v-for="(item, idx) in assistantInsights" :key="idx">{{ item }}</li>
          </ul>
          <div class="assistant-time">{{ assistantTime }}</div>
        </section>

        <!-- Top predicted -->
        <section class="panel">
          <h2 class="section-title" style="font-size:13px; margin-bottom:12px;">TOP DEMANDE PRÉVUE</h2>
          <div class="top-list">
            <div class="top-item" v-for="(p, i) in topProducts" :key="p.id" @click="selected = p">
              <span class="top-rank mono">{{ i + 1 }}</span>
              <div class="top-body">
                <div class="top-name">{{ p.name }}</div>
                <div class="top-bar-bg">
                  <div class="top-bar-fill" :style="{ width: p.demand + '%', background: RISK[p.risk].color }" />
                </div>
              </div>
              <span class="mono top-pct">{{ p.demand }}%</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Product detail slide-over -->
    <div v-if="selected" class="overlay" @click="selected = null">
      <div class="drawer" @click.stop>
        <div class="drawer-head">
          <div class="drawer-head-left">
            <div class="drawer-icon">
              <component :is="selected.icon" :size="17" :color="TOKENS.gold" />
            </div>
            <div>
              <div class="drawer-eyebrow">ANALYSE IA PRODUIT</div>
              <div class="drawer-name">{{ selected.name }}</div>
            </div>
          </div>
          <button class="close-btn" @click="selected = null">
            <X :size="18" />
          </button>
        </div>

        <span
          class="risk-badge"
          :style="{ background: RISK[selected.risk].bg, color: RISK[selected.risk].color }"
        >
          {{ RISK[selected.risk].label }}
        </span>

        <div class="detail-grid">
          <div class="detail-item" v-for="[label, val] in detailRows" :key="label">
            <div class="detail-label">{{ label }}</div>
            <div class="detail-value mono">{{ val }}</div>
          </div>
        </div>

        <div class="justif-title">Justification IA</div>
        <ul class="justif-list">
          <li v-for="(r, i) in selected.reasons" :key="i">{{ r }}</li>
        </ul>

        <!-- <button v-if="selected.restock > 0" class="btn" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px;">
          <ShoppingCart :size="15" /> Créer un bon de commande
        </button> -->
        <button
          v-if="selected.restock > 0"
          class="btn"
          style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px;"
          @click="orderRestock(selected)"
          :disabled="isOrdering"
        >
          <ShoppingCart :size="15" /> {{ isOrdering ? 'Création...' : 'Créer un bon de commande' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted } from "vue";
import api, { getApiErrorMessage } from "@/api/client";
import { useToast } from "@/composables/useToast";
import {
  Sun, Package, AlertTriangle, TrendingUp, Bot, X,
  ShoppingCart, BatteryMedium, PlugZap, Zap,
} from "lucide-vue-next";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
// Same palette as AdminDashboardView.vue: light bg, white cards, green accent.
const TOKENS = {
  bg: "#eef4f0",
  surface: "#ffffff",
  surface2: "#f3f7f4",
  border: "rgba(0,0,0,0.06)",
  borderSoft: "rgba(0,0,0,0.05)",
  gold: "#22c55e",              // primary accent (was gold, now the same green as primary-btn)
  goldSoft: "rgba(34,197,94,0.12)",
  teal: "#3b82f6",              // secondary accent (matches insight-action blue)
  text: "#052e16",
  muted: "#6b7280",
  mutedDim: "#9ca3af",
  danger: "#b91c1c",
  dangerSoft: "#fef2f2",
  warning: "#b45309",
  warningSoft: "#fef3c7",
  success: "#15803d",
  successSoft: "#dcfce7",
};

const RISK = {
  high: { color: TOKENS.danger, bg: TOKENS.dangerSoft, label: "Risque élevé" },
  medium: { color: TOKENS.warning, bg: TOKENS.warningSoft, label: "Risque moyen" },
  low: { color: TOKENS.success, bg: TOKENS.successSoft, label: "Risque faible" },
};

const PRODUCTS = [
  {
    id: 1,
    name: "Panneau Solaire 450W",
    icon: Sun,
    stock: 120,
    avgSales: 95,
    demand: 92,
    risk: "high",
    restock: 80,
    expectedSales: 110,
    confidence: 94,
    deadline: "25 août",
    reasons: [
      "Ventes en hausse sur les 6 derniers mois",
      "La saison estivale augmente la demande",
      "Le stock actuel ne couvrira pas la demande prévue",
    ],
  },
  {
    id: 2,
    name: "Batterie 10kWh",
    icon: BatteryMedium,
    stock: 60,
    avgSales: 48,
    demand: 71,
    risk: "medium",
    restock: 25,
    expectedSales: 66,
    confidence: 87,
    deadline: "2 septembre",
    reasons: [
      "Croissance régulière depuis le trimestre dernier",
      "Corrélation forte avec les ventes de panneaux",
      "Marge de sécurité recommandée sur le stock",
    ],
  },
  {
    id: 3,
    name: "Onduleur Hybride",
    icon: PlugZap,
    stock: 150,
    avgSales: 60,
    demand: 48,
    risk: "low",
    restock: 0,
    expectedSales: 58,
    confidence: 76,
    deadline: "—",
    reasons: [
      "Demande stable, sans pic identifié",
      "Stock actuel largement suffisant",
    ],
  },
  {
    id: 4,
    name: "Chargeur Solaire",
    icon: Zap,
    stock: 90,
    avgSales: 12,
    demand: 10,
    risk: "low",
    restock: 0,
    expectedSales: 14,
    confidence: 81,
    deadline: "—",
    reasons: [
      "Demande faible et stable depuis 3 mois",
      "Aucun réapprovisionnement nécessaire",
    ],
  },
];

const TREND = [
  { month: "Jan", reel: 30, prevu: null },
  { month: "Fév", reel: 45, prevu: null },
  { month: "Mar", reel: 62, prevu: null },
  { month: "Avr", reel: 78, prevu: null },
  { month: "Mai", reel: 95, prevu: null },
  { month: "Juin", reel: 118, prevu: null },
  { month: "Juil", reel: 132, prevu: 132 },
  { month: "Août", reel: null, prevu: 158 },
  { month: "Sep", reel: null, prevu: 176 },
  { month: "Oct", reel: null, prevu: 189 },
];

// ---------------------------------------------------------------------------
// State & API Integration (FastAPI Backend)
// ---------------------------------------------------------------------------
const selected = ref(null);

const ICON_MAP = {
  sun: Sun,
  battery: BatteryMedium,
  plug: PlugZap,
  zap: Zap
};

const mapProductIcon = (item) => {
  if (item.icon && typeof item.icon !== "string") return item.icon;
  return ICON_MAP[item.icon_type] || Sun;
};

// Reactive state initialized with fallback data (no deletion of original data)
const products = ref(PRODUCTS.map((p) => ({ ...p, icon: mapProductIcon(p) })));
const trends = ref([...TREND]);
const lastAnalysis = ref("09:45");
const assistantTime = ref("Généré aujourd'hui à 09:45");
const assistantInsights = ref([
  "Demande des panneaux solaires en hausse de 35%",
  "Ventes de batteries en croissance",
  "Demande des chargeurs en baisse"
]);
const isLoading = ref(false);
const isOrdering = ref(false);
const toast = useToast();

const loadAIData = async () => {
  try {
    isLoading.value = true;
    const response = await api.get("/admin/ai/overview");
    if (response.data) {
      const data = response.data;
      if (data.products && data.products.length) {
        products.value = data.products.map((p) => ({
          ...p,
          icon: mapProductIcon(p)
        }));
      }
      if (data.trends && data.trends.length) {
        trends.value = data.trends;
      }
      if (data.last_analysis) {
        lastAnalysis.value = data.last_analysis;
      }
      if (data.assistant_insights && data.assistant_insights.length) {
        assistantInsights.value = data.assistant_insights;
      }
      if (data.assistant_time) {
        assistantTime.value = data.assistant_time;
      }
    }
  } catch (err) {
    console.warn("AI overview unavailable via Laravel, using local fallback:", err.message);
    toast.error(getApiErrorMessage(err, "Impossible de charger l'analyse IA."));
  } finally {
    isLoading.value = false;
  }
};

const orderRestock = async (product) => {
  if (!product?.id || !product.restock) return;
  try {
    isOrdering.value = true;
    const res = await api.post("/admin/ai/restock-order", {
      product_id: product.id,
      units: product.restock,
      notes: `Commande IA pour ${product.name}`
    });
    toast.success(res.data.message || `Bon de commande créé pour ${product.restock} unités.`);
    selected.value = null;
    await loadAIData();
  } catch (err) {
    toast.error(getApiErrorMessage(err, "Échec de la création du bon de commande."));
  } finally {
    isOrdering.value = false;
  }
};

onMounted(() => {
  loadAIData();
});

// Original static computed kept commented out (no deletion)
// const stats = computed(() => {
//   const high = PRODUCTS.filter((p) => p.risk === "high").length;
//   const avgDemand = Math.round(PRODUCTS.reduce((a, p) => a + p.demand, 0) / PRODUCTS.length);
//   return { total: PRODUCTS.length, high, avgDemand };
// });
// const topProducts = [...PRODUCTS].sort((a, b) => b.demand - a.demand).slice(0, 3);
// const recommendations = PRODUCTS.filter((p) => p.risk !== "low");

const stats = computed(() => {
  const list = products.value;
  const high = list.filter((p) => p.risk === "high").length;
  const avgDemand = list.length
    ? Math.round(list.reduce((a, p) => a + p.demand, 0) / list.length)
    : 0;
  return { total: list.length, high, avgDemand };
});

const topProducts = computed(() =>
  [...products.value].sort((a, b) => b.demand - a.demand).slice(0, 3)
);

const recommendations = computed(() =>
  products.value.filter((p) => p.risk !== "low")
);

const detailRows = computed(() => {
  if (!selected.value) return [];
  const s = selected.value;
  return [
    ["Stock actuel", `${s.stock} unités`],
    ["Ventes mensuelles moy.", `${s.avgSales} unités`],
    ["Demande prévue", `${s.demand}%`],
    ["Ventes attendues", `${s.expectedSales} unités`],
    ["Réapprovisionnement", s.restock > 0 ? `+${s.restock} unités` : "Aucun"],
    ["Score de confiance", `${s.confidence}%`],
  ];
});

// ---------------------------------------------------------------------------
// DemandCells sub-component
// ---------------------------------------------------------------------------
const DemandCells = {
  props: { value: Number, color: String },
  setup(props) {
    const total = 10;
    return () => {
      const filled = Math.round((props.value / 100) * total);
      return h(
        "div",
        { style: { display: "flex", gap: "2px" } },
        Array.from({ length: total }).map((_, i) =>
          h("div", {
            key: i,
            style: {
              width: "6px",
              height: "14px",
              borderRadius: "1px",
              background: i < filled ? props.color : TOKENS.borderSoft,
            },
          })
        )
      );
    };
  },
};

// ---------------------------------------------------------------------------
// StatCard sub-component
// ---------------------------------------------------------------------------
const StatCard = {
  props: { icon: [Object, Function], label: String, value: [String, Number], sub: String, accent: String },
  setup(props) {
    return () =>
      h(
        "div",
        {
          style: {
            background: TOKENS.surface,
            border: `1px solid ${TOKENS.border}`,
            borderRadius: "14px",
            padding: "18px 20px",
            flex: 1,
            minWidth: "190px",
          },
        },
        [
          h(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" } },
            [
              h("span", { style: { fontSize: "12.5px", color: TOKENS.muted, letterSpacing: "0.3px" } }, props.label),
              h(
                "div",
                {
                  style: {
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: props.accent + "22", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  },
                },
                [h(props.icon, { size: 15, color: props.accent })]
              ),
            ]
          ),
          h(
            "div",
            { style: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: 700, color: TOKENS.text } },
            props.value
          ),
          props.sub ? h("div", { style: { fontSize: "12px", color: TOKENS.mutedDim, marginTop: "4px" } }, props.sub) : null,
        ]
      );
  },
};

// ---------------------------------------------------------------------------
// TrendChart sub-component (hand-rolled SVG area chart, no charting lib)
// ---------------------------------------------------------------------------
const TrendChart = {
  props: { data: Array, tokens: Object },
  setup(props) {
    const width = 700;
    const height = 220;
    const padTop = 10;
    const padBottom = 6;
    const chartH = height - padTop - padBottom;
    const n = props.data.length;
    const stepX = width / (n - 1);

    const values = props.data.flatMap((d) => [d.reel, d.prevu]).filter((v) => v !== null && v !== undefined);
    const maxVal = Math.max(...values) * 1.08;

    const xAt = (i) => i * stepX;
    const yAt = (v) => padTop + chartH - (v / maxVal) * chartH;

    const buildLine = (key) => {
      const pts = props.data
        .map((d, i) => (d[key] !== null && d[key] !== undefined ? [xAt(i), yAt(d[key])] : null))
        .filter(Boolean);
      if (!pts.length) return "";
      return pts.map(([x, y], idx) => `${idx === 0 ? "M" : "L"}${x},${y}`).join(" ");
    };

    const buildArea = (key) => {
      const pts = props.data
        .map((d, i) => (d[key] !== null && d[key] !== undefined ? [xAt(i), yAt(d[key])] : null))
        .filter(Boolean);
      if (!pts.length) return "";
      const first = pts[0];
      const last = pts[pts.length - 1];
      const line = pts.map(([x, y], idx) => `${idx === 0 ? "M" : "L"}${x},${y}`).join(" ");
      return `${line} L${last[0]},${padTop + chartH} L${first[0]},${padTop + chartH} Z`;
    };

    const hoverIndex = ref(null);

    const onMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * width;
      let idx = Math.round(relX / stepX);
      idx = Math.max(0, Math.min(n - 1, idx));
      hoverIndex.value = idx;
    };
    const onLeave = () => (hoverIndex.value = null);

    const julyIndex = props.data.findIndex((d) => d.month === "Juil");

    return () => {
      const hovered = hoverIndex.value !== null ? props.data[hoverIndex.value] : null;
      const hoverVal = hovered ? (hovered.reel !== null ? hovered.reel : hovered.prevu) : null;
      const hoverIsPrevu = hovered ? hovered.reel === null : false;
      const hoverX = hoverIndex.value !== null ? xAt(hoverIndex.value) : 0;

      return h("div", { style: { position: "relative" } }, [
        h(
          "svg",
          {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "220",
            preserveAspectRatio: "none",
            style: { display: "block", overflow: "visible" },
            onMousemove: onMove,
            onMouseleave: onLeave,
          },
          [
            h("defs", {}, [
              h("linearGradient", { id: "reelGrad", x1: "0", y1: "0", x2: "0", y2: "1" }, [
                h("stop", { offset: "0%", "stop-color": props.tokens.teal, "stop-opacity": 0.35 }),
                h("stop", { offset: "100%", "stop-color": props.tokens.teal, "stop-opacity": 0 }),
              ]),
              h("linearGradient", { id: "prevuGrad", x1: "0", y1: "0", x2: "0", y2: "1" }, [
                h("stop", { offset: "0%", "stop-color": props.tokens.gold, "stop-opacity": 0.3 }),
                h("stop", { offset: "100%", "stop-color": props.tokens.gold, "stop-opacity": 0 }),
              ]),
            ]),
            ...[0, 0.25, 0.5, 0.75, 1].map((f) =>
              h("line", {
                key: f,
                x1: 0, x2: width,
                y1: padTop + chartH * f, y2: padTop + chartH * f,
                stroke: props.tokens.borderSoft, "stroke-width": 1,
              })
            ),
            julyIndex >= 0
              ? h("line", {
                  x1: xAt(julyIndex), x2: xAt(julyIndex),
                  y1: padTop, y2: padTop + chartH,
                  stroke: props.tokens.border, "stroke-width": 1, "stroke-dasharray": "3 3",
                })
              : null,
            h("path", { d: buildArea("reel"), fill: "url(#reelGrad)" }),
            h("path", { d: buildArea("prevu"), fill: "url(#prevuGrad)" }),
            h("path", { d: buildLine("reel"), fill: "none", stroke: props.tokens.teal, "stroke-width": 2 }),
            h("path", { d: buildLine("prevu"), fill: "none", stroke: props.tokens.gold, "stroke-width": 2, "stroke-dasharray": "5 4" }),
            hovered
              ? h("line", { x1: hoverX, x2: hoverX, y1: padTop, y2: padTop + chartH, stroke: props.tokens.border, "stroke-width": 1 })
              : null,
            ...props.data.map((d, i) =>
              h(
                "text",
                {
                  key: d.month,
                  x: xAt(i), y: height - 2,
                  fill: props.tokens.mutedDim, "font-size": "11.5",
                  "text-anchor": i === 0 ? "start" : i === n - 1 ? "end" : "middle",
                  "font-family": "'Outfit', sans-serif",
                },
                d.month
              )
            ),
          ]
        ),
        hovered
          ? h(
              "div",
              {
                style: {
                  position: "absolute",
                  left: `${(hoverX / width) * 100}%`,
                  top: "0",
                  transform: hoverIndex.value > n / 2 ? "translateX(-105%)" : "translateX(6px)",
                  background: props.tokens.surface,
                  border: `1px solid ${props.tokens.border}`,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  fontFamily: "'Outfit', sans-serif",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                },
              },
              [
                h("div", { style: { fontSize: "11px", color: props.tokens.muted, marginBottom: "2px" } }, hovered.month),
                h(
                  "div",
                  { style: { fontSize: "14px", fontWeight: 600, color: hoverIsPrevu ? props.tokens.gold : props.tokens.teal } },
                  `${hoverVal} unités ${hoverIsPrevu ? "(prévu)" : ""}`
                ),
              ]
            )
          : null,
      ]);
    };
  },
};
</script>

<style scoped>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
      .ai-panel * { box-sizing: border-box; }
      .ai-panel ::-webkit-scrollbar { width: 8px; height: 8px; }
      .ai-panel ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
      .ai-panel .row:hover { background:#f3f7f4 !important; }
      .ai-panel .btn { background:#22c55e; color:#052e16; border:none; border-radius:10px; padding:9px 16px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif; }
      .ai-panel .btn:hover { opacity:0.9; }
      .ai-panel .btn-ghost { background:transparent; border:1px solid rgba(0,0,0,0.1); color:#374151; border-radius:8px; padding:8px 14px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif; }
      .ai-panel .btn-ghost:hover { background:#f3f4f6; }

.ai-panel {
  background: transparent;
  color: #374151;
  font-family: 'Outfit', sans-serif;
  padding: 0;
}

.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
.title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 800; color: #052e16; margin: 0; }
.subtitle { color: #6b7280; font-size: 13.5px; margin: 4px 0 0; }
.last-analysis {
  display: flex; align-items: center; gap: 10px;
  background: #ffffff; border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px; padding: 9px 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.muted-text { font-size: 12.5px; color: #6b7280; }
.mono { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 12.5px; }

.stat-row { display: flex; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
.columns { display: flex; gap: 20px; flex-wrap: wrap; }
.col-left { flex: 1.5; min-width: 320px; display: flex; flex-direction: column; gap: 20px; }
.col-right { width: 280px; display: flex; flex-direction: column; gap: 20px; flex-shrink: 0; }

.section-title { font-size: 14px; font-weight: 700; margin: 0 0 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.4px; }

/* Recommendations */
.rec-list { display: flex; flex-direction: column; gap: 8px; }
.rec-card {
  background: #ffffff; border: 1px solid rgba(0,0,0,0.05);
  border-radius: 12px; padding: 13px 16px; display: flex;
  align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.rec-left { display: flex; align-items: center; gap: 12px; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.rec-title { font-size: 13.5px; font-weight: 600; color: #052e16; }
.rec-sub { font-size: 12px; color: #6b7280; margin-top: 2px; }

/* Table */
.table-card {
  background: #ffffff; border: 1px solid rgba(0,0,0,0.05);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.table-head {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1.2fr; padding: 10px 16px;
  font-size: 11.5px; color: #9ca3af; border-bottom: 1px solid rgba(0,0,0,0.05);
  text-transform: uppercase; letter-spacing: 0.3px;
}
.table-row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1.2fr; padding: 12px 16px;
  align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); cursor: pointer;
}
.cell-name { display: flex; align-items: center; gap: 9px; }
.cell-name-text { font-size: 13px; color: #374151; font-weight: 500; }
.cell-stock { font-size: 12.5px; color: #374151; }
.cell-demand { display: flex; align-items: center; gap: 8px; }
.cell-badge { font-size: 12px; padding: 3px 9px; border-radius: 6px; width: fit-content; font-weight: 600; }

/* Chart */
.chart-card {
  background: #ffffff; border: 1px solid rgba(0,0,0,0.05);
  border-radius: 12px; padding: 18px 20px 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.legend { display: flex; gap: 16px; padding-bottom: 12px; font-size: 11.5px; color: #6b7280; }

/* Right column panels */
.panel { background: #ffffff; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); }
.panel-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.panel-title { font-size: 13px; font-weight: 700; color: #052e16; }
.assistant-intro { font-size: 12.5px; color: #6b7280; margin: 0 0 10px; }
.assistant-list { margin: 0; padding: 0 0 0 16px; font-size: 12.5px; color: #374151; line-height: 1.7; }
.assistant-time { font-size: 11px; color: #9ca3af; margin-top: 10px; }

.top-list { display: flex; flex-direction: column; gap: 12px; }
.top-item { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.top-rank { font-size: 11px; color: #9ca3af; width: 14px; }
.top-body { flex: 1; }
.top-name { font-size: 12.5px; margin-bottom: 4px; color: #374151; font-weight: 500; }
.top-bar-bg { height: 4px; background: rgba(0,0,0,0.06); border-radius: 2px; }
.top-bar-fill { height: 100%; border-radius: 2px; }
.top-pct { font-size: 12px; color: #6b7280; }

/* Slide-over */
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; justify-content: flex-end; z-index: 50;
}
.drawer {
  width: 380px; max-width: 92vw; height: 100%; background: #ffffff;
  border-left: 1px solid rgba(0,0,0,0.06); padding: 24px; overflow-y: auto;
  box-shadow: -12px 0 40px rgba(0,0,0,0.08);
}
.drawer-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.drawer-head-left { display: flex; align-items: center; gap: 10px; }
.drawer-icon {
  width: 36px; height: 36px; border-radius: 9px; background: rgba(34,197,94,0.12);
  display: flex; align-items: center; justify-content: center;
}
.drawer-eyebrow { font-size: 10.5px; color: #6b7280; letter-spacing: 0.4px; }
.drawer-name { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: #052e16; }
.close-btn { background: transparent; border: none; color: #6b7280; cursor: pointer; padding: 4px; border-radius: 6px; }
.close-btn:hover { background: #f3f4f6; }

.risk-badge { display: inline-block; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; margin-bottom: 18px; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
.detail-item { background: #f9fafb; border: 1px solid rgba(0,0,0,0.05); border-radius: 9px; padding: 10px 12px; }
.detail-label { font-size: 11px; color: #9ca3af; margin-bottom: 4px; }
.detail-value { font-size: 15px; font-weight: 700; color: #052e16; }

.justif-title { font-size: 12px; color: #6b7280; margin-bottom: 8px; font-weight: 600; }
.justif-list { margin: 0 0 20px; padding: 0 0 0 16px; font-size: 12.5px; line-height: 1.8; color: #374151; }

@media (max-width: 900px) {
  .col-right { width: 100%; }
}
</style>