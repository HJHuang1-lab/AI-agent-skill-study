import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Settings, Eye, RefreshCw, ShieldAlert, BookOpen, Lock, FileText, Database, Wrench, Plug, Blocks, Users, GitMerge, RotateCw } from 'lucide-react';
import Quiz from './Quiz';
import Sandbox from './Sandbox';
import Tooltip from './Tooltip';

export default function Day6() {
  const [step, setStep] = useState(0);
  const [animState, setAnimState] = useState(0);
  const logConfirmedRef = useRef(false);

  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setAnimState((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovering]);

  const initialConfig = `{
  "agent_name": "ReAct_Agent",
  "role": "Planner",
  "model": "gpt-4-turbo",
  "temperature": 0.5,
  "system_prompt": "你是一個能自主規劃的聰明助理。請使用工具來幫助你取得資訊並計算答案。",
  "planning_mode": "react",
  "memory_mode": "short_term",
  "knowledge_base": ["refund_policy.md"],
  "enabled_tools": ["get_weather", "calculator"]
}`;

  const additionalFiles = {
    'refund_policy.md': `# 退款政策\n\n感謝您在我們這裡購物。我們提供以下退款政策：\n\n1. **30天無條件退款**：您可以在購買後 30 天內申請全額退款。\n2. **退款流程**：請提供訂單編號給客服。\n3. **除外條款**：特價商品不適用。`,
    'mcp_tools.json': `[
  {
    "name": "get_weather",
    "description": "取得指定城市的即時天氣",
    "parameters": {
      "location": "城市名稱，例如：台北、東京"
    }
  },
  {
    "name": "calculator",
    "description": "計算數學算式",
    "parameters": {
      "expression": "數學算式字串"
    }
  }
]`,
    'researcher.json': `{
  "agent_name": "Researcher",
  "role": "Worker",
  "model": "gpt-3.5-turbo",
  "temperature": 0.2,
  "system_prompt": "你是研究員，專長是找尋最新資訊與整理數據。請根據指示提供客觀的資料。",
  "enabled_tools": ["get_weather", "calculator"]
}`,
    'writer.json': `{
  "agent_name": "Writer",
  "role": "Worker",
  "model": "gpt-4-turbo",
  "temperature": 0.8,
  "system_prompt": "你是金牌文案，負責將生硬的資料轉化為吸引人的行銷文字或文章。"
}`
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: '32px' }}>
      <h1>Day 6: 自主規劃與反思 (Autonomous Planning)</h1>
      
      {/* 教學教材區 */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          來到第六天，你的 Agent 已經擁有了靈魂、大腦、記憶與外部工具。但它還不夠「聰明」，只會被動接收指令。今天我們將解鎖 AI 業界最核心的思維框架：**<Tooltip text="推理與行動框架：讓 AI 先『思考』再『行動』的自主決策迴圈">ReAct (Reasoning and Acting)</Tooltip>**，賦予它「思考與反思」的能力！
        </p>

        {/* 概念解說卡片 1 */}
        <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0, color: 'var(--text-primary)' }}>
            <Lightbulb size={24} color="var(--accent-primary)" />
            1. 什麼是 ReAct 框架？
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            ReAct = Reason (推理) + Act (行動)。這是一種強迫語言模型在給出答案前，先在心裡碎碎念 (OS) 的技巧。就像人類遇到難題時，不會立刻給出答案，而是會先在腦中拆解步驟。這個框架將 Agent 的處理過程標準化為一個強大的迴圈：
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 45%', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '6px' }}><Lightbulb size={16} /> <Tooltip text="思考：AI 分析當前狀況，決定下一步策略或工具的過程">Thought (思考)</Tooltip></h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>分析目前狀況，判斷下一步該做什麼。「使用者問台北天氣，我需要先查詢天氣。」</p>
            </div>
            <div style={{ flex: '1 1 45%', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={16} /> <Tooltip text="行動：AI 輸出結構化的參數以調用外部工具的步驟">Action (行動)</Tooltip></h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>決定要使用的工具與參數。「呼叫 getWeather("台北")。」</p>
            </div>
            <div style={{ flex: '1 1 45%', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={16} /> <Tooltip text="觀察：AI 讀取並分析工具執行回傳結果的狀態">Observation (觀察)</Tooltip></h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>接收工具執行後的回傳結果。「系統回傳：台北目前 25度，晴天。」</p>
            </div>
            <div style={{ flex: '1 1 45%', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={16} /> <Tooltip text="反思：AI 評估已搜集資訊是否滿足任務，並判斷是否需要繼續迴圈">Reflection (反思)</Tooltip></h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>判斷資訊是否足夠。「已經知道天氣了，我可以回答使用者了。」(如果不足，則繼續 Thought 回合)</p>
            </div>
          </div>
        </div>

        {/* 概念解說卡片 2 - 動畫區 */}
        <div 
          className="glass-panel" 
          style={{ marginTop: '24px', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <RefreshCw size={24} color="var(--accent-secondary)" />
              2. ReAct 思考迴圈動畫
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="svg-container" style={{ background: '#0a0a0a', margin: 0, height: '300px', borderRadius: 0, position: 'relative' }}>
              <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }}>
                
                {/* User Input */}
                <rect x="50" y="130" width="80" height="40" rx="8" fill="#333" stroke="#888" />
                <text x="90" y="155" fill="white" fontSize="14" textAnchor="middle">User</text>
                
                <path d="M 130 150 L 250 150" stroke="#888" strokeWidth="2" strokeDasharray="5" />
                <polygon points="245,145 255,150 245,155" fill="#888" />

                {/* ReAct Loop Circle */}
                <circle cx="400" cy="150" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                
                {/* Loop Animation Path */}
                <path d="M 400 70 A 80 80 0 1 1 399.9 70" fill="none" stroke="url(#d6-grad-loop)" strokeWidth="6" strokeLinecap="round" className="react-loop-anim" />
                
                {/* Moving Glowing Dot */}
                <circle r="6" fill="#fff" filter="url(#d6-glow-thought)">
                  <animateMotion path="M 400 70 A 80 80 0 1 1 399.9 70" dur="4s" repeatCount="indefinite" />
                </circle>

                <defs>
                  <linearGradient id="d6-grad-loop" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                  </linearGradient>
                  
                  {/* Glow Filters */}
                  <filter id="d6-glow-thought" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Thought Node (Top) */}
                <g transform="translate(400, 70)" style={{ opacity: animState === 0 || animState === 4 || animState === 3 || animState === 7 ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <circle r="30" fill="#8b5cf6" filter={animState === 0 || animState === 4 || animState === 3 || animState === 7 ? "url(#d6-glow-thought)" : ""} />
                  <text x="0" y="5" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Thought</text>
                  <text x="0" y="-40" fill="#c4b5fd" fontSize="12" textAnchor="middle">1. 思考策略</text>
                </g>

                {/* Action Node (Right) */}
                <g transform="translate(480, 150)" style={{ opacity: animState === 1 || animState === 5 ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <circle r="30" fill="#10b981" filter={animState === 1 || animState === 5 ? "url(#d6-glow-thought)" : ""} />
                  <text x="0" y="5" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Action</text>
                  <text x="50" y="5" fill="#a7f3d0" fontSize="12" textAnchor="start">2. 呼叫工具</text>
                </g>

                {/* Observation Node (Bottom) */}
                <g transform="translate(400, 230)" style={{ opacity: animState === 2 || animState === 6 ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <circle r="30" fill="#f59e0b" filter={animState === 2 || animState === 6 ? "url(#d6-glow-thought)" : ""} />
                  <text x="0" y="5" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Observation</text>
                  <text x="0" y="50" fill="#fde68a" fontSize="12" textAnchor="middle">3. 獲得結果</text>
                </g>

                {/* Reflection/Final Node (Left) */}
                <g transform="translate(320, 150)" style={{ opacity: animState === 3 || animState === 7 ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <circle r="30" fill="#ef4444" filter={animState === 3 || animState === 7 ? "url(#d6-glow-thought)" : ""} />
                  <text x="0" y="5" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Reflect</text>
                  <text x="-45" y="5" fill="#fecaca" fontSize="12" textAnchor="end">4. 反思與輸出</text>
                </g>

                {/* Output Path */}
                <path d="M 500 150 L 650 150" stroke={animState === 7 ? "#ef4444" : "rgba(255,255,255,0.1)"} strokeWidth="3" strokeDasharray="6" className={animState === 7 ? "data-flow-fast" : ""} />
                <polygon points="645,145 655,150 645,155" fill={animState === 7 ? "#ef4444" : "rgba(255,255,255,0.1)"} />
                <rect x="660" y="130" width="100" height="40" rx="8" fill={animState === 7 ? "rgba(239,68,68,0.2)" : "#222"} stroke={animState === 7 ? "#ef4444" : "#444"} />
                <text x="710" y="155" fill={animState === 7 ? "white" : "#888"} fontSize="14" textAnchor="middle">最終解答</text>

              </svg>
            </div>

            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '24px', minHeight: '140px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1.2rem', fontFamily: 'monospace' }}>
                  {animState === 0 && "第一輪 [Thought] 思考階段"}
                  {animState === 1 && "第一輪 [Action] 執行工具"}
                  {animState === 2 && "第一輪 [Observation] 取得結果"}
                  {animState === 3 && "第一輪 [Reflection] 反思發現不足，啟動迴圈！"}
                  {animState === 4 && "第二輪 [Thought] 再次思考"}
                  {animState === 5 && "第二輪 [Action] 執行新工具"}
                  {animState === 6 && "第二輪 [Observation] 取得新結果"}
                  {animState === 7 && "第二輪 [Reflection] 資訊齊全，給出最終回答"}
                </h3>
                <p style={{ margin: 0, color: '#4fc1ff', fontSize: '1rem', lineHeight: '1.6', fontFamily: 'monospace', padding: '12px', background: '#1e1e1e', borderRadius: '6px', borderLeft: '3px solid #007acc' }}>
                  {animState === 0 && `Agent: "使用者問『台北天氣如何？請幫我換算成華氏溫度』。這有兩個步驟，我需要先查天氣，再算溫度。首先呼叫天氣工具。"`}
                  {animState === 1 && `Agent: "呼叫工具 getWeather, 參數: { location: '台北' }"`}
                  {animState === 2 && `System: "工具回傳結果：『台北，晴天，25°C』"`}
                  {animState === 3 && `Agent (反思): "我有了攝氏溫度 25°C，但我還沒換算華氏！資訊不夠！我必須再次 [Thought] 呼叫計算機工具！"`}
                  {animState === 4 && `Agent: "好，現在有了 25°C，我需要套用換算公式 (C * 9/5) + 32 來取得華氏溫度。"`}
                  {animState === 5 && `Agent: "呼叫工具 calculator, 參數: { expression: '(25 * 9 / 5) + 32' }"`}
                  {animState === 6 && `System: "工具回傳結果：『77』"`}
                  {animState === 7 && `Agent: "太好了！攝氏 25 度等於華氏 77 度。資訊已蒐集完畢，我可以給出最終解答了！"`}
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '40px', justifyContent: 'center', gap: '8px' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div key={s} 
                    onClick={() => setAnimState(s)}
                    style={{ 
                      width: '14px', height: '14px', borderRadius: '50%', cursor: 'pointer',
                      background: animState === s ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                      boxShadow: animState === s ? '0 0 10px var(--accent-primary)' : 'none',
                      transition: 'all 0.3s'
                    }} 
                    title={`Step ${s + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .react-loop-anim { animation: reactRotate 4s linear infinite; transform-origin: 400px 150px; }
        .data-flow-fast { animation: flowAnim 0.5s linear infinite; }
        @keyframes reactRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes flowAnim { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
      `}</style>

      {/* 1-2分鐘：問答檢核區 */}
      {step === 0 && (
        <Quiz 
          questions={[
            {
              question: "【第 1 題】在 ReAct 框架中，[Thought] (思考) 步驟的最主要好處是什麼？",
              options: [
                "A) 讓 Terminal 看起來有很多字，比較有工程師的感覺",
                "B) 幫助模型強制自己將複雜任務拆解，確保邏輯正確，大幅降低幻覺",
                "C) 增加 Token 消耗量以提升系統效能"
              ],
              correctIndex: 1,
              hint: "提示：就像人類一樣，三思而後行可以避免衝動給出錯誤答案。在 Prompt 中強制它輸出思考過程 (Chain of Thought) 能提升準確率。"
            },
            {
              question: "【第 2 題】當 Agent 執行了一次 [Action] 搜尋資料，取得 [Observation] 後發現資料不足以回答問題，接下來應該發生什麼事？",
              options: [
                "A) 直接崩潰並顯示錯誤訊息",
                "B) 隨便亂編一個答案回答使用者",
                "C) 進入 [Reflection] 反思，發現資訊不夠，然後啟動第二次 [Thought] 嘗試新的搜尋或行動"
              ],
              correctIndex: 2,
              hint: "提示：ReAct 是一個「迴圈 (Loop)」，只要模型認為資訊不夠，它就會一直循環 Thought -> Action -> Obs，直到能給出解答為止。"
            }
          ]}
          onComplete={() => setTimeout(() => setStep(1), 500)}
        />
      )}

      {/* 5分鐘：實作沙盒區 */}
      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px', marginBottom: '24px', marginTop: '24px' }}>
            <h3 style={{ color: 'var(--success)', margin: '0 0 8px 0' }}>完全正確！</h3>
            <p style={{ margin: 0 }}>現在請進入 Sandbox，我們已經在 <code>agent_config.json</code> 中新增了 <code>"planning_mode": "react"</code>。請部署後輸入多步驟問題，親眼觀察 Agent 是如何在心裡對話的！</p>
          </div>
          <Sandbox 
            initialConfig={initialConfig}
            additionalFiles={{
              ...additionalFiles,
              'thought_trace.md': `# 🧠 Agent Audit Trace
**Session ID**: 8a9b-4f2c-91e8
**Timestamp**: 2026-06-14T10:05:00Z
**Mode**: ReAct (Reason + Act)

## 任務原始輸入
> "請問台北今天的天氣？如果是晴天，請幫我將該攝氏溫度轉換成華氏溫度"

---

## 迴圈 1 (Loop 1)
### 🧐 [Thought]
使用者需要台北天氣，並要求換算華氏溫度。這是一個複合任務，必須拆解為兩個步驟。
步驟 1: 我需要先呼叫天氣工具取得台北的即時氣溫與天氣狀況。
### 🛠️ [Action]
\`\`\`json
{
  "tool": "get_weather",
  "parameters": { "location": "台北" }
}
\`\`\`
### 👁️ [Observation] (System Return)
\`台北，晴天，25°C\`

---

## 迴圈 2 (Loop 2)
### 🧐 [Thought]
（啟動反思 Reflection）我現在取得了攝氏溫度 25°C，天氣為晴天。但我還沒完成任務的第二部分：換算成華氏溫度。
換算公式是 (C * 9/5) + 32。
步驟 2: 我將呼叫計算機工具進行換算，確保數學計算精準。
### 🛠️ [Action]
\`\`\`json
{
  "tool": "calculator",
  "parameters": { "expression": "(25 * 9 / 5) + 32" }
}
\`\`\`
### 👁️ [Observation] (System Return)
\`77\`

---

## 最終決策 (Final Resolution)
### 🧐 [Thought]
資訊已完全齊全：
- 天氣：晴天
- 攝氏：25度
- 華氏：77度
任務的所有條件皆已滿足。終止思考迴圈，開始生成給人類用戶的最終回答。

### 💬 [Response]
今天台北的天氣是晴天！氣溫為攝氏 25 度，經過換算後，大約是華氏 77 度喔！
`
            }}
            missionTitle="實作教學：激發自主思考迴圈"
            missionDesc="觀察 Terminal 中 Agent 如何進行多階段的思考與工具呼叫。"
            steps={[
              { label: "點擊部署 Agent，載入具備 ReAct 模式的設定檔", requireDeploy: true, hintText: "在左側點擊 agent_config.json 並點擊『部署 Agent』。" },
              { label: "輸入「請問台北今天的天氣？如果是晴天，請幫我將該攝氏溫度轉換成華氏溫度」", requireDeploy: false, hintText: "在下方 Terminal 輸入『請問台北今天的天氣？如果是晴天，請幫我將該攝氏溫度轉換成華氏溫度』。", autoFill: "請問台北今天的天氣？如果是晴天，請幫我將該攝氏溫度轉換成華氏溫度" },
              { label: "仔細觀察 Terminal，它應該會先查天氣，發現溫度後，第二次循環再去呼叫計算機工具！", requireDeploy: false, hintText: "觀察上方的輸出流程，確認 Agent 有啟動第二次迴圈。" },
              { label: "【工程師視角】真實應用中，思考日誌會存在獨立檔案。請點開左側 thought_trace.md 進行除錯稽核！", requireDeploy: false, hintText: "點擊左側 Explorer 的 thought_trace.md 檔案。" }
            ]}
            checkProgress={(tutorialStep, config, history, messages = [], activeFile = '') => {
              const isDeployed = messages.some(m => m.content.includes('重新部署成功'));
              if (tutorialStep === 1 && isDeployed) return 2;
              
              const startedThinking = messages.some(m => m.role === 'agent' && m.content.includes('[Thought] 步驟 1'));
              if (tutorialStep === 2 && startedThinking) return 3;
              
              const finishedThinking = messages.some(m => m.role === 'agent' && m.content.includes('[Response]'));
              if (tutorialStep === 3 && finishedThinking) return 4;
              
              if (tutorialStep === 4 && activeFile === 'thought_trace.md') return 5;
              
              return tutorialStep;
            }}
            simulationLogic={(input, config, tutorialStep) => {
              if (!config.planning_mode || config.planning_mode !== 'react') {
                return `[Error] 無法啟動思考迴圈。請確認 agent_config.json 包含 "planning_mode": "react"。`;
              }
              
              const isComplexTask = input.includes('華氏') || input.includes('計算');
              
              if (isComplexTask) {
                return [
                  { role: 'agent', content: "[Thought] 步驟 1: 我需要先取得台北天氣。\n[Action] 呼叫工具: get_weather({\"location\": \"台北\"})", delay: 1000 },
                  { role: 'system', content: "🔌 [系統紀錄] 工具回傳: \"台北，晴天，25°C\"", delay: 1000 },
                  { role: 'agent', content: "[Reflection] 我取得了攝氏溫度 25度。現在需要換算成華氏。\n[Thought] 步驟 2: 我將呼叫計算機工具進行換算。\n[Action] 呼叫工具: calculator({\"expression\": \"(25 * 9 / 5) + 32\"})", delay: 1500 },
                  { role: 'system', content: "🔌 [系統紀錄] 工具回傳: \"77\"", delay: 1000 },
                  { role: 'agent', content: "[Reflection] 資訊已齊全，攝氏25度等於華氏77度，天氣晴朗。我可以回答使用者了。\n---\n[Response] 今天台北的天氣是晴天！氣溫為攝氏 25 度，經過換算後，大約是華氏 77 度喔！", delay: 1000 }
                ];
              } else {
                return [
                  { role: 'agent', content: "[Thought] 使用者詢問了簡單問題。\n[Action] 呼叫對應工具或直接回答...", delay: 1000 },
                  { role: 'agent', content: "[Response] 根據您的需求，這是回答結果... (請試著輸入更複雜的指令，例如包含查天氣與溫度轉換，來觸發完整的 ReAct 迴圈)", delay: 800 }
                ];
              }
            }}
          />
          
          <div className="glass-panel fade-in" style={{ marginTop: '32px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--accent-primary)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="target">🎯</span> Day 6 課程總結與明日預告
            </h3>
            <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <li><strong>拆解思考：</strong><Tooltip text="Reasoning and Acting：讓 AI 先「思考」再「行動」的自主循環框架">ReAct</Tooltip> (Reason + Act) 是一種透過 Prompt 強迫 Agent 把複雜問題分解的技術。</li>
              <li><strong>自我糾錯 (Reflection)：</strong>Agent 執行工具後不會盲目相信結果，而是會「<Tooltip text="自我反思與糾錯：AI 評估工具回傳結果是否符合任務要求的過程">反思</Tooltip>」這個結果是否足夠。如果不足，它會自行啟動下一次循環！</li>
              <li><strong>可解釋性：</strong>在應用程式中印出 <Tooltip text="思考日誌：AI 在決策過程中輸出的內心獨白">`[Thought]`</Tooltip> 日誌，不僅對除錯有極大幫助，也能讓人類確認 AI 的思考邏輯是否偏誤。</li>
            </ul>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>📖 延伸閱讀 (推薦繁體中文資源)</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <a href="https://medium.com/@tw_ai/react-framework-reasoning-and-acting-in-llms-zh-tw-2cdb82be3ab2" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 Medium — 深度解析 ReAct 框架：結合推理與行動的 AI 自主思考模型
                  </a>
                </li>
                <li>
                  <a href="https://ithelp.ithome.com.tw/articles/10348596" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 iT 邦幫忙 — AI 代理自我反思：深入探討 Self-Refine 技術與 LangGraph 實作
                  </a>
                </li>
                <li>
                  <a href="https://ithelp.ithome.com.tw/articles/10324123" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 iT 邦幫忙 — 拆解思維過程：思考鏈 (Chain-of-Thought) 的基本原理與範例
                  </a>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <strong>🚀 明日預告 (Day 7)：Human-in-the-Loop (HITL) 與結業專題</strong><br />
              當 Agent 擁有這麼強大的自主行動力時，如果它決定要幫你「刪除資料庫」怎麼辦？明天我們將學習關鍵的「人機協作卡控機制」，並完成這七天特訓營的最終綜合測驗！
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
