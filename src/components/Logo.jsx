export default function Logo({ size = 'md', theme = 'light' }) {
  const sizes = {
    sm: { width: 120, iconSize: 24, fontSize: 20, tagSize: 8 },
    md: { width: 160, iconSize: 32, fontSize: 26, tagSize: 9 },
    lg: { width: 220, iconSize: 44, fontSize: 36, tagSize: 11 },
  }
  const s = sizes[size]

  if (theme === 'icon') {
    return (
      <svg width={s.iconSize} height={s.iconSize} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#4F46E5"/>
        <rect x="15" y="18" width="70" height="22" rx="4" fill="white" opacity="0.9"/>
        <text x="50" y="34" textAnchor="middle" fill="#4F46E5"
          style={{ fontFamily: 'system-ui', fontSize: 14, fontWeight: 700 }}>42</text>
        <rect x="15" y="46" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="35" y="46" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="55" y="46" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="75" y="46" width="16" height="11" rx="3" fill="#A5B4FC"/>
        <rect x="15" y="61" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="35" y="61" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="55" y="61" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="75" y="61" width="16" height="11" rx="3" fill="#A5B4FC"/>
        <rect x="15" y="76" width="36" height="11" rx="3" fill="white" opacity="0.9"/>
        <rect x="55" y="76" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="75" y="76" width="16" height="11" rx="3" fill="#A5B4FC"/>
      </svg>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* 아이콘 */}
      <svg width={s.iconSize} height={s.iconSize} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#4F46E5"/>
        <rect x="15" y="18" width="70" height="22" rx="4" fill="white" opacity="0.9"/>
        <text x="50" y="34" textAnchor="middle" fill="#4F46E5"
          style={{ fontFamily: 'system-ui', fontSize: 14, fontWeight: 700 }}>42</text>
        <rect x="15" y="46" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="35" y="46" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="55" y="46" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="75" y="46" width="16" height="11" rx="3" fill="#A5B4FC"/>
        <rect x="15" y="61" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="35" y="61" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="55" y="61" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="75" y="61" width="16" height="11" rx="3" fill="#A5B4FC"/>
        <rect x="15" y="76" width="36" height="11" rx="3" fill="white" opacity="0.9"/>
        <rect x="55" y="76" width="16" height="11" rx="3" fill="white" opacity="0.7"/>
        <rect x="75" y="76" width="16" height="11" rx="3" fill="#A5B4FC"/>
      </svg>

      {/* 텍스트 */}
      <div style={{ lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: s.fontSize,
            fontWeight: 700,
            color: theme === 'dark' ? 'white' : '#4F46E5',
            letterSpacing: '-0.5px',
          }}>Join</span>
          <span style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: s.fontSize,
            fontWeight: 300,
            color: theme === 'dark' ? '#A5B4FC' : '#4F46E5',
            letterSpacing: '-0.5px',
          }}>Calc</span>
        </div>
        {size !== 'sm' && (
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: s.tagSize,
            fontWeight: 400,
            color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
            letterSpacing: '2px',
            marginTop: 2,
          }}>
            FREE FINANCIAL CALCULATORS
          </div>
        )}
      </div>
    </div>
  )
}