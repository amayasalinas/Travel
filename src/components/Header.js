'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ variant = 'dark' }) {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const headerClass = variant === 'light' ? 'header header-light' : 'header';

    return (
        <header className={headerClass}>
            <div className="header-inner">
                <Link href="/" className="header-logo">
                    <span className="material-icons-round logo-icon" style={{ fontSize: 24 }}>near_me</span>
                    <h1>Assitour</h1>
                </Link>
                <div className="header-actions">
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
