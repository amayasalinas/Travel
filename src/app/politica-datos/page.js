import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Política de Tratamiento de Datos - Assitour',
    description: 'Política de privacidad y tratamiento de datos personales de Assitour.',
};

export default function PoliticaDatosPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                background: '#fff', borderBottom: '1px solid var(--border)',
                padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 0 }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                        <span className="material-icons-round" style={{ color: 'var(--text-dark)' }}>arrow_back</span>
                    </Link>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: 20 }}>near_me</span>
                        <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>Assitour</span>
                    </Link>
                </div>
            </header>

            <main className="container" style={{ flex: 1, paddingTop: 32, paddingBottom: 40 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 24, lineHeight: 1.2 }}>
                    Política de Privacidad y Tratamiento de los Datos Personales
                </h1>

                <div style={{ fontSize: 14, color: 'var(--text-dark)', lineHeight: 1.8 }}>
                    <Section title="CONSIDERACIONES GENERALES">
                        <p>Conscientes de la importancia que tiene la protección y el buen manejo de la información personal suministrada los titulares de la información, ASSITOUR, quien actúa como responsable de la información recibida, ha diseñado la presente política y procedimientos que en conjunto permiten hacer un uso adecuado de sus datos personales.</p>
                        <p>Conforme a lo dispuesto en el artículo 15 de la Constitución Política de Colombia, el cual desarrolla el derecho fundamental al hábeas data, referido al derecho que tienen todos los ciudadanos de conocer, actualizar, rectificar los datos personales que existan sobre ella en bases de datos y en archivos tanto de bases públicas como privadas. Dicho derecho se ha desarrollado mediante la expedición de la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1377 de 2013, con base en los cuales ASSITOUR en calidad de RESPONSABLE de los datos personales que recibe, maneja y trata la información.</p>
                    </Section>

                    <Section title="OBJETIVO">
                        <p>Con la implementación de ésta política, se pretende garantizar la reserva de la información y la seguridad sobre el tratamiento que se le dará a la misma a todos los clientes, proveedores, empleados y terceros de quienes ASSITOUR ha obtenido legalmente información y datos personales conforme a los lineamientos establecidos por la ley regulatoria del derecho al Habeas Data.</p>
                    </Section>

                    <Section title="DEFINICIONES">
                        <ul style={{ paddingLeft: 20 }}>
                            <li><strong>Autorización:</strong> Consentimiento previo, expreso e informado del titular del dato para llevar a cabo el tratamiento.</li>
                            <li><strong>Base de Datos:</strong> Conjunto organizado de Datos Personales que sean objeto de tratamiento.</li>
                            <li><strong>Dato personal:</strong> Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.</li>
                            <li><strong>Dato personal sensible:</strong> Información que afecta la intimidad de la persona o cuyo uso indebido puede generar su discriminación.</li>
                            <li><strong>Responsable del Tratamiento:</strong> Persona que por sí misma o en asocio con otros, decida sobre la base de datos y/o el tratamiento de los datos.</li>
                            <li><strong>Titular del dato:</strong> Es la persona natural a que se refieren la información.</li>
                            <li><strong>Tratamiento:</strong> Cualquier operación o conjunto de operaciones sobre datos personales.</li>
                        </ul>
                    </Section>

                    <Section title="PRINCIPIOS PARA EL TRATAMIENTO DE DATOS PERSONALES">
                        <ul style={{ paddingLeft: 20 }}>
                            <li><strong>Principio de legalidad:</strong> El tratamiento de datos es una actividad reglamentada que debe sujetarse a lo establecido en la ley.</li>
                            <li><strong>Principio de finalidad:</strong> El tratamiento debe obedecer a una finalidad legítima de acuerdo con la Constitución y la Ley.</li>
                            <li><strong>Principio de libertad:</strong> El tratamiento sólo puede ejercerse con el consentimiento, previo, expreso e informado del titular.</li>
                            <li><strong>Principio de veracidad o calidad:</strong> La información sujeta a tratamiento debe ser veraz, completa, exacta, actualizada.</li>
                            <li><strong>Principio de transparencia:</strong> En el tratamiento debe garantizarse el derecho del titular a obtener información sobre sus datos.</li>
                            <li><strong>Principio de seguridad:</strong> La información se debe manejar con las medidas técnicas necesarias para otorgar seguridad.</li>
                            <li><strong>Principio de confidencialidad:</strong> Todas las personas que intervengan en el tratamiento están obligadas a garantizar la reserva de la información.</li>
                        </ul>
                    </Section>

                    <Section title="DERECHOS DE LOS TITULARES DE LOS DATOS">
                        <ul style={{ paddingLeft: 20 }}>
                            <li>Derecho a conocer, actualizar, rectificar, consultar sus datos personales en cualquier momento.</li>
                            <li>Derecho a solicitar prueba de la autorización otorgada a ASSITOUR.</li>
                            <li>Derecho a ser informado respecto del uso que se le ha dado a los datos.</li>
                            <li>Derecho a presentar quejas ante la Superintendencia de Industria y Comercio.</li>
                            <li>Derecho a revocar la autorización y/o solicitar la supresión de algún dato.</li>
                            <li>Derecho a acceder en forma gratuita a los datos personales compartidos.</li>
                        </ul>
                    </Section>

                    <Section title="INFORMACIÓN QUE RECOLECTAMOS">
                        <p>La información y/o datos personales que recolectamos incluyen:</p>
                        <ul style={{ paddingLeft: 20 }}>
                            <li><strong>Persona Natural:</strong> nombres y apellidos, tipo de identificación, número de identificación, género, estado civil, fecha de nacimiento, correo electrónico.</li>
                            <li><strong>Información del viaje:</strong> tipo de solicitud, destino, fecha de salida, duración, gustos del usuario.</li>
                            <li><strong>Datos de contacto:</strong> dirección, teléfonos, ciudad, email.</li>
                        </ul>
                    </Section>

                    <Section title="TRATAMIENTO, ALCANCE Y FINALIDADES">
                        <p>Los datos recolectados podrán ser utilizados para:</p>
                        <ul style={{ paddingLeft: 20 }}>
                            <li>La prestación de servicios relacionados con los productos y servicios ofrecidos.</li>
                            <li>Enviar información sobre cambios en condiciones de servicios y productos.</li>
                            <li>Gestionar solicitudes, aclaraciones e investigaciones.</li>
                            <li>Realizar evaluaciones periódicas de productos y servicios.</li>
                            <li>Envío de información técnica, operativa y comercial.</li>
                            <li>Dar cumplimiento a obligaciones contraídas con clientes.</li>
                        </ul>
                    </Section>

                    <Section title="PETICIONES, QUEJAS Y RECLAMOS">
                        <p>Para efectos de recibir las peticiones, reclamaciones y consultas relacionadas con el manejo y tratamiento de datos personales, ASSITOUR ha destinado el correo electrónico <strong>info@assitour.com</strong>.</p>
                        <p>Las consultas serán atendidas en un término máximo de diez (10) días hábiles contados a partir de la fecha de recibo de la misma.</p>
                    </Section>

                    <Section title="DATOS DE RESPONSABLE DEL TRATAMIENTO">
                        <p><strong>Nombre:</strong> ASSITOUR</p>
                        <p><strong>Correo Electrónico:</strong> info@assitour.com</p>
                        <p><strong>Página web:</strong> www.assitour.com</p>
                    </Section>

                    <Section title="VIGENCIA">
                        <p>ASSITOUR se reserva el derecho a modificar la presente política para adaptarla a novedades legislativas o jurisprudenciales, así como a buenas prácticas del sector del turismo.</p>
                        <p>Esta política fue publicada en los sitios web de ASSITOUR y entra en vigencia a partir de la fecha de publicación.</p>
                    </Section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <h2 style={{
                fontSize: 18, fontWeight: 700, color: 'var(--secondary)',
                marginBottom: 12, paddingBottom: 8,
                borderBottom: '2px solid var(--primary-light)'
            }}>
                {title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {children}
            </div>
        </div>
    );
}
