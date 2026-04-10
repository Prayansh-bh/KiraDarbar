import { ImageResponse } from 'next/og'

export const alt = 'Tenant Rights Guide'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

function unslugify(slug: string) {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default async function Image({ params }: { params: { state: string } }) {
  const { state } = await params;
  const stateName = unslugify(state);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#0F0F0F',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          padding: '40px',
        }}
      >
        <div style={{
          fontSize: 32,
          color: '#E8602A',
          marginBottom: 20,
          textTransform: 'uppercase',
          letterSpacing: 4,
          fontWeight: 'bold',
        }}>
          Legal Protection India
        </div>
        <div style={{
          fontSize: 80,
          textAlign: 'center',
          marginBottom: 10,
        }}>
          Tenant Rights in {stateName}
        </div>
        <div style={{
          fontSize: 32,
          color: '#888',
          marginTop: 20,
        }}>
          www.kiradarbar.in
        </div>
        {/* Saffron accent bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 12,
          width: '100%',
          background: '#E8602A',
        }} />
      </div>
    ),
    {
      ...size,
    }
  )
}
