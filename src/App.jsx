import { useState, useEffect } from 'react';
import { CheckCircle2, Menu, X } from 'lucide-react';
import Day1 from './components/Day1';
import Day2 from './components/Day2';
import Day3 from './components/Day3';
import Day4 from './components/Day4';
import Day5 from './components/Day5';
import Day6 from './components/Day6';
import Day7 from './components/Day7';

function App() {
  const [currentDay, setCurrentDay] = useState(() => {
    return parseInt(localStorage.getItem('agent-camp-current-day')) || 1;
  });
  
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('agent-camp-completed')) || [];
    } catch {
      return [];
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('agent-camp-current-day', currentDay);
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('agent-camp-completed', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    const handleComplete = () => {
      setCompletedDays(prev => {
        if (!prev.includes(currentDay)) {
          return [...prev, currentDay];
        }
        return prev;
      });
    };
    window.addEventListener('sandbox-complete', handleComplete);
    return () => window.removeEventListener('sandbox-complete', handleComplete);
  }, [currentDay]);

  const days = [
    { id: 1, title: "Day 1: AI Agent 與大腦機制初探", description: "理解 Agent 基本概念與 System Prompt" },
    { id: 2, title: "Day 2: 靈魂工程與安全防護", description: "Prompt Engineering & Guardrails" },
    { id: 3, title: "Day 3: Context Engineering", description: "記憶管理與脈絡工程" },
    { id: 4, title: "Day 4: Model Context Protocol (MCP)", description: "賦予 Agent 使用工具的能力" },
    { id: 5, title: "Day 5: 多智能體協作 (Multi-Agent)", description: "打造多個專精 Agent 團隊合作" },
    { id: 6, title: "Day 6: 自主規劃與反思", description: "Autonomous Planning & Reflection" },
    { id: 7, title: "Day 7: Human-in-the-Loop (HITL)", description: "關鍵決策的安全卡控與專題" }
  ];

  const progressPercent = Math.round((completedDays.length / 7) * 100);

  return (
    <div className="app-container">
      {/* Floating Hamburger Toggle Button on Mobile */}
      <button 
        className="menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay on Mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <div className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
          AI Agent 實戰特訓營
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
          七天從零打造你的專屬智能體
        </p>

        {/* Global Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>特訓進度</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {days.map(day => {
            const isCompleted = completedDays.includes(day.id);
            return (
              <div 
                key={day.id}
                onClick={() => {
                  if (day.id <= 7) {
                    setCurrentDay(day.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile
                  }
                }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: currentDay === day.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.02)',
                  color: currentDay === day.id ? 'white' : (day.id > 7 ? 'var(--text-secondary)' : 'var(--text-primary)'),
                  cursor: day.id <= 7 ? 'pointer' : 'not-allowed',
                  border: `1px solid ${currentDay === day.id ? 'transparent' : 'var(--border-color)'}`,
                  transition: 'all 0.3s ease',
                  opacity: day.id > 7 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{day.title}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{day.description}</div>
                </div>
                {isCompleted && (
                  <CheckCircle2 size={20} color={currentDay === day.id ? 'white' : 'var(--success)'} style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {currentDay === 1 && <Day1 />}
        {currentDay === 2 && <Day2 />}
        {currentDay === 3 && <Day3 />}
        {currentDay === 4 && <Day4 />}
        {currentDay === 5 && <Day5 />}
        {currentDay === 6 && <Day6 />}
        {currentDay === 7 && <Day7 />}
      </div>
    </div>
  );
}

export default App;
