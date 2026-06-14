import { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

export default function Quiz({ questions, onComplete }) {
  // Support legacy single-question format
  const questionList = questions || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const q = questionList[currentQ];
  if (!q) return null;

  const handleSelect = (index) => {
    if (isCorrect === true) return; // Already answered correctly
    setSelected(index);
    if (index === q.correctIndex) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentQ < questionList.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="glass-panel fade-in" style={{ marginTop: '24px' }}>
      <h3 style={{ marginTop: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎯 隨堂檢核
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
          第 {currentQ + 1} / {questionList.length} 題
        </span>
      </h3>
      <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{q.question}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {q.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${selected === idx ? (idx === q.correctIndex ? 'var(--success)' : 'var(--error)') : 'var(--border-color)'}`,
              background: selected === idx 
                ? (idx === q.correctIndex ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)')
                : (isCorrect && idx === q.correctIndex ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)'),
              color: 'var(--text-primary)',
              textAlign: 'left',
              cursor: isCorrect ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
              fontSize: '1rem'
            }}
          >
            <span>{option}</span>
            {selected === idx && idx === q.correctIndex && <CheckCircle2 color="var(--success)" />}
            {selected === idx && idx !== q.correctIndex && <XCircle color="var(--error)" />}
          </button>
        ))}
      </div>

      {/* Wrong answer hint */}
      {isCorrect === false && q.hint && (
        <div className="fade-in" style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <Lightbulb size={18} color="var(--warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span style={{ color: 'var(--warning)', fontSize: '0.95rem', lineHeight: '1.5' }}>{q.hint}</span>
        </div>
      )}

      {/* Correct → Next or Complete */}
      {isCorrect === true && (
        <div className="fade-in" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>🎉 答對了！</span>
          <button
            onClick={handleNext}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none',
              background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold',
              cursor: 'pointer', fontSize: '0.95rem'
            }}
          >
            {currentQ < questionList.length - 1 ? '下一題 →' : '進入實作 →'}
          </button>
        </div>
      )}
    </div>
  );
}
