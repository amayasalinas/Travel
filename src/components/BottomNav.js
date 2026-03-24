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
            <Link href="/planifica" className={`nav-item ${isActive('/planifica') ? 'active' : ''}`}>
                <span className="material-icons-round">explore</span>
                <span className="nav-label">Planifica</span>
            </Link>
            <Link href="/mis-viajes" className={`nav-item ${isActive('/mis-viajes') ? 'active' : ''}`}>
                <span className="material-icons-round">favorite</span>
                <span className="nav-label">Mis Viajes</span>
            </Link>
            <Link href="/login" className={`nav-item ${isActive('/login') ? 'active' : ''}`}>
                <span className="material-icons-round">person</span>
                <span className="nav-label">Perfil</span>
            </Link>
        </nav>
    );
}
