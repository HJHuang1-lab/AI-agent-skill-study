import { useState } from 'react';

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <span 
      style={{ position: 'relative', display: 'inline-block', cursor: 'help' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{ borderBottom: '1px dashed #8b5cf6', color: '#c4b5fd' }}>
        {children}
      </span>
      {show && (
        <span style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 100,
          border: '1px solid #444',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.2s ease-out',
          display: 'block'
        }}>
          {text}
          {/* Arrow */}
          <span style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: 'rgba(0, 0, 0, 0.9) transparent transparent transparent',
            display: 'block'
          }}></span>
        </span>
      )}
    </span>
  );
}
