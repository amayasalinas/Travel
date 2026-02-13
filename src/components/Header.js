'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ variant = 'dark', transparent = false }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    let headerClass = 'header';
    if (transparent) headerClass += ' header-transparent';
    else if (variant === 'light') headerClass += ' header-light';

    return (
        <header className={headerClass}>
            <div className="header-inner container-wide">
                <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                    <Link href="/" className="header-logo">
                        <span className="material-icons-round logo-icon" style={{ fontSize: 24 }}>near_me</span>
                        <h1>Assitour</h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Inicio</Link>
                        <Link href="/explorar" className="nav-link">Explorar</Link>
                        <Link href="/mapa" className="nav-link">Mapa</Link>
                        <Link href="/mis-viajes" className="nav-link">Favoritos</Link>
                    </nav>
                </div>

                <div className="header-actions">
                    <button className="header-btn" title="Buscar">
                        <span className="material-icons-round" style={{ fontSize: 20 }}>search</span>
                    </button>
                    <Link href="/login">
                        <button className="header-btn" title="Mi cuenta">
                            <span className="material-icons-round" style={{ fontSize: 20 }}>person</span>
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
