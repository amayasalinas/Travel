'use client';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const experiences = [
  { name: 'Comuna 13', desc: 'Graffiti tour & escaleras eléctricas', category: 'Cultura', rating: 4.9, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFJys-QNR8nPs8zXtldMZ78caNBH0LTA5_2PRMpD4PNS039EiZdvHB9uIJAgbO1iJ_EKtXXNk8UCCF7TdhQcJe9ejJXX3RdGPZwChlkoiIeRv-iZkfh3iGTYTnIEuJ6VYdfMxS5CPmvmiEbaguQrQPPtsS2k9tMeOfdpPDZgxbLZhQ4NewfWyzDCIGP4tRvLFKRjsAqTe6uu4fG_WvzgbD9occwYl5vfmCC8iMykuYsdBeAROUfFz-iPIBjpkZm5z4m9MQrxW6mRs2' },
  { name: 'Guatapé', desc: 'Piedra del Peñol & zócalos', category: 'Aventura', rating: 4.8, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtvJ9lLE56hY7TVEPGRFqheAD62kxDdJya9OWp-VwPSUFC1pC09s90hv9prX-QASDKjdDLOYgQ4Eq85IaPbGGJjVZf-HFfF9B9JS6WsE-WoHGl8vJMlONPp9ACro3QS0MZle8Jn2vCbPUp1nZ6Kw_IWi7_i99ckmeKVyiuql35NQ5IzS9JhdckXOAtdbjwruuxHebgVJkBcwJnNgmCKmi7KMnG6U9xi3iz-H0qHlHv1FfDY8I8hCS8IW39vELNlW7ibwRQy2MXVXzf' },
  { name: 'Coffee Tour', desc: 'De la semilla a la taza', category: 'Gastronomía', rating: 5.0, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrMHrWMLVWyj6r97l98hxcDbzd4HeH2jlxibtUeG8Yk5sD8NiTK90E3mqjXTjhIzk6Z0k39eK9mKVmpnhUAFdTcx1IV7I_oqF6fK7T7fTWWFEQyzQNyxSw51uCZhsOXHbnHzOKW5UNLzHLFsuuQxM5gZjB5scVA8BBEcdVhsQkbzFHD5T-CjO6ql1sNNisCFDYD7XPdajPJHFjM5JKgLGFhAVjAu46veCPUmvj49NTpcJbDLuSS97yKluh7NdBLYXq7MetHYHqqL0A' },
  { name: 'City Tour', desc: 'Metro cable & centro histórico', category: 'Urbano', rating: 4.7, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuc2uylh_kGPjJgtX-0wRjYGPvYS17QPD3jURCedxo4w2KUn1EftFSBT7nqC3EabHWiXJ60e6V8KnUBkjGpOYi2Z-lO6ohnrzNOysnnlfAsea418RwMfw9CxKysVHOxGRVxEKRKx1tvtr3hF60yBk895qPweifUEqSy1fkxcdecR67uhAA6tIOW2r3hleFgtp8MEJAjtLHt0jvC8VtflwOLEmEmV1U6oX8E13Jft1DXPy_5LqXoNPBPOFGRcKoOAIRX3iDhwP4BE56' },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <Header variant="dark" />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '70vh',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #221910 0%, rgba(34,25,16,0.6) 50%, transparent 100%)'
        }} />
        <div className="container animate-fade-in-up" style={{
          position: 'relative', zIndex: 10, textAlign: 'center', paddingBottom: 40
        }}>
          <span style={{
            display: 'inline-block', padding: '6px 16px',
            borderRadius: 999, background: 'rgba(242,127,13,0.2)',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(242,127,13,0.3)',
            color: 'var(--primary)', fontSize: 12, fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16
          }}>Viaja diferente</span>

          <h2 style={{
            fontSize: '2.8rem', fontWeight: 800, color: '#fff',
            lineHeight: 1.1, marginBottom: 8
          }}>
            Medellín<br /><span style={{ color: 'var(--primary)' }}>a tu medida</span>
          </h2>

          <p style={{
            color: '#cbd5e1', fontSize: 15, fontWeight: 500,
            maxWidth: 300, margin: '0 auto 32px'
          }}>
            Descubre la ciudad de la eterna primavera con un itinerario creado solo para ti.
          </p>

          <Link href="/planifica">
            <button className="btn btn-primary btn-lg btn-block" style={{ fontSize: 18 }}>
              <span className="material-icons-round">edit_calendar</span>
              Armar mi viaje
            </button>
          </Link>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="container" style={{ marginTop: 16, paddingBottom: 40 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Experiencias Destacadas</h3>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--primary)' }}>Ver todo</span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16
        }}>
          {experiences.map((exp, i) => (
            <div key={i} style={{
              position: 'relative', borderRadius: 16, overflow: 'hidden',
              aspectRatio: '4/5', background: 'var(--surface-dark)',
              boxShadow: 'var(--shadow-lg)', cursor: 'pointer',
              transition: 'transform 0.2s', animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
            }}>
              <img src={exp.img} alt={exp.name} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.7s'
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)'
              }} />
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                padding: '4px 8px', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <span className="material-icons-round" style={{ fontSize: 12, color: 'var(--primary)' }}>star</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{exp.rating}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, padding: 16, width: '100%' }}>
                <span style={{
                  fontSize: 10, textTransform: 'uppercase', fontWeight: 700,
                  letterSpacing: 1, color: 'var(--primary)', display: 'block', marginBottom: 4
                }}>{exp.category}</span>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{exp.name}</h4>
                <p style={{ fontSize: 12, color: '#cbd5e1' }}>{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Banner */}
        <div style={{
          marginTop: 24, padding: 20, borderRadius: 16,
          background: 'var(--surface-dark)', border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
        }}>
          <div>
            <h4 style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>¿Buscas hospedaje?</h4>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Encuentra los mejores hoteles y airbnb en El Poblado.</p>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(242,127,13,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <span className="material-icons-round" style={{ color: 'var(--primary)' }}>arrow_forward</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
