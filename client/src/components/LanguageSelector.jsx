import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const { lang, changeLanguage, supportedLanguages } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px',
          color: 'var(--text-primary)',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <span>{currentLang.flag}</span>
        <span style={{ textTransform: 'uppercase', fontSize: '11px' }}>{currentLang.code}</span>
        <ChevronDown size={12} color="var(--text-muted)" />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '6px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            zIndex: 200,
            minWidth: '170px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            backdropFilter: 'blur(16px)'
          }}
        >
          {supportedLanguages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                changeLanguage(l.code);
                setOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: lang === l.code ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: lang === l.code ? 'var(--accent-cyan)' : 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: lang === l.code ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
