import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #f97316 0%, #d97706 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            🎓
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
              MOBA академия
            </div>
            <div style={{ fontSize: '24px', opacity: 0.9 }}>
              Платформа самостоятельного обучения
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: '32px',
            display: 'flex',
            gap: '16px',
            fontSize: '20px',
          }}
        >
          <span>6 курсов</span>
          <span>·</span>
          <span>30 уроков</span>
          <span>·</span>
          <span>Квизы и сертификаты</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
