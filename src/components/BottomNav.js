'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <nav className="bottom-nav">
            <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                <span className="material-icons-round">home</span>
                <span className="nav-label">Inicio</span>
            </Link>
            <Link href="/explorar" className={`nav-item ${isActive('/explorar') ? 'active' : ''}`}>
                <span className="material-icons-round">explore</span>
                <span className="nav-label">Explorar</span>
            </Link>
            <Link href="/mis-viajes" className={`nav-item ${isActive('/mis-viajes') ? 'active' : ''}`}>
                <span className="material-icons-round">favorite</span>
                <span className="nav-label">Favoritos</span>
            </Link>
            <Link href="/login" className={`nav-item ${isActive('/perfil') ? 'active' : ''}`}>
                <span className="material-icons-round">person</span>
                <span className="nav-label">Perfil</span>
            </Link>
        </nav>
    );
}
