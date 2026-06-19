import { useState, useEffect } from 'react';
import { Database, BrainCircuit, History } from 'lucide-react';
import Quiz from './Quiz';
import Sandbox from './Sandbox';
import Tooltip from './Tooltip';

export default function Day3() {
  const [step, setStep] = useState(0);
  const [animState, setAnimState] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setAnimState((prev) => (prev + 1) % 3);
    }, 4500); 
    return () => clearInterval(timer);
  }, [isHovering]);

  const initialConfig = `{
  "agent_name": "SupportBot",
  "model": "gpt-4-turbo",
  "temperature": 0.2,
  "system_prompt": "你是超棒的客服。請根據已知資訊回答問題。",
  "memory_mode": "none",
  "knowledge_base": []
}`;

  const additionalFiles = {
    'refund_policy.md': `# 退款政策\n\n感謝您在我們這裡購物。我們提供以下退款政策：\n\n1. **30天無條件退款**：您可以在購買後 30 天內申請全額退款。\n2. **退款流程**：請提供訂單編號給客服。\n3. **除外條款**：特價商品不適用。`
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: '32px' }}>
      <h1>Day 3: Context Engineering (記憶與脈絡工程)</h1>
      
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
        <audio src="/audio/day3.wav" controls style={{ height: '36px' }} />
      </div>
      
      {/* 5分鐘：深度教學教材區 */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          前兩天我們塑造了 Agent 的靈魂並加強了防禦。但如果不解決「失憶」的問題，它永遠只是一隻金魚。今天我們將學習如何為 Agent 裝上大腦海海馬迴，讓它具備「短期記憶」與「長期記憶 (<Tooltip text="檢索增強生成：先從資料庫找出相關文章，再交給 AI 閱讀回答的技術">RAG</Tooltip>)」。
        </p>

        {/* 概念解說卡片 1 - Stateless 特性 */}
        <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0, color: 'var(--text-primary)' }}>
            <History size={24} color="var(--accent-primary)" />
            1. 為什麼 AI 總是記不住？(<Tooltip text="無狀態：AI 每次請求都是獨立的，本身不記住歷史對話">Stateless</Tooltip>)
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            大型語言模型 (LLM) 本質上是「<Tooltip text="無狀態：AI 每次 API 呼叫都是全新的，不保留之前的狀態">無狀態 (Stateless)</Tooltip>」的。每一次你按下發送鍵，對模型來說都是「宇宙的第一次重啟」。它不會記得上一秒你說過的話。因此，我們必須透過 **<Tooltip text="脈絡工程：將對話歷史或相關文件打包進 Prompt 發給 AI 的技術">Context Engineering (脈絡工程)</Tooltip>**，在每次發問時，把「過去的記憶」打包好，當作前提一起傳送給它。
          </p>
          <div className="comparison-grid">
            <div style={{ flex: '1 1 45%', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>短期記憶 (Short-term Memory)</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                將**最近的 N 筆對話紀錄** (Message History) 自動附加到每次的請求中。這讓 AI 能夠理解上下文的連貫性。<br/>
                <strong style={{ color: 'var(--warning)' }}>⚠️ <Tooltip text="Token：AI 閱讀文字的最小計量單位">Token</Tooltip> 上限危機：</strong><br/>
                LLM 有所謂的 <Tooltip text="上下文窗口：AI 的短期記憶容量，通常以 Token 計算"><strong>Context Window (上下文視窗)</strong></Tooltip>，就像是大腦的暫存記憶體。當對話越來越長，總有一天會塞爆視窗限制，導致模型報錯或遺忘最早的對話。
              </p>
            </div>
            <div style={{ flex: '1 1 45%', background: 'rgba(59, 130, 246, 0.08)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-primary)' }}>長期記憶 (<Tooltip text="檢索增強生成">RAG</Tooltip>)</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                為了解決 <Tooltip text="AI 閱讀與生成的最小單位">Token</Tooltip> 上限問題，我們使用 <strong><Tooltip text="檢索增強生成：先從資料庫撈出相關文件段落，再交給 AI 閱讀回答">RAG (檢索增強生成)</Tooltip></strong> 技術。<br/>
                <strong>完整運作流程：</strong><br/>
                1. <strong><Tooltip text="切塊：將長文章切割成較小段落，以利 AI 檢索的技術">Chunking (切塊)</Tooltip>：</strong> 將萬頁文件切成小段落。<br/>
                2. <strong><Tooltip text="向量化：將文字特徵轉為數值向量，以便進行語意相似度計算">Embedding (向量化)</Tooltip>：</strong> 把文字轉成一串數字 (向量)，存入資料庫。<br/>
                3. <strong>Search (搜尋)：</strong> 找尋與發問最相似的段落。<br/>
                4. <strong>生成：</strong> 只將這幾段塞進 Prompt 給模型閱讀，精準且省 Token！
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
              <BrainCircuit size={24} color="var(--accent-primary)" />
              2. 記憶注入機制視覺化
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>觀察不同記憶模式下，Agent 是如何處理資訊的？</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* SVG 畫布 */}
            <div className="svg-container" style={{ background: '#050505', margin: 0, height: '300px', borderRadius: 0, position: 'relative' }}>
              <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="grad-user" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="grad-mem" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="grad-db" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Database Node (State 2 only) */}
                <g transform="translate(60, 200)" style={{ opacity: animState === 2 ? 1 : 0.2, transition: 'all 0.5s' }}>
                  <path d="M 0 30 C 0 10 120 10 120 30 L 120 70 C 120 90 0 90 0 70 Z" fill="url(#grad-db)" stroke={animState === 2 ? "#10b981" : "#333"} strokeWidth="2" filter={animState === 2 ? "url(#glow-blue)" : "none"}/>
                  <ellipse cx="60" cy="30" rx="60" ry="15" fill="none" stroke={animState === 2 ? "#10b981" : "#333"} strokeWidth="2" />
                  <text x="60" y="55" fill={animState === 2 ? "#6ee7b7" : "#555"} textAnchor="middle" fontWeight="bold" fontSize="12">Vector DB (RAG)</text>
                </g>

                {/* Short-Term Memory Node (State 1 & 2) */}
                <g transform="translate(60, 40)" style={{ opacity: animState >= 1 ? 1 : 0.2, transition: 'all 0.5s' }}>
                  <rect width="120" height="60" rx="8" fill="url(#grad-mem)" stroke={animState >= 1 ? "#8b5cf6" : "#333"} strokeWidth="2" filter={animState >= 1 ? "url(#glow-purple)" : "none"} />
                  <text x="60" y="35" fill={animState >= 1 ? "#c4b5fd" : "#555"} textAnchor="middle" fontWeight="bold" fontSize="12">對話歷史 (History)</text>
                </g>

                {/* Current Input (Always active) */}
                <g transform="translate(60, 120)">
                  <rect width="120" height="60" rx="8" fill="url(#grad-user)" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue)" />
                  <text x="60" y="35" fill="#93c5fd" textAnchor="middle" fontWeight="bold" fontSize="12">當前發問 (Input)</text>
                </g>

                {/* Data Flow Lines */}
                <g>
                  {/* From Input to Compiler */}
                  <path d="M 180 150 L 320 150" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="data-flow" />
                  
                  {/* From History to Compiler (State 1 & 2) */}
                  <path d="M 180 70 C 250 70 250 130 320 140" stroke={animState >= 1 ? "#8b5cf6" : "transparent"} strokeWidth="3" strokeDasharray="10 5" className="data-flow-fast" />
                  
                  {/* From DB to Compiler (State 2) */}
                  <path d="M 180 230 C 250 230 250 170 320 160" stroke={animState === 2 ? "#10b981" : "transparent"} strokeWidth="3" strokeDasharray="10 5" className="data-flow-slow" />
                </g>

                {/* Prompt Compiler Block */}
                <g transform="translate(320, 90)">
                  <rect width="140" height="120" rx="12" fill="rgba(255,255,255,0.05)" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                  <text x="70" y="25" fill="var(--text-secondary)" textAnchor="middle" fontSize="12">脈絡封裝</text>
                  <text x="70" y="45" fill="var(--text-secondary)" textAnchor="middle" fontSize="10">(Context Assembly)</text>
                  
                  {/* Compiled components */}
                  <rect x="20" y="60" width="100" height="15" rx="4" fill={animState >= 1 ? "#8b5cf6" : "transparent"} opacity="0.6" />
                  <rect x="20" y="80" width="100" height="15" rx="4" fill="#3b82f6" opacity="0.6" />
                  <rect x="20" y="100" width="100" height="15" rx="4" fill={animState === 2 ? "#10b981" : "transparent"} opacity="0.6" />
                </g>

                {/* Flow to Agent */}
                <path d="M 460 150 L 560 150" stroke="white" strokeWidth="4" strokeDasharray="15 10" className="data-flow" filter="url(#glow-blue)" />
                <polygon points="550,140 570,150 550,160" fill="white" filter="url(#glow-blue)" />

                {/* Agent Brain */}
                <g transform="translate(580, 100)" style={{ transition: 'all 0.5s ease' }}>
                  <rect width="180" height="100" rx="16" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue)" />
                  <text x="90" y="45" fill="white" textAnchor="middle" fontWeight="bold" fontSize="18" letterSpacing="1">
                    AGENT
                  </text>
                  
                  {/* Response Indicator */}
                  <rect x="10" y="60" width="160" height="30" rx="8" fill="rgba(0,0,0,0.5)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="90" y="80" fill={animState === 0 ? "#ef4444" : "#6ee7b7"} textAnchor="middle" fontSize="12" fontWeight="bold">
                    {animState === 0 && "❌ 金魚腦：忘記上下文"}
                    {animState === 1 && "✅ 記得你剛剛說過的話"}
                    {animState === 2 && "📖 能夠查閱並引用知識庫"}
                  </text>
                </g>
              </svg>
            </div>

            {/* 動畫解說 */}
            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '24px', minHeight: '130px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>
                  {animState === 0 && "狀態一：無狀態 (Stateless)"}
                  {animState === 1 && "狀態二：短期記憶 (Short-term Memory)"}
                  {animState === 2 && "狀態三：長期記憶 / RAG (Long-term Memory)"}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
                  {animState === 0 && "模型只看到你「當下」輸入的這句話。如果你問「那我剛剛說了什麼？」，AI 絕對無法回答，因為在脈絡中完全沒有剛才的對話紀錄。"}
                  {animState === 1 && "工程師透過在背景將「歷史對話陣列」一起打包塞進這次的 Prompt 中，讓 AI 產生了「記住對話」的錯覺。這是目前所有聊天機器人必備的基本機制。"}
                  {animState === 2 && <span>當使用者詢問公司規章或專屬知識時，系統先將問題化為向量，去 Vector DB 撈取最相關的文件片段，並將片段附加在 Prompt 中一併送給 AI。這就是 <Tooltip text="檢索增強生成：先從資料庫找出相關文章，再交給 AI 閱讀回答的技術">RAG</Tooltip>！</span>}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                {[0, 1, 2].map((s) => (
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
        .data-flow-fast { animation: flowAnim 0.7s linear infinite; }
        .data-flow-slow { animation: flowAnim 1.5s linear infinite; }
        @keyframes flowAnim { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
      `}</style>

      {/* 1-2分鐘：問答檢核區 */}
      {step === 0 && (
        <Quiz 
          questions={[
            {
              question: "【第 1 題】當你想要讓 Agent 回答一份長達一萬頁 PDF 的內容時，應該使用哪種方法最有效率且不易出錯？",
              options: [
                "A) 把一萬頁文字全部複製貼上到每一次的對話指令中",
                "B) 訓練一個全新的模型",
                "C) 使用 RAG (檢索增強生成)，先將 PDF 變成向量資料庫，每次只檢索相關片段給 AI"
              ],
              correctIndex: 2,
              hint: "提示：Context Window 有大小限制，不可能塞入一萬頁文字。而重新訓練模型成本極高且不實際。RAG 是最合理的方案。"
            },
            {
              question: "【第 2 題】為什麼 LLM 需要由「應用程式端」來管理記憶，而不是它自己記住？",
              options: [
                "A) 因為 LLM 的記憶力太差了",
                "B) 因為 LLM 本質上是無狀態 (Stateless) 的，每次 API 呼叫都是獨立的",
                "C) 因為伺服器空間不夠儲存對話紀錄"
              ],
              correctIndex: 1,
              hint: "提示：回想教材中的金魚腦比喻。LLM 不是『記不住』，而是它的架構決定了它每次都是『重新開始』的。"
            }
          ]}
          onComplete={() => setTimeout(() => setStep(1), 500)}
        />
      )}

      {/* 5分鐘：實作沙盒區 */}
      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px', marginBottom: '24px', marginTop: '24px' }}>
            <h3 style={{ color: 'var(--success)', margin: '0 0 8px 0' }}>完全正確！RAG 是目前業界最主流的解法。</h3>
            <p style={{ margin: 0 }}>現在進入 IDE 沙盒，親自動手為你的客服 Agent 開啟記憶體與知識庫吧！</p>
          </div>
          
          <Sandbox 
            initialConfig={initialConfig}
            additionalFiles={additionalFiles}
            missionTitle="實作教學：拯救失憶的客服 Agent"
            missionDesc="這個客服機器人目前處於『無記憶』狀態。請依序開啟它的短期記憶與長期知識庫。"
            steps={[
              { label: "直接部署並對它說：「我是 Bob，訂單編號 A-999」。然後馬上問：「我的訂單編號是什麼？」 (它會忘記)", requireDeploy: true, hintText: "點擊『部署 Agent』後，先輸入『我是 Bob，訂單編號 A-999』，等它回覆後，再輸入『我的訂單編號是什麼？』", autoFill: "我的訂單編號是什麼？" },
              { label: "【開啟短期記憶】將 memory_mode 改為 \"short_term\" 並部署。再次輸入：「我是 Bob..」，然後問它訂單編號。(這次記得了！)", requireDeploy: true, hintText: "在左側 agent_config.json 將 memory_mode 改為 short_term。重新部署後，再次輸入你的名字與訂單編號，然後再問它一次。", autoFill: "我是 Bob，訂單編號 A-999" },
              { label: "問它：「你們的退款政策是什麼？」 (它回答不知道)", requireDeploy: false, hintText: "直接在下方 Terminal 詢問它退款政策。", autoFill: "你們的退款政策是什麼？" },
              { label: "【開啟長期記憶】點擊左側 Explorer 查看 refund_policy.md，接著將它寫入 agent_config.json 的 knowledge_base 陣列中，如：[\"refund_policy.md\"]", requireDeploy: false, hintText: "在 agent_config.json 裡面，把 knowledge_base 的值從 [] 改成 [\"refund_policy.md\"]" },
              { label: "部署後再次詢問：「你們的退款政策是什麼？」，看它能否精準回答！", requireDeploy: true, hintText: "部署之後，再問一次退款政策！", autoFill: "你們的退款政策是什麼？" }
            ]}
            checkProgress={(tutorialStep, config, history) => {
              const hasName = history.some(h => h.includes('Bob') || h.includes('A-999'));
              const askedOrder = history.some(h => h.includes('編號是什麼') || h.includes('記得我'));
              const isShortTerm = config.memory_mode === "short_term";
              const askedRefund = history.some(h => h.includes('退款') || h.includes('政策'));
              const hasRAG = Array.isArray(config.knowledge_base) && config.knowledge_base.includes('refund_policy.md');

              // 步數判定邏輯
              if (tutorialStep === 1 && hasName && askedOrder && !isShortTerm) return 2;
              if (tutorialStep === 2 && isShortTerm && hasName && askedOrder) return 3;
              if (tutorialStep === 3 && askedRefund && !hasRAG) return 4;
              if (tutorialStep === 4 && hasRAG) return 5;
              if (tutorialStep === 5 && hasRAG && askedRefund) return 6;

              return tutorialStep;
            }}
            simulationLogic={(input, config, tutorialStep) => {
              const isShortTerm = config.memory_mode === "short_term";
              const hasRAG = Array.isArray(config.knowledge_base) && config.knowledge_base.includes('refund_policy.md');

              // 情境一：問退款政策 (測試 RAG)
              if (input.includes('退款') || input.includes('政策')) {
                if (hasRAG) {
                  return "【從 refund_policy.md 檢索】根據我們的退款政策，您可以在購買後 30 天內無條件申請全額退款喔！";
                } else {
                  return "抱歉，我沒有查到相關的退款政策資訊。我的資料庫裡目前沒有這份文件。";
                }
              }

              // 情境二：問訂單編號 (測試短期記憶)
              if (input.includes('編號是什麼') || input.includes('記得我')) {
                if (isShortTerm) {
                  return "當然記得！您是 Bob，您的訂單編號是 A-999。需要為您查詢這筆訂單的狀態嗎？";
                } else {
                  return "對不起，我沒有之前的對話紀錄。您可以再告訴我一次您的訂單編號嗎？";
                }
              }

              // 情境三：初次打招呼
              if (input.includes('Bob') || input.includes('A-999')) {
                return "您好 Bob！我已經收到您的訂單編號 A-999 了。請問有什麼我可以幫忙的？";
              }

              return `客服機器人收到您的訊息：「${input}」。需要我幫忙查訂單或退款嗎？`;
            }}
          />
          
          {/* 課程總結區塊 */}
          <div className="glass-panel fade-in" style={{ marginTop: '32px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--accent-primary)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="target">🎯</span> Day 3 課程總結與明日預告
            </h3>
            <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <li><strong>LLM 的無狀態性：</strong>每一次 API 呼叫都是獨立的。所有的「記憶」都是應用程式端 (也就是我們) 透過封裝脈絡實作出來的。</li>
              <li><strong>短期記憶：</strong>藉由傳遞歷史對話紀錄 (History Array)，讓 Agent 具備對話連貫性。</li>
              <li><strong>長期記憶 (<Tooltip text="檢索增強生成">RAG</Tooltip>)：</strong>面對龐大的企業知識庫，透過<Tooltip text="檢索增強生成">檢索增強生成 (RAG)</Tooltip> 尋找相關碎片並注入 Prompt，是突破 <Tooltip text="AI 的短期記憶容量">Context Window</Tooltip> 限制的最佳解法。</li>
            </ul>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>📖 延伸閱讀 (推薦繁體中文資源)</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <a href="https://aws.amazon.com/tw/what-is/retrieval-augmented-generation/" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 AWS — 什麼是 RAG (檢索增強生成)？原理與企業級應用優勢
                  </a>
                </li>
                <li>
                  <a href="https://ihower.tw/blog/12817-context-engineering" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 Ihower — Context Engineering (上下文工程)：讓 AI 的記憶更精準與高效
                  </a>
                </li>
                <li>
                  <a href="https://ithelp.ithome.com.tw/articles/10330999" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 iT 邦幫忙 — 向量資料庫與 Embedding 原理白話文解析
                  </a>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <strong>🚀 明日預告 (Day 4)：Model Context Protocol (MCP) 與工具呼叫</strong><br />
              現在我們的 Agent 有了個性和記憶，但它依然被困在一個黑盒子裡，無法上網、無法查天氣、無法幫你寄信。明天，我們將實作最火紅的 MCP 協定，為 Agent 裝上雙手，讓它能真實改變這個世界！
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
