import './globals.css';

export const metadata = {
  title: 'Assitour – Tu viaje a Medellín, a tu medida',
  description: 'Descubre la ciudad de la eterna primavera con un itinerario personalizado. Assitour planifica tu viaje a Medellín en minutos.',
  keywords: 'Medellín, viajes, turismo, Colombia, itinerario, planificación, Assitour',
  openGraph: {
    title: 'Assitour – Medellín a tu medida',
    description: 'Tu agenda personalizada para descubrir Medellín.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#221910" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
