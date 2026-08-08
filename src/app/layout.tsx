import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const DESCRIPTION =
  "Describí tus síntomas y obtené un reporte orientativo con posibles causas, recomendaciones y señales de alarma. No sustituye una consulta médica.";

export const metadata: Metadata = {
  title: "Vitalis · Asistente de triaje con IA",
  description: DESCRIPTION,
  applicationName: "Vitalis",
  openGraph: {
    title: "Vitalis · Asistente de triaje con IA",
    description: DESCRIPTION,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Vitalis · Asistente de triaje con IA",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#059674",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
