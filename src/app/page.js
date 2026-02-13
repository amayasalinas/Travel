'use client';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

const experiences = [
  { name: 'Comuna 13 Tour', desc: 'Graffiti & Arte Urbano', category: 'Cultura', rating: 4.9, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFJys-QNR8nPs8zXtldMZ78caNBH0LTA5_2PRMpD4PNS039EiZdvHB9uIJAgbO1iJ_EKtXXNk8UCCF7TdhQcJe9ejJXX3RdGPZwChlkoiIeRv-iZkfh3iGTYTnIEuJ6VYdfMxS5CPmvmiEbaguQrQPPtsS2k9tMeOfdpPDZgxbLZhQ4NewfWyzDCIGP4tRvLFKRjsAqTe6uu4fG_WvzgbD9occwYl5vfmCC8iMykuYsdBeAROUfFz-iPIBjpkZm5z4m9MQrxW6mRs2' },
  { name: 'Piedra del Peñol', desc: 'Naturaleza & Vistas', category: 'Aventura', rating: 4.8, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtvJ9lLE56hY7TVEPGRFqheAD62kxDdJya9OWp-VwPSUFC1pC09s90hv9prX-QASDKjdDLOYgQ4Eq85IaPbGGJjVZf-HFfF9B9JS6WsE-WoHGl8vJMlONPp9ACro3QS0MZle8Jn2vCbPUp1nZ6Kw_IWi7_i99ckmeKVyiuql35NQ5IzS9JhdckXOAtdbjwruuxHebgVJkBcwJnNgmCKmi7KMnG6U9xi3iz-H0qHlHv1FfDY8I8hCS8IW39vELNlW7ibwRQy2MXVXzf' },
  { name: 'Parque Arví', desc: 'Ecoturismo & Aire Puro', category: 'Naturaleza', rating: 4.7, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrMHrWMLVWyj6r97l98hxcDbzd4HeH2jlxibtUeG8Yk5sD8NiTK90E3mqjXTjhIzk6Z0k39eK9mKVmpnhUAFdTcx1IV7I_oqF6fK7T7fTWWFEQyzQNyxSw51uCZhsOXHbnHzOKW5UNLzHLFsuuQxM5gZjB5scVA8BBEcdVhsQkbzFHD5T-CjO6ql1sNNisCFDYD7XPdajPJHFjM5JKgLGFhAVjAu46veCPUmvj49NTpcJbDLuSS97yKluh7NdBLYXq7MetHYHqqL0A' },
  { name: 'City Tour', desc: 'Metro cable & centro histórico', category: 'Urbano', rating: 4.7, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuc2uylh_kGPjJgtX-0wRjYGPvYS17QPD3jURCedxo4w2KUn1EftFSBT7nqC3EabHWiXJ60e6V8KnUBkjGpOYi2Z-lO6ohnrzNOysnnlfAsea418RwMfw9CxKysVHOxGRVxEKRKx1tvtr3hF60yBk895qPweifUEqSy1fkxcdecR67uhAA6tIOW2r3hleFgtp8MEJAjtLHt0jvC8VtflwOLEmEmV1U6oX8E13Jft1DXPy_5LqXoNPBPOFGRcKoOAIRX3iDhwP4BE56' },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-light)' }}>
      <Header transparent={true} />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }} />

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1
        }} />

        {/* Content */}
        <div className="container animate-fade-in-up" style={{
          position: 'relative', zIndex: 10, textAlign: 'center', marginTop: '60px'
        }}>
          <span style={{
            display: 'inline-block', padding: '8px 24px',
            borderRadius: 999, background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--primary)', fontSize: 13, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24
          }}>Viaja diferente</span>

          <h2 style={{
            fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, color: '#fff',
            lineHeight: 1, marginBottom: 8, textShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            Medellín<br />
            <span style={{ color: 'var(--primary)' }}>a tu medida</span>
          </h2>

          <p style={{
            color: '#e2e8f0', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 500,
            maxWidth: 500, margin: '16px auto 40px', lineHeight: 1.6,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Descubre la ciudad de la eterna primavera con un itinerario creado solo para ti. Cultura, gastronomía y aventura te esperan.
          </p>

          <Link href="/planifica">
            <button className="btn btn-primary" style={{
              padding: '16px 32px',
              fontSize: 16,
              borderRadius: '999px',
              boxShadow: '0 8px 20px rgba(242,127,13,0.4)'
            }}>
              <span className="material-icons-round">calendar_month</span>
              Armar mi viaje
            </button>
          </Link>
        </div>

        {/* Floating Action Button (Mobile Only Theme Toggle Placeholder or Scroll Indicator) */}
        <div style={{
          position: 'absolute',
          bottom: '100px',
          right: '24px',
          zIndex: 10
        }}>
          <button style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--primary)', border: 'none',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer'
          }}>
            <span className="material-icons-round">nights_stay</span>
          </button>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="container container-wide" style={{ marginTop: -60, paddingBottom: 100, position: 'relative', zIndex: 20 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', marginBottom: 24
        }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--secondary)' }}>Experiencias Destacadas</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Los tours mejor calificados por viajeros como tú.</p>
          </div>
          <Link href="/explorar" style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Ver todo <span className="material-icons-round">arrow_forward</span>
          </Link>
        </div>

        {/* Carousel / Grid */}
        <div className="experiences-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24
        }}>
          {experiences.slice(0, 3).map((exp, i) => (
            <div key={i} className="card" style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden',
              aspectRatio: '3/4', padding: 0, border: 'none',
              boxShadow: 'var(--shadow-lg)', cursor: 'pointer',
              transition: 'transform 0.3s'
            }}>
              <img src={exp.img} alt={exp.name} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.7s'
              }} />

              {/* Overlay Gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)'
              }} />

              {/* Rating Badge */}
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                padding: '6px 10px', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <span className="material-icons-round" style={{ fontSize: 14, color: '#fbbf24' }}>star</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{exp.rating}</span>
              </div>

              {/* Content */}
              <div style={{ position: 'absolute', bottom: 0, padding: 24, width: '100%' }}>
                <h4 style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 8 }}>{exp.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--primary)' }}>
                    {exp.category === 'Cultura' ? 'palette' : exp.category === 'Aventura' ? 'hiking' : 'forest'}
                  </span>
                  <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{exp.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
}

