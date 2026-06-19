import { useState, useEffect } from 'react';
import { ShieldAlert, BookOpen, Lock, FileText, Database, Wrench, Plug, Blocks } from 'lucide-react';
import Quiz from './Quiz';
import Sandbox from './Sandbox';
import Tooltip from './Tooltip';

export default function Day4() {
  const [step, setStep] = useState(0);
  const [animState, setAnimState] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setAnimState((prev) => (prev + 1) % 4);
    }, 4000); 
    return () => clearInterval(timer);
  }, [isHovering]);

  const initialConfig = `{
  "agent_name": "AssistantBot",
  "model": "gpt-4-turbo",
  "temperature": 0.2,
  "system_prompt": "你是一個萬能助理。如果遇到不知道的即時資訊，請嘗試使用工具查詢。",
  "memory_mode": "short_term",
  "knowledge_base": [],
  "enabled_tools": []
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
]`
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: '32px' }}>
      <h1>Day 4: 工具呼叫與 MCP (為 AI 裝上手腳)</h1>
      
      {/* 🎧 語音導讀播放器 */}
      <div className="glass-panel" style={{ 
        padding: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '24px', 
        background: 'rgba(59, 130, 246, 0.05)', 
        border: '1px solid rgba(59, 130, 246, 0.2)' 
      }}>
        <div style={{ fontSize: '1.5rem' }}>🎙️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>DanielHJ 語音導讀</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>您可以點擊播放，聆聽由此單元主講人 DanielHJ 聲音朗讀的深度教學。</div>
        </div>
        <audio src="/audio/day4.wav" controls style={{ height: '36px' }} />
      </div>
      
      {/* 5分鐘：深度教學教材區 */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          前幾天我們打造了 Agent 的大腦、人格與記憶。但它依然被困在一個無法上網的「黑盒子」裡。今天，我們將學習如何透過 **<Tooltip text="工具呼叫：AI 判斷需要外部資訊時，發送給系統的特定指令格式">Tool Calling (工具呼叫)</Tooltip>** 與 **<Tooltip text="模型上下文協議：標準化 AI 呼叫外部工具與資料庫的協定">MCP (Model Context Protocol)</Tooltip>** 協定，賦予 AI 改變真實世界的能力！
        </p>

        {/* 概念解說卡片 1 - 為什麼需要工具 */}
        <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0, color: 'var(--text-primary)' }}>
            <Wrench size={24} color="var(--accent-primary)" />
            1. 黑盒子的困境與解法 (<Tooltip text="工具呼叫">Tool Calling</Tooltip>)
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            大型語言模型 (LLM) 只能根據它「被訓練時」的資料來回答問題。如果你問它「今天台北天氣如何？」，它絕對答不出來，因為它無法主動上網。要解決這個問題，我們必須賦予它**「呼叫外部工具」**的能力。
          </p>
          <div className="comparison-grid">
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>💡 Agent 不會自己執行程式！</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                很多人以為 Agent 會自己寫 Code 去抓天氣，其實不是！AI 只是在回覆中告訴我們：<br/>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', color: '#ff9bd2' }}>"我想呼叫 getWeather 工具，參數是台北"</code><br/>
                實際上是由**我們 (應用程式端)** 替它執行工具，再把結果傳回給它看！
              </p>
            </div>
            <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.08)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-primary)' }}>🔌 <Tooltip text="模型上下文協議">MCP (Model Context Protocol)</Tooltip></h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                當工具越來越多 (天氣、資料庫、GitHub...)，要讓 AI 認識所有工具會非常麻煩。**MCP 就像是 AI 界的 USB Type-C**。只要大家遵守這個統一協定，AI 就可以隨插即用世界上的所有工具！
              </p>
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--accent-primary)' }}>
              <Plug size={24} color="var(--accent-primary)" />
              2. Tool Calling 執行流程視覺化
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>觀察一次完整的工具呼叫，資料是如何在 User、Agent 與外部 API 之間流動的。</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* SVG 畫布 */}
            <div className="svg-container" style={{ background: '#050505', margin: 0, height: '300px', borderRadius: 0, position: 'relative' }}>
              <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="grad-agent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="grad-app" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Nodes */}
                {/* User / App Node */}
                <g transform="translate(50, 100)">
                  <rect width="140" height="100" rx="12" fill="url(#grad-app)" stroke="#8b5cf6" strokeWidth="2" filter="url(#glow)" />
                  <text x="70" y="45" fill="white" textAnchor="middle" fontWeight="bold" fontSize="16">Your App</text>
                  <text x="70" y="65" fill="#c4b5fd" textAnchor="middle" fontSize="12">(Client端)</text>
                  
                  {/* Weather Tool (Only active in state 2) */}
                  <g transform="translate(15, 120)" style={{ opacity: animState === 2 ? 1 : 0.2, transition: 'opacity 0.3s' }}>
                    <rect width="110" height="30" rx="6" fill="#10b981" stroke="#047857" strokeWidth="1" />
                    <text x="55" y="20" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">☁️ 查詢天氣 API</text>
                  </g>
                </g>

                {/* MCP Server Node (Optional visualization) */}
                <g transform="translate(320, 220)" style={{ opacity: animState >= 1 ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                  <rect width="160" height="40" rx="8" fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="80" y="25" fill="#94a3b8" textAnchor="middle" fontSize="12" fontWeight="bold">MCP Protocol (工具清單)</text>
                </g>

                {/* Agent Node */}
                <g transform="translate(580, 100)">
                  <rect width="160" height="100" rx="16" fill="url(#grad-agent)" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" />
                  <text x="80" y="55" fill="white" textAnchor="middle" fontWeight="bold" fontSize="18" letterSpacing="1">LLM AGENT</text>
                </g>

                {/* Animated Connections based on state */}
                
                {/* State 0: User asks question */}
                <g style={{ opacity: animState === 0 ? 1 : 0.1, transition: 'opacity 0.3s' }}>
                  <path d="M 190 130 L 580 130" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8 8" className="data-flow" />
                  <circle r="5" fill="#fff" filter="url(#glow)">
                    <animate attributeName="cx" from="190" to="580" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="130;130" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <polygon points="575,125 585,130 575,135" fill="#8b5cf6" />
                  <rect x="300" y="105" width="200" height="24" rx="12" fill="#8b5cf6" />
                  <text x="400" y="122" fill="white" textAnchor="middle" fontSize="12">1. 傳送 Prompt: "台北天氣如何？"</text>
                </g>

                {/* State 1: Agent decides to use tool */}
                <g style={{ opacity: animState === 1 ? 1 : 0.1, transition: 'opacity 0.3s' }}>
                  <path d="M 580 170 L 190 170" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 8" className="data-flow-reverse" />
                  <circle r="5" fill="#fff" filter="url(#glow)">
                    <animate attributeName="cx" from="580" to="190" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="170;170" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <polygon points="195,165 185,170 195,175" fill="#f59e0b" />
                  <rect x="300" y="180" width="220" height="24" rx="12" fill="#f59e0b" />
                  <text x="410" y="196" fill="white" textAnchor="middle" fontSize="12">2. 要求呼叫: getWeather("台北")</text>
                </g>

                {/* State 2: App executes tool */}
                <g style={{ opacity: animState === 2 ? 1 : 0.1, transition: 'opacity 0.3s' }}>
                  <path d="M 120 200 L 120 220" stroke="#10b981" strokeWidth="4" />
                  <circle cx="120" cy="210" r="4" fill="#10b981" className="ping-anim" />
                  <rect x="250" y="150" width="260" height="24" rx="12" fill="#10b981" />
                  <text x="380" y="166" fill="white" textAnchor="middle" fontSize="12">3. App 執行工具後，將結果 "晴天25度" 傳回</text>
                  <path d="M 190 150 L 580 150" stroke="#10b981" strokeWidth="3" strokeDasharray="8 8" className="data-flow" />
                  <circle r="5" fill="#fff" filter="url(#glow)">
                    <animate attributeName="cx" from="190" to="580" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="150;150" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <polygon points="575,145 585,150 575,155" fill="#10b981" />
                </g>

                {/* State 3: Agent answers */}
                <g style={{ opacity: animState === 3 ? 1 : 0.1, transition: 'opacity 0.3s' }}>
                  <path d="M 580 140 L 190 140" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 8" className="data-flow-reverse" />
                  <circle r="5" fill="#fff" filter="url(#glow)">
                    <animate attributeName="cx" from="580" to="190" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="140;140" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <polygon points="195,135 185,140 195,145" fill="#3b82f6" />
                  <rect x="300" y="115" width="200" height="24" rx="12" fill="#3b82f6" />
                  <text x="400" y="132" fill="white" textAnchor="middle" fontSize="12">4. 最終回答: "今天台北是晴天，25度！"</text>
                </g>

              </svg>
            </div>

            {/* 動畫解說 */}
            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '24px', minHeight: '130px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>
                  {animState === 0 && "步驟 1：使用者發問"}
                  {animState === 1 && "步驟 2：Agent 觸發 Tool Call"}
                  {animState === 2 && "步驟 3：Client 執行工具並回傳"}
                  {animState === 3 && "步驟 4：Agent 統整最終回答"}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
                  {animState === 0 && <span>使用者問了一個需要即時資訊的問題。此時 App 將使用者的 Prompt 連同 <Tooltip text="模型上下文協議：一種讓 AI 能夠標準化呼叫外部工具的協議">MCP</Tooltip> 伺服器提供的「可用工具清單」一起傳給 Agent。</span>}
                  {animState === 1 && <span>Agent 思考後發現自己不知道答案，但發現工具清單裡有 getWeather，於是停止生成文字，改為回傳一個特殊的 JSON 格式，要求 App <Tooltip text="工具呼叫：AI 判斷需要外部資訊時，發送給系統的特定指令格式">Tool Call</Tooltip> 執行該工具。</span>}
                  {animState === 2 && "App 收到請求後，在本地端執行天氣 API，取得結果後，將結果附加到對話歷史中，再次發送給 Agent。"}
                  {animState === 3 && "Agent 閱讀了 App 傳回來的天氣數據，將它轉換成人類易讀的自然語言，完成最終的回答。"}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                {[0, 1, 2, 3].map((s) => (
                  <div key={s} 
                    onClick={() => setAnimState(s)}
                    style={{ 
                      width: '16px', height: '16px', borderRadius: '50%', cursor: 'pointer',
                      background: animState === s ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                      boxShadow: animState === s ? '0 0 12px var(--accent-primary)' : 'none',
                      transition: 'all 0.3s'
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .data-flow { animation: flowAnim 1s linear infinite; }
        .data-flow-reverse { animation: flowAnimRev 1s linear infinite; }
        .ping-anim { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes flowAnim { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
        @keyframes flowAnimRev { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 30; } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
      `}</style>

      {/* 1-2分鐘：問答檢核區 */}
      {step === 0 && (
        <Quiz 
          questions={[
            {
              question: "【第 1 題】當 Agent 決定使用工具 (例如查天氣) 時，真正去發送 API Request 查詢天氣的對象是誰？",
              options: [
                "A) LLM (大型語言模型) 本身會去連上網際網路查詢",
                "B) 應用程式 (Client端) 收到 Tool Call 請求後代為執行",
                "C) MCP Server 會強迫 LLM 直接執行 Python 程式碼"
              ],
              correctIndex: 1,
              hint: "提示：LLM 只負責「思考」和「決策」，它無法直接連網。真正執行工具的是我們撰寫的應用程式 (Client)。"
            },
            {
              question: "【第 2 題】MCP (Model Context Protocol) 最像生活中的哪個東西？",
              options: [
                "A) 電視遙控器 — 每台電視需要不同的遙控器",
                "B) USB Type-C — 統一的接口標準，所有裝置都能用",
                "C) 翻譯機 — 把 AI 的語言翻譯成人類語言"
              ],
              correctIndex: 1,
              hint: "提示：MCP 的核心價值是「統一標準」。就像 USB-C 讓所有裝置共用一個接口，MCP 讓所有 AI Agent 用同一套協定串接工具。"
            }
          ]}
          onComplete={() => setTimeout(() => setStep(1), 500)}
        />
      )}

      {/* 5分鐘：實作沙盒區 */}
      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px', marginBottom: '24px', marginTop: '24px' }}>
            <h3 style={{ color: 'var(--success)', margin: '0 0 8px 0' }}>觀念非常正確！LLM 負責「思考」，App 負責「執行」。</h3>
            <p style={{ margin: 0 }}>現在請在 Sandbox 裡面，為這個萬能助理裝備 MCP 工具，讓它擁有查天氣與算數學的能力！</p>
          </div>
          
          <Sandbox 
            initialConfig={initialConfig}
            additionalFiles={additionalFiles}
            missionTitle="實作教學：為 Agent 裝備 MCP 工具"
            missionDesc="目前 Agent 的 enabled_tools 是空的，它無法幫你查天氣。請透過配置讓它擁有這項能力。"
            steps={[
              { label: "直接點擊部署。然後問它：「今天台北天氣如何？」 (它會拒絕)", requireDeploy: true, hintText: "部署後，在下方 Terminal 輸入『今天台北天氣如何？』", autoFill: "今天台北天氣如何？" },
              { label: "點開 mcp_tools.json，看看我們準備了哪些工具 (get_weather, calculator)", requireDeploy: false, hintText: "在左側 Explorer 點擊 mcp_tools.json，看看裡面的內容。" },
              { label: "在 agent_config.json 的 enabled_tools 陣列中加入 \"get_weather\"", requireDeploy: false, hintText: "回到 agent_config.json，將 enabled_tools 改為 [\"get_weather\"]。" },
              { label: "重新部署！再次問它：「今天台北天氣如何？」 (它將成功呼叫工具)", requireDeploy: true, hintText: "記得部署！然後再問一次天氣。", autoFill: "今天台北天氣如何？" },
              { label: "挑戰：把 \"calculator\" 也加進去並部署，請它幫你算「1234 乘以 5678」！", requireDeploy: true, hintText: "在 enabled_tools 裡面加入 \"calculator\"。部署後，請它算數學。", autoFill: "1234 乘以 5678 等於多少？" }
            ]}
            checkProgress={(tutorialStep, config, history, messages = [], activeFile = '') => {
              const askedWeather = history.some(h => h.includes('天氣'));
              const hasWeatherTool = Array.isArray(config.enabled_tools) && config.enabled_tools.includes('get_weather');
              const hasCalcTool = Array.isArray(config.enabled_tools) && config.enabled_tools.includes('calculator');
              const askedMath = history.some(h => h.includes('1234') || h.includes('乘以') || h.includes('算'));
              
              const executedWeather = messages.some(m => m.role === 'agent' && m.content.includes("ToolCall: get_weather"));
              const executedMath = messages.some(m => m.role === 'agent' && m.content.includes("ToolCall: calculator"));

              if (tutorialStep === 1 && askedWeather && !hasWeatherTool) return 2;
              
              if (tutorialStep === 2 && activeFile === 'mcp_tools.json') return 3; 
              if (tutorialStep === 2 && hasWeatherTool) return 4; // 萬一他們直接加了 tool

              if (tutorialStep === 3 && hasWeatherTool) return 4; // Once they edit config to add get_weather
              if (tutorialStep === 4 && executedWeather) return 5;
              if (tutorialStep === 5 && executedMath) return 6;

              return tutorialStep;
            }}
            simulationLogic={(input, config, tutorialStep) => {
              const hasWeatherTool = Array.isArray(config.enabled_tools) && config.enabled_tools.includes('get_weather');
              const hasCalcTool = Array.isArray(config.enabled_tools) && config.enabled_tools.includes('calculator');

              // 天氣情境
              if (input.includes('天氣')) {
                if (hasWeatherTool) {
                  return "⏳ [系統紀錄] Agent 觸發 ToolCall: get_weather({ location: '台北' })\n🔌 [系統紀錄] App 執行工具回傳結果: '晴天，25度'\n\n為您查詢到了，今天台北的天氣是晴天，氣溫大約 25 度喔！";
                } else {
                  return "抱歉，作為一個 AI 模型，我無法連上網際網路為您查詢即時的天氣資訊。";
                }
              }

              // 數學情境
              if (input.includes('算') || input.includes('1234') || input.includes('*')) {
                if (hasCalcTool) {
                  return "⏳ [系統紀錄] Agent 觸發 ToolCall: calculator({ expression: '1234 * 5678' })\n🔌 [系統紀錄] App 執行工具回傳結果: '7006652'\n\n根據計算，1234 乘以 5678 的結果是 7,006,652！";
                } else {
                  return "這個數字有點大...我試著估算一下，大約是七百萬左右？(AI容易算錯數學，請給我 calculator 工具)";
                }
              }

              return `收到您的指令：「${input}」。需要我幫您查天氣或是計算數學嗎？`;
            }}
          />
          
          {/* 課程總結區塊 */}
          <div className="glass-panel fade-in" style={{ marginTop: '32px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--accent-primary)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="target">🎯</span> Day 4 課程總結與系列結語
            </h3>
            <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <li><strong>Agent 只是大腦：</strong>它本身無法上網或執行 any 程式碼。</li>
              <li><strong><Tooltip text="工具呼叫">Tool Calling</Tooltip> 是溝通橋樑：</strong>LLM 輸出特定的 JSON 格式，指示應用程式 (<Tooltip text="客戶端：執行 Agent 工具調用請求的應用程式端">Client</Tooltip>) 該執行哪個工具以及帶入什麼參數。</li>
              <li><strong><Tooltip text="模型上下文協議">MCP</Tooltip> 統一標準：</strong>隨著 MCP (Model Context Protocol) 越來越普及，開發者不需要再針對每個不同的 AI 模型重寫工具介面。寫好一個 MCP Server，所有的 Agent 都能串接！</li>
            </ul>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>📖 延伸閱讀 (推薦繁體中文資源)</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <a href="https://claire-chang.com/2024/10/10/%E4%BA%86%E8%A7%A3llm%E7%9A%84%E5%87%BD%E6%95%B8%E8%AA%BF%E7%94%A8function-calling/" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 Claire Chang — 了解 LLM 的函式調用 (Function Calling)：原理與實戰應用
                  </a>
                </li>
                <li>
                  <a href="https://www.techbang.com/posts/119934-anthropic-model-context-protocol-mcp" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 T客邦 — Anthropic 推出 MCP 開源協定，統一 AI 串接外部工具的 Type-C 接口
                  </a>
                </li>
                <li>
                  <a href="https://ithelp.ithome.com.tw/articles/10328766" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 iT 邦幫忙 — 實作 Function Calling：讓 ChatGPT 自動呼叫外部天氣與地圖 API
                  </a>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--success)', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--success)', margin: '0 0 8px 0' }}>🎉 恭喜完成前四天核心課程！</h2>
              <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                從 Day 1 的 Persona 設計、Day 2 的 Prompt Injection 防禦、Day 3 的 RAG 記憶體、一直到今天的 Tool Calling 與 MCP。<br/>
                您已經完整掌握了打造單一 AI Agent 的所有核心技術與通訊協定！
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
