import InvoiceForm from "@/components/InvoiceForm";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header style={{ padding: '2rem 1rem 1rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
            <Sparkles color="white" size={24} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0 }}>Factuurr</h1>
        </div>
        <p style={{ color: 'var(--secondary)', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>
          De tool om razendsnel simpele facturen en offertes te genereren.
        </p>
      </header>

      <InvoiceForm />

      <footer style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
        <p>
          &copy; {new Date().getFullYear()} <a href="https://syrastudio.be" target="_blank" rel="noreferrer" style={{ color: 'lightblue'}}>SyraStudio</a> - Geen opslag op servers, alles in jouw browser.
        </p>
      </footer>
    </main>
  );
}
