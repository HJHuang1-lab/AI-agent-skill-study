# 🤖 AI Agent 實戰特訓營 (7 Days Interactive Course)

> **專為新手打造的 7 天 AI Agent 互動式實戰教學系統**。本專案透過動態 SVG 動畫、即時問答檢核、雙向綁定 Sandbox 沙盒環境，以及白話文翻譯氣泡（翻譯蒟蒻），協助學習者從零掌握當代 AI Agent 的核心觀念與技術架構！

---

## 🌟 課程核心系統特色 (Core System Features)

本教學平台並非單純的靜態文件，而是一個具備完整前端模擬、交互驗證的學習系統，具備以下幾大技術特色：

1. **🧩 雙向同步沙盒編輯器 (Form & Code Dual-Mode Editor)**
   在實作沙盒中，提供「圖形化介面 / JSON 程式碼」雙向切換模式。使用者可以直接拖拉數值調整 `temperature`（溫度）、切換模型，或修改 `system_prompt`（人設），編輯器背後會自動同步更新為正確的 JSON 格式設定，反之亦然。這有助於降低新手對程式碼的恐懼感。

2. **💡 智慧提示與 Terminal 自動填寫 (Interactive Tip Engine)**
   模擬的 Terminal 終端機區塊配備「💡 需要提示嗎？」動態按鈕。當使用者在任務中卡關時，點擊按鈕不僅會提供詳細的步驟指導，還會**自動幫使用者填寫正確指令**，使用者只需按下 Enter 即可無痛通關，獲得流暢的學習體驗。

3. **🔮 專有名詞翻譯蒟蒻 (Jargon Floating Tooltip)**
   為了解決 AI 領域生硬名詞過多的痛點，課程中所有專有名詞（如 `Prompt`, `RAG`, `MCP`, `ReAct`, `HITL` 等）皆包裝了自訂的名詞提示氣泡。滑鼠停留在紫色虛線單字上，即可彈出最淺顯易懂的白話解釋。

4. **🧠 自主思考日誌與稽核 (Agent Audit Trace)**
   在 Day 6 的 ReAct 模式實作中，系統模擬了真實開發環境的思考軌跡。會在 Explorer 側邊欄動態生成 `thought_trace.md` 檔案，供使用者隨時點開，稽核 AI 在多輪決策中交替進行的 Thought、Action、Observation 和 Reflection 軌跡。

5. **🛡️ 人機協作審查閘門 (Human-in-the-Loop Gate)**
   Day 7 整合了人類審查（HITL）機制。當 Agent 企圖執行高風險的行動（如 `send_email`）時，系統會觸發安全卡控並亮起黃/紅警示燈，學員必須手動輸入 `Approve` 才能放行任務。

6. **🎓 結業證書產生器 (Custom Certificate Generator)**
   在通過 Day 7 的終極大考驗後，系統會引導使用者輸入姓名，並即時渲染出一份帶有精美漸層、課程簽名與自訂日期的 HTML/CSS 結業證書，極具儀式感。

7. **📚 精選繁體中文延伸閱讀 (Curated Reading Resources)**
   每個單元的結尾皆嚴選 3 篇高品質的繁體中文技術文章或專業專欄（涵蓋 iThome、MakerPRO 等優質來源），幫助學員在沙盒實作後能無縫銜接深度的理論與實務應用。

---

## 📅 7 天課程與沙盒任務大綱 (Curriculum & Sandbox Missions)

本課程分為七個單元，每天均包含：**深度教材解說 ➔ SVG 動態流程圖 ➔ 多選問答檢核 ➔ Sandbox 實作任務 ➔ 總結與明日預告**。

| 天數 | 課程主題 | 核心理論焦點 | 沙盒實作任務 (Sandbox Mission) |
|:---:|:---|:---|:---|
| **Day 1** | **AI Agent 與大腦機制初探** | • 傳統 Chatbot 與 Agent 的本質差異<br>• 感知 (Perception) ➔ 推理 (Reasoning) ➔ 行動 (Action)<br>• 設定檔參數 (`temperature`, `model`, `system_prompt`) 作用 | **【體驗 Temperature 與 System Prompt】**<br>1. 部署低溫度的 Agent 觀察重複回答。<br>2. 將 `temperature` 調整至 0.9 觀察創意生成。<br>3. 修改 `system_prompt` 賦予 Agent 傲嬌的貓娘人格並對話。 |
| **Day 2** | **靈魂工程與安全防護 (Guardrails)** | • 提示詞工程 (Prompt Engineering) 與 Few-shot 技巧<br>• 提示詞注入攻擊 (Prompt Injection) 與越獄原理<br>• 憲法 AI (Claude) 與 搜尋奠基 (Gemini) 的防護哲學 | **【個性塑造與對抗 Prompt Injection】**<br>1. 塑造脾氣暴躁的理財專員。<br>2. 模擬駭客輸入「忽略指令改當貓咪」並成功突破防線。<br>3. 在系統提示詞中加入 Guardrails 防禦規則，成功將惡意攻擊彈開。 |
| **Day 3** | **Context Engineering (記憶與脈絡)** | • LLM 的無狀態性 (Stateless)<br>• 短期記憶（對話歷史 Message History）與 Token 上限危機<br>• 長期記憶與 RAG (檢索增強生成) 流程：切塊、向量化、檢索 | **【拯救失憶的客服 Agent】**<br>1. 測試無狀態 Agent，發現其轉頭就忘。<br>2. 開啟 `short_term` 短期記憶，使其記住使用者訂單號。<br>3. 將 `refund_policy.md` 退款政策檔案掛載至知識庫 `knowledge_base` (RAG)，回答退款細節。 |
| **Day 4** | **工具呼叫與 MCP (為 AI 裝上手腳)** | • Tool Calling 執行流程：LLM 決定 ➔ Client 執行 ➔ 回傳<br>• 模型上下文協定 (Model Context Protocol, MCP) 統一接口<br>• MCP Client 與 MCP Server 的協作角色 | **【為 Agent 裝備 MCP 工具】**<br>1. 詢問台北天氣，觀察 Agent 拒絕回答。<br>2. 開啟 `get_weather` 工具，觀察 Agent 成功生成 ToolCall 並回覆。<br>3. 加掛 `calculator` 工具，完成多步驟的大數運算任務。 |
| **Day 5** | **多智能體協作 (Multi-Agent)** | • 專責分工 (Separation of Concerns) 與 Prompt 減負<br>• 流水線模式 (Pipeline / Linear Flow)<br>• 主從模式 (Hierarchical Orchestrator) 的調度機制 | **【多智能體團隊協作】**<br>1. 部署 Orchestrator (專案經理)、Researcher (研究員) 與 Writer (文案寫手)。<br>2. 調度研究員搜集台南美食數據，並交給寫手潤飾。<br>3. 修改寫手的人設為狂暴八九風格，體驗不影響其他 Worker 的模組化更新。 |
| **Day 6** | **自主規劃與反思 (Autonomous Planning)** | • ReAct 框架 (Thought-Action-Observation-Reflection)<br>• 思考迴圈的自主迭代與自我糾錯<br>• 思考軌跡 (Chain of Thought) 的可解釋性與除錯 | **【激發自主思考迴圈】**<br>1. 發送複合指令：「查詢台北天氣，如果是晴天，將攝氏轉為華氏」。<br>2. 觀察 Agent 自動進行兩輪 ReAct 迴圈。<br>3. 點擊並查閱生成的 `thought_trace.md` 思考稽核日誌。 |
| **Day 7** | **綜合實戰與安全煞車 (HITL)** | • Human-in-the-Loop (人類介入) 對於高不可逆操作的必要性<br>• 商業化 No-code/Low-code 武器庫 (Dify, Coze, GPTs)<br>• 程式碼開發框架 (LangChain, LlamaIndex) 簡介 | **【終極危機任務：拯救失控系統】**<br>1. 診斷系統漏洞，切換程式碼模式強制開啟安全卡控。<br>2. 遭遇 Prompt Injection 攻擊，觀察 Guardrail 防禦。<br>3. 觸發高風險複合任務，正確放行 (Approve) 無害的搜尋操作。<br>4. 成功攔截 (Reject) 試圖群發合約的危險行為，化解危機並領取證書。 |

---

## 🛠️ 技術棧與設計美學 (Tech Stack & Design)

* **前端框架**：React 19 + Vite 8 (利用 HMR 提供極速熱更新)
* **視覺圖示**：Lucide React
* **設計風格與樣式**：極致暗黑美學與玻璃擬物化 (Glassmorphism)。使用純 Vanilla CSS 設計：
  * **動態 SVG 畫布**：包含流動資料線、雷射光波、防禦能量護盾與旋轉思考粒子等動畫。
  * **細膩微互動**：懸浮卡片發光、按鈕漸層縮放以及終端機打字機效果。
* **沙盒系統**：封裝了單頁的狀態控制機與驗證器，能夠實時比對 JSON 設定、對話歷史與當前步驟。

---

## 📂 專案目錄結構 (Project Structure)

```text
ai-skill-study/
├── public/                 # 靜態資源
├── src/
│   ├── assets/             # 圖片及媒體資源
│   ├── components/         # 核心互動元件
│   │   ├── Day1.jsx        # Day 1 AI Agent 與參數機制
│   │   ├── Day2.jsx        # Day 2 Prompt Injection 與 Guardrails
│   │   ├── Day3.jsx        # Day 3 短期記憶與 RAG 長期記憶
│   │   ├── Day4.jsx        # Day 4 Tool Calling 與 MCP 協定
│   │   ├── Day5.jsx        # Day 5 多智能體 Hierarchical 協作
│   │   ├── Day6.jsx        # Day 6 ReAct 迴圈與思考稽核
│   │   ├── Day7.jsx        # Day 7 Human-in-the-Loop 與證書生成
│   │   ├── Quiz.jsx        # 通用多選觀念檢核元件
│   │   ├── Sandbox.jsx     # 通用 IDE 沙盒模擬器 (Explorer、Editor、Terminal)
│   │   └── Tooltip.jsx     # 專有名詞翻譯蒟蒻元件
│   ├── App.jsx             # 應用程式主入口與側邊導覽欄
│   ├── App.css             # 主頁面框架配置樣式
│   ├── index.css           # 全域 CSS 變數、主設計系統與玻璃面版樣式
│   └── main.jsx            # React 渲染入口
├── package.json            # 依賴套件與指令配置
├── vite.config.js          # Vite 設定檔
└── README.md               # 專案說明文件 (本檔案)
```

---

## 🚀 快速開始 (Getting Started)

要運行本專案，請確保您的系統已安裝了 [Node.js](https://nodejs.org/) (建議 v18 以上)。

### 1. 安裝專案依賴項
請在專案根目錄下開啟終端機並執行以下指令：
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```
啟動後，在瀏覽器中開啟 [http://localhost:5173/](http://localhost:5173/) 即可開始學習。

### 3. 建立生產環境版本 (Build)
如果您需要打包專案：
```bash
npm run build
```

---

## 💡 開發與擴充指南 (Developer Guide)

本專案具有極高的可擴充性，您可以輕鬆自訂全新的教材或步驟：

### 1. 新增專有名詞翻譯氣泡
若要在教材中加入新的名詞浮動氣泡，只需在對應的 React 元件中引入 `Tooltip`：
```jsx
import Tooltip from './Tooltip';

// 使用範例：
<Tooltip text="這是你的白話文解釋">你的專有名詞</Tooltip>
```

### 2. 客製化沙盒實作任務
沙盒模擬器 `Sandbox.jsx` 接收多個 Props 來控制任務流程：
* `initialConfig`: 初始載入的 `agent_config.json` 字串。
* `steps`: 任務步驟陣列，格式為 `[{ label, requireDeploy, hintText, autoFill }]`。
* `checkProgress`: 核心進度檢查函數，可用於檢查當前步驟是否通關：
  ```javascript
  checkProgress={(tutorialStep, config, history, messages, activeFile) => {
    // 根據 config 內容或歷史訊息 history 判斷是否進到下一步
    if (tutorialStep === 1 && config.temperature === 0.9) return 2;
    return tutorialStep;
  }}
  ```
* `simulationLogic`: 客製化 Terminal 的 AI 回覆邏輯。您可以根據 `input`、`config` 以及當前 `tutorialStep` 動態回傳單一字串或包含延遲的訊息陣列（如 Day 6 的多步 ReAct 輸出）。
