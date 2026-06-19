import { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import Quiz from './Quiz';
import Sandbox from './Sandbox';
import Tooltip from './Tooltip';

export default function Day1() {
  const [step, setStep] = useState(0);
  const [animState, setAnimState] = useState(0);

  // Auto loop the animation states for demonstration (paused if user hovers)
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setAnimState((prev) => (prev + 1) % 3);
    }, 5000); // Slower loop for longer reading time
    return () => clearInterval(timer);
  }, [isHovering]);

  const initialConfig = `{
  "agent_name": "EchoAgent",
  "model": "gpt-4-turbo",
  "temperature": 0.1,
  "system_prompt": "你是一個基礎的 AI Agent。"
}`;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: '32px' }}>
      <h1>Day 1: AI Agent 與大腦機制初探</h1>
      
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
        <audio src="/audio/day1.wav" controls style={{ height: '36px' }} />
      </div>
      
      {/* 5分鐘：深度教學教材區 */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          歡迎來到特訓營的第一天！在今天，我們將釐清一個最核心的觀念：<strong><Tooltip text="人工智慧代理：不只是聊天，還具備自主規劃、記憶與使用工具完成任務能力的 AI 系統">AI Agent (人工智慧代理)</Tooltip> 到底是什麼？它和我們平常用的 <Tooltip text="ChatGPT：由 OpenAI 開發的對話式大型語言模型">ChatGPT</Tooltip> 有什麼不同？</strong>
        </p>

        {/* 概念解說卡片 1 */}
        <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0, color: 'var(--text-primary)' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
            1. 傳統對話模型 vs AI Agent
          </h2>
          <div className="comparison-grid">
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--text-secondary)' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>傳統 <Tooltip text="聊天機器人：依賴固定腳本或對話，但缺乏自主規劃與工具調用能力的系統">Chatbot</Tooltip> (如早期的 <Tooltip text="ChatGPT：由 OpenAI 開發的對話式大型語言模型">ChatGPT</Tooltip>)</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                就像一本「會說話的超強百科全書」。你問問題，它根據過去背誦的記憶回答你。如果資訊過時，它無能為力；如果你叫它「幫我訂明天的機票」，它只能告訴你「如何訂機票」，但<strong>無法代替你執行</strong>。
              </p>
            </div>
            <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.08)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-primary)' }}><Tooltip text="人工智慧代理：具備規劃、記憶與使用工具能力的自主 AI 系統">AI Agent (人工智慧代理)</Tooltip></h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                就像一個「數位實習生」。它不只能對話，它具備了<strong><Tooltip text="規劃能力：大腦將複雜任務拆解成多個步驟，並決定執行順序的能力">規劃能力 (Planning)</Tooltip></strong> 與 <strong><Tooltip text="行動能力：透過調用外部工具、API 或生成特定內容來執行任務的能力">行動能力 (Action)</Tooltip></strong>。當你說「幫我訂機票」，它會先上網查航班、接著登入訂票系統、最後用你的信用卡結帳。它能「代理」你完成任務。
              </p>
            </div>
          </div>
        </div>

        {/* 概念解說卡片 2 - 動畫區結合深度閱讀 */}
        <div 
          className="glass-panel" 
          style={{ marginTop: '24px', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Sparkles size={24} color="var(--accent-secondary)" />
              2. 拆解 Agent 的三步大腦運作機制
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>將滑鼠移入下方區塊可暫停動畫。點擊右側圓點可切換詳細解說。</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* SVG 畫布 */}
            <div className="svg-container" style={{ background: '#0a0a0a', margin: 0, height: '280px', borderRadius: 0 }}>
              <svg viewBox="0 0 800 260" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="d1-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                  </linearGradient>
                </defs>

                {/* User Input */}
                <g transform="translate(50, 100)" style={{ opacity: animState >= 0 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                  <rect width="120" height="60" rx="8" fill="rgba(255,255,255,0.1)" stroke={animState === 0 ? 'var(--accent-primary)' : 'var(--border-color)'} strokeWidth={animState === 0 ? 3 : 1} />
                  <text x="60" y="35" fill="white" textAnchor="middle" fontWeight="bold">使用者指令</text>
                </g>

                {/* Arrow 1 */}
                <path d="M 170 130 L 280 130" stroke={animState === 0 ? "var(--accent-primary)" : "var(--text-secondary)"} strokeWidth="4" strokeDasharray="8" className={animState === 0 ? "animate-dash" : ""} style={{ opacity: animState >= 0 ? 1 : 0.3 }} />
                <polygon points="275,125 285,130 275,135" fill={animState === 0 ? "var(--accent-primary)" : "var(--text-secondary)"} />

                {/* Agent Brain */}
                <g transform="translate(300, 80)" style={{ opacity: animState >= 1 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                  <rect width="200" height="100" rx="16" fill={animState === 1 ? 'url(#d1-glow)' : 'rgba(255,255,255,0.05)'} fillOpacity={animState === 1 ? 0.3 : 1} stroke={animState === 1 ? 'url(#d1-glow)' : 'var(--border-color)'} strokeWidth="2" />
                  <text x="100" y="45" fill="white" textAnchor="middle" fontWeight="bold" fontSize="18">Agent 大腦</text>
                  <text x="100" y="70" fill="var(--text-secondary)" textAnchor="middle" fontSize="14">(LLM 推理引擎)</text>
                  {animState === 1 && <circle cx="100" cy="50" r="80" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="4 8">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 50" to="360 100 50" dur="4s" repeatCount="indefinite"/>
                  </circle>}
                </g>

                {/* Arrow 2 */}
                <path d="M 500 130 L 610 130" stroke={animState === 2 ? "var(--success)" : "var(--text-secondary)"} strokeWidth="4" strokeDasharray="8" className={animState === 2 ? "animate-dash" : ""} style={{ opacity: animState >= 2 ? 1 : 0.3 }} />
                <polygon points="605,125 615,130 605,135" fill={animState === 2 ? "var(--success)" : "var(--text-secondary)"} />

                {/* Tool / Output */}
                <g transform="translate(630, 100)" style={{ opacity: animState >= 2 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                  <rect width="120" height="60" rx="8" fill={animState === 2 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)'} stroke={animState === 2 ? 'var(--success)' : 'var(--border-color)'} strokeWidth={animState === 2 ? 3 : 1} />
                  <text x="60" y="35" fill={animState === 2 ? 'var(--success)' : 'white'} textAnchor="middle" fontWeight="bold">輸出 / 回覆</text>
                </g>
              </svg>
            </div>

            {/* 動畫深度說明列 */}
            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '24px', minHeight: '140px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                  {animState === 0 && "步驟一：感知 (Perception) - 從混亂中萃取意圖"}
                  {animState === 1 && "步驟二：大腦推理 (Reasoning) - 思考解決方案"}
                  {animState === 2 && "步驟三：執行與輸出 (Action) - 生成回應或觸發行動"}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
                  {animState === 0 && "人類的語言充滿模糊性，例如「幫我查一下明天的天氣，啊順便看看台積電」。Agent 的第一步是利用 LLM 作為語意分析器，精準拆解出這句話包含了兩個具體任務：查天氣、查股價。這比傳統的按鈕介面強大得多。"}
                  {animState === 1 && <span>一旦確立了任務，LLM 大腦進入了「內心獨白 (Inner Monologue)」階段。它會評估手上有哪些工具可用、該用什麼策略解決問題。這稱為 <Tooltip text="推理與行動框架：讓 AI 交替進行『思考』與『執行工具』的自主決策架構">ReAct (Reasoning and Acting) 框架</Tooltip>——先推理、再行動。</span>}
                  {animState === 2 && "最後一步，Agent 根據推理結果產生輸出。這個輸出可能是一段文字回覆、也可能是一個工具呼叫指令（我們會在 Day 4 深入探討）。取得結果後，Agent 會包裝成人類聽得懂的自然語言回報給你。"}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                {[0, 1, 2].map((s) => (
                  <div key={s} 
                    onClick={() => setAnimState(s)}
                    style={{ 
                      width: '16px', height: '16px', borderRadius: '50%', cursor: 'pointer',
                      background: animState === s ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.3s',
                      boxShadow: animState === s ? '0 0 10px var(--accent-primary)' : 'none'
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 概念解說卡片 3 */}
        <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0, color: 'var(--text-primary)' }}>
            <AlertCircle size={24} color="var(--success)" />
            3. 如何創造一個 Agent？認識設定檔
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            創造一個 Agent 不需要從零開始寫成千上萬行的神經網路程式碼。現代的開發方式，是準備一份 <strong><Tooltip text="JavaScript 對象簡譜：一種輕量級、易於人類閱讀和編寫的數據交換格式">JSON 格式的設定檔</Tooltip></strong>，這份設定檔就像是賦予它靈魂的「基因代碼」。<br/><br/>
            在接下來的實作中，我們將親手調整 <Tooltip text="溫度：控制 AI 回答創造力與隨機度的參數。數值越高回答越有創意但易胡言亂語，越低則越穩定嚴謹"><code>temperature</code></Tooltip> (創造力) 與 <Tooltip text="系統提示詞：設定 AI 的人設、底線與最高指導原則">system_prompt</Tooltip> (人設靈魂)，見證模型從一個空殼變成有個性的智慧體。
          </p>
        </div>
      </div>

      <style>{`
        .animate-dash {
          animation: dashMove 1s linear infinite;
        }
        @keyframes dashMove {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* 1-2分鐘：問答檢核區 (多題) */}
      {step === 0 && (
        <Quiz 
          questions={[
            {
              question: "【第 1 題】以下哪一個情境屬於具備「行動能力」的完整 AI Agent？",
              options: [
                "A) 你問它天氣，它回答「我無法連上網路，但我可以寫一首關於天氣的詩」",
                "B) 你跟它說「幫我把這些信件分類」，它分析收件匣並自動將廣告信移到垃圾桶",
                "C) 你輸入數學公式，它能列出詳細的解題步驟算給你聽"
              ],
              correctIndex: 1,
              hint: "提示：Agent 的核心差異是「能代替你執行任務」。選項 A 和 C 都只是「生成文字」，只有 B 真正「操作了」信件系統。"
            },
            {
              question: "【第 2 題】AI Agent 的三步大腦運作機制，正確的順序是？",
              options: [
                "A) 執行工具 → 推理思考 → 接收指令",
                "B) 接收指令 → 推理思考 → 執行/輸出",
                "C) 推理思考 → 接收指令 → 執行工具"
              ],
              correctIndex: 1,
              hint: "回想一下動畫裡的流程：先「感知」使用者說了什麼，再「推理」該怎麼做，最後才「行動」產出結果。"
            }
          ]}
          onComplete={() => setTimeout(() => setStep(1), 500)}
        />
      )}

      {/* 5分鐘：實作沙盒區 */}
      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px', marginBottom: '24px', marginTop: '24px' }}>
            <h3 style={{ color: 'var(--success)', margin: '0 0 8px 0' }}>太棒了！觀念非常扎實。</h3>
            <p style={{ margin: 0 }}>現在進入 IDE 沙盒，親手調整設定檔，體驗 Temperature 與 System Prompt 對 Agent 行為的影響吧！</p>
          </div>
          <Sandbox 
            initialConfig={initialConfig}
            missionTitle="實作教學：體驗 Temperature 與 System Prompt"
            missionDesc="先感受 Temperature 對回答的影響，再透過修改 System Prompt 賦予 Agent 全新人格！"
            steps={[
              { label: "部署後輸入兩次「說一個笑話」，觀察回答是否幾乎一模一樣 (低 temperature)", requireDeploy: true, hintText: "在下方 Terminal 輸入『說一個笑話』並按下 Enter，重複兩次。", autoFill: "說一個笑話" },
              { label: "將 temperature 改為 0.9，重新部署後再聽笑話 (回答變得豐富多變！)", requireDeploy: true, hintText: "在左側 Explorer 點擊 agent_config.json，用『圖形介面』把 Temperature 拉到 0.9，點擊『部署 Agent』，然後在下方再輸入一次『說一個笑話』。", autoFill: "說一個笑話" },
              { label: "【靈魂工程初體驗】將 system_prompt 改為「你是一隻傲嬌的貓娘，每句話都要加喵」", requireDeploy: false, hintText: "在左側的 System Prompt 輸入框，把文字清空，改成：你是一隻傲嬌的貓娘，每句話都要加喵" },
              { label: "部署後隨意跟它對話，觀察人設如何徹底改變 Agent 的行為！", requireDeploy: true, hintText: "記得點擊『部署 Agent』後，在下方輸入任何你想說的話，例如『早安』。", autoFill: "早安" }
            ]}
            checkProgress={(tutorialStep, config, history) => {
              const jokeCount = history.filter(h => h.includes('笑話')).length;
              if (tutorialStep === 1 && jokeCount >= 2 && config.temperature <= 0.1) return 2;
              if (tutorialStep === 2 && config.temperature >= 0.8) return 3;
              if (tutorialStep === 3 && (config.system_prompt.includes('貓') || config.system_prompt.includes('喵') || config.system_prompt.includes('傲嬌'))) return 4;
              if (tutorialStep === 4 && history.length > 0 && (config.system_prompt.includes('貓') || config.system_prompt.includes('喵'))) return 5;
              return tutorialStep;
            }}
            simulationLogic={(input, config, tutorialStep) => {
              // 貓娘人設判斷
              if (config.system_prompt && (config.system_prompt.includes('貓') || config.system_prompt.includes('喵') || config.system_prompt.includes('傲嬌'))) {
                if (input.includes('笑話')) {
                  return `哼，本喵大人才不想說笑話呢...好啦好啦！為什麼貓不會打撲克牌？因為牠們總是露出「爪」子啦！喵～ 🐱`;
                }
                return `哼！才...才不是因為想回答你才說的呢！你說「${input}」？本喵大人知道答案，但就是不想告訴你...算了，看你這麼可憐就回答你一次吧！喵～ 🐱`;
              }
              // 笑話測試
              if (input.includes('笑話')) {
                if (config.temperature <= 0.1) {
                  return "這是一個笑話：為什麼雞要過馬路？因為要到對面去。";
                } else {
                  const creativeJokes = [
                    "為什麼企鵝只有肚子是白的？因為手短洗不到後背！🐧",
                    "有一天，番茄跑贏了小黃瓜，番茄就說：『哈哈哈，我超越你了！』🍅",
                    "你知道為什麼海是藍色的嗎？因為魚都在裡面『Blue Blue Blue』地吐泡泡... 🐟"
                  ];
                  return creativeJokes[Math.floor(Math.random() * creativeJokes.length)];
                }
              }
              return `我收到你的訊息：「${input}」。我的 Temperature 設定是 ${config.temperature}。`;
            }}
          />
          
          {/* 1-2分鐘：課程總結區塊 */}
          <div className="glass-panel fade-in" style={{ marginTop: '32px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--accent-primary)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="target">🎯</span> Day 1 課程總結與明日預告
            </h3>
            <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <li><strong>核心觀念建立：</strong><Tooltip text="人工智慧代理">AI Agent</Tooltip> 不等於 <Tooltip text="聊天機器人">Chatbot</Tooltip>。Agent 具備「感知指令 → 大腦推理 → 執行行動」的完整能力。</li>
              <li><strong>拆解大腦結構：</strong>我們認識了驅動 Agent 的 <Tooltip text="JSON 格式設定檔">JSON 設定檔</Tooltip>，包含 <Tooltip text="底層 AI 語言模型，如 gpt-4 或 gemini-1.5"><code style={{ color: 'var(--text-primary)' }}>model</code></Tooltip> (大腦引擎)、<Tooltip text="控制 AI 隨機度與創造力的參數"><code style={{ color: 'var(--text-primary)' }}>temperature</code></Tooltip> (創造力)、以及最重要的 <Tooltip text="系統提示詞：設定 AI 的底線人設與最高指導原則"><code style={{ color: 'var(--text-primary)' }}>system_prompt</code></Tooltip> (靈魂人設)。</li>
              <li><strong>做中學體驗：</strong>透過實際調整 Temperature 與 System Prompt，見證了同一個 Agent 從死板到創意、從普通助理到傲嬌貓娘的巨大轉變！</li>
            </ul>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>📖 延伸閱讀 (推薦繁體中文資源)</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <a href="https://www.hbrtaiwan.com/article/24164/agentic-ai-is-already-changing-the-workforce" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 哈佛商業評論 — 數位隊友上線！你有準備「人+AI代理」的勞動力策略嗎？
                  </a>
                </li>
                <li>
                  <a href="https://medium.com/seaniap/ai%E8%BC%B8%E5%87%BA%E7%9A%84%E8%AA%BF%E7%AF%80%E8%A1%93-%E4%BA%86%E8%A7%A3openai%E7%9A%84temperature%E8%88%87top-p%E5%8F%83%E6%95%B8-d849e29dc505" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 Medium — AI 輸出的調節術：了解 OpenAI 的 Temperature 與 Top-P 參數
                  </a>
                </li>
                <li>
                  <a href="https://ithelp.ithome.com.tw/articles/10381183" target="_blank" rel="noopener noreferrer" className="reading-link">
                    🔗 iT 邦幫忙 — [Day 2] 什麼是 AI Agent？
                  </a>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <strong>🚀 明日預告 (Day 2)：靈魂工程與防護欄</strong><br />
              明天我們將深入探討 <code>system_prompt</code>，學習如何撰寫讓 Agent 變聰明的魔法咒語 (<Tooltip text="提示詞工程：設計與優化給 AI 的指令，以獲得最精準回答的技術">Prompt Engineering</Tooltip>)；更重要的是，我們將實作「安全防護欄 (<Tooltip text="限制 AI 輸出邊界的安全規則與防護網，避免 AI 胡言亂語或偏離主題">Guardrails</Tooltip>)」，防止你的 Agent 被壞人駭客惡意套話！
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
