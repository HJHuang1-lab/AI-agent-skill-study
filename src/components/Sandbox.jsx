import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, CheckCircle2, FileJson, FileText, Files, Search, GitBranch, Settings, Terminal, Lock } from 'lucide-react';

export default function Sandbox({ initialConfig, additionalFiles = {}, missionTitle, missionDesc, steps, simulationLogic, checkProgress }) {
  const [files, setFiles] = useState({ 'agent_config.json': initialConfig, ...additionalFiles });
  const [activeFile, setActiveFile] = useState('agent_config.json');
  const [messages, setMessages] = useState([{ role: 'system', content: '⏳ 等待您部署 Agent...' }]);
  const [input, setInput] = useState('');
  
  // Tutorial State
  const [tutorialStep, setTutorialStep] = useState(1);
  const [isDeployed, setIsDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [history, setHistory] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [deployCount, setDeployCount] = useState(0);
  
  // UI Features
  const [isVisualMode, setIsVisualMode] = useState(true);
  const [hintBlink, setHintBlink] = useState(false);
  
  // Auto-scroll terminal
  const terminalRef = useRef(null);
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  const parseConfig = () => {
    try {
      return JSON.parse(files['agent_config.json']);
    } catch {
      return { temperature: 0.7, system_prompt: '' };
    }
  };

  useEffect(() => {
    const config = parseConfig();
    const nextStep = checkProgress(tutorialStep, config, history, messages, activeFile, deployCount);
    if (nextStep && nextStep > tutorialStep) {
      setTutorialStep(nextStep);
      if (nextStep === steps.length + 1) {
        window.dispatchEvent(new CustomEvent('sandbox-complete'));
      }
    }
  }, [files, tutorialStep, history, messages, activeFile]);

  const handleRun = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    try {
      JSON.parse(files['agent_config.json']);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'system', content: '❌ 部署失敗：agent_config.json 格式錯誤！請檢查是否有缺少雙引號、多餘逗號等語法問題。' }]);
      setIsDeploying(false);
      return;
    }
    
    // Simulate deployment delay
    setTimeout(() => {
      setIsDeployed(true);
      setIsDeploying(false);
      setHistory([]);
      setDeployCount(prev => prev + 1);
      const config = parseConfig();
      setMessages([
        { role: 'system', content: `⚡ Agent "${config.agent_name || 'Agent'}" 重新部署成功！所有對話記憶已清除。` },
        { role: 'system', content: `📋 已載入設定：memory_mode=${config.memory_mode || 'N/A'}, temperature=${config.temperature}, tools=${JSON.stringify(config.enabled_tools || config.tools || [])}` },
        { role: 'agent', content: '系統已就緒，請輸入您的問題。' }
      ]);
    }, 800);
  };

  const handleReset = () => {
    setFiles({ 'agent_config.json': initialConfig, ...additionalFiles });
    setActiveFile('agent_config.json');
    setMessages([{ role: 'system', content: '🔄 設定已重置為初始狀態。' }]);
    setIsDeployed(false);
    setHistory([]);
    setDeployCount(0);
    setTutorialStep(1);
  };

  const handleSend = () => {
    if (!input.trim() || isPrinting) return;
    const newHistory = [...history, input];
    setHistory(newHistory);
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsPrinting(true);
    
    setTimeout(() => {
      const config = parseConfig();
      const agentReply = simulationLogic(input, config, tutorialStep);
      
      if (Array.isArray(agentReply)) {
        let delay = 0;
        agentReply.forEach((replyItem, index) => {
          delay += (replyItem.delay || 1500);
          setTimeout(() => {
            setMessages(prev => {
              const newMsgs = [...prev, { role: replyItem.role || 'agent', content: replyItem.content, isTyping: true }];
              const nextStep = checkProgress(tutorialStep, config, newHistory, newMsgs, activeFile, deployCount);
              if (nextStep && nextStep > tutorialStep) {
                setTutorialStep(nextStep);
                if (nextStep === steps.length + 1) window.dispatchEvent(new CustomEvent('sandbox-complete'));
              }
              return newMsgs;
            });
            if (index === agentReply.length - 1) {
               setTimeout(() => setIsPrinting(false), 500);
            }
          }, delay);
        });
      } else {
        setMessages(prev => {
          const newMsgs = [...prev, { role: 'agent', content: agentReply, isTyping: true }];
          const nextStep = checkProgress(tutorialStep, config, newHistory, newMsgs, activeFile, deployCount);
          if (nextStep && nextStep > tutorialStep) {
            setTutorialStep(nextStep);
            if (nextStep === steps.length + 1) window.dispatchEvent(new CustomEvent('sandbox-complete'));
          }
          return newMsgs;
        });
        setIsPrinting(false);
      }
    }, 600);
  };

  const isFileReadonly = (name) => name === 'mcp_tools.json' || !name.endsWith('.json');
  const isReadonly = isFileReadonly(activeFile);

  const getMsgStyle = (msg) => {
    if (msg.role === 'system') return { label: '> SYS', labelColor: '#858585', textColor: '#858585' };
    if (msg.role === 'user') return { label: '> USER', labelColor: '#4fc1ff', textColor: '#d4d4d4' };
    if (msg.content.includes('❌')) return { label: '> AGENT', labelColor: 'var(--danger)', textColor: 'var(--danger)' };
    return { label: '> AGENT', labelColor: '#4ec9b0', textColor: '#ce9178' };
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: '24px' }}>
      
      {/* 教學任務面板 - Vertical Stepper */}
      <div style={{ padding: '16px 24px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '8px 8px 0 0' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Info color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--accent-primary)' }}>{missionTitle}</h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{missionDesc}</p>
            
            {/* Vertical Stepper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
              {steps.map((s, idx) => {
                const isDone = tutorialStep > idx + 1;
                const isCurrent = tutorialStep === idx + 1;
                return (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', position: 'relative' }}>
                    {/* Vertical line connector */}
                    {idx < steps.length - 1 && (
                      <div style={{
                        position: 'absolute', left: '11px', top: '24px', width: '2px',
                        height: 'calc(100% - 4px)',
                        background: isDone ? 'var(--success)' : 'rgba(255,255,255,0.1)'
                      }} />
                    )}
                    {/* Circle indicator */}
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? 'var(--success)' : (isCurrent ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'),
                      border: isCurrent ? '2px solid var(--accent-primary)' : 'none',
                      color: 'white', fontSize: '12px', fontWeight: 'bold',
                      boxShadow: isCurrent ? '0 0 12px var(--accent-primary)' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    {/* Step text */}
                    <div style={{
                      fontSize: '0.9rem', lineHeight: '1.5',
                      color: isDone ? 'var(--success)' : (isCurrent ? 'white' : 'var(--text-secondary)'),
                      opacity: isCurrent || isDone ? 1 : 0.5,
                      paddingBottom: idx < steps.length - 1 ? '16px' : '0',
                      fontWeight: isCurrent ? '600' : '400',
                      transition: 'all 0.3s'
                    }}>
                      {s.label}
                      {isCurrent && s.requireDeploy && (
                        <span style={{ marginLeft: '8px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(59,130,246,0.2)', color: 'var(--accent-primary)' }}>需要部署</span>
                      )}
                      {isCurrent && s.actionLabel && (
                        <button 
                          onClick={() => {
                            if (s.onAction) s.onAction();
                            setTimeout(() => {
                              const config = parseConfig();
                              const nextStep = checkProgress(tutorialStep, config, history, messages, activeFile, deployCount);
                              if (nextStep && nextStep > tutorialStep) {
                                setTutorialStep(nextStep);
                                if (nextStep === steps.length + 1) window.dispatchEvent(new CustomEvent('sandbox-complete'));
                              }
                            }, 50);
                          }}
                          style={{
                             display: 'inline-block', marginLeft: '12px', padding: '4px 12px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'
                          }}
                        >
                          {s.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {tutorialStep === steps.length + 1 && (
              <div className="fade-in" style={{ marginTop: '12px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}>
                🎉 任務完成！你已經成功掌握這個章節的核心概念了！
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ide-btn-run { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 122, 204, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(0, 122, 204, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 122, 204, 0); }
        }
        .typewriter-text {
          overflow: hidden;
          white-space: pre-wrap;
          animation: typing 1s steps(40, end);
        }
        @keyframes typing {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1000px; opacity: 1; }
        }
        .file-pulse {
          animation: filePulse 2s infinite;
          border-left: 2px solid var(--accent-primary);
        }
        @keyframes filePulse {
          0% { background-color: rgba(59, 130, 246, 0.1); }
          50% { background-color: rgba(59, 130, 246, 0.3); }
          100% { background-color: rgba(59, 130, 246, 0.1); }
        }
      `}</style>

      {/* IDE Shell */}
      <div className="ide-shell">
        
        {/* Activity Bar */}
        <div className="ide-activity-bar">
          <Files size={24} color="#fff" strokeWidth={1.5} />
          <Search size={24} color="#858585" strokeWidth={1.5} />
          <GitBranch size={24} color="#858585" strokeWidth={1.5} />
          <div style={{ flex: 1 }}></div>
          <Settings size={24} color="#858585" strokeWidth={1.5} />
        </div>

        {/* Side Bar */}
        <div className="ide-sidebar">
          <div style={{ padding: '10px 16px', fontSize: '11px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Explorer
          </div>
          <div className="ide-sidebar-files">
            {Object.keys(files).map(filename => {
              const isTargetFile = steps[tutorialStep - 1]?.label.includes(filename) && activeFile !== filename;
              return (
                <div 
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={isTargetFile ? "file-pulse" : ""}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 16px', background: activeFile === filename ? '#37373d' : 'transparent', color: activeFile === filename ? '#fff' : '#ccc', fontSize: '13px', cursor: 'pointer' }}
                >
                  {filename.endsWith('.json') ? <FileJson size={16} color="#cbcb41" /> : <FileText size={16} color="#519aba" />}
                <span style={{ flex: 1 }}>{filename}</span>
                {isFileReadonly(filename) && <Lock size={12} color="#858585" />}
              </div>
              );
            })}
          </div>
        </div>

        {/* Main Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e', overflow: 'hidden' }}>
          
          {/* Toolbar */}
          <div style={{ display: 'flex', background: '#252526', height: '35px', alignItems: 'center', justifyContent: 'space-between', paddingRight: '12px' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', background: '#1e1e1e', borderTop: '1px solid #007acc', color: '#fff', fontSize: '13px' }}>
                {activeFile.endsWith('.json') ? <FileJson size={16} color="#cbcb41" /> : <FileText size={16} color="#519aba" />}
                <span>{activeFile}</span>
                {isReadonly && <span style={{ fontSize: '10px', color: '#858585', marginLeft: '4px' }}>(唯讀)</span>}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {activeFile === 'agent_config.json' && (
                <div style={{ display: 'flex', background: '#333', borderRadius: '4px', overflow: 'hidden', border: '1px solid #555', marginRight: '8px' }}>
                  <button onClick={() => setIsVisualMode(true)} style={{ padding: '4px 8px', fontSize: '11px', border: 'none', background: isVisualMode ? '#007acc' : 'transparent', color: isVisualMode ? '#fff' : '#ccc', cursor: 'pointer' }}>🎛️ 圖形</button>
                  <button onClick={() => setIsVisualMode(false)} style={{ padding: '4px 8px', fontSize: '11px', border: 'none', background: !isVisualMode ? '#007acc' : 'transparent', color: !isVisualMode ? '#fff' : '#ccc', cursor: 'pointer' }}>💻 程式</button>
                </div>
              )}
              <button 
                onClick={handleReset}
                title="重置設定"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#333', color: '#ccc', border: '1px solid #555', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}
              >
                <RotateCcw size={12} /> 重置
              </button>
              <button 
                onClick={handleRun}
                className={(tutorialStep === 1 && !isDeployed) || (steps[tutorialStep-1]?.requireDeploy) ? "ide-btn-run" : ""}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', background: '#007acc', color: 'white', 
                  border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                <Play size={14} fill="currentColor" />
                部署 Agent
              </button>
            </div>
          </div>

          <div className="ide-body">
            {/* Code */}
            <div className="ide-editor-container">
              <div style={{ flex: 1, display: 'flex', padding: '8px 0', overflowY: 'auto' }}>
                {isVisualMode && activeFile === 'agent_config.json' ? (
                  <div style={{ padding: '0 24px', width: '100%', color: '#ccc', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(() => {
                      const cfg = parseConfig();
                      const updateConfig = (key, value) => {
                        const newCfg = { ...cfg, [key]: value };
                        setFiles({ ...files, [activeFile]: JSON.stringify(newCfg, null, 2) });
                      };
                      return (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label>Agent Name (名稱)</label>
                            <input type="text" value={cfg.agent_name || ''} onChange={e => updateConfig('agent_name', e.target.value)} style={{ background: '#333', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px' }} />
                          </div>
                          {cfg.role !== undefined && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label>Role (角色)</label>
                              <input type="text" value={cfg.role || ''} onChange={e => updateConfig('role', e.target.value)} style={{ background: '#333', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px' }} />
                            </div>
                          )}
                          {cfg.model !== undefined && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label>Model (模型)</label>
                              <select value={cfg.model || 'gpt-4-turbo'} onChange={e => updateConfig('model', e.target.value)} style={{ background: '#333', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px' }}>
                                <option value="gpt-4-turbo">gpt-4-turbo</option>
                                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                                <option value="claude-3-opus">claude-3-opus</option>
                              </select>
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label>Temperature (創造力: {cfg.temperature})</label>
                            <input type="range" min="0" max="1" step="0.1" value={cfg.temperature || 0} onChange={e => updateConfig('temperature', parseFloat(e.target.value))} />
                          </div>
                          {cfg.memory_mode !== undefined && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label>Memory Mode (記憶模式)</label>
                              <select value={cfg.memory_mode || 'none'} onChange={e => updateConfig('memory_mode', e.target.value)} style={{ background: '#333', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px' }}>
                                <option value="none">None (無記憶)</option>
                                <option value="short_term">Short-Term (短期記憶)</option>
                                <option value="rag">RAG (檢索增強生成)</option>
                              </select>
                            </div>
                          )}
                          {cfg.planning_mode !== undefined && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label>Planning Mode (規劃模式)</label>
                              <select value={cfg.planning_mode || 'none'} onChange={e => updateConfig('planning_mode', e.target.value)} style={{ background: '#333', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px' }}>
                                <option value="none">None (無規劃)</option>
                                <option value="react">ReAct (思考與行動)</option>
                                <option value="hierarchical">Hierarchical (階層式)</option>
                              </select>
                            </div>
                          )}
                          {/* Knowledge Base Input for Day 3 */}
                          {cfg.knowledge_base !== undefined && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label>Knowledge Base (知識庫，多檔案以逗號分隔)</label>
                              <input 
                                type="text" 
                                value={Array.isArray(cfg.knowledge_base) ? cfg.knowledge_base.join(', ') : ''} 
                                onChange={e => {
                                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  updateConfig('knowledge_base', arr);
                                }} 
                                placeholder="例如: refund_policy.md, company_policy.pdf"
                                style={{ background: '#333', border: '1px solid #555', color: '#fff', padding: '6px', borderRadius: '4px' }} 
                              />
                            </div>
                          )}
                          {/* Enabled Tools Checkboxes for Day 4-7 */}
                          {(cfg.enabled_tools !== undefined || cfg.tools !== undefined) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label>Enabled Tools (啟用的工具)</label>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid #444' }}>
                                {['get_weather', 'calculator', 'search_web', 'send_email'].map(tool => {
                                  const key = cfg.enabled_tools !== undefined ? 'enabled_tools' : 'tools';
                                  const isChecked = Array.isArray(cfg[key]) && cfg[key].includes(tool);
                                  return (
                                    <label key={tool} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', userSelect: 'none' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={isChecked}
                                        onChange={e => {
                                          const currentTools = cfg[key] || [];
                                          const newTools = e.target.checked 
                                            ? [...new Set([...currentTools, tool])]
                                            : currentTools.filter(t => t !== tool);
                                          updateConfig(key, newTools);
                                        }}
                                      />
                                      <code>{tool}</code>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {cfg.require_human_approval !== undefined && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label>HITL Security (安全閘門)</label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={!!cfg.require_human_approval}
                                  onChange={e => updateConfig('require_human_approval', e.target.checked)}
                                />
                                <span style={{ color: cfg.require_human_approval ? '#10b981' : '#ef4444' }}>
                                  {cfg.require_human_approval ? '✅ require_human_approval (啟動中)' : '❌ require_human_approval (已關閉)'}
                                </span>
                              </label>
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                            <label>System Prompt (系統提示詞)</label>
                            <textarea value={cfg.system_prompt || ''} onChange={e => updateConfig('system_prompt', e.target.value)} style={{ background: '#333', border: '1px solid #555', color: '#fff', padding: '8px', borderRadius: '4px', flex: 1, minHeight: '100px', resize: 'vertical' }} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <>
                    <div style={{ width: '40px', textAlign: 'right', paddingRight: '12px', color: '#858585', fontFamily: '"Fira Code", monospace', fontSize: '14px', lineHeight: '1.6', userSelect: 'none' }}>
                      {files[activeFile].split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    {isReadonly ? (
                      <pre style={{ flex: 1, margin: 0, padding: '0 8px', color: '#9cdcfe', fontFamily: '"Fira Code", monospace', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {files[activeFile]}
                      </pre>
                    ) : (
                      <textarea
                        value={files[activeFile]}
                        onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
                        style={{ 
                          flex: 1, background: 'transparent', border: 'none', color: '#ce9178',
                          fontFamily: '"Fira Code", monospace', fontSize: '14px', resize: 'none', outline: 'none',
                          lineHeight: '1.6'
                        }}
                        spellCheck="false"
                      />
                    )}
                  </>
                )}
              </div>

              {/* Problems Panel */}
              <div style={{ height: '120px', borderTop: '1px solid #333', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid #333' }}>
                  <div style={{ padding: '6px 0', fontSize: '11px', color: '#e7e7e7', textTransform: 'uppercase', borderBottom: '1px solid #007acc' }}>
                    PROBLEMS (欄位小百科)
                  </div>
                </div>
                <div style={{ padding: '8px 16px', overflowY: 'auto', fontSize: '12px', color: '#9cdcfe', fontFamily: 'monospace', lineHeight: '1.6' }}>
                  {!isReadonly ? (
                    <>
                      {files[activeFile].includes('agent_name') && <div><span style={{ color: '#4fc1ff' }}>agent_name</span>: 給你的 Agent 取個名字</div>}
                      {files[activeFile].includes('model') && <div><span style={{ color: '#4fc1ff' }}>model</span>: 使用的 LLM 模型 (例如 gpt-4-turbo)</div>}
                      {files[activeFile].includes('temperature') && <div><span style={{ color: '#4fc1ff' }}>temperature</span>: 創造力 (0.0~1.0)，越高越隨機</div>}
                      {files[activeFile].includes('role') && <div><span style={{ color: '#4fc1ff' }}>role</span>: Agent 的職責 (如 Boss 或 Worker)</div>}
                      {files[activeFile].includes('system_prompt') && <div><span style={{ color: '#4fc1ff' }}>system_prompt</span>: 人設與最高指導原則 (靈魂)</div>}
                      {files[activeFile].includes('planning_mode') && <div><span style={{ color: '#4fc1ff' }}>planning_mode</span>: 自主規劃模式 (如 react)</div>}
                      {files[activeFile].includes('memory_mode') && <div><span style={{ color: '#4fc1ff' }}>memory_mode</span>: 記憶管理模式 (例如 short_term 或 rag)</div>}
                      {files[activeFile].includes('knowledge_base') && <div><span style={{ color: '#4fc1ff' }}>knowledge_base</span>: 讓 Agent 存取的外部知識庫檔案</div>}
                      {files[activeFile].includes('enabled_tools') && <div><span style={{ color: '#4fc1ff' }}>enabled_tools</span>: 授權給 Agent 使用的工具清單 (如 getWeather)</div>}
                    </>
                  ) : (
                    <div style={{ color: '#858585' }}>📄 此檔案為唯讀參考資料，請切換到可編輯設定檔。</div>
                  )}
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="ide-terminal-container">
              <div style={{ display: 'flex', background: '#252526', height: '35px', alignItems: 'center', padding: '0 16px', color: '#ccc', fontSize: '12px', gap: '8px', borderBottom: '1px solid #333' }}>
                <Terminal size={14} /> TERMINAL (Agent Preview)
              </div>
              
              <div ref={terminalRef} style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: '"Fira Code", monospace', fontSize: '13px' }}>
                {messages.map((msg, i) => {
                  const s = getMsgStyle(msg);
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: s.labelColor, fontWeight: 'bold', fontSize: '11px' }}>{s.label}</span>
                      <div className={msg.isTyping ? "typewriter-text" : ""} style={{ color: s.textColor, lineHeight: '1.5' }}>{msg.content}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '10px 16px', borderTop: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isDeployed && steps[tutorialStep - 1]?.hintText && (
                  <div style={{ alignSelf: 'flex-end' }}>
                    <button 
                      onClick={() => {
                        setMessages(prev => [...prev, { sender: 'system', content: `💡 提示：${steps[tutorialStep - 1].hintText}` }]);
                        if (steps[tutorialStep - 1].autoFill) {
                          setInput(steps[tutorialStep - 1].autoFill);
                        }
                      }}
                      style={{ 
                        background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fcd34d', 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer',
                        animation: 'pulse 2s infinite'
                      }}
                    >
                      💡 需要提示嗎？
                    </button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#4fc1ff', fontWeight: 'bold', fontSize: '13px', fontFamily: 'monospace' }}>$</span>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isPrinting && handleSend()}
                    placeholder={isDeployed ? (isPrinting ? "Agent 思考中..." : "輸入你的 Prompt...") : "請先點擊「部署 Agent」..."}
                    disabled={!isDeployed || isPrinting}
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: '#d4d4d4', outline: 'none', fontFamily: '"Fira Code", monospace', fontSize: '13px',
                      opacity: isDeployed && !isPrinting ? 1 : 0.5
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
