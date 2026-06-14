import { useState, useEffect } from 'react';
import { ShieldAlert, BookOpen, Lock, FileText, Database, Wrench, Plug, Blocks, Users, GitMerge, Workflow } from 'lucide-react';
import Quiz from './Quiz';
import Sandbox from './Sandbox';
import Tooltip from './Tooltip';

export default function Day5() {
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
  "agent_name": "Orchestrator",
  "role": "Boss",
  "model": "gpt-4-turbo",
  "temperature": 0.5,
  "system_prompt": "你是一個專案經理。負責接收使用者的任務，並分配給合適的 Agent 執行。最後彙整結果回報。",
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
      <h1>Day 5: 多智能體協作 (Multi-Agent)</h1>
      
      {/* 5分鐘：深度教學教材區 */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          歡迎來到第五天！當你的單一 Agent 變得越來越複雜，常常會發生「顧此失彼」或「提示詞太長導致幻覺」的問題。今天的解法是：**<Tooltip text="多智能體協作：將複雜任務拆解並分派給多個專門 Agent 協同完成的架構">多智能體協作 (Multi-Agent Collaboration)</Tooltip>**。讓專業的來，把大任務拆給多個專精的 Agent 合作完成。
        </p>

        {/* 概念解說卡片 1 */}
        <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0, color: 'var(--text-primary)' }}>
            <Users size={24} color="var(--accent-primary)" />
            1. 為什麼需要多個 Agent？
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            就像一家公司不能只有老闆一個人做所有事。單一 Prompt 塞入「查資料規則 + 寫作風格 + 審閱標準」，模型很容易精神分裂。拆分成多個 Agent 可以做到：**<Tooltip text="專責分工：將系統拆解為各自獨立且職責單一之模組的軟體設計原則">專責分工 (Separation of Concerns)</Tooltip>**、**獨立使用不同模型 (如編碼用 Claude、寫作用 GPT-4)**、以及**降低 Prompt 的複雜度**。
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--text-secondary)' }}>
              <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Workflow size={18} /> <Tooltip text="流水線模式：線性順序傳遞任務的智能體協作方式">流水線模式 (Pipeline)</Tooltip>
              </h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                像工廠生產線。Agent A (爬蟲) 抓完資料交給 Agent B (總結)，再交給 Agent C (翻譯)。適合**流程固定、順序明確**的任務。
              </p>
            </div>
            <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.08)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GitMerge size={18} /> <Tooltip text="主從模式：由主管 Agent 動態拆解任務並分派給員工 Agent 的協作方式">主從模式 (Hierarchical)</Tooltip>
              </h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                一個 Boss Agent (主管) 負責理解任務，拆解步驟後，動態指派給底下的 Worker Agent (員工) 去做，最後彙整。適合**複雜且未知的任務**。
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Users size={24} color="var(--accent-secondary)" />
              2. 協作資料流 (Hierarchical 模式示範)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="svg-container" style={{ background: '#0a0a0a', margin: 0, height: '300px', borderRadius: 0, position: 'relative' }}>
              <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="d5-glow-boss" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="d5-glow-worker1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                  <linearGradient id="d5-glow-worker2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* User Input to Boss */}
                <path d="M 100 150 L 250 150" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeDasharray="6" className={animState === 0 ? "data-flow-fast" : ""} />
                <polygon points="245,145 255,150 245,155" fill="rgba(255,255,255,0.2)" />
                {animState === 0 && (
                  <circle r="6" fill="#fff" filter="url(#glow)">
                    <animateMotion path="M 100 150 L 250 150" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                )}
                <rect x="50" y="130" width="80" height="40" rx="8" fill="#333" />
                <text x="90" y="155" fill="white" fontSize="14" textAnchor="middle">User</text>

                {/* Boss Agent */}
                <rect x="250" y="110" width="120" height="80" rx="12" fill={animState === 0 || animState === 3 ? "url(#d5-glow-boss)" : "rgba(255,255,255,0.05)"} fillOpacity={animState === 0 || animState === 3 ? 0.3 : 1} stroke="url(#d5-glow-boss)" strokeWidth="2" />
                <text x="310" y="145" fill="white" fontWeight="bold" textAnchor="middle">Orchestrator</text>
                <text x="310" y="165" fill="#ccc" fontSize="12" textAnchor="middle">(主管)</text>

                {/* Boss to Researcher */}
                <path d="M 370 130 C 420 130, 450 80, 500 80" fill="none" stroke={animState === 1 ? "#3b82f6" : "rgba(255,255,255,0.2)"} strokeWidth="3" strokeDasharray="6" className={animState === 1 ? "data-flow" : ""} />
                <polygon points="495,75 505,80 495,85" fill={animState === 1 ? "#3b82f6" : "rgba(255,255,255,0.2)"} />
                {animState === 1 && (
                  <g filter="url(#glow)">
                    <rect width="16" height="12" rx="2" fill="#3b82f6" x="-8" y="-6">
                      <animateMotion path="M 370 130 C 420 130, 450 80, 500 80" dur="1s" repeatCount="indefinite" />
                    </rect>
                  </g>
                )}
                {/* Researcher to Boss */}
                <path d="M 500 90 C 450 90, 420 140, 370 140" fill="none" stroke={animState === 1 ? "#3b82f6" : "rgba(255,255,255,0.2)"} strokeWidth="3" strokeDasharray="6" className={animState === 1 ? "data-flow" : ""} />
                <polygon points="375,135 365,140 375,145" fill={animState === 1 ? "#3b82f6" : "rgba(255,255,255,0.2)"} />
                {animState === 1 && (
                  <g filter="url(#glow)">
                    <rect width="16" height="12" rx="2" fill="#2dd4bf" x="-8" y="-6">
                      <animateMotion path="M 500 90 C 450 90, 420 140, 370 140" dur="1s" repeatCount="indefinite" />
                    </rect>
                  </g>
                )}
                
                {/* Boss to Writer */}
                <path d="M 370 160 C 420 160, 450 210, 500 210" fill="none" stroke={animState === 2 ? "#f59e0b" : "rgba(255,255,255,0.2)"} strokeWidth="3" strokeDasharray="6" className={animState === 2 ? "data-flow" : ""} />
                <polygon points="495,205 505,210 495,215" fill={animState === 2 ? "#f59e0b" : "rgba(255,255,255,0.2)"} />
                {animState === 2 && (
                  <g filter="url(#glow)">
                    <rect width="16" height="12" rx="2" fill="#f59e0b" x="-8" y="-6">
                      <animateMotion path="M 370 160 C 420 160, 450 210, 500 210" dur="1s" repeatCount="indefinite" />
                    </rect>
                  </g>
                )}
                {/* Writer to Boss */}
                <path d="M 500 220 C 450 220, 420 170, 370 170" fill="none" stroke={animState === 2 ? "#f59e0b" : "rgba(255,255,255,0.2)"} strokeWidth="3" strokeDasharray="6" className={animState === 2 ? "data-flow" : ""} />
                <polygon points="375,165 365,170 375,175" fill={animState === 2 ? "#f59e0b" : "rgba(255,255,255,0.2)"} />
                {animState === 2 && (
                  <g filter="url(#glow)">
                    <rect width="16" height="12" rx="2" fill="#ef4444" x="-8" y="-6">
                      <animateMotion path="M 500 220 C 450 220, 420 170, 370 170" dur="1s" repeatCount="indefinite" />
                    </rect>
                  </g>
                )}

                {/* Researcher Agent */}
                <rect x="500" y="50" width="120" height="70" rx="8" fill={animState === 1 ? "url(#d5-glow-worker1)" : "rgba(255,255,255,0.05)"} fillOpacity={animState === 1 ? 0.3 : 1} stroke="url(#d5-glow-worker1)" strokeWidth="2" />
                <text x="560" y="85" fill="white" fontWeight="bold" textAnchor="middle">Researcher</text>
                <text x="560" y="105" fill="#ccc" fontSize="12" textAnchor="middle">(研究員)</text>

                {/* Writer Agent */}
                <rect x="500" y="180" width="120" height="70" rx="8" fill={animState === 2 ? "url(#d5-glow-worker2)" : "rgba(255,255,255,0.05)"} fillOpacity={animState === 2 ? 0.3 : 1} stroke="url(#d5-glow-worker2)" strokeWidth="2" />
                <text x="560" y="215" fill="white" fontWeight="bold" textAnchor="middle">Writer</text>
                <text x="560" y="235" fill="#ccc" fontSize="12" textAnchor="middle">(寫手)</text>

                {/* Output */}
                <path d="M 310 110 L 310 50" stroke={animState === 3 ? "var(--success)" : "rgba(255,255,255,0.2)"} strokeWidth="3" strokeDasharray="6" className={animState === 3 ? "data-flow" : ""} />
                <polygon points="305,55 310,45 315,55" fill={animState === 3 ? "var(--success)" : "rgba(255,255,255,0.2)"} />
                {animState === 3 && (
                  <circle r="6" fill="var(--success)" filter="url(#glow)">
                    <animateMotion path="M 310 110 L 310 50" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                )}
                <rect x="260" y="10" width="100" height="40" rx="8" fill={animState === 3 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.1)"} stroke={animState === 3 ? "var(--success)" : "rgba(255,255,255,0.2)"} />
                <text x="310" y="35" fill={animState === 3 ? "var(--success)" : "white"} fontSize="14" textAnchor="middle">最終結果</text>

              </svg>
            </div>

            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '24px', minHeight: '140px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                  {animState === 0 && "步驟一：主管接收指令與規劃"}
                  {animState === 1 && "步驟二：研究員進行資料搜集"}
                  {animState === 2 && "步驟三：寫手進行潤稿與排版"}
                  {animState === 3 && "步驟四：主管審閱並回報"}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
                  {animState === 0 && <span>使用者提出需求：「幫我寫一篇關於巴黎奧運的旅遊推廣」。主管 (<Tooltip text="協調者：在多智能體系統中負責拆解任務、分派給不同專家 Agent 的主管角色">Orchestrator</Tooltip>) 收到後，拆解出兩個任務：找尋奧運資訊、以及包裝成文案。</span>}
                  {animState === 1 && "主管將第一個任務發給 Researcher (研究員)。研究員利用搜尋工具找齊了所有數據與新聞重點，並將生硬的條列式資料回傳給主管。"}
                  {animState === 2 && "主管確認資料無誤後，將這些素材連同指令發包給 Writer (寫手)。寫手負責加入表情符號、優化語氣，寫出一篇吸引人的社群貼文。"}
                  {animState === 3 && "最後，主管 Agent 檢查這篇貼文是否有遺漏關鍵資訊。確認完美後，將最終結果回傳給使用者。使用者只需對口一位主管即可！"}
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
        .data-flow-rev { animation: flowAnimRev 1s linear infinite; }
        .data-flow-fast { animation: flowAnim 0.5s linear infinite; }
        @keyframes flowAnim { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
        @keyframes flowAnimRev { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 24; } }
      `}</style>

      {/* 1-2分鐘：問答檢核區 */}
      {step === 0 && (
        <Quiz 
          questions={[
            {
              question: "【第 1 題】為什麼要把大任務拆給多個 Agent，而不是讓單一個超強 Agent 做全部的事？",
              options: [
                "A) 因為多個 Agent 可以算使用者比較多錢",
                "B) 降低單一 Prompt 複雜度，減少精神分裂 (幻覺) 並實現專業分工",
                "C) 因為目前的 AI 沒辦法寫超過 100 字的 Prompt"
              ],
              correctIndex: 1,
              hint: "提示：就像公司一樣，專注負責單一職責的員工出錯率較低。這也稱為 Separation of Concerns。"
            },
            {
              question: "【第 2 題】當你需要開發一個「每天早上固定去抓匯率，然後直接發送 Line 通知」的系統，最適合哪種模式？",
              options: [
                "A) 流水線模式 (Pipeline)",
                "B) 主從模式 (Hierarchical)",
                "C) 辯論模式 (Debate)"
              ],
              correctIndex: 0,
              hint: "提示：這是一個「流程固定、順序明確」的任務，不需要動態拆解或決策，因此像工廠生產線一樣的 Pipeline 最合適。"
            }
          ]}
          onComplete={() => setTimeout(() => setStep(1), 500)}
        />
      )}

      {/* 5分鐘：實作沙盒區 */}
      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px', marginBottom: '24px', marginTop: '24px' }}>
            <h3 style={{ color: 'var(--success)', margin: '0 0 8px 0' }}>觀念完全正確！</h3>
            <p style={{ margin: 0 }}>現在讓我們進入 Sandbox，體驗指揮三個 Agent 合作的快感。請輸入「幫我寫一篇推薦台南美食的臉書貼文」來觸發團隊協作！</p>
          </div>
          <Sandbox 
            initialConfig={initialConfig}
            additionalFiles={additionalFiles}
            missionTitle="實作教學：多智能體團隊協作"
            missionDesc="觀察主管如何把任務分派給研究員，最後再交給寫手潤飾。"
            steps={[
              { label: "【認識團隊】點擊左側查看 researcher.json (專長找資料) 與 writer.json (專長寫文案)，然後點擊「部署」", requireDeploy: true, hintText: "在左側 Explorer 點擊查看 researcher.json 和 writer.json，然後點擊『部署 Agent』。" },
              { label: "【發包第一階段】輸入：「請指揮 Researcher 幫我找三家台南必吃美食」", requireDeploy: false, hintText: "在下方 Terminal 輸入『請指揮 Researcher 幫我找三家台南必吃美食』。", autoFill: "請指揮 Researcher 幫我找三家台南必吃美食" },
              { label: "【發包第二階段】收到生硬資料後，輸入：「請交給 Writer 把這三家店寫成 IG 貼文」", requireDeploy: false, hintText: "直接在下方繼續輸入『請交給 Writer 把這三家店寫成 IG 貼文』。", autoFill: "請交給 Writer 把這三家店寫成 IG 貼文" },
              { label: "【風格改造】點開 writer.json，把 system_prompt 改成「你是超狂八九，每句話都要加『懂？』」", requireDeploy: false, hintText: "在左側點擊 writer.json，把 system_prompt 替換成『你是超狂八九，每句話都要加『懂？』』。" },
              { label: "【重新指派】重新部署！然後直接說：「請 Writer 重寫一次！」", requireDeploy: true, hintText: "記得點擊『部署 Agent』，然後輸入『請 Writer 重寫一次！』。", autoFill: "請 Writer 重寫一次！" }
            ]}
            checkProgress={(tutorialStep, config, history, messages = [], activeFile = '') => {
              const isDeployed = messages.some(m => m.content.includes('重新部署成功'));
              
              if (tutorialStep === 1 && isDeployed) return 2;
              
              const askedResearcher = messages.some(m => m.role === 'user' && m.content.includes('Researcher'));
              const gotResearch = messages.some(m => m.role === 'agent' && m.content.includes('[Researcher 回報]'));
              if (tutorialStep === 2 && askedResearcher && gotResearch) return 3;
              
              const askedWriter = messages.some(m => m.role === 'user' && m.content.includes('Writer'));
              const gotPost = messages.some(m => m.role === 'agent' && m.content.includes('[Writer 產出文案]'));
              if (tutorialStep === 3 && askedWriter && gotPost) return 4;
              
              // tutorialStep === 4 checking if writer.json was clicked or modified
              if (tutorialStep === 4 && activeFile === 'writer.json') return 5;
              
              const got89Post = messages.some(m => m.role === 'agent' && m.content.includes('懂？'));
              if (tutorialStep === 5 && got89Post) return 6;
              
              return tutorialStep;
            }}
            simulationLogic={(input, config, tutorialStep) => {
              if (input.includes('Researcher') && input.includes('台南')) {
                return `[Orchestrator 收到任務] 開始分析...
> 判斷任務需要「找尋資訊」，正在發包給專屬 Researcher 🕵️‍♂️...
---
[Researcher 回報] 搜集完成：
1. 文章牛肉湯 (特色：溫體牛、湯頭鮮甜)
2. 丹丹漢堡 (特色：中西合併、麵線糊)
3. 富盛號碗粿 (特色：黑醬汁、古早味)
---
[Orchestrator] 資料已準備好。您可以繼續下達指令，讓 Writer 將這些資料包裝成貼文！`;
              }
              
              if (input.includes('Writer')) {
                const is89Style = tutorialStep >= 4; 
                
                return `[Orchestrator 收到任務] 
> 判斷任務需要「行銷文字包裝」，正在將上述資料發包給專屬 Writer ✍️...
---
[Writer 產出文案]
${is89Style 
  ? `🔥 欸兄弟，來台南沒吃這三家，你這趟白來了懂？\n\n1️⃣ 文章牛肉湯：溫體牛有夠頂，湯頭鮮到會怕懂？\n2️⃣ 丹丹漢堡：南部人的麥當勞啦，麵線配炸雞才是王道懂？\n3️⃣ 富盛號：那黑黑的醬汁...直接讓我升天懂？\n\n快點tag那個整天說要減肥的兄弟，明天直接衝一波懂？😎`
  : `🌟 台南必吃美食推薦來啦！吃貨們趕快收藏這篇！ 🌟\n\n1️⃣ 【文章牛肉湯】🥩 鮮甜的溫體牛肉，每一口都是道地的南部熱情！\n2️⃣ 【丹丹漢堡】🍔 中西合併的絕妙滋味，炸雞配麵線糊絕對讓你驚豔！\n3️⃣ 【富盛號碗粿】🍚 古早味的 Q 彈口感，淋上特製黑醬汁，一試成主顧！\n\n這個週末，就出發去台南來場味蕾之旅吧！🎒✨`}
---
[Orchestrator 最終彙整] 任務完成，請檢閱上述貼文。`;
              }
              
              return `[Orchestrator] 我是專案經理。請問您需要我調動哪位 Agent (Researcher 還是 Writer) 來為您服務？`;
            }}
          />
          
          <div className="glass-panel fade-in" style={{ marginTop: '32px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--accent-primary)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="target">🎯</span> Day 5 課程總結與明日預告
            </h3>
            <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <li><strong>拆解複雜度：</strong>當任務太過龐大，最好的解決方案是引入 <strong><Tooltip text="多智能體系統：多個 AI 協同工作的系統">Multi-Agent (多智能體)</Tooltip></strong>，實現專責分工。</li>
              <li><strong>協作模式：</strong>我們學習了 <strong><Tooltip text="流水線：一種 Agent 協作模式，上一個 Agent 的產出會直接變成下一個 Agent 的輸入">Pipeline</Tooltip></strong> 的線性處理，以及 <strong><Tooltip text="主從模式：一種 Agent 協作模式，由一個主管 Agent 負責發派任務給底下的員工 Agent">Hierarchical</Tooltip></strong> 的動態分派。</li>
              <li><strong>彈性組裝：</strong>透過修改單一 Agent (如 Writer) 的設定檔，我們就能輕易改變整個團隊的最終產出風格，而不會影響到負責查資料的 Researcher！</li>
            </ul>
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <strong>🚀 明日預告 (Day 6)：自主規劃與反思 (Autonomous & Reflection)</strong><br />
              現在我們的 Agent 團隊需要人類給予明確指令。明天，我們將教你如何讓 Agent 具備「自我規劃」與「自我糾錯」的能力，成為一個真正獨立自主的 AI 專家！
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
