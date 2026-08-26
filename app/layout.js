import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "+Emprego — Vagas em Moçambique",
  description: "Vagas verificadas em todas as províncias de Moçambique.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-MZ">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
