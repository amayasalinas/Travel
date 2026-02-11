import Link from 'next/link';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-links">
                <Link href="/politica-datos" className="footer-link">Política de Tratamiento de Datos</Link>
                <Link href="/registro" className="footer-link">Regístrate</Link>
                <Link href="/login" className="footer-link">Iniciar sesión</Link>
            </div>
            <p className="footer-copyright">© {year} Assitour. Todos los derechos reservados.</p>
        </footer>
    );
}
