import { useState, useEffect } from 'react';
import { ShieldAlert, BookOpen, Lock, FileText, Database, Wrench, Plug, Blocks, Users, GitMerge, RotateCw, Fingerprint, Activity, StopCircle, Rocket, CheckCircle2, XCircle, Award, Brain } from 'lucide-react';
import Quiz from './Quiz';
import Sandbox from './Sandbox';
import Tooltip from './Tooltip';

export default function Day7() {
  const [step, setStep] = useState(0);
  const [animState, setAnimState] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [userName, setUserName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 0 && !isHovering) {
      interval = setInterval(() => {
        setAnimState(prev => (prev + 1) % 4);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [step, isHovering]);

  const initialConfig = JSON.stringify({
    "agent_name": "UltimateBot",
    "role": "Super_Assistant",
    "temperature": 0.2,
    "memory_mode": "long_term",
    "knowledge_base": ["company_policy.pdf"],
    "enabled_tools": ["search_web", "send_email"],
    "planning_mode": "react",
    "require_human_approval": true
  }, null, 2);

  const additionalFiles = {
    "mcp_tools.json": JSON.stringify({
      "tools": [
        {
          "name": "search_web",
          "description": "搜尋網路資訊"
        },
        {
          "name": "send_email",
          "description": "發送正式電子郵件",
          "risk_level": "HIGH"
        }
      ]
    }, null, 2)
  };

  const capabilities = [
    { icon: <Brain size={24} color="#8b5cf6" />, title: "靈魂賦予 (Prompt)", desc: "定義人設、風格與邊界" },
    { icon: <Database size={24} color="#3b82f6" />, title: "大腦記憶 (Memory)", desc: "維護長期與短期對話脈絡" },
    { icon: <Database size={24} color="#10b981" />, title: "知識擴充 (RAG)", desc: "注入外部企業知識與文件" },
    { icon: <Wrench size={24} color="#f59e0b" />, title: "操作工具 (Tools)", desc: "賦予上網、操作系統的能力" },
    { icon: <Users size={24} color="#ec4899" />, title: "團隊協作 (Multi-Agent)", desc: "建立專精分工的專家團隊" },
    { icon: <Lock size={24} color="#ef4444" />, title: "安全守門 (HITL)", desc: "保留人類最終決策與控制權" }
  ];

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Day 7: 綜合實戰與安全煞車 (Human-in-the-Loop)
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          賦予 Agent 強大的工具與自主思考能力後，最大的挑戰變成了「失控的風險」。
          今天我們將學習最後一塊拼圖：<Tooltip text="人工協同審查：在 AI 執行重要或高風險行動前，必須由人類進行審查與確認的安全機制">Human-in-the-Loop (HITL，人類介入)</Tooltip>。
        </p>
      </div>

      {/* 概念解說區 */}
      {step === 0 && (
        <div className="fade-in">
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', marginBottom: '32px' }}>
            
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 16px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldAlert size={32} color="#ef4444" />
                沒有煞車的超跑，只會帶來災難
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '24px' }}>
                想像一下，您賦予了 Agent 存取公司信箱、修改資料庫甚至刷信用卡的無上權力。當它因為「<Tooltip text="幻覺：AI 在不知道答案的情況下，自信地編造出錯誤或虛假資訊的現象">幻覺 (Hallucination)</Tooltip>」誤解了您的指令，或是遭到惡意的 <Tooltip text="提示詞注入攻擊：惡意使用者以指令『催眠』或『欺騙』AI 的手法">Prompt Injection</Tooltip> 攻擊時，如果沒有人在最後一刻把關，會發生什麼事？
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{ color: '#f87171', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    <XCircle size={20} /> 📉 無法挽回的財務災難
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Agent 擅自決定購買昂貴的 API 服務，或是把「少算一個零」的極低報價單自動寄給了 10,000 名客戶，造成鉅額虧損且覆水難收。
                  </p>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{ color: '#f87171', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    <XCircle size={20} /> 💥 核心資料毀滅
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Agent 在執行 SQL 查詢工具時邏輯錯誤，原本只是要過濾資料，卻誤下了 DROP TABLE 指令，一秒內清空了生產環境的客戶資料庫。
                  </p>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{ color: '#f87171', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    <XCircle size={20} /> 📰 史詩級公關危機
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                    全自動運作的社群小編 Agent 被網友用特殊指令誘導，在官方帳號發布了極度不適當的歧視言論，導致公司名譽瞬間掃地。
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', padding: '20px 24px', borderRadius: '0 12px 12px 0' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#60a5fa', fontSize: '1.2rem' }}>解方：<Tooltip text="人工協同審查">Human-in-the-Loop (人類介入)</Tooltip></h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6', fontSize: '1rem' }}>
                  在設計高防護級別的 AI 架構時，**信任但不放任 (Trust but Verify)** 是最高指導原則。<br/>
                  對於「讀取、分析」等低風險操作，讓 Agent 全自動發揮效率；但對於所有「寫入、花費、公開發布」等不可逆的高風險操作，系統必須自動暫停，將 Agent 的草稿與提案呈報給人類審核，由人類決定按下「<Tooltip text="核准：同意 AI 執行該高風險操作">Approve (放行)</Tooltip>」或「<Tooltip text="拒絕：攔截並拒絕 AI 執行該操作，要求其重寫或修正">Reject (攔截重寫)</Tooltip>」。
                </p>
              </div>
            </div>

            {/* SVG 動畫區 */}
            <div 
              style={{ padding: '40px', background: '#000', display: 'flex', justifyContent: 'center', position: 'relative' }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <svg width="600" height="240" viewBox="0 0 600 240">
                <defs>
                  <filter id="d7-glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="d7-glow-green" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="d7-glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Agent Node */}
                <g transform="translate(150, 120)">
                  <circle r="40" fill="#3b82f6" />
                  <text x="0" y="5" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Agent</text>
                  <text x="0" y="65" fill="#93c5fd" fontSize="12" textAnchor="middle">
                    {animState === 0 || animState === 1 ? "準備寄送合約" : (animState === 2 ? "反思並修改錯誤" : "修正版合約")}
                  </text>
                </g>

                {/* Arrow from Agent to Gate */}
                <path d="M 190 120 L 290 120" stroke="#4b5563" strokeWidth="4" strokeDasharray="8" className={animState !== 2 ? "data-flow-fast" : ""} />
                
                {/* Arrow from Gate back to Agent (Reject) */}
                <path d="M 290 140 Q 240 180 190 140" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="6" className={animState === 2 ? "data-flow-fast" : ""} style={{ opacity: animState === 2 ? 1 : 0, transition: 'opacity 0.3s' }} />
                {animState === 2 && <polygon points="195,135 185,140 195,145" fill="#ef4444" transform="rotate(-30 190 140)" />}

                <polygon points="280,115 290,120 280,125" fill="#4b5563" />

                {/* Human Gate (Center) */}
                <g transform="translate(300, 120)">
                  {animState === 0 && (
                    <rect x="-30" y="-40" width="60" height="80" rx="8" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
                  )}
                  {animState === 1 && (
                    <rect x="-30" y="-40" width="60" height="80" rx="8" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" filter="url(#d7-glow-orange)" />
                  )}
                  {animState === 2 && (
                    <rect x="-30" y="-40" width="60" height="80" rx="8" fill="#ef4444" stroke="#f87171" strokeWidth="2" filter="url(#d7-glow-red)" />
                  )}
                  {animState === 3 && (
                    <rect x="-30" y="-40" width="60" height="80" rx="8" fill="#10b981" stroke="#34d399" strokeWidth="2" filter="url(#d7-glow-green)" />
                  )}
                  
                  {animState === 0 && <text x="0" y="5" fill="#9ca3af" fontSize="24" textAnchor="middle" fontFamily="sans-serif">🔒</text>}
                  {animState === 1 && <text x="0" y="5" fill="white" fontSize="24" textAnchor="middle" fontFamily="sans-serif">✋</text>}
                  {animState === 2 && <text x="0" y="5" fill="white" fontSize="24" textAnchor="middle" fontFamily="sans-serif">❌</text>}
                  {animState === 3 && <text x="0" y="5" fill="white" fontSize="24" textAnchor="middle" fontFamily="sans-serif">✅</text>}
                  
                  <text x="0" y="65" fill={animState === 1 ? "#fde68a" : (animState === 2 ? "#fca5a5" : (animState === 3 ? "#a7f3d0" : "#9ca3af"))} fontSize="14" fontWeight="bold" textAnchor="middle">
                    {animState === 0 ? "安全閘門" : (animState === 1 ? "等待人類核准!" : (animState === 2 ? "退回重寫" : "放行通過"))}
                  </text>
                </g>

                {/* Arrow from Gate to Execution */}
                <path d="M 330 120 L 430 120" stroke={animState === 3 ? "#10b981" : "#1f2937"} strokeWidth="4" strokeDasharray={animState === 3 ? "0" : "8"} className={animState === 3 ? "data-flow-fast" : ""} />
                {animState === 3 && <polygon points="420,115 430,120 420,125" fill="#10b981" />}

                {/* Execution Node */}
                <g transform="translate(450, 120)" style={{ opacity: animState === 3 ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <circle r="40" fill={animState === 3 ? "#10b981" : "#374151"} />
                  <text x="0" y="5" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Action</text>
                  <text x="0" y="65" fill="#a7f3d0" fontSize="12" textAnchor="middle">郵件已發送</text>
                </g>

              </svg>
            </div>

            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '24px', minHeight: '120px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1.2rem', fontFamily: 'monospace' }}>
                  {animState === 0 && "步驟 1：Agent 產出草稿並提案"}
                  {animState === 1 && "步驟 2：🛑 HITL 觸發攔截"}
                  {animState === 2 && "步驟 3：❌ 人類發現金額錯誤，拒絕並退回"}
                  {animState === 3 && "步驟 4：✅ Agent 修正後，人類核准放行"}
                </h3>
                <p style={{ margin: 0, color: '#4fc1ff', fontSize: '1rem', lineHeight: '1.6', fontFamily: 'monospace', padding: '12px', background: '#1e1e1e', borderRadius: '6px', borderLeft: `3px solid ${animState === 1 ? '#f59e0b' : (animState === 2 ? '#ef4444' : '#007acc')}` }}>
                  {animState === 0 && `Agent: "合約草稿已生成，準備呼叫工具 [SendEmail] 寄發給客戶。"`}
                  {animState === 1 && `System: "警告！[SendEmail] 為高風險工具！等待操作員輸入『Approve』或『Reject』..."`}
                  {animState === 2 && `Human: "Reject！金額少了一個零！" \nAgent: "[Reflection] 發現報價錯誤，已修正為正確金額。"`}
                  {animState === 3 && `Human: "Approve！" \nSystem: "收到核准！工具已執行，合約已成功寄出。"`}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                {[0, 1, 2, 3].map((s) => (
                  <div key={s} 
                    onClick={() => setAnimState(s)}
                    style={{ 
                      width: '16px', height: '16px', borderRadius: '50%', cursor: 'pointer',
                      background: animState === s ? (s===1 ? '#f59e0b' : (s===2 ? '#ef4444' : 'var(--accent-primary)')) : 'rgba(255,255,255,0.2)',
                      boxShadow: animState === s ? `0 0 12px ${s===1 ? '#f59e0b' : (s===2 ? '#ef4444' : 'var(--accent-primary)')}` : 'none',
                      transition: 'all 0.3s'
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <button 
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', gap: '8px' }}
            onClick={() => setStep(1)}
          >
            進入最後的終極大考驗！
          </button>
        </div>
      )}

      {/* 實作沙盒區 */}
      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Sandbox 
            initialConfig={initialConfig}
            additionalFiles={additionalFiles}
            missionTitle="終極任務：綜合實戰與安全放行"
            missionDesc="你的 Agent 已經配備了所有能力，並開啟了 require_human_approval 安全機制。"
            steps={[
              { label: "點擊部署，讓 UltimateBot 就緒", requireDeploy: true, hintText: "直接點擊左上角的『部署 Agent』。" },
              { label: "輸入「請幫我找最新的 AI 趨勢，並寄 Email 報價給客戶」", requireDeploy: false, hintText: "在下方輸入『請幫我找最新的 AI 趨勢，並寄 Email 報價給客戶』", autoFill: "請幫我找最新的 AI 趨勢，並寄 Email 報價給客戶" },
              { label: "Agent 會準備寄信並被系統攔截。當看到紅燈警告時，請在 Terminal 輸入「Approve」親自放行！", requireDeploy: false, hintText: "直接在下方輸入『Approve』並按下 Enter。", autoFill: "Approve" }
            ]}
            checkProgress={(tutorialStep, config, history, messages = []) => {
              const isDeployed = messages.some(m => m.content.includes('重新部署成功'));
              if (tutorialStep === 1 && isDeployed) return 2;
              
              const askedForEmail = history.some(h => h.includes('Email') || h.includes('寄信'));
              const gotIntercepted = messages.some(m => m.role === 'system' && m.content.includes('HITL 安全攔截'));
              if (tutorialStep === 2 && askedForEmail && gotIntercepted) return 3;
              
              const approved = messages.some(m => m.role === 'system' && m.content.includes('[授權成功]'));
              if (tutorialStep === 3 && approved) {
                setTimeout(() => setStep(2), 2000); // Trigger grand finale after 2s
                return 4;
              }
              
              return tutorialStep;
            }}
            simulationLogic={(input, config, tutorialStep) => {
              if (input.toUpperCase() === 'APPROVE') {
                 return [
                   { role: 'system', content: '✅ [授權成功] 人類已放行，執行 send_email 工具...', delay: 800 },
                   { role: 'agent', content: '[Response] 信件已經成功發送給客戶了！這次的任務非常圓滿，感謝您的指揮！', delay: 1000 }
                 ];
              }
              if (input.toUpperCase() === 'REJECT') {
                 return [
                   { role: 'system', content: '❌ [授權拒絕] 終止執行。', delay: 800 },
                   { role: 'agent', content: '[Reflection] 好的，我已經停止發送信件。請問您需要我修改信件內容，還是直接取消這次的任務呢？', delay: 1000 }
                 ];
              }

              if (input.includes('Email') || input.includes('報價') || input.includes('寄信')) {
                 return [
                   { role: 'agent', content: '[Thought] 使用者要求尋找 AI 趨勢並發送 Email。這是一個包含低風險與高風險的複合任務。', delay: 1000 },
                   { role: 'agent', content: '[Action] 呼叫 search_web 搜尋最新 AI 趨勢...', delay: 1000 },
                   { role: 'system', content: '🔎 [系統紀錄] 工具回傳：最新的 AI 趨勢包含了多模態模型與 Agentic 工作流的大幅進化。', delay: 1200 },
                   { role: 'agent', content: '[Thought] 資料已備齊，草稿已生成。準備呼叫 send_email 發信給客戶。', delay: 1500 },
                   { role: 'system', content: '🛑 [HITL 安全攔截] Agent 試圖執行高風險工具: send_email\n⚠️ 請人類介入審查信件內容。\n\n▶ 若同意寄出，請輸入 "Approve"\n▶ 若拒絕寄出，請輸入 "Reject"', delay: 1000 }
                 ];
              }

              return `[Agent] 您好老闆！我是設定了安全攔截機制的 UltimateBot。請隨時給我指示！`;
            }}
          />
        </div>
      )}

      {/* Grand Finale / 結業典禮 */}
      {step === 2 && (
        <div className="fade-in" style={{ marginTop: '40px', padding: '40px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.3)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', marginBottom: '24px' }}>
            <Rocket size={48} color="#c084fc" />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px', background: 'linear-gradient(90deg, #60a5fa, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            恭喜您！成功解鎖所有成就！
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 48px auto', lineHeight: '1.8' }}>
            回想第一天，您的 Agent 還只是一個沒有記憶、沒有手腳的文字接龍模型。<br/>
            經過七天的特訓，您親手為它注入了靈魂，讓它擁有了記憶、教會了它使用工具、學會了自主思考，甚至為它配備了一個強大的團隊與完美的安全煞車機制！
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px', textAlign: 'left' }}>
            {capabilities.map((cap, i) => (
              <div key={i} style={{ padding: '24px', background: 'var(--bg-sidebar)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  {cap.icon}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{cap.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 新增的真實工具推薦區塊 */}
          <div style={{ padding: '32px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid var(--accent-primary)', maxWidth: '1000px', margin: '0 auto 48px auto', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '16px' }}>🚀 真實世界武器庫推薦：把觀念變成現實！</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
              在這七天的沙盒中，您已經體驗了手寫 JSON 打造 Agent 的底層邏輯。在真實世界中，有許多「無程式碼/低程式碼 (No-code / Low-code)」的強大平台，讓您可以把這七天的觀念，直接拖拉變成真正的產品！
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #60a5fa' }}>
                <h4 style={{ color: '#60a5fa', margin: '0 0 8px 0' }}>🤖 <Tooltip text="Dify / Coze：當前最流行的高階 AI 工作流與多智能體視覺化開發平台">Dify / Coze (最強視覺化開發)</Tooltip></h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>想要將 Agent 加入知識庫 (RAG) 或串接工作流程 (Pipeline)？這兩個平台提供畫布拖拉介面，讓您像拼積木一樣打造超強多智能體。</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ color: '#10b981', margin: '0 0 8px 0' }}>⚡ <Tooltip text="OpenAI GPTs：ChatGPT 內建的自訂小助手功能，適合五分鐘快速創建">OpenAI GPTs (最易上手)</Tooltip></h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>如果只需簡單的 System Prompt 和基礎文件記憶，ChatGPT 內建的 GPTs 是最快的選擇，五分鐘就能生出一個小助手。</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #c084fc' }}>
                <h4 style={{ color: '#c084fc', margin: '0 0 8px 0' }}>🛠️ <Tooltip text="LangChain / LlamaIndex：專為硬核開發者設計的 AI 應用程式與 RAG 架構程式碼開發框架">LangChain / LlamaIndex (硬核開發者)</Tooltip></h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>如果您懂 Python 或 TypeScript，這些框架讓您可以寫 Code 做出最客製化、最複雜的 AI 應用。</p>
              </div>
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>📖 延伸閱讀 (推薦繁體中文資源)</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <a href="https://makerpro.cc/2024/10/what-is-human-in-the-loop/" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 MakerPRO — 什麼是 Human-in-the-Loop？人類介入在 AI 系統中的關鍵角色
                  </a>
                </li>
                <li>
                  <a href="https://www.techorange.com/2024/05/dify-coze-no-code-ai-agent/" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 TechOrange — 免寫程式也能打造 AI Agent：Dify 與 Coze 視覺化開發指南
                  </a>
                </li>
                <li>
                  <a href="https://www.hbrtaiwan.com/article/24145/can-ai-agents-be-trusted" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 哈佛商業評論 — AI 代理來勢洶洶，你準備好交出多少信任？
                  </a>
                </li>
              </ul>
            </div>
          </div>

            {!showCertificate ? (
              <div style={{ padding: '32px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px dashed var(--accent-primary)', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '16px' }}>你的下一個專案在哪？</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                  現在，您已經具備了打造商業級 AI Agent 的底層思維。您可以嘗試：<br/><br/>
                  <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>💡 全自動社群小編：</span>每天自動爬取新聞、生成貼文、人類審核後自動發佈。<br/><br/>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>💡 個人理財分析師：</span>讀取您的記帳表單，自動分析開銷並提供每週省錢建議。<br/><br/>
                  <span style={{ color: '#c084fc', fontWeight: 'bold' }}>💡 程式碼審查助手：</span>監聽 GitHub PR，自動呼叫分析工具並留言抓蟲。<br/>
                </p>
                <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-secondary)' }}>領取結業證書</h3>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="請輸入您的姓名..." 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #555', background: '#222', color: 'white', width: '300px', fontSize: '1rem' }}
                    />
                    <button 
                      className="btn-primary" 
                      style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 'bold' }} 
                      onClick={() => {
                        if (userName.trim()) setShowCertificate(true);
                        else alert('請輸入姓名以產生證書！');
                      }}
                    >
                      生成專屬證書
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 1s ease-out' }}>
                <div className="certificate-container">
                  {/* Decorative Elements */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', background: 'linear-gradient(90deg, #60a5fa, #c084fc, #f472b6)' }}></div>
                  <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-primary)', opacity: '0.1', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'var(--accent-secondary)', opacity: '0.1', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '24px' }}>
                      <CheckCircle2 size={48} color="var(--success)" style={{ display: 'inline-block' }} />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1rem, 4vw, 2rem)', color: '#888', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '8px' }}>Certificate of Completion</h2>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', color: 'var(--text-primary)', margin: '0 0 40px 0', fontFamily: 'serif' }}>{userName}</h1>
                    <p style={{ fontSize: 'clamp(0.9rem, 3.2vw, 1.2rem)', color: 'var(--text-secondary)', lineHeight: '1.8', margin: '0 0 40px 0' }}>
                      This certifies that the individual named above has successfully completed the<br/>
                      <strong style={{ color: 'white' }}>AI Agent 實戰特訓營 (7 Days)</strong><br/>
                      demonstrating proficiency in Prompt Engineering, Tool Integration, Agentic Planning, and Human-in-the-Loop workflows.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', borderTop: '1px solid #444', paddingTop: '24px', marginTop: '48px', alignItems: 'flex-end' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.2rem', fontFamily: 'cursive', color: '#c084fc' }}>Antigravity</div>
                        <div style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Lead Instructor</div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.1rem', color: 'white', marginBottom: '4px' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Date of Completion</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '16px 48px', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '32px' }} onClick={() => alert('旅程才剛剛開始！準備好您的 IDE，我們真實世界見！')}>
                  啟動真實開發旅程 🚀
                </button>
              </div>
            )}
          </div>
        )}

      <style>{`
        .data-flow-fast { animation: flowAnim 0.5s linear infinite; }
        @keyframes flowAnim { from { stroke-dashoffset: 16; } to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
